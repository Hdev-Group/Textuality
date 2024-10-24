"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../../convex/_generated/api'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, Link, ArrowLeft, MoreHorizontal, Edit, Trash  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../../withAuth';
import { useRouter } from 'next/navigation'
import { use } from 'react'

type FieldType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string,
  fieldid?: string,
  fieldname?: string
}

const fieldTypes: FieldType[] = [
  { icon: AlignLeft, name: "Rich text", description: "Text formatting with references and media" },
  { icon: Type, name: "Short Text", description: "Titles, names, paragraphs, list of names" },
  { icon: Hash, name: "Number", description: "ID, order number, rating, quantity" },
  { icon: Calendar, name: "Date and time", description: "Event dates" },
  { icon: MapPin, name: "Location", description: "Coordinates: latitude and longitude" },
  { icon: Image, name: "Media", description: "Images, videos, PDFs and other files" },
  { icon: ToggleLeft, name: "Boolean", description: "Yes or no, 1 or 0, true or false" },
  { icon: Braces, name: "JSON object", description: "Data in JSON format" },
  { icon: Link, name: "Reference", description: "For example, a blog post can reference its author(s)" },
]

export default function Page({ params }: { params: any, _teamid: any }) {
  const { _teamid }: { _teamid: any } = use(params);
  const { userId, isLoaded, isSignedIn } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fields, setFields] = useState<FieldType[]>([])
  const [open, setOpen] = useState(true)
  const [isSectionOpen, setIsSectionOpen] = useState(false)
  const [template, setTemplater] = useState({name: '', apiref: ''})

    const router = useRouter();

    useEffect(() => {
        if (!open && template.apiref === '') {
            router.push(`/application/${_teamid}/templates`);
        }
    }, [open, template, router]);

  const [namevalue, setNameValue] = useState('')
  const [apivalue, setApiValue] = useState('')

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

  const handleSubmit = (event) => {
    if (event.target.id === 'newtemplate') {
      event.preventDefault();
      
      if (isSubmitting) return; // Prevent double submit
      setIsSubmitting(true);
      
      setTemplater({ name: namevalue, apiref: apivalue });
      const templateinfo = newtemplatemaker({
        pageid: _teamid,
        title: namevalue,
        apiref: apivalue,
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
  };


  return (
  <>
  <body className='overflow-hidden'>
    <AuthWrapper _teamid={_teamid}>
    <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
      <AppHeader activesection="templates" teamid={_teamid} />
      <main className="mx-auto px-10 py-3">
        <div className="bg-white dark:bg-neutral-950 rounded-lg flex flex-col shadow-lg p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">{template.name} Fields</h1>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle>New Template</DialogTitle>
            <DialogContent>
              <form id='newtemplate' onSubmit={handleSubmit} className='gap-2 flex flex-col'>
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="font-semibold text-sm">
                  Name
                </Label>
                <Input id="name" onChange={(e) => setNameValue(e.target.value)} maxLength={45} placeholder="Enter template name" />
                <div className='flex justify-end'>
                    <p className='text-xs'>{namevalue.length}/45</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="apiref" className="font-semibold text-sm">
                  API Reference
                </Label>
                <Input id="apiref" onChange={(e) => setApiValue(e.target.value)} maxLength={60} placeholder="Enter an API reference" />
                <div className='flex justify-end'>
                    <p className='text-xs'>{apivalue.length}/60</p>
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
          <DragDropContext onDragEnd={null}>
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
  </>
  )
}
function AddSectionDialog({ onAddField }: { onAddField: (field: FieldType) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<FieldType | null>(null)

  const handleClose = () => {
    setIsOpen(false)
    setSelectedField(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">Add Section</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader className="pb-5">
          <DialogTitle>{selectedField ? `Add ${selectedField.name} Field` : 'Add new field'}</DialogTitle>
        </DialogHeader>
        {selectedField ? (
          <FieldForm 
            field={selectedField} 
            onBack={() => setSelectedField(null)} 
            onAddField={(field) => {
              onAddField(field)
              handleClose()
            }} 
          />
        ) : (
          <div className="grid grid-cols-3 gap-4 py-4">
            {fieldTypes.map((field, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                onClick={() => setSelectedField(field)}
              >
                <h3 className="text-lg font-semibold mb-1">{field.name}</h3>
                <p className="text-sm text-center text-muted-foreground">{field.description}</p>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function FieldForm({ field, onBack, onAddField }: { field: FieldType, onBack: () => void, onAddField: (field: FieldType) => void }) {
  const [fieldName, setFieldName] = useState('');
  const [fieldId, setFieldId] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newField = { ...field, fieldid: fieldId, fieldname: fieldName };
    console.log('submitting', newField);
    onAddField(newField);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 flex flex-col justify-between`}>
      <div className={`flex flex-col gap-4`}>
        <div className={`${field.name === 'Number' ? ("flex-row") : ("flex-col")} w-full flex gap-4`}>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="name" className="font-semibold text-sm">
              Name
            </Label>
            <Input 
              id="name" 
              placeholder="Enter field name" 
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="id" className="font-semibold text-sm">
              Field ID
            </Label>
            <Input 
              id="id" 
              placeholder="Enter field reference" 
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
            />
          </div>
        </div>
        {field.name === 'Number' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type" className="font-semibold text-sm">
              Type
            </Label>
            <div className='flex flex-row gap-[50%]'>
              <div className='flex flex-row items-center gap-2'>
                <Input id="integer" type="checkbox"/>
                <p>Integer</p>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <Input id="decimal" type="checkbox" />
                <p>Decimal</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button type="submit">Add {field.name} Field</Button>
        </div>
      </DialogFooter>
    </form>
  )
}
