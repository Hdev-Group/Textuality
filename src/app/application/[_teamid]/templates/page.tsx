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


type Template = {
  name: string
  fields: number
  lastUpdatedBy: string
  updated: string
}

export default function Page({params: {_teamid }}: any) {
  const teamid = _teamid;
  const { userId, isLoaded, isSignedIn } = useAuth();
  const user = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const getPage = useQuery(api.page.getPage, { _id: teamid });
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('asc');
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState('');
  const getTemplates = useQuery(api.template.getTemplates, { pageid: teamid });
  const getRole = useQuery(api.page.getRoledetail, { externalId: userId, pageId: _teamid })

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
      const matchesLastUpdated = lastUpdatedFilter === '' || template.updated.includes(lastUpdatedFilter);
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

  
  return (
    <AuthWrapper _teamid={teamid}>
      <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <AppHeader activesection="templates" teamid={_teamid} />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl flex flex-col shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-4 gap-5 md:flex-row justify-between">
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
  
            <Table>
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
                    <TableRow key={index} onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>
                    <TableCell>{template.title}</TableCell>
                    <TableCell>{template.fields}</TableCell>
                    <TableCell>
                      {template.lastUpdatedBy}
                    </TableCell>
                    <TableCell>{timeAgo(new Date(template._creationTime))}</TableCell>
                    </TableRow>
                  ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No templates found.
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
  );
}