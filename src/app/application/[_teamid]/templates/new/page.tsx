"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../../../convex/_generated/api'
import { AlignLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, Link, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppHeader from "@/components/header/appheader"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth'

type FieldType = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
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

export default function Page({ params: { _teamid } }: { params: { _teamid: string } }) {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedField, setSelectedField] = useState<FieldType | null>(null)

  const getPage = useQuery(api.page.getPage, { _id: _teamid })

  useEffect(() => {
    if (getPage?.users?.includes(userId as string)) {
      setIsAuthorized(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [getPage, userId])

  if (!isLoaded) {
    return <IsLoadedEdge />
  }

  if (!isAuthorized) {
    return <IsAuthorizedEdge />
  }

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
      <AppHeader activesection="templates" teamid={_teamid} />
      <main className="mx-auto px-10 py-8">
        <div className="bg-white dark:bg-neutral-950 rounded-2xl flex flex-col shadow-lg p-8 space-y-8">
          <div className="flex justify-end">
            <AddSectionDialog />
          </div>
          <div className="flex flex-col md:gap-4 gap-5 md:flex-row justify-between">
            {/* Add your content here */}
          </div>
        </div>
      </main>
    </div>
  )
}

function AddSectionDialog() {
  const [selectedField, setSelectedField] = useState<FieldType | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">Add Section</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader className="pb-5">
          <DialogTitle>
            {selectedField ? (
              <div className="flex items-center gap-2">
                Add field <span className="text-xs text-muted-foreground">{selectedField.name}</span>
              </div>
            ) : (
              'Add new field'
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md px-2">
          <div className="relative overflow-hidden">
            <div
              className={`transition-transform duration-300 ease-in-out ${
                selectedField ? '-translate-x-full' : 'translate-x-0'
              }`}
            >
              <div className="grid grid-cols-3 gap-4 py-4">
                {fieldTypes.map((field, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                    onClick={() => setSelectedField(field)}
                  >
                    <field.icon className="w-8 h-8 mb-2 text-primary" />
                    <h3 className="text-lg font-semibold mb-1">{field.name}</h3>
                    <p className="text-sm text-center text-muted-foreground">{field.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`absolute top-0 left-full w-full h-full transition-transform duration-300 ease-in-out ${
                selectedField ? '-translate-x-full' : 'translate-x-0'
              }`}
            >
              {selectedField && <FieldForm field={selectedField} onBack={() => setSelectedField(null)} />}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function FieldForm({ field, onBack }: { field: FieldType; onBack: () => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission
    console.log('Form submitted')
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 flex flex-col justify-between`}>
      <div className={`flex flex-col gap-4`}>
        <div className={`${field.name === 'Number' ? ("flex-row") : ("flex-col")} w-full flex gap-4`}>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="name" className="font-semibold text-sm">
              Name
            </Label>
            <Input id="name" placeholder="Enter field name" />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="fieldId" className="font-semibold text-sm">
              Field ID
            </Label>
            <Input id="fieldId" placeholder="Enter field reference" />
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