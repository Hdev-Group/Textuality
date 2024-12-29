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
import CheckpointAuthWrapper from "./checkpointauthroleperms";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"

export default function Page({ params }) {
    const { _teamid } = params
    const { toast } = useToast()
    const route = useRouter()
    const teamid = _teamid
    const { user } = useUser()
    const getPage = useQuery(api.page.getPage, { _id: teamid as any });
    const getRole = useQuery(api.page.getRoledetail, { externalId: user?.id ?? 'none', pageId: _teamid });
    const updatePage = useMutation(api.page.updatePage);
    const updateSettings = useMutation(api.page.updateSettings);
    const getSettings = useQuery(api.page.getSettings, { pageid: teamid as any });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: teamid as any });
    const getContent = useQuery(api.content.getContent, { pageid: teamid as any });
    const deletePage = useMutation(api.page.deletePage);
    const [activeTab, setActiveTab] = React.useState("general");
    const searchParams = useSearchParams();
    const [isContentReview, setContentReview] = useState(getSettings?.[0]?.contentreview ?? true);

    useEffect(() => {
      if (getSettings) {
        setContentReview(getSettings?.[0]?.contentreview);
      }
    }, [getSettings])

    function UpdateContentReview(checked: boolean) {
      setContentReview(checked);
      if (getRole?.[0]?.permissions.includes("owner") || getRole?.[0]?.permissions.includes("admin")) {
        updateSettings({ pageid: teamid, contentreview: checked });
      } else {
        alert("You do not have permission to update content review settings")
      }
    }

    useEffect(() => {
        const currentType = searchParams.get('type');
        if (currentType === 'general' || currentType === 'content' || currentType === 'billing' || currentType === 'security' || currentType === 'dangerzone') {
            setActiveTab(currentType);
        } else {
            setActiveTab('general');
        }
      }, [searchParams])
    useEffect(() => {
        if (getPage) {
            setTitle(getPage?.title)
            setContent(getPage?.content)
        }
    }, [getPage])
    const [pagetitle, setTitle] = useState("")
    const [content, setContent] = useState("")

    function handleSaveChangesTitle(e: FormEvent) {
        e.preventDefault();
        updatePage({ _id: teamid, title: pagetitle, content: content });
    }
    function handleSaveChangesContent(e: FormEvent) {
      e.preventDefault();
      updatePage({ _id: teamid, title: pagetitle, content: content });
    }

    function pagedelete() {
      // check role again
      if (getRole?.[0]?.permissions.includes("owner")){
      deletePage({ _id: teamid });
      route.push('/application/home')
      } else {
        alert("You do not have permission to delete this page")
      }
    }

    function deleteDepartment(departmentid: string) {
      if (["owner", "admin", "editor"].some(role => getRole?.[0]?.permissions.includes(role))) {
        // check to see if the department has any content ownership
        getContent?.map((content) => {
          if (content.authorid === departmentid) {
            toast({
              title: "Department has content ownership",
              content: `We have detected that this department has content ownership in {}. Please reassign ownership before deleting this department`,
              variant: "destructive",
            })
          } else {
            // delete department
          }
        }
        )
      }
    }

    return (
      <CheckpointAuthWrapper teamid={teamid}>
        <div className='overflow-y-hidden'>
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
                                              <form onSubmit={handleSaveChangesTitle}>
                                              <label className="text-sm font-medium">Page Name</label>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    value={pagetitle}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <div className="flex flex-row justify-between mt-3">
                                                <span className="text-sm text-gray-500">
                                                    {pagetitle?.length || 0}/50
                                                </span>
                                                <Button type="submit" variant="outline">Save Changes</Button>
                                                </div>
                                              </form>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                              <form onSubmit={handleSaveChangesContent}>
                                              <label className="text-sm font-medium">Page Description</label>
                                                <Textarea
                                                    maxLength={500}
                                                    className="w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-3 text-sm"
                                                    onChange={(e) => setContent(e.target.value)}
                                                    value={content}
                                                />
                                                <div className="flex flex-row justify-between mt-3">
                                                  <span className="text-sm text-gray-500">{
                                                    content?.length || 0}/500
                                                  </span>
                                                  <Button type="submit" variant="outline">Save Changes</Button>
                                                </div>
                                              </form>
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
                                                                <DropdownMenu>
                                                                  <DropdownMenuTrigger asChild>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                  </DropdownMenuTrigger>
                                                                  <DropdownMenuContent align="start">
                                                                    <DropdownMenuItem>
                                                                      Edit
                                                                    </DropdownMenuItem>
                                                                    {
                                                                      ["owner", "admin", "editor"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                                                        <DropdownMenuItem className="hover:bg-red-500/60" onClick={() => deleteDepartment(department._id)}>
                                                                          Delete
                                                                        </DropdownMenuItem>
                                                                      ) : null
                                                                    }
                                                                  </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    )) : <p>No departments found</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="gap-0 flex flex-col border-y">
                                            <div className="flex flex-row justify-between items-center py-5 px-8 gap-3 p-2 ">
                                              <h1 className="font-semibold text-lg">Content Review</h1>
                                              <Switch aria-checked={isContentReview} onCheckedChange={(checked) => UpdateContentReview(checked)} />
                                            </div>
                                            <div className="flex flex-col gap-4 px-8 pb-4">
                                                {
                                                  isContentReview ? (
                                                    <h1 className="text-md">Content Review is enabled. When you attempt to publish content it will now go through the review stage.</h1>
                                                  ) : null
                                                }
                                            </div>
                                        </div>
                                    </main>
                                    ) : activeTab === "billing" ? (
                                      <BillingPage />
                                    ) : activeTab === "security" ? (
                                        <main className="flex-1">
                                        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-2xl font-bold">Security Settings</h1>
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
                                    ) : activeTab === "dangerzone" ? (
                                        <main className="flex-1">
                                        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-2xl font-bold">Danger Zone</h1>
                                            </div>
                                        </div>
                                        {
                                          ["owner"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                            <div className="space-y-4 p-8 border-b">
                                            <h2 className="text-lg font-semibold">Delete Page</h2>
                                            <p className="text-sm text-gray-400">Delete this page. This action cannot be undone.</p>
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button variant="destructive">Delete Page</Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>Delete Page</DialogTitle>
                                                  <DialogDescription>Are you sure you want to delete this page?</DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                  <Button variant="destructive" onClick={() => pagedelete()}>Delete Page</Button>
                                                </DialogFooter>
                                              </DialogContent>
                                            </Dialog>
                                          </div>
                                          ) : (
                                            <p className="text-sm text-gray-400 p-8">You do not have permission to delete this page</p>
                                          )
                                        }
                                    </main>
                                    ) : null
                                }
                            </div>
                        </div>
                    </main>
                </div>
        </AuthWrapper>
    </div>
    </CheckpointAuthWrapper>
    )
}
function Sidebar({ activeTab, setActiveTab, teamid }) {
    return (
        <aside className="w-64 bg-white dark:bg-neutral-950 h-screen border-r border-gray-200 dark:border-neutral-800">
            <div className="p-8 pb-9 border-b">
                <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <nav className="space-y-2 flex flex-col">
            <Link href={`/application/${teamid}/settings?type=general`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2  text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "general" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <p>General</p>
                </Link>
                <Link href={`/application/${teamid}/settings?type=content`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "content" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <p>Content</p>
                </Link>
                <Link href={`/application/${teamid}/settings?type=security`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "security" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <p>Security</p>
                </Link>
                <Link href={`/application/${teamid}/settings?type=billing`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "billing" ? "bg-gray-100 dark:bg-neutral-900 font-semibold" : "hover:bg-neutral-400/20"}`}
                >
                    <p>Billing</p>
                </Link>
                <Link href={`/application/${teamid}/settings?type=dangerzone`}
                    className={`flex items-center justify-between cursor-pointer w-full px-8 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 ${activeTab === "dangerzone" ? "bg-red-100 dark:bg-red-900 font-semibold" : "hover:bg-red-400/20"}`}
                >
                    <p>Danger Zone</p>
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

  function BillingPage() {
    const { user } = useUser();
    const customerinfo = useQuery(api.customer.getCustomerInfo, { userid: user.id as any });
  
    useEffect(() => {
      if (!customerinfo) {
        return;
      }
      const customerId = customerinfo?.stripeid;
    
      const fetchSubscriptions = async () => {
        try {
          const response = await fetch('/api/getSubscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
        }
      };
    
      fetchSubscriptions();
    }, [customerinfo]);
  
    return (
      <main className="flex-1">
        <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Billing Settings</h1>
          </div>
        </div>
        <div className="space-y-4 p-8 border-b">
          <h2 className="text-lg font-semibold">You are currently on the Free plan</h2>
          <div className="flex p-4 w-[30rem] flex-col gap-2 border rounded-lg">
            <h1 className="font-semibold text-lg">Textuality Free</h1>
            <div className="flex flex-col justify-between items-start">
              <Button variant="outline" className="w-full mt-2">
                <img src="/planimg/pro.png" className="h-4 w-4" /> Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }