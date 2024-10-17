"use client"
import AppHeader from "@/components/header/appheader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle } from "lucide-react"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Button } from "@/components/ui/button"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';



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
      <IsLoadedEdge />
    );
  }
  if (!isAuthorized) {
    return (
      <IsAuthorizedEdge />
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