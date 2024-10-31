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
    position: number;
    templateid: string;
    reference: string;
    fieldposition?: number;
  }
  import { ScrollArea } from "@/components/ui/scroll-area"
import { AlignLeft, ArrowLeft, Type, Hash, Calendar, MapPin, Image, ToggleLeft, Braces, MessageCircleQuestionIcon, Frown } from "lucide-react"

  const fieldTypes: FieldType[] = [
    { icon: AlignLeft, name: "Rich text", description: "Text formatting with references and media", position: 0, templateid: '', reference: '' },
    { icon: Type, name: "Short Text", description: "Titles, names, paragraphs, list of names", position: 0, templateid: '', reference: '' },
    { icon: Hash, name: "Number", description: "ID, order number, rating, quantity", position: 0, templateid: '', reference: '' },
    { icon: Calendar, name: "Date and time", description: "Event dates", position: 0, templateid: '', reference: '' },
    { icon: MapPin, name: "Location", description: "Coordinates: latitude and longitude", position: 0, templateid: '', reference: '' },
    { icon: Image, name: "Media", description: "Images, videos, PDFs and other files", position: 0, templateid: '', reference: '' },
    { icon: ToggleLeft, name: "Boolean", description: "Yes or no, 1 or 0, true or false", position: 0, templateid: '', reference: '' },
    { icon: Braces, name: "JSON object", description: "Data in JSON format", position: 0, templateid: '', reference: '' },
    { icon: Frown, name: "Unsure", description: "Not sure what to choose? Click here", position: 0, templateid: '', reference: '' },
  ]
  const unsureTemplates = [
    { 
      name: "Blog Post", 
      fields: [
        { name: "Title", type: "Short Text" },
        { name: "Content", type: "Rich text" },
        { name: "Featured Image", type: "Media" },
        { name: "Tags", type: "Short Text" },
        { name: "Category", type: "Short Text" }
      ]
    },
    { 
      name: "Event Announcement", 
      fields: [
        { name: "Event Name", type: "Short Text" },
        { name: "Date and Time", type: "Date and time" },
        { name: "Location", type: "Location" },
        { name: "Description", type: "Rich text" }
      ]
    },
    { 
      name: "Product Review", 
      fields: [
        { name: "Product Name", type: "Short Text" },
        { name: "Rating", type: "Number" },
        { name: "Review Text", type: "Rich text" },
        { name: "Pros", type: "Rich text" },
        { name: "Cons", type: "Rich text" }
      ]
    }
  ];  
  
  function UnsureFieldTemplates({ onSelectTemplate }: { onSelectTemplate: (template: { name: string, fields: string[] }) => void }) {
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
        return {
          ...matchedType,
          type: field.type,
          fieldname: field.name,
          reference: `${template.name.toLowerCase().replace(/\s+/g, '_')}_${field.name.toLowerCase().replace(/\s+/g, '_')}`,
          position: index,
        };
      });
    
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
        <DialogContent className="sm:max-w-[725px] overflow-hidden transition-all">
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
            <Button type="submit">{type} {field.name} Field</Button>
          </div>
        </DialogFooter>
      </form>
    );
  }
  