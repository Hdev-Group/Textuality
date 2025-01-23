import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon, Clock, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useState, useEffect } from 'react'
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"


export default function ScheduleChangeOpen({ isOpen, onClose, _id, scheduleInfo, Blocking }: { isOpen: boolean, onClose(), _id: string, scheduleInfo: any, Blocking: boolean }) {
    const scheduleInfoUpdate = useMutation(api.content.schedulecontent)
    const deleteSchedule = useMutation(api.content.deleteschedule)
    const updateContentStatus = useMutation(api.content.updateContentStatus);
    const [date, setDate] = React.useState<Date>(scheduleInfo ? new Date(scheduleInfo) : new Date())
    const [time, setTime] = React.useState<string>(scheduleInfo ? format(new Date(scheduleInfo), "HH:mm") : "00:00")
    useEffect(() => {
        if (scheduleInfo) {
            const date = new Date(scheduleInfo);
            setTime(format(date, "HH:mm"));
        }
    }, [scheduleInfo]);

    useEffect(() => {
        const modal = document.getElementById("modal-overlay");
        if (!modal) return;
        // if clicked on backdrop, close modal
        const handleClick = (e: MouseEvent) => {
            if (e.target === modal) {
                onClose();
            }
        }
        modal.addEventListener("click", handleClick);
        return () => {
            modal.removeEventListener("click", handleClick);
        }
    }, [onClose])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const selectedDate = date || new Date();
          const selectedTime = time || "00:00";
          const [hours, minutes] = selectedTime.split(":").map(Number);
          const selectedDateTime = new Date(selectedDate);
          selectedDateTime.setHours(hours, minutes, 0, 0);
          const returner = await scheduleInfoUpdate({ _id: _id as any, scheduled: selectedDateTime.getTime() });
          await returner;
          if (returner) {
              onClose();
          } else {
              console.log("Error scheduling content");
          }
        } catch (error) {
          console.error("Error scheduling content:", error);
        }
      }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    function deleteSchedules() {
        deleteSchedule({ _id: _id as any });
        onClose();
    }

    function alterPushing({status}) {
        deleteSchedule({ _id: _id as any });
        updateContentStatus({                 
            _id: _id as any,
            status: status,
        });
        onClose();
    }

    return(
        <>
            {isOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex z-50 items-center justify-center p-4" id="modal-overlay">
            <div className="bg-background border rounded-lg shadow-xl z-50 max-w-md w-full">
            <div className="p-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-1">Edit Schedule</h2>
                        <p className="mb-4 text-sm text-muted-foreground">Choose a date and time for your content.</p>
                    </div>
                    <Button onClick={onClose} variant="outline"><X className="h-4 w-4" /> </Button>
                </div>
            <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-1">
                <Label htmlFor="date" className="text-right">
                    Date
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                            if (selectedDate && selectedDate >= new Date()) {
                                setDate(selectedDate)
                            }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                </div>
                <div className="flex flex-col items-start mb-4 gap-1">
                <Label htmlFor="time" className="text-right">
                    Time
                </Label>
                <Select onValueChange={setTime} defaultValue={time}>
                    <SelectTrigger 
                    id="time" 
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <SelectValue placeholder="Select a time" defaultValue={time}>
                        {time}
                    </SelectValue>
                    </SelectTrigger>
                    <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                        const currentTime = new Date()
                        const selectedDate = date || new Date()
                        const isPastTime = selectedDate.setHours(hour, 0, 0, 0) < currentTime.getTime()
                        return (
                        <SelectItem 
                            key={hour} 
                            value={`${hour}:00`}
                            onSelect={(e) => e.preventDefault()}
                            disabled={isPastTime}
                        >
                            {`${hour.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                        )
                    })}
                    </SelectContent>
                </Select>
                </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline">Other</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="gap-2 flex flex-col">
                        <Button variant="destructive" onClick={() => deleteSchedules()}>Delete Schedule</Button>
                        {Blocking ? (
                                <Button className="bg-purple-700 text-white" onClick={() => alterPushing({status: "Review"})}>Send to review</Button>
                            ) : (
                                <Button variant="publish" onClick={() => alterPushing({status: "Published"})}>Publish</Button>
                            )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button type="submit">Edit Schedule</Button>
            </div>
            </form>
              </div>
            </div>
          </div>
        )}
      </>
    )
}