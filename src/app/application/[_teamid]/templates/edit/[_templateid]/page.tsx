'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../../convex/_generated/api'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, Link, ArrowLeft, MoreHorizontal, Edit, Trash, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../../../withAuth'
import { useRouter } from 'next/navigation'
import { use } from 'react';
import { motion } from 'framer-motion';

type FieldType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  fieldid?: string
  fieldname?: string
  type?: string
  defaultValue?: string
  validationRules?: string
  placeholder?: string
  _id?: string
  isRequired?: boolean
  position: number
  templateid: string
  reference: string
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
  { icon: Link, name: "Reference", description: "For example, a blog post can reference its author(s)", position: 0, templateid: '', reference: '' },
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

  const getPage = useQuery(api.page.getPage, { _id: teamid })
  const getTemplates = useQuery(api.template.getExactTemplate, { pageid: teamid, _id: templateid })
  const getFields = useQuery(api.template.getFields, { templateid: templateid })
  const templateaddfield = useMutation(api.template.addField)
  const saveField = useMutation(api.template.updateField)

  useEffect(() => {
    if (getFields) {
      setFields(getFields?.map((field, index) => ({ ...field, fieldposition: index + 1 })))
    }
  }, [getFields])

  useEffect(() => {
    if (getTemplates && getTemplates[0]?.apiref === '') {
      router.push(`/application/${teamid}/templates`)
    }
  }, [getTemplates, router, teamid])

  const addField = async (field: FieldType) => {
    console.log(field)
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
        fieldid: field._id as string,
        fieldname: field.fieldname as string,
        type: field.type as string,
        description: field.description,
        reference: field.reference,
        fieldposition: field.position
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
        fieldid: field._id as string,
        fieldname: field.fieldname as string,
        type: field.type as string,
        reference: field.reference,
        description: field.description,
        fieldposition: field.position
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
          <main className="mx-auto px-10 py-3">
            <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg py-6 overflow-y-auto">
              <div className="flex justify-between items-center px-6 border-b pb-4">
                <h1 className="text-2xl font-semibold">{getTemplates?.[0]?.title} Fields</h1>
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
                          {fields.map((field, index) => (
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
                                      {field.fieldposition}
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
              _id: updatedField._id as any,
              templateid: updatedField.templateid,
              fieldname: updatedField.fieldname as string,
              type: updatedField.type as string,
              reference: updatedField.reference
            })
          }}
        />
      </AuthWrapper>
    </body>
  )
}

export function AddFieldDialog({ open, onOpenChange, onAddField }: { open: boolean, onOpenChange: (open: boolean) => void, onAddField: (field: FieldType) => void }) {
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');

  const handleClose = () => {
    onOpenChange(false);
    setSelectedField(null);
  };

  const swipeTransition = {
    initial: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.4 }
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] overflow-x-hidden transition-all">
        <DialogHeader>
          <DialogTitle>{selectedField ? `Add ${selectedField.name} Field` : 'Add new field'}</DialogTitle>
        </DialogHeader>
        
        <motion.div
          key={selectedField ? 'field-form' : 'field-selection'}
          initial={swipeTransition.initial(animationDirection)}
          animate={swipeTransition.animate}
          exit={swipeTransition.exit(animationDirection)}
        >
          {selectedField ? (
            <FieldForm
              field={selectedField}
              onBack={() => {
                setAnimationDirection('left');
                setSelectedField(null);
              }}
              onSubmit={(field) => {
                onAddField(field);
                handleClose();
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {fieldTypes.map((field, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => {
                    setAnimationDirection('right');
                    setSelectedField(field);
                  }}
                >
                  {React.createElement(field.icon, { className: "h-8 w-8 mb-2" })}
                  <h3 className="text-lg font-semibold mb-1">{field.name}</h3>
                  <p className="text-sm text-center text-muted-foreground">{field.description}</p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function EditFieldDialog({ open, onOpenChange, field, onEditField }: { open: boolean, onOpenChange: (open: boolean) => void, field: FieldType | null, onEditField: (field: FieldType) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] overflow-hidden transition-all">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
        </DialogHeader>
        {field && (
          <FieldForm
            field={field}
            onBack={() => onOpenChange(false)}
            onSubmit={(updatedField) => {
              onEditField(updatedField)
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function FieldForm({ field, onBack, onSubmit }: { field: FieldType, onBack: () => void, onSubmit: (field: FieldType) => void }) {
  const [fieldName, setFieldName] = useState(field.fieldname || '');
  const [fieldId, setFieldId] = useState(field.reference || '');
  const [description, setDescription] = useState(field.description || '');
  const [isRequired, setIsRequired] = useState(field.isRequired || false); 
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...field,
      reference: fieldId,
      fieldname: fieldName,
      description,
      isRequired,
      defaultValue
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter field name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">Field ID</Label>
          <Input
            id="id"
            placeholder="Enter field reference"
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter field description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="defaultValue">Default Value</Label>
        <Input
          id="defaultValue"
          placeholder="Enter default value"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Is Required</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />
          <span>Required</span>
        </div>
      </div>

      {field.name === 'Number' && (
        <div className="space-y-2">
          <Label>Type</Label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="numberType" value="integer" />
              <span>Integer</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="numberType" value="decimal" />
              <span>Decimal</span>
            </label>
          </div>
        </div>
      )}
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button type="submit">{field.fieldid ? 'Update' : 'Add'} {field.name} Field</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

