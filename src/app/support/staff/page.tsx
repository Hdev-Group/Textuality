import React from 'react';
import DashboardStaff from './dashboard';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata() {
    return {
        title: `Staff | Textuality`,
        description: `Staff Zone for Textuality.`,
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
          description: `Currently checking the Staff page for Textuality.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function SupportWrap() {
    return <DashboardStaff  />;
}