"use client"
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { BellDotIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useRef } from "react";

export default function DashboardStaff() {
    const user = useUser();

    function NotificationPrompt() {
        if (Notification.permission === 'granted') {
            new Notification('You will now receive notifications for new tickets.', {
                body: 'You will now receive notifications for new tickets.',
                icon: '/IMG_6128.png'
            });
        } else {
            Notification.requestPermission().then(function (permission) {
                if (permission === 'granted') {
                    new Notification('You will now receive notifications for new tickets.', {
                        body: 'You will now receive notifications for new tickets.',
                        icon: '/IMG_6128.png'
                    });
                }
            });
        }
    }
    const previousTickets = useRef([]);
    const tickets = useQuery(api.staff.getTickets);
  
    useEffect(() => {
      if (tickets?.length > previousTickets?.current?.length) {
        if (Notification.permission === 'granted') {
          new Notification('You have a new ticket.', {
            body: 'You have a new ticket.',
            icon: '/IMG_6128.png'
          });
        } else {
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              new Notification('You have a new ticket.', {
                body: 'You have a new ticket.',
                icon: '/IMG_6128.png'
              });
            }
          });
        }
      }
      previousTickets.current = tickets;
    }, [tickets]);


    return (
        <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center`}>
            <div className="flex items-center flex-col justify-center">
                <Header />
                <div className=" h-full w-full z-30 rounded-sm flex items-center justify-center flex-col border-b">
                    <div className="flex flex-col items-start w-full pb-5 mx-auto container justify-center">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-bold text-white mt-10">Welcome {user?.user?.firstName},</h1>
                            <p className="text-muted-foreground text-md">You are a <b>Senior Developer</b> at the <b>Hdev Group</b>.</p>
                        </div>
                    </div>
                </div>
                <div className="h-screen w-full flex items-center flex-col">
                    <div className="flex flex-col items-start w-full pb-5 mx-auto container justify-center">
                        <div className="flex flex-col gap-1 w-full justify-center">
                            <div className="flex flex-row items-end justify-between w-full">
                                <h1 className="text-2xl font-bold text-white mt-10">Tickets</h1>
                                <Button className="font-semibold" size="sm" onClick={() => NotificationPrompt()}><BellDotIcon className="w-5 h-5" /> Get Notified</Button>
                            </div>
                            <p className="text-muted-foreground">There are currently <b>{tickets.filter(ticket => ticket.status !== "closed" && !ticket.staffid).length}</b> unassigned tickets.</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
}