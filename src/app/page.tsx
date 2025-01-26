import React from 'react';
import Home from './homeIndex';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata() {
    return {
        title: "Textuality | The Ultimate Content Management Solution for Teams",
        description: "A cutting-edge CMS for teams to create, collaborate, and innovate. Ideal for blogs, digital content, and seamless workflows.",
        keywords: [
            "Textuality CMS",
            "content collaboration",
            "real-time editing",
            "team productivity tools",
            "content management system",
        ].join(", "),
        openGraph: {
            title: "Textuality | The Ultimate Content Management Solution",
            description: "Innovative real-time CMS for teams to manage and create content effortlessly.",
            url: "https://textuality.hdev.uk/",
            images: [
                {
                    url: "https://textuality.hdev.uk/assets/contentimg.png",
                    alt: "Textuality - Collaborative Content Management",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Textuality | The Leading CMS for Teams",
            description: "Discover a cutting-edge CMS for seamless team collaboration and content innovation.",
            images: ["https://textuality.hdev.uk/assets/contentimg.png"],
        },
    };
}


export default function ProductWrapper({ params }) {
    return <Home />;
}
