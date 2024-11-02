import React from 'react'
import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react'

interface HeroProps {
  title: string
  description: string
  buttonText: string
  backgroundColor: string
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
}

export default function HeroComponent({ title, description, buttonText, backgroundColor, facebook, twitter, linkedin, instagram }: HeroProps) {
  return (
    <div className="relative h-[500px] flex flex-col items-center rounded-md border overflow-hidden justify-center text-center text-white">
      <div className='border-b w-full h-10'>

      </div>
      <div className={`flex relative w-full items-center text-left justify-center h-full rounded-t-lg mt-5`} style={{backgroundColor: backgroundColor}}>
        <div className="relative z-10 gap-2 flex flex-col">
          <h1 className="text-4xl font-bold ">{title}</h1>
          <p className="text-xl ">{description}</p>
          <div className='flex flex-row gap-4'>
            {
              facebook && (
                <Button className='bg-blue-500 hover:bg-blue-600'><Share2 /> Facebook</Button>
              )
            }
            {
              twitter && (
                <Button className='bg-blue-400 hover:bg-blue-500'><Share2 /> Twitter</Button>
              )
            }
            {
              linkedin && (
                <Button className='bg-blue-300 hover:bg-blue-400'><Share2 /> LinkedIn</Button>
              )
            }
            {
              instagram && (
                <Button className='bg-blue-200 hover:bg-blue-300'><Share2 /> Instagram</Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}