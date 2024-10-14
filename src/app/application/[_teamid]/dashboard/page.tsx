"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Mail, Phone, UserCheck2Icon, BookMarkedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"




interface TeamMember {
    id: string
    firstName: string
    lastName: string
    emailAddresses: string
    phone: string
    role: string
    imageUrl: string
    users: any
  }

export default function Page({params: {_teamid }}: any) {
    const teamid = _teamid;
    const user = useUser();

    const getPage = useQuery(api.page.getPage, { _id: teamid });

    const users = getPage?.users;

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      async function fetchAssigneeData() {
        if (users) {
          try {
            const response = await fetch(`/api/secure/get-user?userId=${users.join(",")}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUserData(data);
          } catch (error) {
            console.error('Error fetching assignee data:', error);
            setUserData(null);
          } finally {
            setIsLoading(false);
          }
        }
      }
  
      fetchAssigneeData();
    }, [users]);

    console.log(userData);

    return (
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <AppHeader activesection="dashboard" />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
              <div>
                <h1 className="text-4xl font-bold">
                    Welcome to {getPage?.title}.
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                </p>
              </div>
              <div className="flex items-s</div>tart">
              </div>
            </div>
  
            <Card className="w-full">
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                    <CardTitle>Latest Blogs</CardTitle>
                    <CardDescription>Manage and view your blogs</CardDescription>
                    </div>
                    <CreateBlog />
                </div>
                </CardHeader>
                <CardContent>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <p className="text-center py-4">No blogs found.</p>
                    <CreateBlog />
                </div>
                </CardContent>
            </Card>

            <TeamMemberList users={userData} isLoading={isLoading} />
            </div>
        </main>
      </div>
    );
}

function TeamMemberList({ users, isLoading }: { users: TeamMember[] | null; isLoading: boolean }) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
useEffect(() => {
    if (users) {
        const mappedUsers = users?.users?.map((user: any) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddresses: user.emailAddresses,
            phone: user.phone,
            role: user.role,
            imageUrl: user.imageUrl
        }));
        setTeamMembers(mappedUsers);
    }
}, [users]);

    // Filter members based on the search query
    const filteredMembers = teamMembers.filter((member) =>
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage and view your team members <br/><span className='font-bold'>{teamMembers.length}/5</span> members invited</CardDescription>
              
            </div>
            <InviteTeamMember />
          </div>
        </CardHeader>
  
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
  
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-neutral-400"></div>
            </div>
          ) : teamMembers.length > 0 ? (
            <ScrollArea className="h-auto rounded-md">
              <div className="flex flex-row gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex min-w-[400px] flex-col items-left w-auto rounded-lg border p-4"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl} alt={`${member.firstName} ${member.lastName}`} />
                        <AvatarFallback>
                          {member?.firstName?.charAt(0) ?? ''}
                          {member?.lastName?.charAt(0) ?? ''}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-lg font-semibold leading-none">
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
  
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center pt-2">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {Array.isArray(member.emailAddresses)
                            ? member.emailAddresses.map((email) => email).join(", ") // Fixing email display logic
                            : member.emailAddresses}
                        </span>
                      </div>
                      <div className="flex items-center pt-2">
                        <UserCheck2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">Owner</span>
                      </div>
                      <div className='pt-2 flex flex-row gap-8'>
                        <Link href={`/author/${member.id}`}>
                          <Button variant="outline" className='text-left px-4 py-0.5 flex w-auto'>
                            <p className="text-xs font-bold text-primary">View Profile</p>
                          </Button>
                        </Link>
                        <Role userid={member.id} onValueChange={(newValue: string) => console.log(newValue)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center py-4">No team members found.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  function CreateBlog() {
    return (
        <Link href='./templates/create-blog-template'>
            <Button>
                <BookMarkedIcon className="mr-2 h-4 w-4" />
                Create Blog
            </Button>
      </Link>
    );
  }
export function Role({ onValueChange, userid }: any) {
  const getRole = useQuery(api.page.getRole, { externalId: userid });
  const role = getRole?.[0]?.permissions[0];

  const handleChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <Select value={role} onValueChange={handleChange} disabled={role === 'owner'}>
      <SelectTrigger>
        <SelectValue className="px-2" />
      </SelectTrigger>
      <SelectContent className="z-50">
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function RoleInvite() {

  const handleChange = (newValue: string) => {
    console.log(newValue);
  }

  return (
    <Select value="member" onValueChange={handleChange} >
      <SelectTrigger className='w-1/3'>
        <SelectValue className="px-2" />
      </SelectTrigger>
      <SelectContent className="z-50">
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
export function InviteTeamMember() {
  return(
    <Dialog>
      <DialogTrigger>
        <div className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 px-4 py-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Invite a new team member to your team</DialogDescription>
        </DialogHeader>
        <div className='flex flex-row gap-2'>
        <Input placeholder="Email Address" />
        <RoleInvite />
        </div>
        <Button>Invite</Button>
      </DialogContent>
    </Dialog>
  )
}