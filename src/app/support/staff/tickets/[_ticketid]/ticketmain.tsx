"use client"
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import StaffOnlyWrapper from "../../StaffOnlyWrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stat } from "fs";
const staffImages = [
  { name: "Textuality Support", imageUrl: "/supporticons/support.png", department: "Support" },
  { name: "Textuality Development", imageUrl: "/supporticons/developer.png", department: "Development" },
  { name: "Textuality Management", imageUrl: "/supporticons/manager.png", department: "Management" },
  { name: "Textuality Executive", imageUrl: "/supporticons/executive.png", department: "Executive" },
  { name: "Textuality Legal", imageUrl: "/supporticons/legal.png", department: "Legal" }, 
];
export default function StaffTicketView({params}: {params: any}) {
    const getTicket = useQuery(api.support.getTicketsbyID, { _id: params });
    const sendUserMessage = useMutation(api.support.sendUserMessage);
    const ticket = getTicket?.[0];
    const staffIds = Array.isArray(ticket?.staffid) ? ticket.staffid.filter(id => id) : [ticket?.staffid].filter(id => id);
    const getStaffer = useQuery(api.staff.getStaff, { staffIds: staffIds.length > 0 ? staffIds : [] });
    const staffDataRoleInfo = getStaffer || [];
    const getStaffData = staffDataRoleInfo && staffDataRoleInfo[0];
    const ticketmessages = useQuery(api.support.getMessages, { ticketID: params });
    const selfAssignTicket = useMutation(api.support.selfAssignTicket);
    const changeTicketStatus = useMutation(api.support.changeTicketStatus);
    const changeTicketPriority = useMutation(api.support.changeTicketPriority);
    const user = useUser();
    const router = useRouter();
    const [userdata, setUserdata] = useState<any[]>([]);
    const [staffdata, setStaffdata] = useState<any[]>([]);
    useEffect(() => {
        if (ticket?.userId) {
            fetch("/api/secure/staff/support-get-user?userId=" + ticket.userId)
                .then((res) => res.json())
                .then((data) => {
                    setUserdata([data]);
                });
        }
    }, [ticket?.userId]);

    useEffect(() => {
        if (Array.isArray(ticket?.staffid) && ticket?.staffid.length > 0) {
            fetch("/api/secure/staff/support-get-user?userId=" + ticket?.staffid)
                .then((res) => res.json())
                .then((data) => {
                    setStaffdata([data]);
                });
        }
    }, [ticket?.staffid]);

    const data = userdata[0]?.users?.[0];

    function sendMessage({ value }) {
      fetch("/api/support/restricted/email/startsupport", {
        method: "POST",
        body: JSON.stringify({
          email: data?.emailAddresses,
          firstname: data?.firstName,
          lastname: data?.lastName,
          title: ticket?.title,
          description: value,
          datetime: new Date().toLocaleDateString(),
          imageUrl: staffImages.find((image) => image.department === getStaffData?.department)?.imageUrl,
          type: "staffresponse",
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SECURE_TOKEN}`,
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data));  
        sendUserMessage({ 
          ticketID: params, 
          message: value,
          userId: user.user.id,
          isStaff: true
        });
      }
      const checkifassigned = ticket?.staffid?.includes(user?.user?.id);
      function selfAssign() {
        selfAssignTicket({ _id: params, staffID: user?.user.id });
      }

      function statusChanger({ value }) {
        fetch("/api/support/restricted/email/startsupport", {
          method: "POST",
          body: JSON.stringify({
            email: data?.emailAddresses,
            firstname: data?.firstName,
            lastname: data?.lastName,
            title: ticket?.title,
            description: `Your ticket status has been changed to ${value}`,
            datetime: new Date().toLocaleDateString(),
            imageUrl: staffImages.find((image) => image.department === getStaffData?.department)?.imageUrl,
            type: "statuschange",
            status: value,
            priority: ticket?.priority,
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SECURE_TOKEN}`,
          },
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
        changeTicketStatus({ _id: params, status: value });
      }
      function priorityChanger({ value }) {
        fetch("/api/support/restricted/email/startsupport", {
          method: "POST",
          body: JSON.stringify({
            email: data?.emailAddresses,
            firstname: data?.firstName,
            lastname: data?.lastName,
            title: ticket?.title,
            description: `Your ticket priority has been changed to ${value}`,
            datetime: new Date().toLocaleDateString(),
            imageUrl: staffImages.find((image) => image.department === getStaffData?.department)?.imageUrl,
            type: "prioritychange",
            status: ticket?.status,
            priority: value,
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SECURE_TOKEN}`,
          },
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
        changeTicketPriority({ _id: params, priority: value });
      }
      
      // check if the staff member is assigned to the ticket
      const isAssigned = ticket?.staffid?.includes(user?.user?.id);


    return (
      <StaffOnlyWrapper>
        <div className={`flex bgmain flex-col min-h-screen w-full items-center justify-center`}>
        <div className="flex items-center justify-center">
          <div className="w-full flex items-center justify-center flex-col h-full rounded-sm">
            <Header />
            <div className="flex flex-col w-full items-center pb-10 min-h-screen">
              <div className="flex flex-col h-auto w-full gap-4 mt-12">
                <div className="flex flex-row w-full justify-between pb-10 items-center border-b">
                  <div className="flex flex-row mx-auto container">
                    <div className="flex flex-row w-full justify-between">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Staff Ticket Center</h1>
                        <p className="text-sm text-muted-foreground">Respond to tickets and requests here.</p>
                      </div>
                      <div className="flex flex-row gap-5">
                        {!checkifassigned && (
                        <Button onClick={() => selfAssign()} variant="secondary">Self Assign</Button>
                        )}
                        <Button onClick={() => router.push("/support/staff")}>View all Tickets</Button>
                      </div>
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
                    <div className="flex flex-col md:flex-row gap-5 w-full mt-5">
                    <div className="w-full flex flex-col">
                      <div className="border border-muted/50 rounded-md bg-muted/30">
                        <div className="flex flex-col">
                          <div className="border-b flex flex-row gap-3 pl-2">
                            <img src={data?.imageUrl} alt="User" className="w-9 h-9 mt-6 mx-2 rounded-full" />
                            <div className="flex flex-col py-6 pr-4 gap-2 w-full">
                              <div className="flex flex-row justify-between w-full">
                                <span className="text-sm font-semibold">{data?.firstName} {data?.lastName}</span>
                                <span className="text-sm text-muted-foreground">{new Date(ticket?._creationTime).toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              <div className="flex flex-col gap-2">
                                <p className="text-sm ">{ticket?.content}</p>
                              </div>
                            </div>
                          </div>
                          {
                              ticketmessages?.map((message) => {
                                  if (message.isstaff === false) {
                                      return <UserTicket ticket={message} user={data} />;
                                  } else {
                                      const staffMember = staffDataRoleInfo.find(staff => staff.staffId === message.userId);
                                      const staffMemberData = staffdata?.[0]?.users?.find(user => user.id === message.userId);
                                      return <StaffTicket ticket={message} staffinfo={staffMember} staffMemberData={staffMemberData} />;
                                  }
                              })
                          }
                        </div>
                      </div>
                      <div className="mt-5 border border-muted rounded-md w-full">
                      <form className="relative flex w-full" onSubmit={(e) => {
                          e.preventDefault();
                          const messageElement = document.getElementById("replymessage") as HTMLTextAreaElement;
                          sendMessage({ value: messageElement.value });
                          messageElement.value = "";
                          }}>
                          <Textarea placeholder="Write a reply..." disabled={isAssigned} id="replymessage" maxLength={2000} />
                          <Button type="submit" className="absolute bottom-2 right-2" disabled={isAssigned} size="sm">Reply</Button>
                        </form>
                      </div>
                    </div>
                    <div className="relative w-full md:w-1/3 h-auto">
                      <div className="sticky w-full top-20 bg-background px-2 md:pl-12 rounded-md shadow-md">
                        <div className="flex flex-col gap-4">
                          <h2 className="text-lg font-semibold">Ticket Information</h2>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Select defaultValue={ticket?.status} onValueChange={(value) => statusChanger({ value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status"><p className="text-sm font-semibold"><TicketStatus status={ticket?.status} /></p></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open"><TicketStatus status="open" /></SelectItem>
                                <SelectItem value="closed"><TicketStatus status="closed" /></SelectItem>
                                <SelectItem value="pending"><TicketStatus status="pending" /></SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Priority</p>
                            <Select defaultValue={ticket?.priority} onValueChange={(value) => priorityChanger({ value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority"><p className="text-sm font-semibold"><TicketPriority priority={ticket?.priority} /></p></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low"><TicketPriority priority="low" /></SelectItem>
                                <SelectItem value="medium"><TicketPriority priority="medium" /></SelectItem>
                                <SelectItem value="high"><TicketPriority priority="high" /></SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">Opened by</p>
                            <p className="text-sm  flex flex-row items-center gap-2">
                              <img src={data?.imageUrl} alt="User" className="w-4 h-4 rounded-full" />
                              {data?.firstName} {data?.lastName}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {ticket?.staffid?.length > 0 && (
                              <div className="flex flex-col ">
                              <p className="text-sm text-muted-foreground mb-1">Support Agent{ticket.staffid.length > 1 ? "s" : ""}</p>
                              <div className="flex flex-col gap-1">
                              {ticket.staffid.map((id, index) => (
                                <p key={index} className="text-sm flex flex-row items-center gap-2">
                                <img src={staffImages.find(image => image.department === staffDataRoleInfo.find(staff => staff.staffId === id)?.department)?.imageUrl} alt="User" className="w-4 h-4 rounded-full" />
                                {staffdata?.[0]?.users?.find(user => user.id === id)?.firstName} {staffdata?.[0]?.users?.find(user => user.id === id)?.lastName} <span className="text-xs text-muted-foreground"> -  {staffDataRoleInfo.find(staff => staff.staffId === id)?.role}</span>
                                </p>
                              
                              ))}
                              </div>
                              </div>
                            )}
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
    </StaffOnlyWrapper>
    )
}
function UserTicket({ ticket, user }) {
    return(
      <div className="border-b flex flex-row gap-3 pl-2">
        <img src={user?.imageUrl} alt="User" className="w-9 h-9 mt-6 mx-2 rounded-full" />
        <div className="flex flex-col py-6 pr-4 gap-2 w-full">
          <div className="flex flex-row justify-between w-full">
            <span className="text-sm font-semibold">{user?.firstName} {user?.lastName}</span>
            <span className="text-sm text-muted-foreground">{new Date(ticket._creationTime).toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm ">{ticket?.message}</p>
          </div>
        </div>
      </div>
    )
  }
  
  function StaffTicket({ ticket, staffinfo, staffMemberData }) {
    const getstaffinfo = staffImages.find((image) => image.department === staffinfo?.department);

    return(
      <div className="border-b flex flex-row gap-3 pl-2">
        <img src={`${getstaffinfo?.imageUrl}`} alt="User" className="w-9 h-9 mt-6 mx-2 rounded-full" />
        <div className="flex flex-col py-6 pr-4 gap-2 w-full">
          <div className="flex flex-row justify-between w-full">
            <span className="text-sm font-semibold">{getstaffinfo?.name} <span className="text-xs text-muted-foreground">( {staffMemberData?.firstName} {staffMemberData?.lastName} - Only support staff can see this )</span></span>
            <span className="text-sm text-muted-foreground">{new Date(ticket._creationTime).toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm ">{ticket?.message}</p>
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