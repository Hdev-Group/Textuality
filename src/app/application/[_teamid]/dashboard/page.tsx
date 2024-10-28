"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ChevronDown, Layout, FileText, Cloud, Code, BookMarkedIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import AuthWrapper from '../withAuth';

export default function Page({ params }: { params: Promise<{ _teamid: string}> }) {
  const { _teamid } = React.use(params);
  const teamid = _teamid;
  const user = useUser();
  const { userId, isLoaded, isSignedIn } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getPage = useQuery(api.page.getPage, { _id: teamid as any });

  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
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
  const title = getPage?.title  + ' — Textuality'

  return (
    <>
      <body className='overflow-hidden'>
        <title>{title}</title>
      <AuthWrapper _teamid={teamid}>
      <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <AppHeader activesection="dashboard" teamid={teamid} />
        <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
          <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg p-8 space-y-8 h-screen overflow-y-auto pb-32">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                  Welcome to {getPage?.title}.
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400"></p>
              </div>
            </div>

            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Latest Blogs</CardTitle>
                    <CardDescription>Manage and view your blogs</CardDescription>
                  </div>
                  <CreateBlog />
                </div>
              </CardHeader>
              <CardContent>
                {/* Your blog content here */}
              </CardContent>
            </Card>
          {/* {<QuickStartGuide />} */}
          </div>
        </main>
      </div>
    </AuthWrapper>
    </body>
    </>
  );
}
function QuickStartGuide(): JSX.Element {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2])

  const steps = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Create a structure with a Content Model",
      description: "This defines the schema for your content, including fields and data types.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Create a content entry",
      description: "They are actual pieces of content, instances of the structure you created.",
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Make your first API call and retrieve content",
      description: "Make your first API call for a content entry and preview the response.",
      action: "Open code sample",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Consume API",
      description: "This app allows you to test the capabilities of our APIs using the GraphQL.",
      action: "JavaScript",
    },
  ]

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const allCompleted = completedSteps.length === steps.length

  return (
    <div className="mx-auto p-6 border rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4"></div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-gray-200">Your quick start guide</h2>
        <div className="flex items-center"></div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-gray-200">Get started with Textuality in a few steps</h2>
          <div className="flex items-center">
            <span className="text-sm text-green-600 mr-2">All steps completed</span>
            <div className="w-24 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className=" rounded-lg p-6 relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold mb-4">Learn how to use the basics of Textuality </h3>
          <ul className="space-y-6">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded border border-blue-200 flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold">
                      <span className="text-blue-600 mr-2">{index + 1}</span>
                      {step.title}
                    </h4>
                    {completedSteps.includes(index + 1) && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{step.description}</p>
                  {step.action && (
                    <button className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded-md flex items-center">
                      {step.action}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-sm text-gray-300 flex justify-between items-center">
          <span>Switch to editor experience to learn about editing and creating content.</span>
          <button className="px-3 py-1 border border-gray-300 rounded-md flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Developer
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    )
  }
function CreateBlog() {
  return (
    <Link href="/author/${member.id}" legacyBehavior>
      <Button>
        <BookMarkedIcon className="mr-2 h-4 w-4" />
        Create Blog
      </Button>
    </Link>
  );
}

