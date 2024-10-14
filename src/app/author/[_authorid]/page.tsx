'use client'

import { useEffect, useState } from 'react'
import { useUser } from "@clerk/clerk-react"
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import HomeHeader from '@/components/header/homeheader'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User, BookOpen, Calendar, MessageCircle, Plus } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type UserData = {
  firstName: string
  lastName: string
  imageUrl: string
  bio: string
  teams: string[]
  recentBlogs: { title: string; date: string }[]
}

type PageProps = {
  params: {
    authorid: any
  }
}

export default function Page({params: {_authorid }}: any) { const authorid = _authorid; const user = useUser();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const getuserdata = useQuery(api.users.getUserById, { id: authorid });
    console.log(getuserdata)
    const getblogs = useQuery(api.blogs.getBlogs, { authorid: authorid });

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
                    getblogs?.data?.map((blog: any) => (
                        <div key={blog.id} className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{blog.category}</span>
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{blog.date}</span>
                                </Badge>
                            </div>
                        </div>
                    )) || <div className="text-lg font-semibold">{userData.firstName} {userData.lastName} has not posted anything, Yet...</div>
                }
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Sidebar */}
        <div className="w-full md:flex hidden md:w-96 h-auto relative md:border-l md:border-t-0   text-card-foreground shadow-sm">
          <div className="sticky w-full top-0">
            <AuthorSidebar userData={userData} />
          </div>
        </div>
      </main>
    </div>
  );
}
interface NavigationZoneProps {
    id: string
  }
export function NavigationZone({ id }: NavigationZoneProps) {
    const { user } = useUser()

    return (
      <nav className="flex px-6 md:px-8 gap-5  justify-between overflow-hidden h-auto border-b">
        <div className='gap-5 flex flex-row '>
            <NavLink href={`/author/${id}`} label="Home" />
            <NavLink href={`/author/${id}/about`} label="About" />
            <NavLink href={`/author/${id}/blogs`} label="Blogs" />
            <NavLink href={`/author/${id}/contact`} label="Contact" />
        </div>
        {
            id === user?.id && (
                <CreatePostButton />
            )
        }
      </nav>
    )
  }
function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname()
    const isActive = pathname === href


  return (
    <Link 
      href={href} 
      className={`
        group pb-2 relative 
        ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}
      `}
    >
      <span className="text-sm font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
        {label}
      </span>
      <span 
        className={`
          absolute bottom-0 left-0 w-full h-0.5 
          bg-neutral-900 dark:bg-neutral-100 
          transition-transform origin-left
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
        `} 
      />
    </Link>
  )
}

export function AuthorSidebar({ userData }: { userData: UserData }) {
    return (
      <div className="flex w-full flex-col bg-card p-6 rounded-r-xl md:p-8 relative gap-6">
        <Avatar className="w-24 h-24 border">
          <AvatarImage src={userData.imageUrl} alt={`${userData.firstName} ${userData.lastName}`} />
          <AvatarFallback>
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">100k Followers</p>
        </div>
        <div className="space-y-2 pb-4 text-sm flex-col flex w-auto border-b dark:border-neutral-700">
          <p>World Class Author</p>
          <p>Friend of Textuality</p>
        </div>
        <p className="text-sm">{userData.bio}</p>
        <div className="flex gap-3">
          <Button className="flex-1">Follow</Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
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
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function CreatePostButton() {
  return (
    <div>
        <Link href="/new-post" className='mb-2'>
            <Button className='gap-2 flex flex-row'><Plus height={22} />Create Post</Button>
        </Link>
    </div>
  )
}