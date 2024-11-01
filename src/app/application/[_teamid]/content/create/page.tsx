"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import AuthWrapper from '../../withAuth';
import AppHeader from '@/components/header/appheader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TemplateManager({ params }: { params: Promise<{ _teamid: string }> }) {
    const { _teamid } = React.use(params);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [templateId, setTemplateId] = useState<string | null>(null);
    const [open, setOpen] = useState(true)
    const [content, setContent] = useState({name: '', apiref: ''})
    const { userId } = useAuth()
    const getTemplates = useQuery(api.template.getTemplates, { pageid: _teamid });

    useEffect(() => {
        // Resolve the params promise
        params.then(data => {
            setTeamId(data._teamid);
        }).catch(error => {
            console.error("Error fetching team ID:", error);
        });
    }, [params]);
    const router = useRouter();
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setTemplateId(urlParams.get('templateid'));
    }, []);
    useEffect(() => {
        if (!open && content.apiref === '') {
            router.push(`/application/${_teamid}/content`);
        }
    }, [open, content, router]);
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (getPage?.users?.includes(userId as string)) {
          setIsAuthorized(true)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }, [getPage, userId])

    const [namevalue, setNameValue] = useState('')
    const [apivalue, setApiValue] = useState('')

    const sendContent = useMutation(api.content.createContent)
  
    const templatefilter = getTemplates?.filter((template) => template._id === templateId)
    async function onsubmit(event) {
        event.preventDefault();
        setOpen(false);
        setContent({ name: namevalue, apiref: apivalue });
        const returner = await sendContent({ pageid: _teamid as any, updated: new Date().getTime(), templateid: templateId as any, title: namevalue, apiref: apivalue, lastUpdatedBy: userId });
        router.push(`/application/${_teamid}/content/${returner}/edit`);
    }

    return (
        <body className='overflow-y-hidden'>
            <AuthWrapper _teamid={_teamid}>
            <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                <AppHeader activesection="content" teamid={_teamid} />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Content</DialogTitle>
                            <DialogDescription>Your creating content using the <b>{templatefilter?.[0]?.title}</b></DialogDescription>
                        </DialogHeader>
                        <form id='newcontent' onSubmit={(event) => {
                            onsubmit(event)
                        }}>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="name" className="font-semibold text-sm">
                                Title
                                </Label>
                                <Input id="name" onChange={(e) => setNameValue(e.target.value)} maxLength={45} placeholder="Enter content title" />
                                <div className='flex justify-end'>
                                    <p className='text-xs'>{namevalue.length}/45</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="apiref" className="font-semibold text-sm">
                                API Reference
                                </Label>
                                <Input id="apiref" onChange={(e) => setApiValue(e.target.value)} maxLength={45} placeholder="Enter API reference" />
                                <div className='flex justify-end'>
                                    <p className='text-xs'>{apivalue.length}/45</p>
                                </div>
                            </div>
                            <DialogFooter className='mt-5'>
                                <div className="flex justify-between w-full">
                                    <Button variant="outline"  onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type='submit'>Create Content</Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                    <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                        <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                            <div className="flex-1 p-6 w-full overflow-y-auto">
                                {/* Skeleton loaders */}
                                <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-800 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6 animate-pulse"></div>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </AuthWrapper>
        </body>
    );
}