"use client"
import {use, useState} from 'react';
import AppHeader from '@/components/header/appheader';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import { useAuth } from '@clerk/clerk-react';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useMutation, useQuery } from 'convex/react';
import { api} from '../../../../../convex/_generated/api';
import AuthWrapper from '../withAuth';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Search, AlignLeftIcon, History, TimerIcon, Timer, EyeOff } from 'lucide-react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  export default function Page({ params }: any) {
    const { _teamid } = params;
    const router = useRouter();
    const user = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const [activeTab, setActiveTab] = useState('all');
    const getTemplates = useQuery(api.template.getTemplates, { pageid: _teamid });

    const contentItems = [
        { id: 1, title: "Getting Started with React", type: "Blogging Template", updated: "1 hour ago", author: "Jane Doe", status: "Published" },
        { id: 2, title: "Advanced TypeScript Tips", type: "Blogging Template", updated: "2 days ago", author: "John Smith", status: "Draft" },
        { id: 3, title: "CSS Grid Layout Mastery", type: "Blogging Template", updated: "5 weeks ago", author: "Emily Brown", status: "Review" },
    ];

    const { userId, isLoaded, isSignedIn } = useAuth();
    useEffect(() => {
        if (getPage?.users?.includes(userId as string)) {
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [userId, getPage, getPage?.users]);

    if (!isLoaded) {
        return <IsLoadedEdge />;
    }
    if (!isAuthorized) {
        return <IsAuthorizedEdge />;
    }

    const filteredContentItems = contentItems.filter((item) => {
        if (activeTab === 'all') {
            return true;
        } else if (activeTab === 'new') {
            return item.updated === '1 hour ago';
        } else if (activeTab === 'scheduled') {
            return item.updated === '5 weeks ago';
        }
        return item.type === activeTab;
    });

    return (
        <body className='overflow-y-hidden'>
            <AuthWrapper _teamid={_teamid}>
            <AppHeader activesection="content" teamid={_teamid} />
            <main className="md:mx-auto md:px-10 py-3 h-full">
            <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                <div className="flex">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                        <main className="flex-1">
                            <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">All Content</h1>
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
                                            getTemplates?.map((template: any) => (
                                                <DropdownMenuItem key={template._id} onClick={() => router.push(`/application/${_teamid}/content/create?templateid=${template._id}`)} >{template.title}</DropdownMenuItem>
                                            ))
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                                {filteredContentItems.map((item) => (
                                    <TableRow key={item.id} className='cursor-pointer hover:border-b-red-300/60'>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.updated}</TableCell>
                                    <TableCell>{item.author}</TableCell>
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
                                ))}
                                </TableBody>
                            </Table>
                            </div>
                        </main>
                        </div>
                    </div>
                </main>
                </AuthWrapper>
            </body>
    )
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
    )
}