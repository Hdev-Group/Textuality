import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-10-28.acacia",
});

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { premiumcheck, projects, userId } = body;

        // Validate input
        if (!premiumcheck?.[0] || !projects || !userId) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const filteredProjects = projects.filter((project: any) =>
            project.users.includes(userId)
        );

        const premiumPages = await Promise.all(
            filteredProjects
                .filter((project: any) => project._id === premiumcheck[0]?.pageid)
                .map(async (project: any) => {
                    const product = await stripe.products.retrieve(
                        premiumcheck[0]?.productid
                    );
                    return { ...project, product };
                })
        );

        return NextResponse.json(premiumPages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
};
