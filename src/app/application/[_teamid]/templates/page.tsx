"use client"
import AppHeader from "@/components/header/appheader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle } from "lucide-react"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Button } from "@/components/ui/button"



export default function Page({params: {_teamid }}: any) {
  const teamid = _teamid;
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getPage = useQuery(api.page.getPage, { _id: teamid });
  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [getPage, userId]);

  if (!isLoaded) {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen">
        <div className="flex items-center flex-col justify-center min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground text-center mt-4">Loading.</p>
        </div>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full border-red-500 max-w-md">
          <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
            <p>
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            </p>
            <h2 className="text-2xl font-bold mb-2">Not Authorised</h2>
            <p className="text-muted-foreground">
              You are not authorised to access this page. <br />
              <span className="text-xs">Think this is wrong? Contact the page owner.</span>
            </p>
            <a href='/application/home'>
              <Button className="mt-4" variant="outline">Go Home</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }
    return (
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <AppHeader activesection="templates" teamid={_teamid} />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div>
                <h1 className="text-4xl font-bold">

                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                </p>
              </div>
              <div className="flex items-s</div>tart">
              </div>
            </div>
            </div>
        </main>
      </div>
    )
}