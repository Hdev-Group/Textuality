import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
    templateid: string;
    reference: string;
    fieldposition?: number;
    fieldappearance?: string;
  }
  import { ScrollArea } from "@/components/ui/scroll-area"
import { AlignLeft, ArrowLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, MessageCircleQuestionIcon, Frown, Heading } from "lucide-react"

  const fieldTypes: FieldType[] = [
    { icon: Heading, name: "Title", description: "Main title Includes author information & more", templateid: '', reference: '' },
    { icon: AlignLeft, name: "Rich text", description: "Text formatting with references and media", templateid: '', reference: '' },
    { icon: Type, name: "Short Text", description: "Titles, names, paragraphs, list of names", templateid: '', reference: '' },
    { icon: Hash, name: "Number", description: "ID, order number, rating, quantity", templateid: '', reference: '' },
    { icon: Calendar, name: "Date and time", description: "Event dates", templateid: '', reference: '' },
    { icon: MapPin, name: "Location", description: "Coordinates: latitude and longitude", templateid: '', reference: '' },
    { icon: Image, name: "Media", description: "Images, videos, PDFs and other files", templateid: '', reference: '' },
    { icon: ToggleLeft, name: "Boolean", description: "Yes or no, 1 or 0, true or false", templateid: '', reference: '' },
    { icon: Braces, name: "JSON object", description: "Data in JSON format", templateid: '', reference: '' },
    { icon: Frown, name: "Unsure", description: "Not sure what to choose? Click here", templateid: '', reference: '' },
  ]
  const unsureTemplates = [
    { 
      name: "Blog Post", 
      fields: [
        { name: "Title", type: "Title" },
        { name: "Content", type: "Rich text" },
        { name: "Featured Image", type: "Media" },
        { name: "Tags", type: "Short Text" },
        { name: "Category", type: "Short Text" }
      ]
    },
    { 
      name: "Event Announcement", 
      fields: [
        { name: "Event Name", type: "Title" },
        { name: "Date and Time", type: "Date and time" },
        { name: "Location", type: "Location" },
        { name: "Description", type: "Rich text" }
      ]
    },
    { 
      name: "Product Review", 
      fields: [
        { name: "Product Name", type: "Title" },
        { name: "Rating", type: "Number" },
        { name: "Review Text", type: "Rich text" },
        { name: "Pros", type: "Rich text" },
        { name: "Cons", type: "Rich text" }
      ]
    }
  ];  
  
  function UnsureFieldTemplates({ onSelectTemplate }: { onSelectTemplate: (template: { name: string, fields: string[], fieldposition: string }) => void }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        {unsureTemplates.map((template, index) => (
          <button
            key={index}
            className="flex flex-col items-start p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
            onClick={() => onSelectTemplate(template as any)}
          >
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              {template.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>{field.name}</div>
              ))}
          </button>
        ))}
      </div>
    )
  }
  export function AddFieldDialog({ open, onOpenChange, onAddField }: { open: boolean; onOpenChange: (open: boolean) => void; onAddField: (field: FieldType) => void }) {
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
        transition: { duration: 0.25 }
      },
      exit: (direction: 'left' | 'right') => ({
        x: direction === 'left' ? '100%' : '-100%',
        opacity: 0,
        transition: { duration: 0.25 }
      })
    };
  
    const handleSelectTemplate = (template) => {
      const newFields = template.fields.map((field, index) => {
        const matchedType = fieldTypes.find((type) => type.name === field.type);
        
        if (!matchedType) {
          console.error(`No matching field type found for ${field.type}`);
          return null;
        }
    
        return {
          ...matchedType,
          type: field.type,
          fieldname: field.name,
          reference: `${template.name.toLowerCase().replace(/\s+/g, '_')}_${field.name.toLowerCase().replace(/\s+/g, '_')}`,
          position: index + 1,
          fieldappearance: matchedType.fieldappearance || 'number-editor'
        };
      }).filter(field => field !== null);  
    

      newFields.forEach((field) => onAddField(field));
    
      handleClose();
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
              selectedField.name === "Unsure" ? (
                <UnsureFieldTemplates onSelectTemplate={handleSelectTemplate} />
              ) : (
                <FieldForm
                  type={"Create"}
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
              )
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
  export function EditFieldDialog({ open, onOpenChange, field, onEditField }: { open: boolean; onOpenChange: (open: boolean) => void; field: FieldType | null; onEditField: (field: FieldType) => void }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1025px] overflow-hidden transition-all">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          {field && (
            <FieldForm
              field={field}
              type={"Edit"}
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
  
  function FieldForm({ field, onBack, onSubmit, type }: { type: string, field: FieldType, onBack: () => void, onSubmit: (field: FieldType) => void }) {
    const [fieldName, setFieldName] = useState(field.fieldname || '');
    const [fieldId, setFieldId] = useState(field.reference || '');
    const [description, setDescription] = useState(field.description || '');
    const [isRequired, setIsRequired] = useState(field.isRequired || false); 
    const [defaultValue, setDefaultValue] = useState(field.defaultValue || '');
    const [fieldappearance, setFieldAppearance] = useState(field.fieldappearance || 'number-editor');
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit({
        ...field,
        reference: fieldId,
        fieldname: fieldName,
        description,
        isRequired,
        defaultValue,
        fieldappearance: fieldappearance || 'number-editor',
      });
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
          <h2 className="text-lg font-semibold">Name</h2>
            <Input
              id="name"
              placeholder="Enter field name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
          <h2 className="text-lg font-semibold">Field ID</h2>
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
        <h2 className="text-lg font-semibold">Description</h2>
          <Input
            id="description"
            placeholder="Enter field description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
  
        <div className="space-y-2">
        <h2 className="text-lg font-semibold">Default Value</h2>
          <Input
            id="defaultValue"
            placeholder="Enter default value"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
        </div>
  
        <div className="space-y-2">
        <h2 className="text-lg font-semibold">Is Required</h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
            <span>Required</span>
          </div>
        </div>
  
        {(field.type === 'Number' || field.name === 'Number') && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Apperance</h2>
            <div className="flex space-x-4">
              <label className={`${fieldappearance === "number-editor" ? "border-blue-300" : ""} border rounded-md flex flex-col items-start  space-y-2 cursor-pointer`}>
                <input
                  type="radio"
                  name="appearance"
                  onChange={(e) => setFieldAppearance(e.target.value)}
                  value="number-editor"
                  checked={fieldappearance === 'number-editor'}
                  className="hidden peer"
                />
                <div className='p-4 w-full h-full'>
                  <div className="flex items-center justify-center w-full h-8 border rounded-md">
                    <span>1001</span>
                  </div>
                </div>
                <div className='flex flex-col gap-0.5 border-t px-4 py-2 h-14'>
                  <span className="font-semibold">Number editor</span>
                  <p className="text-xs text-gray-400">Default</p>
                </div>
              </label>
              <label className={`${fieldappearance === "rating" ? "border-blue-300" : ""} border rounded-md flex flex-col justify-end items-start space-y-2 cursor-pointer `}>
                <input
                  type="radio"
                  name="appearance"
                  value="rating"
                  onChange={(e) => setFieldAppearance(e.target.value)}
                  checked={fieldappearance === 'rating'}
                  className="hidden peer"
                />
                <div className='flex w-full p-4'>
                  <div className="flex space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-yellow-500">★</span>
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-400">★</span>
                    <span className="text-gray-400">★</span>
                  </div>
                </div>
                <div className='flex flex-col w-full items-center gap-0.5 h-14 border-t px-4 py-2 '>
                  <span className="font-semibold">Rating</span>
                </div>
              </label>
            </div>
          </div>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button type="submit">{type} {field.name} Field</Button>
          </div>
        </DialogFooter>
      </form>
    );
  }
  