'use client'

import { useEffect, useState } from 'react'
import { useUser } from "@clerk/clerk-react"
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import HomeHeader from '@/components/header/homeheader'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthorSidebar, NavigationZone } from "@/components/author/comp"
import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"
type UserData = {
    firstName: string
    lastName: string
    imageUrl: string
    bio: string
    about: string
    teams: string[]
    recentBlogs: { title: string; date: string }[]
  }
export default function Page({ params: { _authorid } }: any) {
    const authorid = _authorid;
    const user = useUser();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getuserdata = useQuery(api.users.getUserById, { id: authorid });
    console.log(getuserdata)

    useEffect(() => {
        async function fetchUserData() {
            if (authorid) {
                try {
                    const response = await fetch(`/api/get-user?userId=${authorid}`)
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    const data = await response.json()
                    setUserData(data.users[0])
                } catch (error) {
                    console.error('Error fetching user data:', error)
                    setUserData(null)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchUserData()
    }, [authorid])

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (!userData) {
        return <ErrorState />
    }

    return (
        <div className="bg-gray-100 dark:bg-neutral-900 h-full min-h-screen">
            <HomeHeader activesection="author" />
            <main id="slowenlarge" className="container md:w-[1765px] flex-row flex w-full mx-auto px-4 py-8">
                {/* Main Content Area */}
                <Card className="overflow-hidden w-full border-hidden rounded-none rounded-l-xl">
                    <CardContent className="p-0 relative">
                        <div className="flex flex-col md:flex-col">
                            {/* Scrollable content area */}
                            <div className="flex-grow overflow-y-auto">
                                <div className="text-3xl px-6 pt-6 md:pt-8 md:px-8 font-bold mb-2 dark:text-neutral-100">
                                    {userData.firstName} {userData.lastName}
                                </div>
                                <p className="text-lg mb-6 px-6 md:px-8 dark:text-neutral-200">{userData.bio}</p>
                                <NavigationZone id={authorid} />
                            </div>
                            <div className="md:px-8 px-6 py-6">
                                {
                                    userData.about && (
                                        <div className="mb-6">
                                            <CardHeader>
                                                <CardTitle>About</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{userData.about}</p>
                                            </CardContent>
                                        </div>
                                    )
                                    || (
                                        <div className="mb-6">
                                                <p>{userData.firstName} {userData.lastName} has not set their about section.</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="w-full md:flex hidden md:w-96 h-auto relative md:border-l md:border-t-0 text-card-foreground shadow-sm">
                    <div className="sticky w-full top-0">
                        <AuthorSidebar userData={userData} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
            <HomeHeader activesection="author" />
            <main className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-grow space-y-4">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex gap-4 pt-4">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                            <div className="w-full md:w-96 space-y-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-28" />
                                </div>
                                <Skeleton className="h-20 w-full" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

function ErrorState() {
    return (
        <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
            <HomeHeader activesection="author" />
            <main className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-6 md:p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-4">Error Loading Profile</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            We couldn't load the author's profile. Please try again later.
                        </p>
                        <Button>
                            <a href="/">Return to Home</a>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}