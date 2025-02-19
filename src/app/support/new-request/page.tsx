import React from 'react';
import NewRequest from './newRequest';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata() {
    return {
        title: `New Request | Textuality`,
        description: `Help and Support for Textuality.`,
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
          description: `Currently checking help and support page for Textuality.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function SupportWrap() {
    return <NewRequest />;
}