"use client"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from "../withAuth"
import React from "react"
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs'
import { api } from '../../../../../convex/_generated/api';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Building2, AlertCircle, MoreVertical } from "lucide-react";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page({ params }: { params: Promise<{ _teamid: string}> }) {
    const { _teamid } = React.use(params)
    const teamid = _teamid
    const getPage = useQuery(api.page.getPage, { _id: teamid as any });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: teamid as any });
    const [activeTab, setActiveTab] = React.useState("general");
    const searchParams = useSearchParams();

    useEffect(() => {
        const currentType = searchParams.get('type');
        setActiveTab(currentType === 'general' || currentType === 'content' ? currentType : 'billing');
      }, [searchParams])

    const [pagetitle, setTitle] = useState(getPage?.title)
    const [content, setContent] = useState(getPage?.content)

    const title = getPage?.title + "— Settings — Textuality"
    return (
        <body className='overflow-y-hidden'>
            <title>{title}</title>
            <AuthWrapper _teamid={_teamid}>
                <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                    <AppHeader activesection="settings" teamid={_teamid} />
                    <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                        <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                            <div className="flex">
                                <Sidebar activeTab={activeTab} teamid={teamid} setActiveTab={setActiveTab} />
                                {
                                    activeTab === "general" ? (
                                        <main className="flex-1">
                                        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-2xl font-bold">General Settings</h1>
                                            </div>
                                        </div>
                                        <div className="space-y-4 p-8 border-b">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium">Page Name</label>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    value={pagetitle}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <span className="text-sm text-gray-500">{pagetitle?.length}/50</span>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium">Page Description</label>
                                                <Textarea
                                                    maxLength={500}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setContent(e.target.value)}
                                                    value={content}
                                                />
                                                <span className="text-sm text-gray-500">{content?.length}/500</span>
                                            </div>
                                        </div>
                                    </main>
                                    ) : activeTab === "content" ? (
                                        <main className="flex-1">
                                        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-2xl font-bold">Content Settings</h1>
                                            </div>
                                        </div>
                                        <div className="space-y-8 border-b">
                                            <div className="flex flex-row justify-between items-center py-5 px-8 gap-3 p-2 ">
                                                <h1 className="font-semibold text-lg">Author / Department Adding</h1>
                                                <AddDepartment teamid={teamid} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 px-8 py-4">
                                            <h1 className="font-semibold text-lg">Departments</h1>
                                            <div className="flex flex-row gap-4">
                                                {
                                                    getDepartments?.length > 0 ? getDepartments.map((department) => (
                                                        <div key={department._id} className="flex flex-row items-center gap-4 px-6 py-4 border rounded-lg">
                                                            <Avatar>
                                                                <AvatarFallback>
                                                                {department?.departmentname?.split(' ').map((word) => word[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                            <div className="flex items-center justify-between">
                                                                <h1 className="font-semibold text-lg">{department.departmentname}</h1>
                                                            </div>
                                                            <p className="text-sm text-gray-400">{department.departmentdescription}</p>
                                                            </div>
                                                            <div className="h-full flex items-start">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </div>
                                                        </div>
                                                    )) : <p>No departments found</p>
                                                }
                                            </div>
                                        </div>
                                    </main>
                                    ) : activeTab === "billing" ? (
                                        <main className="flex-1">
                                        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-2xl font-bold">Billing Settings</h1>
                                            </div>
                                        </div>
                                        <div className="space-y-4 p-8 border-b">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium">Page Name</label>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    value={pagetitle}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <span className="text-sm text-gray-500">{pagetitle?.length}/50</span>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium">Page Description</label>
                                                <Textarea
                                                    maxLength={500}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setContent(e.target.value)}
                                                    value={content}
                                                />
                                                <span className="text-sm text-gray-500">{content?.length}/500</span>
                                            </div>
                                        </div>
                                    </main>
                                    ) : null
                                }
                            </div>
                        </div>
                    </main>
                </div>
        </AuthWrapper>
    </body>
    )
}
function Sidebar({ activeTab, setActiveTab, teamid }) {
    return (
        <aside className="w-64 bg-white dark:bg-neutral-950 h-screen border-r border-gray-200 dark:border-neutral-800">
            <div className="p-8 pb-9 border-b">
                <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <nav className="space-y-2">
                <Link href={`/application/${teamid}/settings?type=general`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2  text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "general" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <span>General</span>
                </Link>
                <Link href={`/application/${teamid}/settings?type=content`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "content" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <span>Content</span>
                </Link>
                <Link href={`/application/${teamid}/settings?type=billing`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "billing" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <span>Billing</span>
                </Link>
            </nav>
        </aside>
    )
}


const formSchema = z.object({
    name: z.string().min(2).max(25),
    description: z.string().max(80),
    image: z.instanceof(File).optional(),
    isLive: z.boolean(),
  })
  
  type FormData = z.infer<typeof formSchema>
  
function AddDepartment({ teamid }) {
    const createDepartment = useMutation(api.department.createDepartment)
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<FormData>({
      name: "",
      description: "",
      isLive: false,
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [errors, setErrors] = useState<Partial<FormData>>({})
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  
    const handleSwitchChange = (checked: boolean) => {
      setFormData((prev) => ({ ...prev, isLive: checked }))
    }
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }))
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  
    const validateForm = (): boolean => {
      try {
        formSchema.parse(formData)
        setErrors({})
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Partial<Record<keyof FormData, string>> = {}
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof FormData] = err.message as string
            }
          })
          setErrors(newErrors as any)
        }
        return false
      }
    }
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (validateForm()) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(formData)
        createDepartment({departmentname: formData.name, departmentdescription: formData.description, isLive: formData.isLive, pageid: teamid})
        setIsOpen(false)
        setFormData({ name: "", description: "", isLive: false })
        setPreviewImage(null)
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <div>
            <Button className="gap-2 ">
                <Building2 className="h-4 w-4" />
                Add Department
            </Button>
            </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organization's content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Department Name"
                maxLength={25}
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Department Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Department Description"
                className="resize-none"
                maxLength={50}
                required
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isLive">Department Live</Label>
                <p className="text-sm text-muted-foreground">
                  Make this department visible to users
                </p>
              </div>
              <Switch
                required
                id="isLive"
                checked={formData.isLive}
                onCheckedChange={handleSwitchChange}
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Preview</AlertTitle>
              <AlertDescription>
                <div className="flex items-center gap-2.5 rounded-md border p-2">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Department"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {formData.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">
                      {formData.name || "Department Name"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || "Department description"}
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button type="submit">Save Department</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }