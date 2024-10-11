"use client"
import HomeHeader from "@/components/header/homeheader";
import { useUser } from "@clerk/clerk-react";
import { CalendarDays, Users, BookOpen, ArrowRight, ChevronDown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


interface ProjectProps {
    title: string
    description: string
    date: string
    postCount: number
    teamMembers: { name: string; avatar: string }[]
    latestPost: { title: string; excerpt: string }
  }
export default function Page() {
    const projects = [

      ]
    const { user } = useUser();

    const date = new Date();
    const hours = date.getHours();
    let time = "morning";
    if (hours >= 12 && hours < 17) {
        time = "afternoon";
    }
    if (hours >= 17 && hours < 24) {
        time = "evening";
    }
    if (hours >= 0 && hours < 5) {
        time = "night";
    }

    return (
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <HomeHeader activesection="home" />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Good {time} {user?.firstName},</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">Welcome to Textuality.</p>
                </div>
                <div className="flex items-start">
                  <CreatePage />
                </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Recent Pages</h2>
              <div className="flex p-2 rounded-xl items-start bg-neutral-100 dark:bg-neutral-900 flex-wrap gap-6">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <Project key={index} {...project} />
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center w-full py-3">
                    <p className="text-2xl font-semibold text-center w-full">No Pages found.</p>
                    <CreatePage />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}
function Project({ 
    title, 
    description, 
    date, 
    postCount, 
    teamMembers, 
    latestPost 
  }: ProjectProps) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-900 border  dark:border-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{title}</h3>
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <CalendarDays className="w-4 h-4 mr-1" />
              {date}
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
          <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{postCount} posts</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{teamMembers.length} members</span>
            </div>
          </div>
        </div>
        {latestPost && (
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-t dark:border-neutral-700">
            <h4 className="font-semibold mb-2">Latest Post</h4>
            <p className="text-sm font-medium">{latestPost.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{latestPost.excerpt}</p>
          </div>
        )}
        <div className="p-4 flex items-center justify-between dark:bg-neutral-600 bg-neutral-200 dark:bg-neutral-850">
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-white dark:border-neutral-900">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>
          <Button variant="secondary" size="sm">
            View Project <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

function Tutorial(){

}

function CreatePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ title, content, category })
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Page Content</Label>
            <Textarea
              id="content"
              placeholder="Enter page content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup label="Categories">
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