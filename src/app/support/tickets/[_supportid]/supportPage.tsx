"use client"
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TicketAuthWrapper from "../../isAllowed"
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useUser } from "@clerk/clerk-react";


export default function SupportPage({supportid}) {
  const getTicket = useQuery(api.support.getTicketsbyID, { _id: supportid });
  const ticket = getTicket?.[0];
  const user = useUser();
  const router = useRouter();
  return (
    <TicketAuthWrapper ticketID={supportid}>
      <div className={`flex bgmain flex-col min-h-screen w-full items-center justify-center`}>
        <div className="flex items-center justify-center">
          <div className="w-full flex items-center justify-center flex-col h-full rounded-sm">
            <Header />
            <div className="flex flex-col w-full items-center min-h-screen">
              <div className="flex flex-col h-auto w-full gap-4 mt-12">
                <div className="flex flex-row w-full justify-between pb-10 items-center border-b">
                  <div className="flex flex-row mx-auto container">
                    <div className="flex flex-row w-full justify-between">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Support Center</h1>
                        <p className="text-sm text-muted-foreground">Create and view support tickets for your content.</p>
                      </div>
                      <Button onClick={() => router.push("/support/tickets")}>View all Tickets</Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full mx-auto mt-8 container">
                  <div className="flex flex-col gap-4 w-full h-full">
                    <div className="flex flex-col gap-2 w-full items-start justify-start">
                      <h1 className="text-2xl font-semibold">{ticket?.title}</h1>
                      <div className="flex flex-row gap-1 text-sm text-muted-foreground">
                        <p>Last updated: {new Date(ticket?.lastUpdated).toLocaleDateString()}</p>
                        ·
                        <p>Opened: {new Date(ticket?._creationTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                    <div className="flex flex-row gap-5 w-full mt-5">
                    <div className="w-full flex flex-col">
                      <div className="border border-muted/50 rounded-md bg-muted/30 h-full">
                        <div className="flex flex-col">
                          <UserTicket ticket={ticket} user={user} />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-1/3 h-auto">
                      <div className="sticky w-full top-20 bg-background pl-12 rounded-md shadow-md">
                        <div className="flex flex-col gap-4">
                          <h2 className="text-lg font-semibold">Ticket Information</h2>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-sm font-semibold"><TicketStatus status={ticket?.status} /></p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Priority</p>
                            <p className="text-sm font-semibold"><TicketPriority priority={ticket?.priority} /></p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Opened by</p>
                            <p className="text-sm  flex flex-row items-center gap-2">
                              <img src={user?.user?.imageUrl} alt="User" className="w-4 h-4 rounded-full" />
                              {user?.user?.firstName} {user?.user?.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TicketAuthWrapper>
  );
}
function UserTicket({ ticket, user }) {
  return(
    <div className="border-b flex flex-row gap-3">
      <img src={user.user.imageUrl} alt="User" className="w-9 h-9 mt-6 mx-2 rounded-full" />
      <div className="flex flex-col py-6 pr-4 gap-2 w-full">
        <div className="flex flex-row justify-between w-full">
          <span className="text-sm font-semibold">{user.user.firstName} {user.user.lastName}</span>
          <span className="text-sm text-muted-foreground">{new Date(ticket._creationTime).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm ">{ticket.content}</p>
        </div>
      </div>
    </div>
  )
}
function TicketPriority({ priority }) {
  if (priority === "low") {
      return <span className="text-xs bg-blue-400/20 text-blue-400  font-semibold  px-2 py-1 rounded-full">Low</span>
  } else if (priority === "medium") {
      return <span className="text-xs bg-yellow-400/20 text-yellow-400  font-semibold  px-2 py-1 rounded-full">Medium</span>
  } else {
      return <span className="text-xs bg-red-400/20 text-red-400 font-semibold px-2 py-1 rounded-full">High</span>
  }
}

function TicketStatus({ status }) {
  if (status === "open") {
      return <span className="text-xs bg-green-400/20 text-green-400  font-semibold  px-2 py-1 rounded-full">Open</span>
  } else if (status === "closed") {
      return <span className="text-xs bg-red-400/20 text-red-400  font-semibold  px-2 py-1 rounded-full">Closed</span>
  } else {
      return <span className="text-xs bg-yellow-400/20 text-yellow-400 font-semibold px-2 py-1 rounded-full">Pending</span>
  }
}