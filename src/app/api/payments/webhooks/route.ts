import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Query, MutationBuilder } from 'convex/server';


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
