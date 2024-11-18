import React from 'react';
import Page from './dashboardMain';
import { api } from '../../../../../convex/_generated/api';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid } = params;

    const pageResponse = await preloadQuery(api.page.getPage, { _id: _teamid });
    
    const pageData = pageResponse._valueJSON as any;
    
    return {
        title: `${pageData.title} | Textuality`,
        description: `Dashboard of the ${pageData.title} project on Textuality. Join ${pageData.title} to create, manage, and explore new ideas seamlessly.`,
        keywords: [
          pageData.title,
          "Textuality",
          "create",
          "components",
          "component editing",
          "content",
          "content editing",
          "collaboration",
          "digital content",
          "team blogs",
        ].join(", "),
        openGraph: {
          title: `Textuality`,
          description: `Currently checking the dashboard as part of ${pageData.title} using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper({ params }) {
    const { _teamid, _fileid } = params;

    return <Page params={{_teamid: _teamid}} />;
}