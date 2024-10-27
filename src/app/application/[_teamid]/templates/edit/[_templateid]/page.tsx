'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../../convex/_generated/api'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, ArrowLeft, MoreHorizontal, Edit, Trash, GripVertical, ChevronLeft, ChevronRight, LucideMessageCircleQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../../../withAuth'
import { useRouter } from 'next/navigation'
import {AddFieldDialog, EditFieldDialog} from '@/components/template/comp'
import Link from 'next/link';

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
}


const fieldTypes: FieldType[] = [
  { icon: AlignLeft, name: "Rich text", description: "Text formatting with references and media", position: 0, templateid: '', reference: '' },
  { icon: Type, name: "Short Text", description: "Titles, names, paragraphs, list of names", position: 0, templateid: '', reference: '' },
  { icon: Hash, name: "Number", description: "ID, order number, rating, quantity", position: 0, templateid: '', reference: '' },
  { icon: Calendar, name: "Date and time", description: "Event dates", position: 0, templateid: '', reference: '' },
  { icon: MapPin, name: "Location", description: "Coordinates: latitude and longitude", position: 0, templateid: '', reference: '' },
  { icon: Image, name: "Media", description: "Images, videos, PDFs and other files", position: 0, templateid: '', reference: '' },
  { icon: ToggleLeft, name: "Boolean", description: "Yes or no, 1 or 0, true or false", position: 0, templateid: '', reference: '' },
  { icon: Braces, name: "JSON object", description: "Data in JSON format", position: 0, templateid: '', reference: '' },
]

export default function TemplateManager({ params }: { params: Promise<{ _teamid: string; _templateid: string }> }) {
  const { _teamid, _templateid } = React.use(params);
  const teamid = _teamid;
  const templateid = _templateid; 
  const { userId } = useAuth()
  const [fields, setFields] = useState<FieldType[]>([])
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false)
  const [editingField, setEditingField] = useState<FieldType | null>(null)
  const router = useRouter()

  const getPage = useQuery(api.page.getPage, { _id: teamid as any })
  const getTemplates = useQuery(api.template.getExactTemplate, { pageid: teamid, _id: templateid })
  const getFields = useQuery(api.template.getFields, { templateid: templateid })
  const templateaddfield = useMutation(api.template.addField)
  const saveField = useMutation(api.template.updateField)

  useEffect(() => {
    if (getFields) {
      setFields(getFields?.map((field: any, index: number) => ({
        ...field,
        fieldposition: index + 1,
        icon: fieldTypes.find(ft => ft.name === field.type)?.icon || AlignLeft,
        name: field.fieldname || field.name,
        description: field.description || '',
        position: field.position || 0,
        templateid: field.templateid,
        reference: field.reference,
      })))
    }
  }, [getFields])

  useEffect(() => {
    if (getTemplates && getTemplates[0]?.apiref === '') {
      router.push(`/application/${teamid}/templates`)
    }
  }, [getTemplates, router, teamid])

  const addField = async (field: FieldType) => {
    const newField = { 
      ...field, 
      fieldid: field.fieldid, 
      _id: field.fieldid, 
      position: fields.length + 1,
      description: field.description,
      templateid: _templateid,
      reference: field.reference,
      name: field.fieldname as string,
    }
    setFields((prevFields) => [...prevFields, newField])
    await templateaddfield({
      templateid: _templateid, 
      fieldname: newField.name, 
      description: newField.description,
      type: field.name, 
      reference: newField.reference,
      fieldposition: fields.length + 1
    })
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const newFields = Array.from(fields)
    const [reorderedItem] = newFields.splice(result.source.index, 1)
    newFields.splice(result.destination.index, 0, reorderedItem)

    const updatedFields = newFields.map((field, index) => ({
      ...field,
      position: index + 1
    }))

    setFields(updatedFields)

    // Save the updated positions
    for (const field of updatedFields) {
      await saveField({
        fieldid: field._id as any, 
        templateid: _templateid as any,
        fieldname: field.fieldname as string,
        type: field.type as string,
        description: field.description,
        reference: field.reference,
        fieldposition: field.position,
        lastUpdatedBy: userId as string
      })
    }
  }

  const handleEdit = (fieldId: string) => {
    const fieldToEdit = fields.find(field => field._id === fieldId)
    if (fieldToEdit) {
      setEditingField(fieldToEdit)
      setIsEditFieldOpen(true)
    }
  }

  const handleDelete = async (fieldId: string) => {
    const updatedFields = fields
      .filter(field => field._id !== fieldId)
      .map((field, index) => ({
        ...field,
        position: index + 1
      }))
    
    setFields(updatedFields)

    // Save the updated positions after deletion
    for (const field of updatedFields) {
      await saveField({
        fieldid: field._id as any, 
        templateid: _templateid as any,
        fieldname: field.fieldname as string,
        type: field.type as string,
        description: field.description,
        reference: field.reference,
        fieldposition: field.position,
        lastUpdatedBy: userId as string
      })
    }
  }

  if (!getPage?.users?.includes(userId as string)) {
    return <div className="flex items-center justify-center h-screen">Not authorized</div>
  }
  const title = getTemplates?.[0]?.title + ' — Templates' + ' — Textuality'
  return (
    <body className='overflow-y-hidden'>
      <title>{title}</title>
      <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
          <AppHeader activesection="templates" teamid={teamid} />
          <main className="mx-auto px-10 py-3 transition-all">
            <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg py-6 overflow-y-auto">
              <div className="flex justify-between items-center px-6 border-b pb-4">
                <div className='flex flex-row gap-1 items-center'>
                  <Link href={`/application/${teamid}/templates`} className="text-primary hover:underline">
                    <ChevronLeft  />
                  </Link>
                  <h1 className="text-2xl font-semibold ml-3">{getTemplates?.[0]?.title} Fields</h1>
                </div>
                <Button onClick={() => setIsAddFieldOpen(true)}>Add Field</Button>
              </div>
              <div className='flex flex-col px-6'>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Table className='mt-4'>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Field Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <Droppable droppableId="fields">
                    {(provided) => (
                      <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                        {fields
                          .sort((a, b) => a.fieldposition - b.fieldposition) // Sorting based on fieldposition
                          .map((field, index) => (
                            <Draggable key={field._id} draggableId={field._id as string} index={index}>
                              {(provided) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TableCell>
                                    <div className="flex items-center">
                                      <span {...provided.dragHandleProps} className="mr-2 cursor-move">
                                        <GripVertical className="h-4 w-4" />
                                      </span>
                                      {field?.fieldposition}
                                    </div>
                                  </TableCell>
                                  <TableCell>{field.fieldname || field.name}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div className="flex items-center">
                                        {fieldTypes.find(ft => ft.name === field.type)?.icon && React.createElement(fieldTypes.find(ft => ft.name === field.type)!.icon, { className: "mr-2 h-4 w-4" })}
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
                          ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                  </Table>
                </DragDropContext>
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
            await saveField({
              fieldid: updatedField._id as any,
              templateid: _templateid as any,
              lastUpdatedBy: userId as string,
              description: updatedField.description,
              fieldname: updatedField.fieldname as string,
              type: updatedField.type as string,
              reference: updatedField.reference,
              fieldposition: updatedField.fieldposition as number,
            })
          }}
        />
      </AuthWrapper>
    </body>
  )
}


