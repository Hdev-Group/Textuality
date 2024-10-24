"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import AppHeader from "@/components/header/appheader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { use } from 'react';

type Template = {
  name: string
  fields: number
  lastUpdatedBy: any
  updated: string
}

export default function Page({ params }: { params: any, _teamid: any }) {
  const { _teamid }: { _teamid: any } = use(params);
  const teamid = _teamid;
  const { userId, isLoaded, isSignedIn } = useAuth();
  const user = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [userData, setUserData] = useState<any[]>([]);
  console.log(userData);
  const getPage = useQuery(api.page.getPage, { _id: teamid });
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('asc');
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('');
  const getTemplates = useQuery(api.template.getTemplates, { pageid: teamid });
  console.log(getTemplates);
  const getRole = useQuery(api.page.getRoledetail, { externalId: userId as string, pageId: _teamid })

  function nameFilterSetter() {
    setNameFilter(nameFilter === 'asc' ? 'desc' : 'asc');
  }

  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [getPage, userId]);

  const filteredTemplates = useMemo(() => {
    if (!getTemplates) return [];

    const sortedTemplates = getTemplates.sort((a, b) => {
      if (nameFilter === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    return sortedTemplates.filter(template => {
      const matchesSearch = Object.values(template).some(
        value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesLastUpdated = lastUpdatedFilter === '' || template?.lastUpdatedBy.includes(lastUpdatedFilter);
      return matchesSearch && matchesLastUpdated;
    });
  }, [getTemplates, searchTerm, lastUpdatedFilter, nameFilter]);

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
  useEffect(() => {
    async function fetchUserData() {
      if (getTemplates?.[0]?.lastUpdatedBy) {
        try {
          const response = await fetch(`/api/secure/get-user?userId=${getTemplates?.[0]?.lastUpdatedBy}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setUserData(data.users);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData([]);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchUserData();

  }, [getTemplates]);
  const title = getPage?.title + ' — Templates — Textuality'
  
  return (
      <body className="overflow-y-hidden">
        <title>{title}</title>
      <AuthWrapper _teamid={teamid}>
      <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen overflow-y-hidden">
        <AppHeader activesection="templates" teamid={teamid} />
        <main className="mx-auto px-10  py-3">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-8 space-y-8 h-screen overflow-y-auto">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
                <h1 className="text-2xl font-bold w-full md:w-auto min-w-[15rem]">
                  Content Templates
                </h1>
                <div className='flex flex-row gap-5'>
                  <Input 
                  placeholder="Search Templates" 
                  className="w-full md:w-[40rem]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {getRole?.[0]?.permissions?.some(permission => ['owner', 'admin', 'author'].includes(permission)) && (
                <Link href={`/application/${teamid}/templates/new`}>
                  <Button variant="default" className="w-full md:w-auto">Create Template</Button>
                </Link>
                )}  
                </div>
            </div>
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
                    <TableRow className='cursor-pointer border-b-red-200' key={index} onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>
                    <TableCell>{template.title}</TableCell>
                    <TableCell>{template.fields}</TableCell>
                    <TableCell>
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
                    <TableCell>{timeAgo(new Date(template._creationTime))}</TableCell>
                    </TableRow>
                  ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center  items-center justify-center w-full">
                        <div className='flex flex-col gap-2'>
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
        </main>
      </div>
    </AuthWrapper>
    </body>
  );
}