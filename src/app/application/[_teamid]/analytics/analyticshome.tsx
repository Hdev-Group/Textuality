"use client"

import AppHeader from "@/components/header/appheader"
import AuthWrapper from "../withAuth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, ChartArea } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function AnalyticsHome({ params }: { params: { _teamid: string} }){
    const { _teamid: teamid } = params
    return(
        <div>
        <body className='overflow-hidden'>
          <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
          <AppHeader activesection="analytics" teamid={teamid} />
          <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
            <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg space-y-8 h-screen overflow-y-auto pb-32">
          <div className="flex flex-col md:gap-0 gap-5 w-full justify-between">
            <div className="py-4 px-8 flex flex-row w-full border-b">
                <div className="flex flex-row w-full items-center justify-between">
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <Link href={`/application/${teamid}/analytics/tracknew`}>
                        <Button variant="gradient" className="mt-4 flex items-center justify-center flex-row"><span className="flex flex-row gap-1 items-center justify-center"><ChartArea className="w-5"/> Track New</span></Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row py-4 px-8">
                <div className="flex flex-row">
                    <DateSelector />
                </div>
            </div>
          </div>
          </div>
          </main>
        </div>
          </AuthWrapper>
        </body>
      </div>
    )
}
function DateSelector() {
    const [date, setDate] = useState<Date>(new Date())
    const [filterType, setFilterType] = useState<"day" | "month" | "year">("day")
  
    const handleDateChange = (newDate: Date | undefined) => {
      if (newDate) {
        setDate(newDate)
      }
    }
  
    const handleFilterTypeChange = (value: string) => {
      setFilterType(value as "day" | "month" | "year")
    }
  
    const handlePrevious = () => {
      switch (filterType) {
        case "day":
          setDate(subDays(date, 1))
          break
        case "month":
          setDate(subMonths(date, 1))
          break
        case "year":
          setDate(subYears(date, 1))
          break
      }
    }
  
    const handleNext = () => {
      switch (filterType) {
        case "day":
          setDate(addDays(date, 1))
          break
        case "month":
          setDate(addMonths(date, 1))
          break
        case "year":
          setDate(addYears(date, 1))
          break
      }
    }
  
    const formatDate = () => {
      switch (filterType) {
        case "day":
          return format(date, "PPP")
        case "month":
          return format(date, "MMMM yyyy")
        case "year":
          return format(date, "yyyy")
      }
    }
  
    return (
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Select onValueChange={handleFilterTypeChange} defaultValue={filterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous {filterType}</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next {filterType}</span>
          </Button>
        </div>
      </div>
    )
  }
  