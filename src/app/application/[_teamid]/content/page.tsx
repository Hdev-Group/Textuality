"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import AppHeader from '@/components/header/appheader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/clerk-react';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import AuthWrapper from '../withAuth';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, AlignLeftIcon, History, Timer } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Page({ params }: { params: Promise<{ _teamid: string }> }) {
    const { _teamid } = React.use(params);
    const router = useRouter();
    const { userId, isLoaded } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const [activeTab, setActiveTab] = useState('all');
    const getTemplates = useQuery(api.template.getTemplates, { pageid: _teamid });
    const getContent = useQuery(api.content.getContent, { pageid: _teamid });
    const [userData, setUserData] = useState<any[]>([]);
    const [dataloaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (getPage?.users?.includes(userId as string)) {
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [userId, getPage, getPage?.users]);

    useEffect(() => {
        async function fetchUserData() {
            if (getContent?.[0]?.authorid) {
                try {
                    const response = await fetch(`/api/secure/get-user?userId=${getContent?.[0]?.authorid}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setUserData(data.users);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData([]);
                } finally {
                    setDataLoaded(true);
                }
            }
        }
        fetchUserData();
    }, [getContent]);

    if (!isLoaded) {
        return <IsLoadedEdge />;
    }
    if (!isAuthorized) {
        return <IsAuthorizedEdge />;
    }

    const filteredContentItems = getContent?.filter((item) => {
        if (activeTab === 'all') {
            return true;
        } else if (activeTab === 'new') {
            if (item.updated) {
                const updatedDate = new Date(item.updated);
                const now = new Date();
                const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
                if (now.getTime() - updatedDate.getTime() > twoWeeksInMs) {
                    return false;
                }
            }
        } else if (activeTab === 'scheduled') {
            return item.updated === '5 weeks ago';
        }
        return item.status === activeTab;
    });

    function getTemplateName(contentId: string) {
        const content = getContent?.find((item) => item._id === contentId);
        const template = getTemplates?.find((item) => item._id === content?.templateid);
        return template?.title;
    }

    const title = getPage?.title + ' — Content — Textuality';

    return (
        <div>
        <body className='overflow-y-hidden'>
            <title>{title}</title>
            <AuthWrapper _teamid={_teamid}>
                <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                    <AppHeader activesection="content" teamid={_teamid} />
                    <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                        <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                            <div className="flex">
                                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                                <main className="flex-1">
                                    <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-2xl font-bold">All Content</h1>
                                            <ContentCreateButton getTemplates={getTemplates} _teamid={_teamid} />
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8 bg-white  dark:bg-neutral-950">
                                        {/* Filters */}
                                        <div className="flex gap-4 mb-6 ">
                                            <Select>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Content Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    <SelectItem value="article">Article</SelectItem>
                                                    <SelectItem value="tutorial">Tutorial</SelectItem>
                                                    <SelectItem value="course">Course</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="review">In Review</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <Input className="pl-10" placeholder="Search content..." />
                                            </div>
                                        </div>

                                        {/* Content Table */}
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Template</TableHead>
                                                    <TableHead>Updated</TableHead>
                                                    <TableHead>Author</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredContentItems?.length > 0 ? (
                                                    filteredContentItems?.map((item) => (
                                                        <TableRow key={item._id} onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)} className='cursor-pointer hover:border-b-red-300/60'>
                                                            <TableCell className="font-medium">{item.title}</TableCell>
                                                            <TableCell>{getTemplateName(item._id)}</TableCell>
                                                            <TableCell>{timeAgo(new Date(item.updated))}</TableCell>
                                                            <TableCell>
                                                                {dataloaded ? (
                                                                    userData?.length > 0 ? (
                                                                        <div className="flex flex-row items-center gap-2">
                                                                            <Avatar className='h-7 w-7 border-2 p-0.5'>
                                                                                <AvatarImage className='rounded-full' src={userData[0]?.imageUrl} />
                                                                                <AvatarFallback>
                                                                                    <AvatarImage>
                                                                                        <AvatarFallback>{userData?.[0]?.firstName.charAt(0)}</AvatarFallback>
                                                                                    </AvatarImage>
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <span>{userData[0]?.firstName} {userData[0]?.lastName}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex flex-row items-center gap-2">
                                                                            <Avatar>
                                                                                <AvatarImage>
                                                                                    <AvatarFallback>UK</AvatarFallback>
                                                                                </AvatarImage>
                                                                            </Avatar>
                                                                            <span>Unknown User</span>
                                                                        </div>
                                                                    )) : (
                                                                    <div className="flex flex-row items-center gap-2">
                                                                        <Avatar>
                                                                            <AvatarImage>
                                                                                <div className='w-20 h-5 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse'></div>
                                                                            </AvatarImage>
                                                                        </Avatar>
                                                                        <div className='w-20 h-5 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse'></div>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className={`
                                                                        ${item.status === "Published" ? "bg-green-300/60 text-green-700 dark:bg-green-700 dark:text-green-300" : ""}
                                                                        ${item.status === "Draft" ? "bg-yellow-300/60 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300" : ""}
                                                                        ${item.status === "Review" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : ""}
                                                                        w-min px-2.5 py-1 rounded-sm
                                                                    `}>
                                                                        {item.status}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center items-center justify-center w-full">
                                                            <div className='flex flex-col gap-2 w-auto'>
                                                                <p className='text-lg'>No content found.</p>
                                                                <div className='w-auto'>
                                                                    <ContentCreateButton getTemplates={getTemplates} _teamid={_teamid} />
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </main>
                </div>
            </AuthWrapper>
        </body>
        </div>
    );
}

function timeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} days ago`;
    } else if (hours > 0) {
        return `${hours} hours ago`;
    } else if (minutes > 0) {
        return `${minutes} minutes ago`;
    } else {
        return `a few seconds ago`;
    }
}

function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <aside className="min-w-[13rem] bg-white h-screen dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800">
            <div className='px-4 py-5 space-y-8 border-b flex flex-col'>
                <ul className='space-y-2'>
                    <li className={`${activeTab === "all" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('all')}><AlignLeftIcon className='h-4 w-4' />All Content</li>
                    <li className={`${activeTab === "new" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('new')}><History className='h-4 w-4' />New</li>
                    <li className={`${activeTab === "scheduled" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('scheduled')}><Timer className='h-4 w-4' /> Scheduled</li>
                </ul>
            </div>

            <nav>
                <ul className="space-y-2">
                </ul>
            </nav>
        </aside>
    );
}
function ContentCreateButton({getTemplates, _teamid}: any) {
    const router = useRouter();

    return(
        <DropdownMenu>
        <DropdownMenuTrigger>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> New Content
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Templates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
                getTemplates?.length > 0 ? (
                    getTemplates?.map((template: any) => (
                        <DropdownMenuItem key={template._id} onClick={() => router.push(`/application/${_teamid}/content/create?templateid=${template._id}`)} >{template.title}</DropdownMenuItem>
                    ))
                ) : (
                    <>
                        <DropdownMenuLabel>No templates found.</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/application/${_teamid}/templates/new`)}>Create a new template</DropdownMenuItem>
                    </>
                )
            }
        </DropdownMenuContent>
    </DropdownMenu>
    )
}