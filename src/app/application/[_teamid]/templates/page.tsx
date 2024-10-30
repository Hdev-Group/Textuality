"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import AppHeader from "@/components/header/appheader"
import { BookMarkedIcon, Filter, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function Page({ params }: { params: Promise<{ _teamid: string}> }) {
  const { _teamid } = React.use(params);
  const teamid = _teamid;
  const { userId, isLoaded, isSignedIn } = useAuth();
  const user = useUser();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("asc");
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState("");
  const TemplateRemove = useMutation(api.template.remove);

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

  // Filter templates based on search terms and sorting options
  const filteredTemplates = useMemo(() => {
    if (!getTemplates) return [];

    const sortedTemplates = [...getTemplates].sort((a, b) =>
      nameFilter === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    return sortedTemplates.filter((template) => {
      const matchesSearch = Object.values(template).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesLastUpdated = lastUpdatedFilter === "" || template?.lastUpdatedBy.includes(lastUpdatedFilter);
      return matchesSearch && matchesLastUpdated;
    });
  }, [getTemplates, searchTerm, lastUpdatedFilter, nameFilter]);

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

  if (!isSignedIn) return <IsAuthorizedEdge />;

  const title = getPage?.title + " — Templates — Textuality";
  
  return (
      <body className="overflow-y-hidden">
        <title>{title}</title>
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
                <div className='flex  md:w-[40rem] flex-row w-full gap-5'>
                  <Input 
                  placeholder="Search Templates" 
                  className="w-full md:w-full"
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
                  {
                    getRole?.[0]?.permissions?.some(permission => ['owner', 'admin', 'author'].includes(permission)) && (
                      <TableHead>Actions</TableHead>
                    )
                  }
                </TableRow>
              </TableHeader>
                <TableBody>
                {
                  filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template, index) => (
                    <TableRow className='cursor-pointer border-b-red-200' key={index}>
                    <TableCell onClick={() => router.push(`/application/${teamid}/templates/edit/${template._id}`)}>{template.title}</TableCell>
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
                    {
                      getRole?.[0]?.permissions?.some(permission => ['owner', 'admin'].includes(permission)) && (
                        <TableCell className="z-50">
                          <div className="flex justify-end">
                            <DeleteTemplate
                              id={template._id}
                              title={template.title}
                              onDelete={async (id) => {
                                await TemplateRemove({ _id: id as any});
                              }}
                              getRole={getRole}
                            />
                          </div>
                        </TableCell>
                      )
                    }
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
interface DeleteTemplateProps {
  id: any
  title: string
  onDelete: (id: string) => Promise<void>
  getRole: { permissions: string[] }[]
}

function DeleteTemplate({ id, title, onDelete, getRole }: DeleteTemplateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [length, setLength] = useState(0)
  console.log(length)
  const TemplateRemove = useMutation(api.template.remove);
  const getContentSpecific = useQuery(api.template.getContentViaTemplate, { templateid: id as any});


  const canDelete = getRole?.[0]?.permissions?.some(permission => ['owner', 'admin'].includes(permission))

    const handleDelete = async () => {
      if (confirmTitle !== title) {
        setError("The entered title doesn't match. Please try again.")
        return
      }
      if (getContentSpecific?.length > 0){
        setError("The template has content associated with it. Please delete the content items before deleting the template.")
        return
      }
      setIsDeleting(true)
      setError(null)
  
      try {
        await onDelete(id)
        setSuccess(true)
        setTimeout(() => setIsOpen(false), 2000) // Close dialog after 2 seconds
      } catch (err) {
        setError("An error occurred while deleting the template. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }

  if (!canDelete) return null

  useEffect(() => {
    const length = getContentSpecific?.length
    setLength(length)
  }, [getContentSpecific])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {getContentSpecific && getContentSpecific?.length === 0 && (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Template</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the template, all content, and all its contents.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            To confirm, type <strong>{title}</strong> in the box below:
          </p>
          <Input
            className="mt-2"
            value={confirmTitle}
            onChange={(e) => setConfirmTitle(e.target.value)}
            placeholder="Enter template title"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>The template has been successfully deleted.</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={confirmTitle !== title || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
      )} {
        // we will show an error if the template has content
        getContentSpecific && getContentSpecific?.length > 0 && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error Deleting Template</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              You are <strong>unable to delete this template</strong> as it has content associated with it. 
              We detected <strong>{length}</strong> content items associated with this template.
              Please delete the content items before deleting the template.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Okay, Got it.</Button>
            </DialogFooter>
          </DialogContent>
        )
      }
    </Dialog>
  )
}