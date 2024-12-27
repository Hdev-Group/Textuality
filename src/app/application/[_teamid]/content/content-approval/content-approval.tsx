"use client";
import AppHeader from '@/components/header/appheader';
import AuthWrapper from '../../withAuth';
import Sidebar from '@/components/sidebar/sidebar';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlignLeftIcon} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ContentApproval({ params }) {
    const { _teamid } = params;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Content Approval');
    const getContent = useQuery(api.content.getContent, { pageid: _teamid });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: _teamid });
    const departmentFilter = getDepartments?.filter((department) => department._id === getContent?.[0]?.authorid);
    const [userData, setUserData] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [getRole, setRole] = useState<any>();

        useEffect(() => {
            async function fetchAllUserData() {
                if (getContent && getContent.length > 0) {
                    try {
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

    const handleSelectAllChange = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            const allIds = getContent?.map((item) => item._id) || [];
            setSelectedItems(allIds);
        } else {
            // Deselect all items
            setSelectedItems([]);
        }
    };

    const handleCheckboxChange = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, itemId]);
        } else {
            setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        }
    };

    return(
        <div className='overflow-y-hidden'>
        <AuthWrapper _teamid={_teamid}>
            <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                <AppHeader activesection="content" teamid={_teamid} />
                <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                    <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                        <div className='flex'>
                            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pageid={_teamid} />
                            <main className="flex-1">
                                <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-2xl font-bold">Content Review</h1>
                                    </div>
                                </div>
                                <div className="p-8 space-y-8 bg-white  dark:bg-neutral-950">
                                    <div className="flex-1 gap-4 mb-6 ">
                                        <div className='border rounded-md'>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            <Checkbox
                                                                checked={selectAll}
                                                                onCheckedChange={(checked) => handleSelectAllChange(checked as boolean)}
                                                            />
                                                        </TableHead>
                                                        <TableHead>Title</TableHead>
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
                                                    {getContent?.map((item) => (
                                                        item.status === "Review" ? (
                                                            <TableRow key={item._id} className="cursor-pointer hover:border-b-red-300/60">
                                                                    <TableCell>
                                                                    <Checkbox
                                                                        checked={selectedItems.includes(item._id)}
                                                                        onCheckedChange={(checked) =>
                                                                            handleCheckboxChange(item._id, checked as boolean)
                                                                        }
                                                                        className='ml-2'
                                                                    />
                                                                    </TableCell>
                                                                    <TableCell onClick={() => router.push(`/application/${_teamid}/content/${item._id}/edit`)} className="font-medium">{item.title}</TableCell>
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
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        ) : null
                                                                    }
                                                            </TableRow>
                                                        ) : null
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </main>
            </div>
        </AuthWrapper>
        </div>
    )
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
