"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import AppHeader from '@/components/header/appheader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/clerk-react';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useMutation, useQuery } from 'convex/react';
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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectSeparator } from '@radix-ui/react-select';
import Link from 'next/link';

export default function Page({ params }: { params: { _teamid: string }}) {
    const { _teamid } = params;
    const router = useRouter();
    const { userId, isLoaded } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const [activeTab, setActiveTab] = useState('all');
    const getTemplates = useQuery(api.template.getTemplates, { pageid: _teamid });
    const getRole = useQuery(api.page.getRoledetail, { externalId: userId ?? 'none', pageId: _teamid });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: _teamid });
    const DeleteContenta = useMutation(api.content.deleteContent);
    const getContent = useQuery(api.content.getContent, { pageid: _teamid });
    const [userData, setUserData] = useState<any[]>([]);
    const [dataloaded, setDataLoaded] = useState(false);
    const [filteredContentItems, setFilteredContentItems] = useState(getContent || []);

    const departmentFilter = getDepartments?.filter((department) => department._id === getContent?.[0]?.authorid);

    useEffect(() => {
        setFilteredContentItems(getContent || []);
    }, [getContent]);
    
    useEffect(() => {
        if (getPage?.users?.includes(userId as string)) {
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [userId, getPage, getPage?.users]);


    useEffect(() => {
        async function fetchAllUserData() {
            if (getContent && getContent.length > 0) {
                try {
                    // map out all the author ids then find those that dont have user_ in them
                    const authorIds = getContent.map((item) => item.authorid);
                    const uniqueAuthorIds = [...new Set(authorIds)];
                    const userAuthorIds = uniqueAuthorIds.filter((id) => id.includes("user_"));
                    const response = await fetch(`/api/secure/get-user?userId=${userAuthorIds.join(",")}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setUserData(data.users);
                    setDataLoaded(true);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setDataLoaded(true);
                }
            }
        }
        fetchAllUserData();
    }, [getContent]);

    function filterContentItem(selectedItemId: string) {
        if (selectedItemId === "all") {
            setFilteredContentItems(getContent || []); // Show all content
        } else {
            const filteredItems = getContent?.filter(
                (item) => item.authorid === selectedItemId || item._id === selectedItemId
            );
            setFilteredContentItems(filteredItems || []); // Update filtered items
        }
    }
    function DeleteContent(contentId: any) {
        DeleteContenta({ _id: contentId as any});
    }

    function getTemplateName(contentId: string) {
        const content = getContent?.find((item) => item._id === contentId);
        const template = getTemplates?.find((item) => item._id === content?.templateid);
        return template?.title;
    }
    return (
        
        <div className='overflow-y-hidden'>
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
                                            {/* Filter by Author */}
                                                <Select defaultValue="all" onValueChange={(value) => filterContentItem(value)}>
                                                    <SelectTrigger className="w-auto">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>All Authors</SelectLabel>
                                                            <SelectItem value="all">All</SelectItem> {/* Option to show all */}
                                                            {userData?.map((user) => (
                                                                <SelectItem value={user.id} key={user.id}>
                                                                    {user.firstName} {user.lastName}
                                                                </SelectItem>
                                                            ))}

                                                            <SelectSeparator />
                                                            <SelectLabel>All Departments</SelectLabel>
                                                            {getDepartments?.map((department) => (
                                                                <SelectItem value={department._id} key={department._id}>{department.departmentname}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
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
                                                    {
                                                        ["admin", "owner", "author"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                                            <TableHead>Actions</TableHead>
                                                        ) : null
                                                    }
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredContentItems?.length > 0 ? (
                                                    filteredContentItems?.map((item) => (
                                                                <TableRow key={item._id} className="cursor-pointer hover:border-b-red-300/60">
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)} className="font-medium">{item.title}</TableCell>
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)}>{getTemplateName(item._id)}</TableCell>
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)}>{timeAgo(new Date(item.updated))}</TableCell>
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)}>
                                                                            {userData?.map((user) => {
                                                                                if (user.id === item.authorid) {
                                                                                    return (
                                                                                        <div className="flex flex-row items-center gap-2" key={user.id}>
                                                                                            <Avatar className='w-7 h-7'>
                                                                                                <AvatarImage src={user.imageUrl} alt={user.firstName} />
                                                                                                <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                                                                                            </Avatar>
                                                                                            <p>{user.firstName} {user.lastName}</p>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })}
                                                                            {departmentFilter?.map((department) => {
                                                                                if (department._id === item.authorid) {
                                                                                    return (
                                                                                        <div className="flex flex-row items-center gap-2" key={department._id}>
                                                                                            <Avatar className='w-7 h-7'>
                                                                                                <AvatarFallback>{department.departmentname.charAt(0)}</AvatarFallback>
                                                                                            </Avatar>
                                                                                            <p>{department.departmentname}</p>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })}
                                                                    </TableCell>
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)}>
                                                                        <div>
                                                                            <div className={`${
                                                                                item.status === "Published" ? "bg-green-300/60 text-green-700 dark:bg-green-700 dark:text-green-300" : ""
                                                                            } ${
                                                                                item.status === "Draft" ? "bg-yellow-300/60 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300" : ""
                                                                            } ${
                                                                                item.status === "Review" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : ""
                                                                            } w-min px-2.5 py-1 rounded-sm`}>
                                                                                {item.status}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    {
                                                                        ["admin", "owner", "author"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                                                            <TableCell>
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger>
                                                                                        <Button variant="ghost" size="icon">
                                                                                            <AlignLeftIcon className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent align="end">
                                                                                        <DropdownMenuItem onClick={() => DeleteContent(item._id)}>Delete</DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        ) : null
                                                                    }
                                                                </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center items-center justify-center w-full">
                                                            <div className="flex flex-col gap-2 w-auto">
                                                                <p className="text-lg">No content found.</p>
                                                                <div className="w-auto">
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
            <div>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> New Content
            </Button>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Templates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
                getTemplates?.length > 0 ? (
                    getTemplates?.map((template: any) => (
                    <Link href={`/application/${_teamid}/content/create?templateid=${template._id}`} key={template._id}>
                        <DropdownMenuItem key={template._id} >{template.title}</DropdownMenuItem>
                    </Link>
                    ))
                ) : (
                    <>
                        <DropdownMenuLabel>No templates found.</DropdownMenuLabel>
                        <Link href={`/application/${_teamid}/templates/new`}>
                        <DropdownMenuItem >Create a new template</DropdownMenuItem>
                        </Link>
                    </>
                )
            }
        </DropdownMenuContent>
    </DropdownMenu>
    )
}