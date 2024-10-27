"use client";
import AppHeader from '@/components/header/appheader'
import AuthWrapper from '../../../withAuth'
import { api } from '../../../../../../../convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import React, {use, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import { BotMessageSquare, ChevronLeft, LucideClipboardSignature, MessagesSquare, SidebarOpen } from 'lucide-react';
import { get } from 'http';

export default function ContentEditPage({params}: {params: Promise<{ _teamid: string, _fileid: string }>}) {
    const router = useRouter();
    const { _teamid, _fileid } = React.use(params)
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    
    const getContent = useQuery(api.content.getContentSpecific, { _id: _fileid as any });
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const title = getPage?.title + ' — ' + getContent?.title + '— Textuality';

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
                                    <div className='flex flex-col gap-5'>

                                    </div>
                                </div>
                            </div>
                            <div className={`${isSideBarOpen ? "w-[22rem]" : "w-[5rem]"} transition-all h-full justify-center flex border-l pt-5`}>
                                <div className='flex flex-col w-full gap-5 px-5'>
                                    <div onClick={() => setIsSideBarOpen(!isSideBarOpen)} className='border overflow-hidden items-center flex flex-row gap-4 p-1 cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all'>
                                        <SidebarOpen className={`${isSideBarOpen ? '' : 'rotate-180'}`} />
                                        { isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Close Sidebar</p> : null }
                                    </div>
                                    <div className='h-0.5 w-full border-t' />
                                    <div className='border p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all'>
                                        <MessagesSquare  />
                                        { isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>View Messages</p> : null }
                                    </div>
                                    <div className='border p-1 cursor-pointer overflow-hidden flex flex-row items-center gap-4 h-auto rounded-md  hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all'>
                                        <LucideClipboardSignature />
                                        { isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide leading-tight flex-nowrap'>View Logs</p> : null }
                                    </div>
                                    <div className='border p-1 cursor-pointer overflow-hidden flex flex-row items-center gap-4 h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all'>
                                        <BotMessageSquare />
                                        {
                                            isSideBarOpen ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>AI Assistant</p> : null
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
                                        {isSideBarOpen && (
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
                        </div>
                    </div>
                </main>
            </div>
        </AuthWrapper>
        </body>
    )
}