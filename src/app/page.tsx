import React from 'react';
import Home from './homeIndex';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    const { _teamid } = params;

    return {
        title: `Textuality | The Ultimate Content Management Solution for Teams`,
        description: `Textuality is a powerful and user-friendly collaborative tool designed for content teams. Seamlessly create, manage, and innovate with your team in real-time for blogs, digital content, and more.`,
        keywords: [
            "Textuality",
            "create",
            "textuality cms",
            "Textuality content management",
            "Textuality content creation",
            "Textuality content collaboration",
            "Textuality content workflow",
            "Textuality content marketing",
            "content creation tool",
            "CMS",
            "content management system",
            "content creation",
            "digital transformation",
            "collaborative tools",
            "real-time editing",
            "content management",
            "team collaboration",
            "blog management",
            "component editing",
            "real-time content collaboration",
            "content publishing",
            "content workflow",
            "content marketing",
            "content strategy",
            "web content management",
            "remote collaboration",
            "team productivity",
            "digital storytelling",
            "content versioning",
            "seamless collaboration",
            "remote teams",
            "content approval process",
            "content ideation",
            "content development",
            "content lifecycle management",
            "content optimization",
            "content innovation",
            "creative collaboration",
            "content editing software",
            "team content tools",
            "collaborative workflows",
            "content management for teams",
            "next-gen CMS",
            "intuitive content tools",
            "modern CMS platforms",
            "scalable content management",
            "enterprise CMS",
            "content management technology",
            "cloud-based CMS",
            "content collaboration software",
            "team blog tools",
            "digital content solutions",
            "content tools for teams",
            "streamlined content processes",
            "content integration tools",
            "efficient content management",
        ].join(", "),
        openGraph: {
            title: `Textuality | The Ultimate Content Management Solution`,
            description: `Textuality is a versatile and innovative collaborative tool for content teams. Manage, create, and explore content effectively with real-time tools and seamless workflows.`,
            url: `https://textuality.hdev.uk/`,
            type: "website",
            images: [
                {
                    url: 'https://textuality.hdev.uk/assets/contentimg.png',
                    alt: 'Textuality - Collaborative Content Management',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `Textuality | The Ultimate Content Management Solution`,
            description: `Discover Textuality, the advanced tool for content teams to collaborate, innovate, and manage content efficiently in real-time.`,
            images: ['https://textuality.hdev.uk/assets/contentimg.png'],
        },
    };
}

export default function ProductWrapper({ params }) {
    return <Home />;
}
