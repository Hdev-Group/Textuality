"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../convex/_generated/api'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, Link, ArrowLeft, MoreHorizontal, Edit, Trash  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../../withAuth';
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Textarea } from '@/components/ui/textarea'

type FieldType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string,
  fieldid?: string,
  fieldname?: string
}
export default function TemplateManager({ params }: { params: Promise<{ _teamid: string}> }) {
  const { _teamid }: { _teamid: any } = use(params);
  const { userId } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fields, setFields] = useState<FieldType[]>([])
  const [open, setOpen] = useState(true)
  const [template, setTemplater] = useState({name: '', description: ''})

    const router = useRouter();

    useEffect(() => {
        if (!open && template.description === '') {
            router.push(`/application/${_teamid}/templates`);
        }
    }, [open, template, router]);

  const [namevalue, setNameValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')

  const getPage = useQuery(api.page.getPage, { _id: _teamid })

  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [getPage, userId])
  const newtemplatemaker = useMutation(api.template.create)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateid, setTemplateId] = useState('')

  function TransporterWeb(data: string) {
    setOpen(false)
    router.push(`/application/${_teamid}/templates/edit/${data}`);
  }

  const handleSubmit = (event: any) => {
    if (event.target.id === 'newtemplate') {
      event.preventDefault();
      if (namevalue.length === 0 || descriptionValue.length === 0) {
        return alert('Please fill out all fields');
      } else if (namevalue.length > 45 || descriptionValue.length > 120) {
        return alert('Name must be less than 45 characters and description must be less than 120 characters');
      }
      if (isSubmitting) return; // Prevent double submit
      setIsSubmitting(true);
      
      setTemplater({ name: namevalue, description: descriptionValue });
      const templateinfo = newtemplatemaker({
        pageid: _teamid,
        title: namevalue,
        description: descriptionValue,
        lastUpdatedBy: userId as string,
      }).finally(() => {
        setTimeout(() => {
          setOpen(false);
          setIsSubmitting(false); // Allow new submission after completion
          templateinfo.then((data) => {
            setTemplateId(data);
            TransporterWeb(data);
          });
        }, 100);
      });
    }
  }
  const title = `New Template | Textuality`

  return (
  <body className='overflow-hidden'>
    <title>{title}</title>
    <AuthWrapper _teamid={_teamid}>
    <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
      <AppHeader activesection="templates" teamid={_teamid} />
      <main className="mx-auto px-10 py-3 transition-all">
        <div className="bg-white dark:bg-neutral-950 rounded-lg flex flex-col shadow-lg p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">{template.name} Fields</h1>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle>New Template</DialogTitle>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
                <DialogDescription>Use this form to create a new template</DialogDescription>
              </DialogHeader>
              <form id='newtemplate' onSubmit={handleSubmit} className='flex flex-col'>
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="font-semibold text-sm">
                  Name
                </Label>
                <Input id="name" required onChange={(e) => setNameValue(e.target.value)} maxLength={45} placeholder="Enter template name" />
                <div className='flex justify-end'>
                    <p className='text-xs'>{namevalue.length}/45</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="description" className="font-semibold text-sm">
                  Description
                </Label>
                <Textarea id="description" required onChange={(e) => setDescriptionValue(e.target.value)} maxLength={120} placeholder="Enter a description" />
                <div className='flex justify-end'>
                    <p className='text-xs'>{descriptionValue.length}/120</p>
                </div>
              </div>
              <DialogFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline"  onClick={() => setOpen(false)}>Cancel</Button>
                <Button type='submit'>Create Template</Button>
              </div>
            </DialogFooter>
            </form>
            </DialogContent>
          </Dialog>
            <DragDropContext onDragEnd={() => { }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Field Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <Droppable droppableId="fields">
                {(provided) => (
                  <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                    {fields.map((field, index) => (
                      <Draggable key={field.fieldid} draggableId={field.fieldid!} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>{field.fieldname || field.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <field.icon className="mr-2 h-4 w-4" />
                                {field.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </DragDropContext>
        </div>
      </main>
    </div>
    </AuthWrapper>
  </body>
  )
}
