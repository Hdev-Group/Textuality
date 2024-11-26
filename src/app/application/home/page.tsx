"use client"
import HomeHeader from "@/components/header/homeheader";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  CalendarDays, Users, BookOpen, ArrowRight, ChevronDown, Plus,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@radix-ui/react-toast";
import { get } from "http";
import { useAuth } from "@clerk/nextjs";
import { IsAuthorizedEdge } from "@/components/edgecases/Auth";
import Link from "next/link";

interface ProjectProps {
  title: string;
  description: any;
  date: string;
  postCount: number;
  _id: any;
  category: string;
  content: string;
  users: string[];
  _creationTime: number;
  latestPost: { title: string; excerpt: string };
}

export default function Page() {
  const { isSignedIn } = useAuth();
  const user = useUser();
  const projects = useQuery(api.page.getPages);
  const filteredprojects = projects?.filter((project) => project.users.includes(user?.user?.id as string));
  const getinvites = useQuery(api.page.getInvites, { externalId: user?.user?.id || "" });
  const cancelInvite = useMutation(api.page.cancelInvite);
  const acceptInvite = useMutation(api.page.acceptInvite);

  // Fetch projects using useQuery
  // check if user can access projects

  const isLoading = !projects; 
  const error = projects === null; 


  // Calculate time of day greeting
  const date = new Date();
  const hours = date.getHours();
  let time = "morning";
  if (hours >= 12 && hours < 17) {
    time = "afternoon";
  } else if (hours >= 17 && hours < 24) {
    time = "evening";
  } else if (hours >= 0 && hours < 5) {
    time = "night";
  }
  const CancelInvite = (inviteId: any) => {
      cancelInvite({ _id: inviteId.InviteDetails._id });
  }

  function AcceptInvite(InviteDetails: any) {
    if (user?.user?.id === InviteDetails.InviteDetails.externalId) {
      acceptInvite({ _id: InviteDetails.InviteDetails._id, pageId: InviteDetails.InviteDetails.pageId, role: InviteDetails.InviteDetails.role, externalId: InviteDetails.InviteDetails.externalId });
    }
  }
  if (!getinvites) {
  }
  
  return (
    <div className="overflow-y-hidden">
      <title>Home | Textuality</title>
    <div className="bg-gray-100 dark:bg-neutral-900 h-auto overflow-y-hidden">
      <HomeHeader activesection="home" />
      <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
      <div className="bg-white dark:bg-neutral-950 h-screen rounded-lg overflow-y-auto shadow-lg p-8 space-y-8">
          <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Good {time} {user?.user?.firstName},
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Welcome to Textuality.
              </p>
            </div>
            <div className="flex items-start">
              <CreatePage />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Your Pages</h2>
            
            {/* Handle loading and error states */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-neutral-400"></div>
              </div>
            ) : error ? (
              <p>Error loading projects.</p>
            ) : projects?.length === 0 ? (
              <p>No projects available.</p>
            ) : (
                <div className="flex p-2 rounded-xl items-start  flex-wrap gap-6">
                  {/* Map through the projects if available */}
                  {filteredprojects?.length === 0 ? (
                    <div className="w-full flex items-center flex-col py-4 justify-center">
                      <p className="text-lg ">No pages available.</p>
                      <CreatePage />
                    </div>
                  ) : (
                    filteredprojects?.map((page, index) => (
                      <Project
                        key={index}
                        title={page.title}
                        date={new Date(page._creationTime).toLocaleDateString()}
                        _id={page._id}
                        category={page.category}
                        content={page.content}
                        users={page.users}
                        description={page.content}
                        _creationTime={page._creationTime}
                        postCount={0}
                        latestPost={{ title: "", excerpt: "" }}
                      />
                    ))
                  )}
                </div>
            )}
            {getinvites &&
            getinvites?.length > 0 && (
            <div>
              <h2 className="text-xl mt-5 font-semibold mb-2">Page Invites</h2>
              <div className="flex p-2 rounded-xl items-start bg-neutral-100 dark:bg-neutral-900 flex-wrap gap-6">
              {getinvites?.map((invite, index) => (
                <div key={index} className="bg-neutral-50 min-w-[30rem] dark:bg-neutral-800 border w-min dark:border-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                    <PageName type="title" pageid={invite.pageId} />
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 flex flex-row gap-0">
                      <p className="w-full flex flex-row">You have been invited to join with the role of {invite.role}.</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between dark:bg-neutral-600 bg-neutral-200">
                    <Button variant="secondary" size="sm" onClick={() => AcceptInvite({InviteDetails: invite})}>
                      Accept Invite <Check className="w-4 h-4 ml-1" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => CancelInvite({InviteDetails: invite})}>
                      Decline Invite
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            </div>
            )}
          </div>
          </div>
      </main>
    </div>
    </div>
  );
}


interface ProjectProps {
  title: string
  description: any
  users: string[]
  _id: any
  _creationTime: number
  latestPost: { title: string; excerpt: string }
  postCount: number
}

interface UserData {
  id: string
  firstName: string
  imageUrl: string
}

export function Project({ 
  title,
  description,
  users,
  _id,
  _creationTime,
  latestPost,
  postCount
}: ProjectProps) {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userCache: { [key: string]: UserData } = {};

  useEffect(() => {
    async function fetchAssigneeData() {
      if (users && users.length > 0) {
        const usersToFetch = users.filter((user: string) => !userCache[user]);

        if (usersToFetch.length > 0) {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/get-user?userId=${usersToFetch.join(",")}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            data.users.forEach((user: UserData) => {
              userCache[user.id] = user;
            });

            setUserData(users.map((user: string) => userCache[user]));

          } catch (error) {
            console.error("Error fetching assignee data:", error);
            setUserData([]);
          } finally {
            setIsLoading(false);
          }
        } else {
          setUserData(users.map((user: string) => userCache[user]));
        }
      }
    }

    fetchAssigneeData();
  }, [users]);

  const teamMemberCount = users.length;
  const creationDate = new Date(_creationTime);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg md:min-w-[30rem] md:w-min w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold truncate">{title}</h3>
          <Badge variant="secondary" className="font-normal">
            <CalendarDays className="w-3 h-3 mr-1" />
            {creationDate.toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>
              {/* Placeholder for post count */}
              No posts
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{teamMemberCount} {teamMemberCount >= 1 ? "member" : "members"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between h-full mt-4 bg-muted/30">
      <div className="flex flex-row items-center justify-between overflow-hidden ">
          {!isLoading && userData.slice(0, 3).map((member, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-background">
              <AvatarImage src={member.imageUrl} alt={member.firstName} />
              <AvatarFallback>{member.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {teamMemberCount > 3 && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
              +{teamMemberCount - 3}
            </div>
          )}
        </div>
        <Button variant="gradient" size="sm" asChild>
          <Link href={`/application/${_id}/dashboard`}>
            <span className="flex flex-row justify-between items-center">View Project <ArrowRight className="w-4 h-4 ml-1" /></span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CreatePage() {
  const user = useUser()

  const createPage = useMutation(api.page.create)

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.length === 0 || content.length === 0 || category.length === 0) {
      return
    } else if (user.user === null) {
      return
    } else if (title.length > 50 || content.length > 500) {
      return alert("Title must be less than 50 characters and content must be less than 500 characters.")
    }
    const userid = user.user?.id
    // Handle form submission here
    createPage({ title, content, category, userid: userid! })
    setIsOpen(false)
    // Reset form fields
    setTitle("")
    setContent("")
    setCategory("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="mt-4 font-semibold">
          Create a Page <Plus className="ml-2" height={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Page</DialogTitle>
          <DialogDescription>Fill in the details to create your new page</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              placeholder="Enter page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={50}
            />
            <span className="text-sm text-gray-500">{title.length}/50</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Page Content</Label>
            <Textarea
              id="content"
              placeholder="Enter page content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength={500}
            />
            <span className="text-sm text-gray-500">{content.length}/500</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                <SelectLabel>What is this for?</SelectLabel>
                  <SelectItem value="personalblog">My Personal Blog</SelectItem>
                  <SelectItem value="teamblog">My Teams Blog</SelectItem>
                  <SelectItem value="sharingcontent">Share content</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Page</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PageName({ pageid, type }: { pageid: any, type: any }) {
  const page = useQuery(api.page.getExactPage, { _id: pageid });

  if (!page) {
    return <p>Loading...</p>;
  }

  return <h1 className={`font-semibold text-lg`}>{page.title ? page.title : "Unknown Page"}</h1>;
}
