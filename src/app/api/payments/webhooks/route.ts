import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { api} from '../../../../../convex/_generated/api';
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

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        console.log('Payment successful:', session);
        // Check if customer exists, if not, fetch customer details based on the payment intent
        if (session.customer || session.payment_intent) {
          const customerId = session.customer as string
          if (customerId && session.id) {
            await fetchMutation(api.payments.successfulPayment, {
              userid: session.metadata.userid as any,
              sessionId: session.id,
              stripeid: customerId,
              subscriptionid: session.subscription as any,
              membershiptype: session.mode,
              status: session.payment_status
            });
          } else {
            console.error('Unable to retrieve customer ID for session:', session.id);
          }
        } else {
          console.error('Customer ID is null for session:', session.id);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      if (subscription.status === 'canceled') {
        console.log(`Subscription was canceled: ${subscription.id}`);
      }
      if (subscription.status === 'incomplete_expired') {
        console.log(`Subscription ended or was deleted: ${subscription.id}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription was canceled: ${subscription.id}`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice payment failed for subscription: ${invoice.subscription}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Respond with a 200 status to acknowledge receipt of the event
  return NextResponse.json({ message: 'Event received' }, { status: 200 });
}
