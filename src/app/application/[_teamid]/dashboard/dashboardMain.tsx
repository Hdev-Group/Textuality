"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle, ChartArea, CreditCard, ArrowLeft, LucideMessageCircleQuestion, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import AuthWrapper from '../withAuth';
import { cookies } from 'next/headers';

export default function Page({ params }: { params: { _teamid: string} }) {
  const { _teamid } = params;
  const teamid = _teamid;
  const user = useUser();

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
  }

  useEffect(() => {
    if (document.cookie.includes('poweruser=true')) {
      setPreview("PowerUser");
    } else if (document.cookie.includes('setup=true')) {
      setPreview("Setup");
    }
  }, []);

  return (
    <>
        <body className='overflow-hidden'>
          <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
          <AppHeader activesection="dashboard" teamid={teamid} />
          <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
            <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg p-8 space-y-8 h-screen overflow-y-auto pb-32">
          <div className="flex flex-col md:gap-0 gap-5 w-full justify-between">
            <div>
              {
                preview === "Setup" ? <Setup changePreview={changePreview} /> : <PowerUser changePreview={changePreview} getpageinfo={getpageinfo} />
              }
            </div>
          </div>
          </div>
          </main>
        </div>
          </AuthWrapper>
        </body>
      </>
  );
}

function Setup({ changePreview }: { changePreview: any }) {
  return(
    <div className='xl:min-w-[1400px] w-full xl:w-min container mt-10 mx-auto items-center justify-center'>
    <div className='flex container mx-auto'>
      <div className='flex flex-row justify-between w-full items-center'>
        <h2 className='text-3xl font-semibold'>Setup your Textuality account</h2>
        <div className='flex flex-row gap-1 items-center justify-center cursor-pointer' onClick={() => changePreview("PowerUser")}>
          <X className='h-5 w-5' /> <p className='text-md'>Skip setup</p>
        </div>
      </div>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><Layout className='h-6 w-6' />Connect your website</p>
          </div>
          <div className='flex w-full flex-row justify-between py-2 px-5'>
            <div className='flex flex-row gap-5 items-center w-1/3 border-r pr-5 border-muted'>
              <img src="/images/quickstart.svg" />
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold text-lg'>Quick Start Guide</h3>
                <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/4 pl-5'>
              <div className='flex flex-row border-b py-4 gap-5'>
                <img src="/images/createblog.svg"  />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Create your content</h3>
                  <p>Learn how to integrate Textuality using best practices that will make you appear higher in search results</p>
                </div>
              </div>
              <div className='flex flex-row gap-5 py-4'>
                <img src="/images/invite.svg" />
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

function PowerUser({ getpageinfo, changePreview }: { getpageinfo: any, changePreview: any }) {
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
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><Folder className='h-6 w-6' />Build your content</p>
            <ChevronDown className={`h-6 w-6 hover:text-blue-500 cursor-pointer transition-all ${showhideContent ? "rotate-0" : "rotate-180"}`} onClick={() => showHideContentBuild()} />
          </div>
          <div className={`flex w-full flex-row justify-between py-2 px-5 overflow-hidden ${showhideContent ? "h-auto" : "hidden"}`}>
            <div className='flex flex-row gap-5 items-center w-1/3 border-r pr-5 border-muted'>
              <img src="/images/quickstart.svg" />
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold text-lg'>Quick Start Guide</h3>
                <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-3/4 pl-5'>
              <div className='flex flex-row border-b py-4 gap-5'>
                <img src="/images/createblog.svg"  />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Create your content</h3>
                  <p>Learn how to make your content shine using best practices that will make you appear higher in search results</p>
                </div>
              </div>
              <div className='flex flex-row gap-5 py-4'>
                <img src="/images/invite.svg" />
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
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3 items-center'><LucideMessageCircleQuestion className='h-6 w-6' /> Suggested for you</p>
            <ChevronDown className={`h-6 w-6 hover:text-blue-500 cursor-pointer transition-all ${showhideSuggesteder ? "rotate-0" : "rotate-180"}`} onClick={() => showhideSuggested()} />
          </div>
          <div className={`flex w-full flex-row justify-between py-2 px-5 overflow-hidden ${showhideSuggesteder ? "h-auto" : "hidden"}`}>
            <div className='flex flex-col gap-5 w-full  pr-5 '>
              <div className='flex flex-row py-4 gap-5'>
                <img src="/images/quickstart.svg" />
                <div className='flex flex-col gap-1'>
                  <h3 className='font-semibold text-lg'>Invite Team members</h3>
                  <p className='text-muted-foreground text-sm'>Discover the best practices to use textuality effectively for your content</p>
                </div>
              </div>
              <div className='flex flex-row py-4 gap-5'>
                <img src="/images/createblog.svg"  />
                <div className='flex flex-col gap-2'>
                  <h3 className='font-semibold'>Learn how to intergrate Textuality</h3>
                  <p>Learn how to make your content shine using best practices that will make you appear higher in search results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UsageMeter getpageinfo={getpageinfo} />
  </div>
  )
}

function UsageMeter(getpageinfo: any){
  const pageinfo = getpageinfo.getpageinfo;

  // calculate the percentage of usage
  const users = (pageinfo.users / 5) * 100;
  const templates = (pageinfo.templates / 25) * 100;
  const content = (pageinfo.content / 5000) * 100;

  return(
    <div className='flex container mx-auto mt-5'>
      <div className='border-muted border mt-3 rounded-md'>
        <div className='flex flex-col gap-3 '>
          <div className='flex border-b border-muted items-center py-4 px-4 justify-between'>
            <p className='font-semibold text-lg flex flex-row gap-3'><ChartArea className='h-6 w-6' /> Insights</p>
            <Link className='flex flex-row items-center gap-1.5 hover:underline text-blue-500 underline-offset-2 text-sm' href='/plans'>
              <CreditCard className='h-4 w-4' /> Upgrade Plan
            </Link>
          </div>
          <div className='flex w-full flex-col justify-between py-2 pb-4 px-5'>
            <div className='flex flex-row gap-5 px-5 py-3 justify-between'>
              <div className='flex flex-col border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3 w-full'>
                <h1 className='text-md font-semibold'>Content Sending API</h1>
                <p className='text-muted-foreground text-xs'>Number of API calls that was made to send your content</p>
                <p className='font-semibold mt-3'>0</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: '0%'}}></div>
                </div>
              </div>
              <div className='flex flex-col w-full border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3'>
                <h1 className='text-md font-semibold'>Content Management API</h1>
                <p className='text-muted-foreground text-xs'>Number of API calls that was made to create or update content</p>
                <p className='font-semibold mt-3'>0</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-5 px-5 py-3 justify-between'>
              <div className='flex flex-col w-full border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3'>
                <h1 className='text-md font-semibold'>Users</h1>
                <p className='font-semibold mt-3 text-sm'>{pageinfo.users}/5</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: users}}></div>
                </div>
              </div>
              <div className='flex flex-col w-full border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3'>
                <h1 className='text-md font-semibold'>Templates</h1>
                <p className='font-semibold mt-3  text-sm'>{pageinfo.templates}/25</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: templates}}></div>
                </div>
              </div>
              <div className='flex flex-col w-full border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3'>
                <h1 className='text-md font-semibold'>Content</h1>
                <p className='font-semibold mt-3  text-sm'>{pageinfo.content}/5000</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: content}}></div>
                </div>
              </div>
              <div className='flex flex-col w-full border-foreground/40 border bg-muted-foreground/20 rounded-sm p-3'>
                <h1 className='text-md font-semibold'>Webhooks</h1>
                <p className='font-semibold mt-3 text-sm'>0/2</p>
                <div className='w-full bg-foreground/20 rounded-full h-2 mt-2'>
                  <div className='bg-primary rounded-full h-2' style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
