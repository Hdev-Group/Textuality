import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarDaysIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeroProps {
    title: string
    readtimeon: boolean
    Author: string
    bodytext: string
    tags: string[]
    bannerimage: string
    boldText: string
    hoverandlinks: string
}

const readtimecalc = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);

    if (readTime < 1) {
        return `${Math.ceil(minutes * 60)} seconds`;
    } else if (readTime === 1) {
        return `${readTime} minute`;
    } else if (readTime < 60) {
        return `${readTime} minutes`;
    } else {
        const hours = Math.floor(readTime / 60);
        const remainingMinutes = readTime % 60;
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    }
}

export default function HeroComponent({ title, Author, bodytext, tags, bannerimage, boldText, hoverandlinks }: HeroProps) {
  return (
<div className="relative h-[500px] flex text-start p-4 dark:text-white text-black overflow-y-auto resize-y min-h-[200px] max-h-[80vh]">
    <div className="absolute inset-0 border rounded-md"></div>
    <div className="relative z-10 w-full">
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col relative gap-2 pb-5 w-full">
                <img src={bannerimage} className="max-h-[200px] w-[100%] object-cover rounded-md" />
                <div className="w-full flex flex-col gap-3">
                    <div className="py-1 gap-2 flex flex-col rounded w-full dark:text-white text-black">
                        <a className={`flex flex-row items-center text-xs w-auto gap-1 cursor-pointer`}>
                            <ArrowLeft width={14} height={14} /> Back
                        </a>
                        <style jsx>{`
                            a:hover {
                                color: ${hoverandlinks};
                                transition: color 0.2s ease-in-out;
                            }
                        `}</style>
                        <div className="flex flex-row gap-3">
                            {
                                tags?.map((tag) => {
                                    return <p className="text-xs cursor-pointer hover:text-blue-400 dark:text-neutral-400 font-semibold" key={tag}>{tag}</p>
                                })
                            }
                        </div>
                    </div>
                    <h2 className="font-bold text-3xl -mt-1 dark:text-white text-black">{title}</h2>
                    <div className="flex flex-row gap-2">
                        <Avatar>
                            <AvatarFallback className="h-10 w-10 rounded-full">{Author?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-between">
                            <p className="font-normal text-sm">
                                <span className='dark:text-gray-400'>By </span> 
                                <b style={{ color: boldText }}>{Author}</b>
                            </p>
                            <div className="flex flex-row gap-2 items-center">
                                <p className="font-normal text-xs dark:text-gray-400">{readtimecalc(bodytext)} read</p>
                                <p>·</p>
                                <p className="font-normal text-xs dark:text-gray-400 flex items-center flex-row gap-0.5">
                                    <CalendarDaysIcon height={18} /> {new Date().toDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>{bodytext}</div>
    </div>
</div>

  )
}