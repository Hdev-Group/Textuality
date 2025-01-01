import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { api } from '../../../../../convex/_generated/api';
import { fetchMutation } from "convex/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  let event: Stripe.Event;

  try {
    // Read the raw body as a buffer
    const body = await req.arrayBuffer();
    
    // Construct the event with raw body
    event = stripe.webhooks.constructEvent(Buffer.from(body), sig, webhookSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
    
        if (session.payment_status === 'paid') {
          var productid = session.metadata.productid;
    
          if (!productid) {
            const lineItems = session.line_items?.data;
            if (lineItems && lineItems.length > 0) {
              const product = lineItems[0].price.product; 
              productid = product as string; 
            }
          }
    
          await fetchMutation(api.payments.successfulPayment, {
            userid: session.metadata.userid,
            sessionId: session.id,
            stripeid: session.customer as string,
            productid: productid,  // Use the productid
            subscriptionid: session.subscription as string,
            membershiptype: session.mode,
            subscriptionStatus: 'active',
          });
        }
        break;
      }

      // Handle canceled subscription or payment failures
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Call the subscription canceled mutation
        await fetchMutation(api.payments.subscriptionCanceled, {
          subscriptionId: subscription.id,
          status: subscription.status,
          cancellationDate: subscription.canceled_at,
        });
        break;
      }

      // Handle changes in the subscription (e.g., plan change from monthly to yearly)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
      
        // Check if the plan has changed
        const oldPlan = event.data.previous_attributes?.items?.[0]?.plan?.id;
        const newPlan = subscription.items.data[0].plan.id;
      
        // Check for cancellation
        const cancellationDate = subscription.cancel_at;

          // Call the subscription updated mutation
          await fetchMutation(api.payments.subscriptionUpdated, {
            subscriptionId: subscription.id,
            oldPlanId: oldPlan,
            newPlanId: newPlan,
            status: subscription.status,
            cancellationDate: cancellationDate || null,
          });
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.customer || !session.metadata) {
          console.error('Missing customer or metadata in session:', session.id);
          return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Ensure metadata is attached to the customer
        if (session.metadata.userid) {
          await stripe.customers.update(session.customer as string, {
            metadata: { userid: session.metadata.userid }
          });
        }

        // Calculate the end date of the subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const endDate = subscription.current_period_end;

        await fetchMutation(api.payments.subscriptionCanceled, {
          subscriptionId: session.subscription as any,
          status: session.payment_status,
          cancellationDate: endDate,
        });
        break;
      }

      default:
        console.log(`Ignoring unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error processing event:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Event received' }, { status: 200 });
}
