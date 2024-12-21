"use client"

import AppHeader from "@/components/header/appheader"
import AuthWrapper from "../withAuth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears, startOfWeek, eachDayOfInterval } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, AreaChartIcon as ChartArea, ChevronDown } from 'lucide-react'

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
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { jsPDF } from "jspdf";

// Helper function to generate random data
const generateRandomData = (date: Date, filterType: "day" | "week" | "month" | "year") => {
  const generateDailyData = (date: Date) => {
    return {
      date: format(date, 'yyyy-MM-dd'),
      views: Math.floor(Math.random() * 500) + 100,
      impressions: Math.floor(Math.random() * 1000) + 200
    }
  }

  switch (filterType) {
    case "day":
      return [generateDailyData(date)]
    case "week":
      return eachDayOfInterval({
        start: startOfWeek(date),
        end: addDays(startOfWeek(date), 6)
      }).map(generateDailyData)
    case "month":
      return eachDayOfInterval({
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
      }).map(generateDailyData)
    case "year":
      return Array.from({ length: 12 }, (_, i) => {
        const monthDate = new Date(date.getFullYear(), i, 1)
        return generateDailyData(monthDate)
      })
  }
}

// Helper function to generate heatmap data
const generateHeatmapData = (date: Date) => {
  const weekStart = startOfWeek(date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
    const dayData = { day }
    for (let hour = 0; hour < 24; hour += 4) {
      dayData[`${hour.toString().padStart(2, '0')}:00`] = Math.floor(Math.random() * 30)
    }
    return dayData
  })
}

export default function AnalyticsHome({ params }: { params: { _teamid: string } }) {
  const { _teamid: teamid } = params
  const teaminfo = useQuery(api.page.getExactPage, { _id: teamid as any });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day")

  const data = useMemo(() => generateRandomData(selectedDate, filterType), [selectedDate, filterType])
  const heatmapData = useMemo(() => generateHeatmapData(selectedDate), [selectedDate])

  const totalViews = useMemo(() => data.reduce((sum, item) => sum + item.views, 0), [data])
  const totalImpressions = useMemo(() => data.reduce((sum, item) => sum + item.impressions, 0), [data])

  return (
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
                        <Button variant="gradient" className="mt-4 flex items-center justify-center flex-row">
                          <span className="flex flex-row gap-1 items-center justify-center">
                            <ChartArea className="w-5"/> Track New
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center py-4 px-8">
                    <div className="flex flex-row">
                      <DateSelector 
                        teaminfo={teaminfo} 
                        date={selectedDate} 
                        setDate={setSelectedDate}
                        filterType={filterType}
                        setFilterType={setFilterType}
                      />
                    </div>
                    <div className="flex flex-row">
                      <ExportButton
                        totalViews={totalViews}
                        totalImpressions={totalImpressions}
                        data={data}
                        heatmapData={heatmapData}
                        selectedDate={selectedDate}
                        filterType={filterType}
                      />
                    </div>
                  </div>
                  {/* Total views, Impressions etc */}
                  <div className="flex flex-row py-4 px-8">
                    <div className="flex flex-row w-full space-x-4">
                      <div className="flex flex-col w-1/3 bg-white dark:bg-neutral-950 border-muted-foreground border rounded-lg shadow-lg p-4">
                        <h1 className="text-lg font-bold">Total Views</h1>
                        <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col w-1/3 bg-white dark:bg-neutral-950 border-muted-foreground border rounded-lg shadow-lg p-4">
                        <h1 className="text-lg font-bold">Impressions</h1>
                        <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>   
                </div>
                {/* Graphs */}
                <div className="flex flex-col space-y-8 px-8">
                  <Card>
                    <CardHeader className="mb-4">
                      <CardTitle>{filterType === 'day' ? 'Hourly' : filterType === 'month' ? 'Daily' : 'Monthly'} Views and Impressions</CardTitle>
                      <CardDescription>Number of views and impressions over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          views: {
                            label: "Views",
                            color: "hsl(var(--chart-1))",
                          },
                          impressions: {
                            label: "Impressions",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px] w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => format(new Date(value), filterType === 'day' ? 'HH:mm' : filterType === 'month' ? 'dd' : 'MMM')}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                            <Line type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity Heatmap</CardTitle>
                      <CardDescription>User activity throughout the week</CardDescription>
                    </CardHeader>
                    <CardContent className="mb-4">
                      <div className="h-[300px] w-full">
                        <ChartContainer
                          config={{
                            views: {
                              label: "Views",
                              color: "hsl(var(--chart-1))",
                            },
                            impressions: {
                              label: "Impressions",
                              color: "hsl(var(--chart-2))",
                            },
                          }}
                          className="h-[300px] w-full"
                                                  >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={heatmapData} className="w-full h-full">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line type="monotone" dataKey="00:00" stroke="hsl(var(--chart-1))" />
                              <Line type="monotone" dataKey="04:00" stroke="hsl(var(--chart-2))" />
                              <Line type="monotone" dataKey="08:00" stroke="hsl(var(--chart-3))" />
                              <Line type="monotone" dataKey="12:00" stroke="hsl(var(--chart-4))" />
                              <Line type="monotone" dataKey="16:00" stroke="hsl(var(--chart-5))" />
                              <Line type="monotone" dataKey="20:00" stroke="hsl(var(--chart-6))" />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </AuthWrapper>
      </body>
    </div>
  )
}

function DateSelector({
  teaminfo,
  date,
  setDate,
  filterType,
  setFilterType
}: {
  teaminfo: any;
  date: Date;
  setDate: (date: Date) => void;
  filterType: "day" | "week" | "month" | "year";
  setFilterType: (filterType: "day" | "week" | "month" | "year") => void;
}) {
  const createdatday = new Date(teaminfo?._creationTime)

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
  }

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value as "day" | "week" | "month" | "year")
  }

  const handlePrevious = () => {
    switch (filterType) {
      case "day":
        if (subDays(date, 1) < new Date(createdatday)) return  
        setDate(subDays(date, 1))
        break
      case "week":
        if (subDays(date, 7) < new Date(createdatday)) return
        setDate(subDays(date, 7))
        break
      case "month":
        if (subMonths(date, 1) < new Date(createdatday)) return
        setDate(subMonths(date, 1))
        break
      case "year":
        if (subYears(date, 1) < new Date(createdatday)) return
        setDate(subYears(date, 1))
        break
    }
  }

  const handleNext = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    switch (filterType) {
      case "day":
        if (date >= today) return
        setDate(addDays(date, 1))
        break
      case "week":
        if (addDays(date, 7) > today) return
        setDate(addDays(date, 7))
        break
      case "month":
        if (addMonths(date, 1) > today) return
        setDate(addMonths(date, 1))
        break
      case "year":
        if (addYears(date, 1) > today) return
        setDate(addYears(date, 1))
        break
    }
  }

  const formatDate = () => {
    switch (filterType) {
      case "day":
        return format(date, "PPP")
      case "week":
        return `${format(startOfWeek(date), "PPP")} - ${format(addDays(startOfWeek(date), 6), "PPP")}`
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
          <SelectItem value="week">Week</SelectItem>
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
              disabled={(date) =>
                date > new Date() || date < new Date(createdatday)
              }
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
import { saveAs } from "file-saver";
function ExportButton({
  totalViews,
  totalImpressions,
  data,
  heatmapData,
  selectedDate,
  filterType,
}: {
  totalViews: number;
  totalImpressions: number;
  data: any[];
  heatmapData: any[];
  selectedDate: Date;
  filterType: "day" | "week" | "month" | "year";
}) {
  function dataExport({
    totalViews,
    totalImpressions,
    data,
    heatmapData,
    selectedDate,
    filterType,
    typeExport
  }: {
    totalViews: number;
    totalImpressions: number;
    data: any[];
    heatmapData: any[];
    selectedDate: Date;
    filterType: "day" | "week" | "month" | "year";
    typeExport: "JSON" | "CSV" | "PDF";
  }) {
    // Combine all data into a single object or structured format
    const exportData = {
      summary: {
        totalViews,
        totalImpressions,
        selectedDate: selectedDate.toISOString(),
        filterType,
      },
      details: data,
      heatmap: heatmapData,
    };

    if (typeExport === "JSON"){
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      saveAs(blob, `exported-data-${selectedDate.toISOString()}.json`);
    } else if (typeExport === "CSV") {
      const csvString = data.map((item) => `${item.date},${item.views},${item.impressions}`).join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      saveAs(blob, `exported-data-${selectedDate.toISOString()}.csv`);
    } else if (typeExport === "PDF") {
          const doc = new jsPDF();
          doc.text("Summary:", 10, 10);
          doc.text(`Total Views: ${totalViews}`, 10, 20);
          doc.text(`Total Impressions: ${totalImpressions}`, 10, 30);
          doc.text(`Selected Date: ${selectedDate.toISOString()}`, 10, 40);
          doc.text(`Filter Type: ${filterType}`, 10, 50);

          doc.text("Details:", 10, 70);
          data.forEach((item, index) => {
            doc.text(
              `Date: ${item.date}, Views: ${item.views}, Impressions: ${item.impressions}`,
              10,
              80 + index * 10
            );
          });

          if (filterType !== "year"){
          doc.text("Heatmap:", 10, 150);
          heatmapData.forEach((item, index) => {
            const heatmapLine = `${item.day}: ${Object.entries(item)
              .map(([time, value]) => `${time}: ${value}`)
              .join(", ")}`;
            doc.text(heatmapLine, 10, 160 + index * 10);
          });
        }

        doc.save(`exported-data-${selectedDate.toISOString()}.pdf`);
      }

  }
  return (
    <Select onValueChange={(value) => dataExport({ totalViews, totalImpressions, data, heatmapData, selectedDate, filterType, typeExport: value === "JSON" ? "JSON" : value === "CSV" ? "CSV" : "PDF" })}>
      <SelectTrigger className="w-44">
      Export Data as <SelectValue />
      </SelectTrigger>
      <SelectContent>
      <SelectItem value="JSON"
      >JSON</SelectItem>
      <SelectItem 
      value="CSV"
      >CSV</SelectItem>
      <SelectItem 
      value="PDF"
      >PDF</SelectItem>
      </SelectContent>
    </Select>
  );
}