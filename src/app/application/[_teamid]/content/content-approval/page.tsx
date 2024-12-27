import React from 'react';
import ContentApproval from './content-approval';

export async function generateMetadata({ params }) {
    const { _teamid } = params;
    
    return {
        title: `Content Approval | Textuality`,
        description: `Content Approval on Textuality. Join today to create, manage, and explore new ideas seamlessly.`,
        keywords: [
          "Analytics",
          "Textuality",
          "create",
          "components",
          "component editing",
          "content",
          "content editing",
          "approval",
          "content approval",
          "collaboration",
          "digital content",
          "team blogs",
        ].join(", "),
        openGraph: {
          title: `Textuality`,
          description: `Currently checking Content using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper({ params }) {
    const { _teamid } = params;

    return <ContentApproval params={{_teamid: _teamid}} />;
}