import React from 'react';
import Visualizer from './visulizerPage';
import { api } from '../../../../../../../convex/_generated/api';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid, _fileid } = params;

    const pageResponse = await preloadQuery(api.page.getPage, { _id: _teamid });
    const contentResponse = await preloadQuery(api.content.getContentSpecific, { _id: _fileid });
    
    const pageData = pageResponse._valueJSON as any;
    const contentData = contentResponse._valueJSON as any;
    
    return {
        title: `Preview | ${contentData.title} | Textuality`,
        description: `Preview of ${contentData.title} on Textuality. Collaborate with your team to create, manage, and explore new ideas seamlessly.`,
        keywords: [
          contentData.title,
          pageData.title,
          "Textuality",
          "content editing",
          "collaboration",
          "digital content",
          "team blogs",
        ].join(", "),
        openGraph: {
          title: `${contentData.title} — Textuality Preview`,
          description: `Currently working on ${contentData.title} as part of ${pageData.title} using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/${pageData._id}/${contentData._id}`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper({ params }) {

    return <Visualizer />;
}