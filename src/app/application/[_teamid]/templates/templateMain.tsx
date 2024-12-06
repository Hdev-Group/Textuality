"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import AppHeader from "@/components/header/appheader"
import { ArrowUp, BookMarkedIcon, Filter, PlusCircleIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import "../team.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import AuthWrapper from '../withAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Template = {
  name: string
  fields: number
  lastUpdatedBy: any
  updated: string
}

export default function Page({ params }: { params: { _teamid: string}}) {
  const { _teamid } = params;
  const user = useUser();
  const teamid = _teamid;
  const { userId } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("asc");
  const [usernameFilter, setUsernameFilter] = useState<string | null>(null)
  const [lastUpdatedFilter, setLastUpdatedFilters] = useState("highest");

  // Fetch data using hooks at the top level to avoid inconsistencies
  const getPage = useQuery(api.page.getPage, { _id: teamid as any });
  const getTemplates = useQuery(api.template.getTemplates, { pageid: teamid });
  const getRole = useQuery(api.page.getRoledetail, { externalId: userId || "none", pageId: teamid });

  // Handle authorization and loading state
  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [getPage, userId]);

  // Fetch user data based on the fetched template details
  useEffect(() => {
    async function fetchUserData() {
      if (getTemplates?.[0]?.lastUpdatedBy) {
        try {
          const response = await fetch(`/api/secure/get-user?userId=${getTemplates[0].lastUpdatedBy}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setUserData(data.users);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData([]);
        }
      }
    }
    fetchUserData();
  }, [getTemplates]);

  const filteredTemplates = useMemo(() => {
    if (!getTemplates) return [];

    const sortedTemplates = [...getTemplates].sort((a, b) => {
      if (nameFilter === "asc") {
        return a.title.localeCompare(b.title);
      } else if (nameFilter === "desc") {
        return b.title.localeCompare(a.title);
      } else {
        return 0;
      }
    });

    const filteredByLastUpdated = sortedTemplates.sort((a, b) => {
      if (lastUpdatedFilter === "highest") {
        return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime();
      } else if (lastUpdatedFilter === "lowest") {
        return new Date(a._creationTime).getTime() - new Date(b._creationTime).getTime();
      } else {
        return 0;
      }
    });

    return filteredByLastUpdated.filter((template) => {
      const matchesSearch = Object.values(template).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesUsernameFilter = usernameFilter === null || template?.lastUpdatedBy === usernameFilter;
      return matchesSearch && matchesUsernameFilter;
    });
  }, [getTemplates, searchTerm, lastUpdatedFilter, usernameFilter, nameFilter, lastUpdatedFilter]);

  // Helper functions
  function nameFilterSetter() {
    setNameFilter((prevFilter) => (prevFilter === "asc" ? "desc" : "asc"));
  }

  function timeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "a few seconds ago";
  }  

  function filterbyuser(userid: string) {
    if (usernameFilter != null){
      setUsernameFilter(null);
    } else {
      setUsernameFilter(userid);
    }
  }
  function setupdatedlastFilter() {
    if (lastUpdatedFilter === "highest") {
      setLastUpdatedFilters("lowest");
    } else if (lastUpdatedFilter === "lowest") {
      setLastUpdatedFilters(null);
    } else {
      setLastUpdatedFilters("highest");
    }
  }
  
  return (
    <div className="overflow-y-hidden">
      <AuthWrapper _teamid={teamid}>
      <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen overflow-y-hidden">
        <AppHeader activesection="templates" teamid={teamid} />
        <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
          <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg p-8 space-y-8 h-screen overflow-y-auto">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div className="flex flex-col md:flex-row w-full items-start justify-between gap-4">
                <h1 className="text-2xl font-bold w-full md:w-auto ">
                  Templates
                </h1>
                <div className='flex  md:w-[40rem] flex-row w-full'>
                  <Input 
                  placeholder="Search Templates" 
                  className="w-full md:w-full rounded-r-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
                <Select
                  value={nameFilter}
                  onValueChange={(value) => setNameFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-[180px] rounded-l-none">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Name (A-Z)</SelectItem>
                    <SelectItem value="desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                {getRole?.[0]?.permissions?.some(permission => ['owner', 'admin', 'author'].includes(permission)) && (
                <Link href={`/application/${teamid}/templates/new`}>
                  <Button variant="default" className="w-full md:w-auto">Create Template</Button>
                </Link>
                )}  
                </div>
            </div>
            <div className='flex flex-row justify-start items-center gap-2'>
              <div onClick={() => filterbyuser(user.user.id)} className={`flex cursor-pointer  hover:border-blue-300 transition-all items-center justify-center gap-1 px-3 text-sm py-1.5 rounded-full border-dashed border ${usernameFilter === null ? "border-blue-400 hover:text-foreground text-muted-foreground" : "border-blue-300 text-foreground"}`}>
                <PlusCircleIcon className='w-3 h-3'/> Filter by me
              </div>

              <div onClick={() => setupdatedlastFilter()} className='flex items-center justify-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground hover:border-blue-300 transition-all px-3 text-sm py-1.5 rounded-full border-dashed border-blue-400 border'>
                <PlusCircleIcon className='w-3 h-3'/> Filter by updated <ArrowUp className={`w-3 h-3 ${lastUpdatedFilter === "highest" ? "" : "rotate-180"} ${lastUpdatedFilter === null ? "hidden" : "flex"}`} />
              </div>
            </div>
            <div className='border rounded-md'>
              <Table className='overflow-y-auto max-h-screen'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='flex flex-row gap-1 items-center' onClick={() => nameFilterSetter()}>
                      <div className='cursor-pointer flex flex-row gap-1 items-center w-auto'>
                        Name <Filter height={15} />
                      </div>
                    </TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Last Updated By</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                  {
                    filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                      <TableRow className='cursor-pointer border-b-red-200' key={index}>
                      <TableCell onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>
                        <div className='flex flex-col gap-0.5 items-start justify-center'>
                          <p>{template.title}</p>
                          <p className='text-sm dark:text-neutral-400 text-neutral-700'>{template.description}</p>
                        </div>
                        </TableCell>
                      <TableCell onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>{template.fields}</TableCell>
                      <TableCell onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>
                        {userData.length > 0 ? (
                          <div className="flex flex-row items-center gap-2">
                            <Avatar className='h-7 w-7 border-2 p-0.5'>
                              <AvatarImage className='rounded-full' src={userData[0]?.imageUrl} />
                              <AvatarFallback>
                                <AvatarImage>
                                  <BookMarkedIcon />
                                </AvatarImage>
                              </AvatarFallback>
                            </Avatar>
                            <span>{userData[0]?.firstName} {userData[0]?.lastName}</span>
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-2">
                            <Avatar>
                              <AvatarImage>
                                <BookMarkedIcon />
                              </AvatarImage>
                            </Avatar>
                            <span>Unknown User</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>{timeAgo(new Date(template._creationTime))}</TableCell>
                      </TableRow>
                    ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center items-center justify-center w-full">
                          <div className='flex flex-col gap-2 items-center justify-center'>
                          No templates found.
                            {
                              getRole?.[0]?.permissions?.some(permission => ['owner', 'admin', 'author'].includes(permission)) && (
                                <Link href={`/application/${teamid}/templates/new`}>
                                  <Button variant="default" className="w-full md:w-auto">Create Template</Button>
                                </Link>
                              )
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
    </div>
  );
}

