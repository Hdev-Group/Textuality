'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../../convex/_generated/api'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, ArrowLeft, MoreHorizontal, Edit, Trash, GripVertical, ChevronLeft, ChevronRight, LucideMessageCircleQuestion, InfoIcon, Heading } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookMarkedIcon, Filter, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../../../withAuth'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import {AddFieldDialog, EditFieldDialog} from '@/components/template/comp'
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import "../../../team.css"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type FieldType = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  fieldid?: string;
  fieldname?: string;
  type?: string;
  defaultValue?: string;
  validationRules?: string;
  placeholder?: string;
  _id?: string;
  isRequired?: boolean;
  position: number;
  templateid: string;
  reference: string;
  fieldposition?: number;
  fieldappearance?: string;
}


const fieldTypes: FieldType[] = [
  { icon: AlignLeft, name: "Rich text", description: "Text formatting with references and media", position: 0, templateid: '', reference: '' },
  { icon: Heading, name: "Title", description: "Main title", position: 0, templateid: '', reference: '' },
  { icon: Type, name: "Short Text", description: "Titles, names, paragraphs, list of names", position: 0, templateid: '', reference: '' },
  { icon: Hash, name: "Number", description: "ID, order number, rating, quantity", position: 0, templateid: '', reference: '' },
  { icon: Calendar, name: "Date and time", description: "Event dates", position: 0, templateid: '', reference: '' },
  { icon: MapPin, name: "Location", description: "Coordinates: latitude and longitude", position: 0, templateid: '', reference: '' },
  { icon: Image, name: "Media", description: "Images, videos, PDFs and other files", position: 0, templateid: '', reference: '' },
  { icon: ToggleLeft, name: "Boolean", description: "Yes or no, 1 or 0, true or false", position: 0, templateid: '', reference: '' },
  { icon: Braces, name: "JSON object", description: "Data in JSON format", position: 0, templateid: '', reference: '' },
]

export default function TemplateManager({ params }: { params: { _teamid: any; _templateid: any } }) {
  const { _teamid, _templateid } = params;
  const teamid = _teamid;
  const templateid = _templateid; 
  const { userId } = useAuth()
  const [fields, setFields] = useState<FieldType[]>([])
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false)
  const [type, setType] = useState("")
  const [editingField, setEditingField] = useState<FieldType | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams();
  const getPage = useQuery(api.page.getPage, { _id: teamid as any })
  const getTemplates = useQuery(api.template.getExactTemplate, { pageid: teamid, _id: templateid })
  const getFields = useQuery(api.template.getFields, { templateid: templateid })
  const templateaddfield = useMutation(api.template.addField)
  const getRole = useQuery(api.page.getRoledetail, { externalId: userId || "none", pageId: teamid });
  const fieldSaver = useMutation(api.template.updateFieldTemplate)
  const [saveField, setSaveField] = useState([
    {
      fieldid: null,
      templateid: null,
      lastUpdatedBy: null,
      description: null,
      fieldname: null,
      type: null,
      reference: null,
      fieldposition: 0,
      fieldappearance: null
    }
  ])
  console.log(saveField)
  const hasChanged = saveField.some(field => 
    field.fieldid && 
    field.templateid && 
    field.lastUpdatedBy && 
    field.description && 
    field.fieldname && 
    field.type && 
    field.reference && 
    field.fieldposition && 
    field.fieldappearance
  )
  const deleteField = useMutation(api.template.deleteField)
  const TemplateRemove = useMutation(api.template.remove);

  useEffect(() => {
    const currentType = searchParams.get('type');
    setType(currentType === 'settings' || currentType === 'preview' ? currentType : '');
  }, [searchParams])
  
  useEffect(() => {
    if (getFields) {
      setFields(
        getFields
          ?.sort((a: any, b: any) => a.fieldposition - b.fieldposition)
          .map((field: any, index: number) => ({
            ...field,
            fieldposition: index + 1,
            icon: fieldTypes.find(ft => ft.name === field.type)?.icon || AlignLeft,
            name: field.fieldname || field.name,
            description: field.description || '',
            position: field.position || 0,
            templateid: field.templateid,
            reference: field.reference,
          }))
      );
    }
  }, [getFields]);

  useEffect(() => {
    if (getTemplates && getTemplates[0]?.description === '') {
      router.push(`/application/${teamid}/templates`)
    }
  }, [getTemplates, router, teamid])

  // check if the template exists
  if (!getTemplates) return null;
  interface DeleteTemplateProps {
    id: any
    title: string
    onDelete: (id: string) => Promise<void>
    getRole: { permissions: string[] }[]
  }
  function DeleteTemplate({ id, title, onDelete, getRole }: DeleteTemplateProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [confirmTitle, setConfirmTitle] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [length, setLength] = useState(0)
    const getContentSpecific = useQuery(api.template.getContentViaTemplate, { templateid: id as any});
    const canDelete = getRole?.[0]?.permissions?.some(permission => ['owner', 'admin'].includes(permission))
  
      const handleDelete = async () => {
        if (confirmTitle !== title) {
          setError("The entered title doesn't match. Please try again.")
          return
        }
        if (getContentSpecific?.length > 0){
          setError("The template has content associated with it. Please delete the content items before deleting the template.")
          return
        }
        setIsDeleting(true)
        setError(null)
    
        try {
          await onDelete(id)
          setSuccess(true)
          setTimeout(() => setIsOpen(false), 2000) // Close dialog after 2 seconds
          window.location.href = `/application/${teamid}/templates`
        } catch (err) {
          setError("An error occurred while deleting the template. Please try again.")
        } finally {
          setIsDeleting(false)
        }
      }
  
    if (!canDelete) return null
  
    useEffect(() => {
      const length = getContentSpecific?.length
      setLength(length)
    }, [getContentSpecific])
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </DialogTrigger>
        {getContentSpecific && getContentSpecific?.length === 0 && (
        <DialogContent aria-describedby='Deleting template'>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the template, all content, and all its contents.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To confirm, type <strong>{title}</strong> in the box below:
            </p>
            <Input
              className="mt-2"
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              placeholder="Enter template title"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>The template has been successfully deleted.</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={confirmTitle !== title || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
        )} {
          // we will show an error if the template has content
          getContentSpecific && getContentSpecific?.length > 0 && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>This template can't be deleted right now.</DialogTitle>
              </DialogHeader>
              <div className="py-4 flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  This template has <strong>{length}</strong> content associated with it. Please delete the content items before deleting the template.
                </p>
                <div className='bg-blue-400/40 flex flex-row gap-1 items-center  border-blue-400  border px-2 py-1 rounded-md'>
                  <InfoIcon className='h-4 w-4 mr-1' />
                  <span className='text-sm'>Delete all <strong>content</strong> that uses this template before deleting it.</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className='font-semibold bg-green-700 text-white' onClick={() => setIsOpen(false)}>Okay</Button>
              </DialogFooter>
            </DialogContent>
          )
        }
      </Dialog>
    )
  }
  const addField = async (field: FieldType) => {
    // lets check if there is already 12 fields]
    if (fields.length >= 12) {
      alert('You have reached the maximum number of fields allowed for a template.')
    }

    const newField = { 
      ...field, 
      fieldid: field.fieldid, 
      _id: field.fieldid, 
      position: fields.length + 1,
      description: field.description,
      templateid: _templateid,
      reference: field.reference,
      name: field.fieldname as string,
    };
    setFields((prevFields) => [...prevFields, newField]);
    
    // Persist new field to backend
    await templateaddfield({
      templateid: _templateid, 
      fieldname: newField.name, 
      description: newField.description,
      type: field.name, 
      reference: newField.reference,
      fieldposition: fields.length + 1,
      fieldappearance: field.fieldappearance as any
    });
  };

  
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
  
    const newFields = Array.from(fields);
    const [reorderedItem] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, reorderedItem);
  
    // Update positions based on new order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      fieldposition: index + 1,
    }));
  
    // Update state
    setFields(updatedFields);
  
    // Batch update the new positions in backend
    await Promise.all(updatedFields.map((field) =>
      setSaveField((prevFields) => [
        ...prevFields,
        {
          fieldid: field._id as any, 
          templateid: _templateid as any,
          fieldname: field.fieldname as string,
          type: field.type as string,
          description: field.description,
          reference: field.reference,
          fieldposition: field.fieldposition,
          lastUpdatedBy: userId as string,
          fieldappearance: field.fieldappearance as any
        }
      ])
    ))
  };
  const handleEdit = (fieldId: string) => {
    const fieldToEdit = fields?.find(field => field._id === fieldId);
    if (fieldToEdit) {
      setEditingField(fieldToEdit);
      setIsEditFieldOpen(true);
    }
  };

  const handleSave = async () => {
    await Promise.all(saveField.map(async (field) => {
      if (field.fieldid && field.templateid && field.lastUpdatedBy && field.description && field.fieldname && field.type && field.reference && field.fieldposition && field.fieldappearance) {
        await fieldSaver({
          fieldid: field.fieldid as any,
          templateid: field.templateid as any,
          fieldname: field.fieldname as string,
          type: field.type as string,
          description: field.description,
          reference: field.reference,
          fieldposition: field.fieldposition as number,
          lastUpdatedBy: field.lastUpdatedBy as string,
          fieldappearance: field.fieldappearance as any
        })
      }
      // then clear the saveField state
      setSaveField([
        {
          fieldid: null,
          templateid: null,
          lastUpdatedBy: null,
          description: null,
          fieldname: null,
          type: null,
          reference: null,
          fieldposition: 0,
          fieldappearance: null
        }
      ])
    })
  )}
  
  const handleDelete = async (fieldId: string) => {
    const updatedFields = fields
      .filter(field => field._id !== fieldId)
      .map((field, index) => ({
        ...field,
        position: index + 1
      }))
    deleteField({ _id: fieldId, templateid: _templateid })
    setFields(updatedFields)

    // Save the updated positions after deletion
    for (const field of updatedFields) {
      setSaveField((prevFields) => [
        ...prevFields,
        {
          fieldid: field._id as any, 
          templateid: _templateid as any,
          fieldname: field.fieldname as string,
          type: field.type as string,
          description: field.description,
          reference: field.reference,
          fieldposition: field.fieldposition,
          lastUpdatedBy: userId as string,
          fieldappearance: field.fieldappearance as any
        }
      ])
    }
  }

  const livepreviewcolours = [
    { type: 'Rich text', colour: 'border-blue-400 text-blue-400 dark:border-blue-400/80 dark:text-blue-400' },
    { type: 'Title', colour: 'border-green-400 text-green-400 dark:border-green-400/80 dark:text-green-400' },
    { type: 'Short Text', colour: 'border-yellow-500 text-yellow-500 dark:border-yellow-400/80 dark:text-yellow-400' },
    { type: 'Number', colour: 'border-red-400 text-red-400 dark:border-red-400/80 dark:text-red-400' },
    { type: 'Date and time', colour: 'border-purple-400 text-purple-400 dark:border-purple-400/80 dark:text-purple-400' },
    { type: 'Location', colour: 'border-indigo-400 text-indigo-400 dark:border-indigo-400/80 dark:text-indigo-400' },
    { type: 'Media', colour: 'border-pink-400 text-pink-400 dark:border-pink-400/80 dark:text-pink-400' },
    { type: 'Boolean', colour: 'border-gray-400 text-gray-400 dark:border-gray-400/80 dark:text-gray-400' },
    { type: 'JSON object', colour: 'border-neutral-400 text-neutral-400 dark:border-neutral-400/80 dark:text-neutral-400' },
  ]



  const title = getTemplates?.[0]?.title + ' — Templates' + ' — Textuality'
  return (
    <div className='overflow-y-hidden'>
      <title>{title}</title>
      <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
          <AppHeader activesection="templates" teamid={teamid} />
          <main className="mx-auto md:px-10 py-3 transition-all">
            <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg h-screen scrollbaredit overflow-y-auto">
              <div className="flex justify-between items-center px-6 border-b py-4">
                <div className='flex flex-row gap-1 items-center'>
                  <Link href={`/application/${teamid}/templates`} className="text-primary hover:underline">
                    <ChevronLeft  />
                  </Link>
                  <h1 className="text-2xl font-semibold ml-3">{getTemplates?.[0]?.title} Fields</h1>
                </div>
                <div className='flex flex-row gap-4 items-center justify-center'>
                <DeleteTemplate
                    id={_templateid}
                    title={getTemplates?.[0]?.title}
                    onDelete={async (id) => {
                      await TemplateRemove({ _id: id as any});
                    }}
                    getRole={getRole}
                  />
                  <Button onClick={() => setIsAddFieldOpen(true)}>Add Field</Button>
                  <Button variant='publish' disabled={!hasChanged} onClick={() => handleSave()}>Save</Button>
                </div>
              </div>
              <div className='flex flex-row '>
                <aside className='border-r h-screen pb-6 w-1/6 pl-6'>
                  <div className="flex pr-5 items-start flex-col gap-3 mt-4">
                    <Link href={`/application/${teamid}/templates/edit/${templateid}`} className={`${type === "" ? "bg-neutral-400/20 font-semibold" : "hover:bg-neutral-400/20"} w-full transition-all text-sm rounded-md px-2 py-1.5`}>
                      <p className=''>Fields ({fields.length})</p>
                    </Link>
                    <Link href={`/application/${teamid}/templates/edit/${templateid}?type=settings`} className={`${type === "settings" ? "bg-neutral-400/20 font-semibold" : "hover:bg-neutral-400/20"} w-full transition-all text-sm rounded-md px-2 py-1.5`}>
                      <p className=''>Settings</p>
                    </Link>
                    <Link href={`/application/${teamid}/templates/edit/${templateid}?type=preview`} className={`${type === "preview" ? "bg-neutral-400/20 font-semibold" : "hover:bg-neutral-400/20"} w-full transition-all text-sm rounded-md px-2 py-1.5`}>
                      <p className=''>JSON Preview</p>
                    </Link>
                  </div>
                </aside>
                <div className='w-full pb-6 ml-6 container mx-auto'>
                {
                    type === "" ? (
                      <DragDropContext onDragEnd={onDragEnd} >
                        <div className='flex flex-row w-full gap-3'>
                        <div className='border border-gray-200 w-full h-min dark:border-neutral-800 rounded-lg mt-4'>
                          <Table className='mx-auto rounded-lg h-auto border-none py-6'>
                          <TableHeader className='rounded-t-md'>
                            <TableRow>
                              <TableHead>Position</TableHead>
                              <TableHead className='w-1/2'>Name</TableHead>
                              <TableHead className='w-full'>Field Type</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <Droppable droppableId="fields">
                          {(provided) => (
                            <TableBody className=' ' {...provided.droppableProps} ref={provided.innerRef}>
                              {
                                fields.length > 0 ? (
                                  fields
                                    .sort((a, b) => Number(a.fieldposition) - Number(b.fieldposition))  
                                    .map((field, index) => (
                                      <Draggable  key={field._id} draggableId={field._id as string} index={index}>
                                        {(provided) => (
                                          <TableRow
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`${livepreviewcolours.find(colour => colour.type === field.type)?.colour}`}
                                          >
                                            <TableCell>
                                              <div className="flex items-center">
                                                <span {...provided.dragHandleProps} className="mr-2 cursor-move">
                                                  <GripVertical className="h-4 w-4" />
                                                </span>
                                                {field?.fieldposition} {/* Display the field position */}
                                              </div>
                                            </TableCell>
                                            <TableCell >{field.fieldname || field.name}</TableCell>
                                            <TableCell>
                                              <div className="flex items-center">
                                                <div className="flex items-center">
                                                  {fieldTypes?.find(ft => ft.name === field.type)?.icon && 
                                                    React.createElement(fieldTypes?.find(ft => ft.name === field.type)!.icon, { className: "mr-2 h-4 w-4" })
                                                  }
                                                  {field.type}
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(field._id as string)}>
                                                  <Edit className="h-4 w-4" />
                                                  <span className="sr-only">Edit {field.fieldname || field.name}</span>
                                                </Button>
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                      <MoreHorizontal className="h-4 w-4" />
                                                      <span className="sr-only">More options for {field.fieldname || field.name}</span>
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleDelete(field._id as string)}>
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
                                    ))
                                ) : (
                                  <TableRow  className="text-center py-4 w-full">
                                    <TableCell colSpan={4} className='space-y-2'>
                                      <p className='w-full'>No fields found. Click "Add Field" to create your first field.</p>
                                      <div className='flex justify-center items-center'>
                                      <Button onClick={() => setIsAddFieldOpen(true)}>Add Field</Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              }
                              {provided.placeholder}
                            </TableBody>
                          )}
                        </Droppable>
                        </Table>
                        </div>
                        <div className='flex flex-col border-l border-b pb-4 rounded-bl-lg pl-2 w-1/2'>
                          <div className='flex flex-col px-2 pt-4'>
                            <div className='flex flex-col mb-4'>
                              <h1 className='text-lg font-semibold'>Live Preview</h1>
                              <p className='text-xs text-gray-500'>This is a live preview of the fields in the template</p>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd} >
                              <Droppable droppableId="fields">
                              {(provided) => (
                                <div className='flex flex-col ' {...provided.droppableProps} ref={provided.innerRef}>
                                  {
                                    fields.map((field, index) => (
                                      <Draggable key={field._id} draggableId={field._id as string} index={index}>
                                        {(provided, snapshot) => (
                                          <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger>
                                                <div className='flex flex-row gap-2 items-center py-2' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                  <div className={`w-full flex flex-row gap-2 items-center px-4 justify-start border-dashed border ${livepreviewcolours.find(colour => colour.type === field.type)?.colour} rounded-lg py-2`}>
                                                    <GripVertical className="h-4 w-4" />
                                                    <h3 className="text-md font-semibold ">{field.fieldname}</h3>
                                                  </div>
                                                </div>
                                                </TooltipTrigger>
                                                <TooltipContent align='start'>
                                                  {field.type}
                                                </TooltipContent>
                                              </Tooltip>
                                          </TooltipProvider>
                                      )}
                                      </Draggable>
                                    ))
                                  }
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            </DragDropContext>
                          </div>
                        </div>
                        </div>
                    </DragDropContext>
                    ) : type === "settings" ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center py-4 text-gray-500">
                          Settings coming soon
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center py-4 text-gray-500">
                          JSON Preview coming soon
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              {fields.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No fields found. Click "Add Field" to create your first field.
                </div>
              )}
            </div>
          </main>
        </div>
        <AddFieldDialog
          open={isAddFieldOpen}
          onOpenChange={setIsAddFieldOpen}
          onAddField={addField}
          totalfields={fields.length}
        />
        <EditFieldDialog
          open={isEditFieldOpen}
          onOpenChange={setIsEditFieldOpen}
          field={editingField}
          onEditField={async (updatedField) => {
            const updatedFields = fields.map(f => 
              f._id === updatedField._id ? { ...updatedField, position: f.position } : f
            )
            setFields(updatedFields)
            setIsEditFieldOpen(false)
            setSaveField((prevFields) => [
              {              
              fieldid: updatedField._id as any,
              templateid: _templateid as any,
              lastUpdatedBy: userId as string,
              description: updatedField.description,
              fieldname: updatedField.fieldname as string,
              type: updatedField.type as string,
              reference: updatedField.reference,
              fieldposition: updatedField.fieldposition as number,
              fieldappearance: updatedField.fieldappearance,
            }
          ]);
          }}
        />
      </AuthWrapper>
    </div>
  )
}


