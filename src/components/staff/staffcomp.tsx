"use cliet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, CheckCircleIcon, ClockIcon, SettingsIcon,SearchIcon, PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export function DashboardSummary({ tickets }) {

    const responsetimecalc = (tickets) => {
        const totaltime = (Array.isArray(tickets) ? tickets : []).reduce((acc: number, ticket: { responsetime: number, _creationTime: number }) => {
            if (typeof ticket.responsetime === 'number' && typeof ticket._creationTime === 'number' && ticket.responsetime !== undefined) {
                const responseDuration = (ticket.responsetime / 1000) - (ticket._creationTime / 1000);
                return acc + responseDuration;
            }
            return acc;
        }, 0);
        
        const total = tickets?.filter(ticket => ticket.responsetime !== undefined).length;
        const avg = total ? totaltime / total : 0;
        const hours = Math.floor(avg / 3600);
        const minutes = Math.floor((avg % 3600) / 60);
        
        let humanReadable = '';
        
        if (hours > 0 && minutes > 0) {
            humanReadable = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            humanReadable = `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            humanReadable = `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            humanReadable = 'Less than a minute';
        }
        
        return humanReadable;
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.length}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.filter(ticket => ticket.status === "closed").length}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responsetimecalc(tickets)}</div>
            <p className="text-xs text-muted-foreground">-12% from last month</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  export function QuickActions() {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 mt-4">
          <Button className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" /> Create New Ticket
          </Button>
          <Button className="w-full" variant="outline">
            <SearchIcon className="mr-2 h-4 w-4" /> Search Tickets
          </Button>
          <Button className="w-full" variant="outline">
            <SettingsIcon className="mr-2 h-4 w-4" /> Manage Settings
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  export function RecentActivity() {
    const activities = [
      { id: 1, description: "Resolved ticket #1234", time: "2 hours ago" },
      { id: 2, description: "Commented on ticket #5678", time: "4 hours ago" },
      { id: 3, description: "Assigned ticket #9101", time: "1 day ago" },
      { id: 4, description: "Closed ticket #1121", time: "2 days ago" },
    ]
  
    return (
      <Card className="col-span-2">
        <CardHeader className="mb-4">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center flex-row">
                <img src="/IMG_6128.png" alt="Avatar" className="w-8 h-8 rounded-full" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }
export function TicketsTable({ tickets }) {
    const copyId = (id) => (event) => {
        navigator.clipboard.writeText(id);
        const el = event.target;
        el.innerText = 'Copied!';
        setTimeout(() => {
            el.innerText = id.slice(0, 6) + '...';
        }, 1000);
    }
    return (
        <div className="border rounded-md">
                  <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {tickets?.filter(ticket => Array.isArray(ticket.staffid) && ticket.staffid.length === 0).slice(0, 5).map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell className="max-w-5 overflow-hidden cursor-pointer hover:text-green-300" onClick={copyId(ticket._id)}>{ticket._id.slice(0, 6)}...</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{TicketStatus(ticket.status)}</TableCell>
              <TableCell>{TicketPriority(ticket.priority)}</TableCell>
                <TableCell>{ticket.staffid.length > 0 ? ticket.staffid.join(', ') : 'Unassigned'}</TableCell>
              <TableCell>
                <a href={`/support/staff/tickets/${ticket._id}`}>
                  <Button size="sm">View</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </div>
    )
  }

  export function AssignedTickets({ tickets, staffid }) {
    const copyId = (id) => (event) => {
      navigator.clipboard.writeText(id);
      const el = event.target;
      el.innerText = 'Copied!';
      setTimeout(() => {
          el.innerText = id.slice(0, 6) + '...';
      }, 1000);
  }
    return(
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.filter(ticket => Array.isArray(ticket.staffid) && ticket.staffid.includes(staffid)).map((ticket) => (
            <TableRow key={ticket._id}>
            <TableCell className="max-w-5 overflow-hidden cursor-pointer hover:text-green-300" onClick={copyId(ticket._id)}>{ticket._id.slice(0, 6)}...</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{TicketStatus(ticket.status)}</TableCell>
            <TableCell>{TicketPriority(ticket.priority)}</TableCell>
            <TableCell>You</TableCell>
            <TableCell>
              <a href={`/support/staff/tickets/${ticket._id}`}>
                <Button size="sm">View</Button>
              </a>
            </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
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