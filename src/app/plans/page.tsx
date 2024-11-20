import React from 'react';
import PricingPage from './pricingPage';
import { api } from '../../../convex/_generated/api';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata() {
    return {
        title: `Pricing | Textuality`,
        description: `Pricing page of the Textuality project on Textuality. Join Textuality to create, manage, and explore new ideas seamlessly.`,
        keywords: [
          "Textuality",
          "create",
          "components",
          "settings",
          "component editing",
          "content",
          "content editing",
          "collaboration",
          "digital content",
          "team blogs",
        ].join(", "),
        openGraph: {
          title: `Textuality`,
          description: `Currently checking the pricing as part of Textuality using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper() {
    return <PricingPage />;
}