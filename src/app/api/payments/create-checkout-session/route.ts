import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { bundel } = await req.json();
    const { priceId, mainemail, userid, productid } = bundel;

    if (!priceId) throw new Error("Price ID is required");
    if (!mainemail) throw new Error("Email is required");
    if (!userid) throw new Error("User ID is required");
    if (!productid) throw new Error("Product ID is required");

    const subscriptionInstanceId = uuidv4(); 

    // Check if customer exists
    const customers = await stripe.customers.list({ email: mainemail, limit: 1 });
    const customer = customers.data.length > 0 ? customers.data[0] : null;

    let customerId = customer ? customer.id : undefined;
    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: mainemail,
        metadata: { userid },
      });
      customerId = newCustomer.id;
    }

    // Create subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1, // Each subscription represents one token
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.YOUR_DOMAIN}/plans?success=true&priceId=${priceId}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/plans?canceled=true`,
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      automatic_tax: { enabled: true },
      metadata: {
        userid,
        productid,
        subscriptionInstanceId, // Track the token's unique ID
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
