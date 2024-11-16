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
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
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
          if (!session.customer || !session.metadata) {
            console.error('Missing customer or metadata in session:', session.id);
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
          }

          // Ensure metadata is attached to the customer
          const customer = await stripe.customers.retrieve(session.customer as string);

          if (session.metadata.userid) {
            console.log(`Updating Stripe customer metadata with userid: ${session.metadata.userid}`);
            await stripe.customers.update(session.customer as string, {
              metadata: { userid: session.metadata.userid }
            });
          }

          console.log('Payment successful:', session);
          await fetchMutation(api.payments.successfulPayment, {
            userid: session.metadata.userid as any,
            sessionId: session.id,
            stripeid: session.customer as string,
            subscriptionid: session.subscription as any,
            membershiptype: session.mode,
            status: session.payment_status,
            subscriptionStatus: 'active',
          });
        }
        break;
      }

      // Handle subscription status updates
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.status === 'canceled') {
          console.log(`Subscription was canceled: ${subscription.id}`);
          await fetchMutation(api.payments.subscriptionCanceled, {
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }
        if (subscription.status === 'incomplete_expired') {
          console.log(`Subscription ended or was deleted: ${subscription.id}`);
          await fetchMutation(api.payments.subscriptionExpired, {
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription was deleted: ${subscription.id}`);
        await fetchMutation(api.payments.subscriptionDeleted, {
          subscriptionId: subscription.id,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment failed for subscription: ${invoice.subscription}`);
        await fetchMutation(api.payments.paymentFailed, {
          subscriptionId: invoice.subscription as string,
          invoiceId: invoice.id,
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
