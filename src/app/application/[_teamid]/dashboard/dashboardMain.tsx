"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle, ChartArea, CreditCard, ArrowLeft, LucideMessageCircleQuestion, Folder, Text, LucideHardDriveUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import AuthWrapper from '../withAuth';
import { cookies } from 'next/headers';
import { set } from 'zod';
import { Progress } from "@/components/ui/progress"

export default function Page({ params }: { params: { _teamid: string} }) {
  const { _teamid } = params;
  const teamid = _teamid;
  const user = useUser();
  const pageContentAPIGetter = useQuery(api.apicontent.pageContentAPIGetter, { pageid: teamid })
  const getpageinfo = useQuery(api.page.getPageDetails, { _id: teamid as any });

  const [preview, setPreview] = useState("Setup");

  function changePreview(preview: string) {
    if (preview === "PowerUser") {
      document.cookie = `poweruser=true; path=/; SameSite=Lax`;
      document.cookie = `setup=false; path=/; SameSite=Lax`;
    } else {
      document.cookie = `setup=true; path=/; SameSite=Lax`;
      document.cookie = `poweruser=false; path=/; SameSite=Lax`;
    }
    setPreview(preview);
  }

  useEffect(() => {
    if (document.cookie.includes('poweruser=true')) {
      setPreview("PowerUser");
    } else if (document.cookie.includes('setup=true')) {
      setPreview("Setup");
    }
  }, []);

  return (
    <div>
        <body className='overflow-hidden'>
          <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
          <AppHeader activesection="dashboard" teamid={teamid} />
          <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
            <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg p-8 space-y-8 h-screen overflow-y-auto pb-32">
          <div className="flex flex-col md:gap-0 gap-5 w-full justify-between">
            <div>
              {
                preview === "Setup" ? <Setup changePreview={changePreview} /> : <PowerUser changePreview={changePreview} pageContentAPIGetter={pageContentAPIGetter} getpageinfo={getpageinfo} _teamid={_teamid} />
              }
            </div>
          </div>
          </div>
          </main>
        </div>
          </AuthWrapper>
        </body>
      </div>
  );
}

function Setup({ changePreview }: { changePreview: any }) {
  return(
    <div className='xl:min-w-[1400px] w-full xl:w-min container mt-10 mx-auto items-center justify-center'>
    <div className='flex container mx-auto'>
      <div className='flex flex-row justify-between w-full items-center'>
        <h2 className='text-3xl font-semibold'>Setup your Textuality account</h2>
        <div className='flex flex-row gap-3'>
          <Button>Start Setup</Button>
          <div className='flex flex-row gap-1 items-center justify-center cursor-pointer' onClick={() => changePreview("PowerUser")}>
          <X className='h-5 w-5' /> <p className='text-md'>Skip setup</p>
        </div>
        </div>
      </div>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><Layout className='h-6 w-6' />Connect your website</p>
          </div>
          <div className='flex w-full flex-row justify-between py-2 px-5'>
            <div className='flex flex-row gap-5 items-center w-1/3 border-r pr-5 border-muted'>
            <Text className='h-10 w-10' />
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold text-lg'>Quick Start Guide</h3>
                <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/4 pl-5'>
              <div className='flex flex-row border-b py-4 gap-5'>
              <img src="/icons/IMG_6490.png" className='h-10 dark:flex hidden' />
              <img src="/icons/IMG_6451.png" className='h-10 dark:hidden flex' />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Create your content</h3>
                  <p>Learn how to integrate Textuality using best practices that will make you appear higher in search results</p>
                </div>
              </div>
              <div className='flex flex-row gap-5 py-4'>
              <img src="/icons/IMG_6489.png" className='h-10 dark:flex hidden' />
              <img src="/icons/IMG_6452.png" className='h-10 dark:hidden flex' />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Pre-Made Templates</h3>
                  <p>Unsure where to begin? Start by using a pre-configured template.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

function PowerUser({ getpageinfo, _teamid, changePreview, pageContentAPIGetter }: { getpageinfo: any, changePreview: any, _teamid: any, pageContentAPIGetter: any }) {
  const teamid = _teamid;
  useEffect(() => {
    const handleCookieChange = () => {
      if (document.cookie.includes('showhideContent=true')) {
        setShowHideContent(true);
      } else {
        setShowHideContent(false);
      }
      if (document.cookie.includes('showhideSuggesteder=true')) {
        setShowHideSuggested(true);
      } else {
        setShowHideSuggested(false);
      }
    };

    handleCookieChange();
    window.addEventListener('cookiechange', handleCookieChange);

    return () => {
      window.removeEventListener('cookiechange', handleCookieChange);
    };
  }, []);


  function showHideContentBuild() {
    const newState = !showhideContent;
    setShowHideContent(newState);
    document.cookie = `showhideContent=${newState}; path=/; SameSite=Lax`;
    window.dispatchEvent(new Event('cookiechange'));
  }

  function showhideSuggested() {
    const newState = !showhideSuggesteder;
    setShowHideSuggested(newState);
    document.cookie = `showhideSuggesteder=${newState}; path=/; SameSite=Lax`;
    window.dispatchEvent(new Event('cookiechange'));
  }
  const [showhideContent, setShowHideContent] = useState(true);
  const [showhideSuggesteder, setShowHideSuggested] = useState(true);

  return(
  <div className='xl:min-w-[1400px] w-full xl:w-min container mt-10 mx-auto items-center justify-center'>
    <div className='flex container mx-auto'>
      <div className='flex flex-row justify-between w-full items-center'>
        <h2 className='text-3xl font-semibold'>Become a Textuality power user with these tips</h2>
        <div className='flex flex-row gap-1 items-center justify-center cursor-pointer' onClick={() => changePreview("Setup")}>
          <ArrowLeft className='h-5 w-5' /> <p className='text-md'>Return to setup</p>
        </div>
      </div>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between hover:bg-muted/70 transition-all' onClick={() => showHideContentBuild()}>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><Folder className='h-6 w-6' />Build your content</p>
            <ChevronDown className={`h-6 w-6 hover:text-blue-500 cursor-pointer transition-all ${showhideContent ? "rotate-0" : "rotate-180"}`}  />
          </div>
          <div className={`flex w-full flex-row justify-between py-2 px-5 overflow-hidden ${showhideContent ? "h-auto" : "hidden"}`}>
            <div className='flex flex-row gap-5 items-center w-1/3 border-r pr-5 border-muted'>
              <Text className='h-10 w-10' />
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold text-lg'>Quick Start Guide</h3>
                <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/4 pl-5'>
              <div className='flex flex-row border-b py-4 gap-5'>
              <img src="/icons/IMG_6490.png" className='h-10 dark:flex hidden' />
              <img src="/icons/IMG_6451.png" className='h-10 dark:hidden flex' />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Create your content</h3>
                  <p>Learn how to make your content shine using best practices that will make you appear higher in search results</p>
                </div>
              </div>
              <div className='flex flex-row gap-5 py-4'>
              <img src="/icons/IMG_6489.png" className='h-10 dark:flex hidden' />
              <img src="/icons/IMG_6452.png" className='h-10 dark:hidden flex' />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Pre-Made Templates</h3>
                  <p>Unsure where to begin? Start by using a pre-configured template.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='flex container mx-auto mt-5'>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between hover:bg-muted/70 transition-all' onClick={() => showhideSuggested()}>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><LucideMessageCircleQuestion className='h-6 w-6' /> Suggested for you</p>
            <ChevronDown className={`h-6 w-6 hover:text-blue-500 cursor-pointer transition-all ${showhideSuggesteder ? "rotate-0" : "rotate-180"}`}  />
          </div>
          <div className={`flex w-full flex-row justify-between py-2 px-5 overflow-hidden ${showhideSuggesteder ? "h-auto" : "hidden"}`}>
            <div className='flex flex-col gap-5 w-full  pr-5 '>
              <div className='flex flex-row py-4 gap-5'>
                <img src="/icons/IMG_6491.png" className='h-10 dark:flex hidden' />
                <img src="/icons/IMG_6450.png" className='h-10 dark:hidden flex' />
                <div className='flex flex-col gap-1'>
                  <h3 className='font-semibold text-lg'>Invite Team members</h3>
                  <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
                </div>
              </div>
              <div className='flex flex-row py-4 gap-5'>
                <LucideHardDriveUpload className='h-10 w-10' />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Learn how to integrate Textuality</h3>
                  <p>Learn how to make your content shine using best practices that will make you appear higher in search results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UsageMeter getpageinfo={getpageinfo} pageContentAPIGetter={pageContentAPIGetter} />
  </div>
  )
}

function UsageMeter({ getpageinfo, pageContentAPIGetter }: { getpageinfo: any,  pageContentAPIGetter }) {
  const pageinfo = getpageinfo;
  const [warninger, setWarning] = useState(false);
  const pageContentAPI = pageContentAPIGetter?.[0]?.contentsendingapi
  const pageContentManagerAPI = pageContentAPIGetter?.[0]?.contentmanagerapi
  // calculate the percentage of usage
  const users = (pageinfo?.users / 5) * 100;
  const templates = (pageinfo?.templates / 25) * 100;
  const content = (pageinfo?.content / 5000) * 100;
  const contentAPI = (pageContentAPI / 2000) * 100;
  const contentManagerAPI = (pageContentManagerAPI / 2000) * 100;

  useEffect(() => {
    // check if one of the percentage is greater than 75% and display a warning
    const warning = users >= 75 || templates >= 75 || content >= 75 || contentAPI >= 75 || contentManagerAPI >= 75;
    if (warning) {
      setWarning(true);
    }
  }, [users, templates, content, contentAPI, contentManagerAPI]);

  return(
    <div className='flex container mx-auto mt-5'>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3'><ChartArea className='h-6 w-6' /> Insights</p>
            <Link className={`flex flex-row items-center gap-1.5 hover:underline underline-offset-2 text-sm py-1.5 px-2 rounded-lg ${warninger ? " bg-red-500 shadow-md animate-pulse text-foreground font-semibold" : "text-blue-500 "}`} href='/plans'>
              <CreditCard className='h-4 w-4' /> Upgrade Plan
            </Link>
          </div>
          <div className='flex w-full flex-col justify-between py-2 pb-4 px-5'>
          <div className="grid gap-6 md:grid-cols-2">
            <MetricCard
              title="Content Sending API"
              description="Number of API calls that were made to send your content"
              current={pageContentAPI}
              max={50000}
            />
            <MetricCard
              title="Content Management API"
              description="Number of API calls that were made to create or update content"
              current={pageContentManagerAPI}
              max={50000}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 mt-5 lg:grid-cols-4">
            <MetricCard
              title="Users"
              description="Total number of users"
              current={pageinfo?.users || 0}
              max={5}
            />
            <MetricCard
              title="Templates"
              description="Total number of templates"
              current={pageinfo?.templates || 0}
              max={25}
            />
            <MetricCard
              title="Content"
              description="Total amount of content"
              current={pageinfo?.content || 0}
              max={5000}
            />
            <MetricCard
              title="Webhooks"
              description="Total number of webhooks"
              current={0}
              max={2}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
interface MetricCardProps {
  title: string
  description: string
  current: number
  max: number
  warningThreshold?: number
}
function MetricCard({ title, description, current, max, warningThreshold = 75 }: MetricCardProps) {
  const percentage = (current / max) * 100
  const isWarning = percentage >= warningThreshold
  console.log(percentage)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        <p className="font-semibold mb-2">
          {(current ?? 0).toLocaleString()}/{(max ?? 0).toLocaleString()}
        </p>
        {isWarning && (
          <p className="text-destructive text-sm mb-2">
            You have reached {percentage.toFixed(0)}% of your {title.toLowerCase()} limit.
          </p>
        )}
        <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
            <div className='bg-primary rounded-full h-2' style={{width: `${percentage || 0}%`, backgroundColor: isWarning ? 'red' : ''}}></div>
        </div>
      </CardContent>
    </Card>
  )
}