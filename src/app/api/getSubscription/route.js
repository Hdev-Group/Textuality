import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method not allowed' });
  }

  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).send({ error: 'Missing customer ID' });
  }

  try {
    // Fetch subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    res.status(200).json({ subscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch subscriptions' });
  }
}
