import React from 'react'
import { Button } from "@/components/ui/button"

interface HeroProps {
  title: string
  description: string
  buttonText: string
  backgroundColor: string
}

export default function HeroComponent({ title, description, buttonText, backgroundColor }: HeroProps) {
  return (
    <div className="relative h-[500px] flex items-center justify-center text-center text-white" 
         style={{backgroundImage: `url(${backgroundColor})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-8">{description}</p>
        <Button variant="outline" size="lg">{buttonText}</Button>
      </div>
    </div>
  )
}