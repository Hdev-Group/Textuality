import React from 'react';
import Page from './contentMain';
import { api } from '../../../../../convex/_generated/api';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const awaitedParams = await params;
    const { _teamid } = awaitedParams;

    const pageResponse = await preloadQuery(api.page.getPage, { _id: _teamid });
    
    const pageData = pageResponse._valueJSON as any;
    
    return {
        title: `Content Home | ${pageData.title} | Textuality`,
        description: `Content dashboard of the ${pageData.title} project on Textuality. Join ${pageData.title} to create, manage, and explore new ideas seamlessly.`,
        keywords: [
          pageData.title,
          "Textuality",
          "create",
          "content",
          "content editing",
          "collaboration",
          "digital content",
          "team blogs",
        ].join(", "),
        openGraph: {
          title: `Textuality`,
          description: `Currently checking the content dashboard as part of ${pageData.title} using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/`,
          type: "article",
        },
    };
}

  
export default async function ProductWrapper({ params }) {
    const awaitedParams = await params;
    const { _teamid, _fileid } = awaitedParams;

    return <Page params={{_teamid: _teamid}} />;
}