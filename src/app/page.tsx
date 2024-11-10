import React from 'react';
import Home from './homeIndex';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid } = params;
    
    return {
        title: `Textuality | Content management that brings everyone together`,
        description: `Textuality is a collaborative tool for content teams. Create, manage, and explore new ideas seamlessly.`,
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
          "collaborative tools",
          "real-time collaboration",
        ].join(", "),
        openGraph: {
          title: `Textuality`,
          description: `Textuality is a collaborative tool for content teams. Create, manage, and explore new ideas seamlessly.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper({ params }) {
    return <Home />;
}