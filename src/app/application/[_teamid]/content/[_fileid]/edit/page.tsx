"use client";
import AppHeader from '@/components/header/appheader'
import AuthWrapper from '../../../withAuth'
import { api } from '../../../../../../../convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BotMessageSquare, ChevronLeft, LucideClipboardSignature, MessagesSquare, SidebarOpen } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/richtext/editor';

export default function ContentEditPage({ params }: { params: Promise<{ _teamid: string, _fileid: string }> }) {
    const router = useRouter();
    const { _teamid, _fileid } = React.use(params)
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const getContent = useQuery(api.content.getContentSpecific, { _id: _fileid as any });
    const getFields = useQuery(api.content.getFields, { templateid: getContent?.templateid });
    const [richTextValue, setRichTextValue] = useState('');
    console.log(getFields)
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const [activeSidebar, setActiveSidebar] = useState<string | null>(null)
    const title = getPage?.title + ' — ' + getContent?.title + '— Textuality';
    const handleSidebarClick = (sidebar: string) => {
        setActiveSidebar(sidebar);
        if (sidebar === activeSidebar) {
            setActiveSidebar(null);
        }
        if (isSideBarOpen === false) {
            setIsSideBarOpen(true)
        }
        setActiveSidebar(sidebar);
    };
    function sidebardeployer() {
        setIsSideBarOpen(!isSideBarOpen)
        setActiveSidebar(null)
    }
    const renderField = (field) => {
        switch (field.type) {
            case "Rich text":
                return (
                    <RichTextEditor />
                );
            case "Short Text":
                return (
                    <Input type="text" className='border rounded-md p-2 w-full' placeholder={field.description} />
                );
            case "Number":
                return (
                    <Input type="number" className='border rounded-md p-2 w-full' min={0} placeholder={field.description} />
                );
            case "Boolean":
                return (
                    <Switch defaultChecked={false} /> // Replace with a real handler for state
                );
            case "Date and time":
                return (
                    <Input type="datetime-local" className='border rounded-md p-2 w-full' />
                );
            case "Location":
                return (
                    <Input type="text" className='border rounded-md p-2 w-full' placeholder="Latitude, Longitude" />
                );
            case "JSON object":
                return (
                    <textarea className='border rounded-md p-2 w-full' placeholder='Enter JSON here' />
                );
            case "Media":
                return (
                    <Input type="file" className='border rounded-md p-2 w-full' />
                );
            default:
                return <Input type="text" className='border rounded-md p-2 w-full' placeholder="Unknown field type" />;
        }
    };

    return (
        <body className='overflow-y-hidden'>
            <title>{title}</title>
            <AuthWrapper _teamid={_teamid}>
                <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                    <AppHeader activesection="content" teamid={_teamid} />
                    <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                        <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                            <div className='flex flex-row w-full h-full'>
                                <div className='w-full flex flex-col h-full'>
                                    <div className="border-b py-5 px-5 flex flex-row">
                                        <div className='flex flex-row gap-3'>
                                            <div onClick={() => router.push(`/application/${_teamid}/content`)} className='flex flex-row gap-2 border rounded-md hover:border-black hover:shadow-md cursor-pointer transition-all items-center'>
                                                <ChevronLeft />
                                            </div>
                                            <h1 className='text-2xl font-bold'><span className='text-neutral-400 font-normal text-sm'>/ Content /</span> {getContent?.title}</h1>
                                        </div>
                                    </div>
                                    <div className='container mx-auto px-5 py-5'>
                                        <div className='flex flex-col gap-5'>
                                            {getFields?.map((field, index) => (
                                                <div key={index} className='flex flex-col gap-1'>
                                                    <Label className='text-sm font-medium text-gray-700 dark:text-gray-100'>{field?.fieldname}</Label>
                                                    {renderField(field)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isSideBarOpen ? "w-[20rem]" : "w-[5rem]"} transition-all h-full justify-center flex border-l pt-5`}>
                                    <div className='flex flex-col w-full gap-5 px-5'>
                                        <div onClick={() => sidebardeployer()} className='border p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full'>
                                            <SidebarOpen className={`${isSideBarOpen ? '' : 'rotate-180'}`} />
                                            {isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Close</p> : null}
                                        </div>
                                        <div className='h-0.5 w-full border-t' />
                                        <div onClick={() => handleSidebarClick("chat")} className={`${activeSidebar === "chat" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex  flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <MessagesSquare />
                                            {isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Chat</p> : null}
                                        </div>
                                        <div onClick={() => handleSidebarClick("logs")} className={`${activeSidebar === "logs" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <LucideClipboardSignature />
                                            {isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide leading-tight flex-nowrap'>Logs</p> : null}
                                        </div>
                                        <div onClick={() => handleSidebarClick("ai")} className={`${activeSidebar === "ai" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <BotMessageSquare />
                                            {
                                                isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>AI</p> : null
                                            }
                                        </div>
                                        <div>
                                            <div className={`
                                            ${getContent?.status === "Published" ? "bg-green-300/60 text-green-700 dark:bg-green-700 dark:text-green-300" : ""}
                                            ${getContent?.status === "Draft" ? "bg-yellow-300/60 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300" : ""}
                                            ${getContent?.status === "Review" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : ""}
                                            px-2.5 py-1 h-auto min-h-8 rounded-sm w-full flex items-center 
                                        `}>
                                                <div className='flex flex-col gap-0.5'>
                                                    {
                                                        isSideBarOpen === true ? <span className='font-bold'>{getContent?.status}</span> : null
                                                    }
                                                    {isSideBarOpen &&  (
                                                        <>
                                                            {getContent?.status === "Published" && <span className='text-xs font-medium'>This content has been published.</span>}
                                                            {getContent?.status === "Draft" && <span className='text-xs font-medium'>This content is a draft. It has not been posted.</span>}
                                                            {getContent?.status === "Review" && <span className='text-xs font-medium'>This content is under review. An owner, admin or author needs to review this first.</span>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isSideBarOpen && activeSidebar !== null  ? "w-[30rem] px-5 border-l" : "w-[0rem]"} flex flex-col gap-5 transition-all`}>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </AuthWrapper>
        </body>
    )
}