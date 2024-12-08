"use client"
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { BellDotIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import { DashboardSummary, QuickActions, TicketsTable, RecentActivity, AssignedTickets } from "@/components/staff/staffcomp";

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
        <body className="flex bgmain flex-col min-h-screen w-full items-center justify-center">
        <div className="flex items-center flex-col justify-center w-full">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-1 mb-8">
              <h1 className="text-4xl font-bold text-white">Welcome {user?.user?.firstName},</h1>
              <p className="text-muted-foreground text-md">You are a <b>Senior Developer</b> at the <b>Hdev Group</b>.</p>
            </div>
            <div className="flex flex-col gap-6">
            <div className=" flex flex-col">
              <div className="flex flex-row items-end justify-between w-full mb-4">
                <h2 className="text-2xl font-bold text-white">Tickets</h2>
                <Button className="font-semibold" size="sm" onClick={() => NotificationPrompt()}>
                  <BellDotIcon className="w-5 h-5 mr-2" /> Get Notified
                </Button>
              </div>
              <div className="gap-6 flex-col flex">
                <p className="text-muted-foreground">There are currently <b>{tickets?.filter(ticket => ticket.status !== "closed" && !ticket.staffid).length}</b> unassigned tickets.</p>
                <TicketsTable tickets={tickets} />   
                <h2 className="text-2xl font-bold text-white">Assigned Tickets</h2> 
                <AssignedTickets tickets={tickets} staffid={user?.user?.id} />
              </div>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <QuickActions />
                    <DashboardSummary tickets={tickets} />
                    <RecentActivity />
                </div>
            </div>            
          </main>
        </div>
      </body>
    )
}

