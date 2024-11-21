"use client";
import Header from "@/components/header/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CalendarDaysIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import readtimecalc from "@/components/readtime/readtime";
import Footer from "@/components/footer/footer";

export default function Visualizer() {
    const [contentData, setContentData] = useState({
        content: null,
        fields: [],
        values: [],
        authorInfo: null
    });
    console.log(contentData);

    useEffect(() => {
        // Listen for incoming messages
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.origin === window.location.origin) {
                console.log(event.data);
                const { content, fields, values, authorInfo } = event.data;
                setContentData({ content, fields, values, authorInfo });
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const renderField = (field: any) => {
        const fieldValueObj = contentData.values.find(
            (val: any) => val.fieldid === field._id || val.fieldname === field.fieldname
        );
        const value = fieldValueObj?.value || null;

        switch (field.type) {
            case "Rich text":
                return <RichTextViewer content={value} />;
            case "Short Text":
                return <p>{value || `No ${field.type} provided`}</p>;
            case "Number":
                if (field.fieldappearance === "rating") {
                    const rating = value || 0;
                    return (
                        <div className="flex flex-row">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={star <= rating ? "currentColor" : "none"}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className={`w-6 h-6 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                    />
                                </svg>
                            ))}
                        </div>
                    );
                }
                return <p>{value || `No ${field.type} provided`}</p>;
            case "Boolean":
            case "Date and time":
            case "Location":
            case "JSON object":
            case "Media":
                return <p>{value || `No ${field.type} provided`}</p>;
            default:
                return <p>Unknown field type</p>;
        }
    };
    const renderTitle = (field: any, index: number) => {
        const titleField = contentData.fields.find((f: any) => f.type === "Title");
        const titleValueObj = contentData.values.find((val: any) => val.fieldid === titleField?._id);
        const titlevalue = titleValueObj?.value || "No title provided";
        const authorInfo = contentData.authorInfo;
        // find all the rich text fields and get the content
        const richTextFields = contentData.fields.filter((field: any) => field.type === "Rich text").map((field: any) => {
            const fieldValueObj = contentData.values.find(
                (val: any) => val.fieldid === field._id || val.fieldname === field.fieldname
            );
            return fieldValueObj?.value || null;
        }).join(' ');

        return (
            <div key={index} className="flex font-bold text-3xl  dark:text-white text-black flex-col gap-1">
                <p>{titlevalue}</p>
                <div className="flex flex-row gap-2">
                    <Avatar>
                        <AvatarImage src={authorInfo.imageUrl} alt={authorInfo.name} />
                        <AvatarFallback className="h-10 w-10 rounded-full">{authorInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-between">
                        <p className="font-normal text-sm">
                            <span className="dark:text-gray-400">By </span>
                            <b>{authorInfo.name}</b>
                        </p>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="font-normal text-xs dark:text-gray-400">{readtimecalc(richTextFields as any)} read</p>
                                <p>·</p>
                                <p className="font-normal text-xs dark:text-gray-400 flex items-center flex-row gap-0.5">
                                <CalendarDaysIcon height={18} /> {new Date().toDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
     <div className="relative min-h-screen">
     <div 
        className="fixed inset-0 bg-background z-[-1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='13' fill='rgba(255,255,255,0.05)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45, 30, 30)'%3EPreview%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

        <Header />
        <div className='flex px-5 flex-col min-h-screen items-start justify-start container mt-10  mx-auto w-full '>
        <a className={`flex flex-row items-center text-xs w-auto mb-10 gap-1 cursor-pointer`} onClick={() => window.close()}>
            <ArrowLeft width={14} height={14} /> Back
        </a>
            {contentData.fields
                .sort((a: any, b: any) => a.fieldposition - b.fieldposition)
                .map((field: any, index: number) =>
                    field.type === "Title" ? renderTitle(field, index) : (
                        <div key={index} className="mb-4">
                            {renderField(field)}
                        </div>
                    )
                )}
        </div>
        <Footer />
    </div>
        </>
    );
}
function RichTextViewer({ content }: { content: string }) {
    if (!content) {
        console.log('No content provided to RichTextViewer');
        return <p>No rich text content available</p>;
    }

    return (
        <div className="flex flex-col gap-1">
            <div
                className="prose prose-headings:text-blue-600 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg text-sm font-medium break-all"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
