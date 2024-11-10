import React from 'react';
import ContentEditPage from './ContentEditPage';
import { api } from '../../../../../../../convex/_generated/api';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid, _fileid } = params;

    const pageResponse = await preloadQuery(api.page.getPage, { _id: _teamid });
    const contentResponse = await preloadQuery(api.content.getContentSpecific, { _id: _fileid });
    
    const pageData = pageResponse._valueJSON as any;
    const contentData = contentResponse._valueJSON as any;
    
    return {
        title: `${contentData.title} — Editing on ${pageData.title} | Textuality`,
        description: `Engage with the content editor for ${contentData.title}, part of the ${pageData.title} project on Textuality. Join ${pageData.title} to create, manage, and explore new ideas seamlessly.`,
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
          title: `${contentData.title} — Textuality Editor`,
          description: `Currently working on ${contentData.title} as part of ${pageData.title} using Textuality's collaborative tools. Perfect for content teams.`,
          url: `https://textuality.hdev.uk/${pageData._id}/${contentData._id}`,
          type: "article",
        },
    };
}

  
export default function ProductWrapper({ params }) {
    const { _teamid, _fileid } = params;
    console.log(_teamid, _fileid);

    return <ContentEditPage params={{_teamid: _teamid, _fileid: _fileid}} />;
}