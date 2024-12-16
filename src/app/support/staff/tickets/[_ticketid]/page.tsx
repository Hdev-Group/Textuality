import React from 'react';
import StaffTicketView from './ticketmain';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid } = params;

    return {
        title: `Staff | Textuality`,
        openGraph: {
          title: `Textuality`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default async function ProductWrapper({ params }) {
    const awaitedParams = await params;
    const { _ticketid } = awaitedParams;

    return <StaffTicketView params={_ticketid} />;
}