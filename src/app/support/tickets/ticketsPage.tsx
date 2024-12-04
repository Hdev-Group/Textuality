"use client"
import { useState } from "react";
import Header from "@/components/header/header";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircleQuestionIcon } from "lucide-react";

export default function TicketsPage() {
    const router = useRouter();
    const user = useUser();
    const checktickets = useQuery(api.support.getTickets, { userId: user.user?.id });
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('lastupdated');

    function filterTickets(tickets) {
        return tickets
            ?.filter((ticket) => {
                if (filter === "all") return true;
                return ticket.status === filter;
            })
            .filter((ticket) => {
                if (!searchQuery) return true;
                return ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .sort(({a, b}: any) => {
                if (sort === "lastupdated") {
                    return new Date(b._lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                } else if (sort === "priority") {
                    const priorityOrder = { high: 1, medium: 2, low: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                } else if (sort === "creation") {
                    return new Date(b._creationTime).getTime() - new Date(a.creationTime).getTime();
                }
                return 0;
            });
    }

    const filteredTickets = filterTickets(checktickets);

    return (
    <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center `}>
        <div className="flex items-center justify-center">
            <div className="w-full flex items-center justify-center flex-col h-full rounded-sm">
                <Header />
                <div className="flex flex-col w-full items-center min-h-screen">
                    <div className="flex flex-col w-full h-auto gap-4 mt-12">
                        <div className="flex flex-row w-full justify-between pb-10 items-center border-b">
                            <div className="flex flex-row mx-auto container">
                                <div className="flex flex-row w-full justify-between">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-3xl font-bold">Support Center</h1>
                                        <p className="text-sm text-muted-foreground">Create and view support tickets for your content.</p>
                                    </div>
                                    <Button onClick={() => router.push("/support/new-request")} >New Ticket</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row w-full mx-auto container">
                            <div className="flex flex-row gap-4">
                                <Input
                                    type="text"
                                    placeholder="Search for help..."
                                    className="z-50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value)} >
                                    <TabsList defaultValue="all">
                                        <TabsTrigger value="all">All</TabsTrigger>
                                        <TabsTrigger value="open">Open</TabsTrigger>
                                        <TabsTrigger value="pending">Pending</TabsTrigger>
                                        <TabsTrigger value="closed">Closed</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Select defaultValue="lastupdated">
                                    <SelectTrigger >
                                        <span>Sort By: <SelectValue /></span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lastupdated">Last Updated</SelectItem>
                                        <SelectItem value="priority">Priority</SelectItem>
                                        <SelectItem value="creation">Creation Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="border border-muted rounded-md mt-2 mx-auto container">
                            <Table>
                                <TableBody>
                                    {
                                        filteredTickets?.length > 0 ? filteredTickets?.map((ticket) => (
                                            <div key={ticket._id} className="h-full py-3 hover:bg-muted/20 transition-all flex flex-row cursor-pointer items-center justify-between" onClick={() => router.push(`/support/tickets/${ticket._id}`)}>
                                                <div className="gap-2 flex flex-row justify-start px-6 h-full w-full items-center">
                                                    <TicketStatus status={ticket.status}/>
                                                    <TicketPriority priority={ticket.priority}/>
                                                    <span className="text-md font-semibold">{ticket.title}</span>
                                                </div>
                                                <div className="gap-2 flex flex-row justify-end px-6 h-full w-full items-center">
                                                    <span className="text-md font-semibold items-center flex flex-row gap-2"><img src={user.user.imageUrl} className="w-6 h-6 rounded-full border" /> {user.user.fullName}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(ticket._creationTime).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )) : 
                                        <div className="flex flex-col items-center justify-center bg-muted/20 w-full h-full py-24">
                                            <div className="border p-3 rounded-lg">
                                                <MessageCircleQuestionIcon className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-2 my-4">
                                                <span className="text-lg font-semibold">No Tickets</span>
                                                <span className="text-md text-muted-foreground">Create a new ticket to get started.</span>
                                            </div>
                                                <Button variant="outline" onClick={() => router.push("/support/new-request")} >New Ticket</Button>
                                        </div>  
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
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