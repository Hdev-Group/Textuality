import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: NextRequest) {
  console.log('req', req);
  try {
    const { bundel } = await req.json();
    const priceId = bundel.priceId;
    const mainemail = bundel.mainemail;
    const userid = bundel.userid;
    if (!priceId) {
      throw new Error("Price ID is required");
    }
    if (!mainemail) {
      throw new Error("Email is required");
    }

    if (!userid) {
      throw new Error("User ID is required");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
      {
        price: priceId,
        quantity: 1,
      },
      ],
      mode: 'subscription',
      customer_email: mainemail,
      success_url: `${process.env.YOUR_DOMAIN}/plans?success=true&priceId=${priceId}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/plans?canceled=true`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      metadata: {
      userid: userid,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
