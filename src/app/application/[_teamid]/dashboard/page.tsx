"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from 'convex/react';
import { api} from '../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Mail, Phone, UserCheck2Icon, BookMarkedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';



export default function Page({params: {_teamid }}: any) {
    const teamid = _teamid;
    const user = useUser();

    const getPage = useQuery(api.page.getPage, { _id: teamid });

    const users = getPage?.users;


    return (
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <AppHeader activesection="dashboard" />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                    Welcome to {getPage?.title}.
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                </p>
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
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <p className="text-center py-4">No blogs found.</p>
                    <CreateBlog />
                </div>
                </CardContent>
            </Card>
            </div>
        </main>
      </div>
    );
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