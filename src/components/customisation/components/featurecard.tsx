import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  totalposts: string
  borderhovercolour: string
  bordercolour: string
}

export default function FeatureCardComponent({ title, description, totalposts, bordercolour, borderhovercolour }: FeatureCardProps) {
  const postCount = parseInt(totalposts) || 0;

  return (
    <div className="relative h-[500px] flex text-start p-4 dark:text-white text-black overflow-y-auto resize-y min-h-[200px] max-h-[80vh]">
      <div className={`absolute inset-0 border rounded-md`}>
        <div className="relative z-10 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col relative gap-2 pb-5 w-full">
              {/* Grid layout with conditional full width for odd-numbered items */}
              <div className={`p-4 grid gap-4 transition-all ${postCount > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {
                  postCount > 0 ? (
                    Array.from({ length: postCount }).map((_, index) => {
                      const isLastOddItem = postCount % 2 !== 0 && index === postCount - 1;

                      return (
                        <div 
                          key={index} 
                          className={`border rounded-md px-4 py-3 transition-all hover:shadow-md shadow-sm ${isLastOddItem ? 'col-span-2' : 'w-full'}`}
                          style={{ borderColor: bordercolour }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = borderhovercolour}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = bordercolour}
                        >
                          <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold">{title}</h1>
                          </div>
                          <p className="text-sm">{description}</p>
                          <Button className="self-start flex flex-row gap-1 onzoomers">Read More <ArrowRight className='zoomerfollow' height={14} width={14} /></Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center w-full">No posts available</p>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}