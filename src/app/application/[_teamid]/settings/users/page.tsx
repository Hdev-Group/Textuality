"use client"
import AppHeader from '@/components/header/appheader';
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import {useAuth} from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react';
import { api} from '../../../../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Mail, X, Search, AlertTriangle} from "lucide-react"
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
import {Separator} from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger,  } from "@/components/ui/tabs"

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
import rolesConfig from '../../../../../config/rolesConfig.json';


export default function TeamManagement({ params: { _teamid } }: { params: { _teamid: any } }) {
    const teamid = _teamid;
    const { userId, isLoaded, isSignedIn } = useAuth();
  
    const getPage = useQuery(api.page.getPage, { _id: teamid });
    const getInvites = useQuery(api.page.getPageInvites, { pageId: teamid });
    const cancelInvite = useMutation(api.page.cancelInvite);
    const updateRole = useMutation(api.users.updateRole);
  
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userData, setUserData] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const { toast } = useToast();


  
    // Return early if user is not authorized
    useEffect(() => {
      if (getPage?.users?.includes(userId as string)) {
        setIsAuthorized(true);

        setIsLoading(false);
      }
    }, [userId, getPage, getPage?.users]);

    useEffect(() => {
      async function fetchUserData() {
        if (getPage?.users) {
          try {
            const response = await fetch(`/api/secure/get-user?userId=${getPage.users.join(",")}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUserData(data.users);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData([]);
          } finally {
            setIsLoading(false);
          }
        }
      }
      fetchUserData();
    }, [getPage]);
  
    if (!isLoaded) {
      return (
        <div className="flex items-center flex-col justify-center min-h-screen">
          <div className="flex items-center flex-col justify-center min-h-screen">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground text-center mt-4">Loading.</p>
          </div>
        </div>
      );
    }
    if (!isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full border-red-500 max-w-md">
            <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
              <p>
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              </p>
              <h2 className="text-2xl font-bold mb-2">Not Authorised</h2>
              <p className="text-muted-foreground">
                You are not authorised to access this page. <br />
                <span className="text-xs">Think this is wrong? Contact the page owner.</span>
              </p>
              <a href='/application/home'>
                <Button className="mt-4" variant="outline">Go Home</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      );
    }
  

  
  const CancelInvite = (inviteId: any) => {
      cancelInvite({ _id: inviteId });
      toast({ title: "Success", description: "Invite has been cancelled" });
  };

  const UpdateUserRole = ({ role, userupdate }: { role: string; userupdate: string }) => {
      updateRole({ externalId: userupdate, pageid: teamid, permissions: [role] });
      toast({ title: "Success", description: "Role has been updated" });
  };

  const filteredMembers = userData.filter(
      (member) =>
          (`${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (Array.isArray(member.emailAddresses)
                  ? member.emailAddresses.some((email) =>
                      email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  : member.emailAddresses.toLowerCase().includes(searchQuery.toLowerCase()))) &&
          (roleFilter === "all" || member?.role?.toLowerCase() === roleFilter)
  );

  // Early return for unauthorized access
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full border-red-500 max-w-md">
          <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
            <p><AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" /></p>
            <h2 className="text-2xl font-bold mb-2">Not Authorised</h2>
            <p className="text-muted-foreground">You are not authorised to access this page. <br /> <span className='text-xs'>Think this is wrong? Contact the page owner.</span></p>
            <a href='/application/home'>
              <Button className="mt-4" variant="outline">Go Home</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  
    return (
      <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
        <AppHeader activesection="settings" teamid={teamid} />
        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
          <Card className="w-full border-none shadow-lg ">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-2xl font-bold">Team Members</CardTitle>
                <CardDescription className="mt-1">
                  Manage and view your team members
                  <br />
                  <span className="font-semibold text-primary">
                    {userData.length + (getInvites?.length || 0)}/5 members invited
                  </span>
                </CardDescription>
              </div>
              <InviteTeamMember getPage={getPage} teamid={teamid} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="all" onValueChange={(value) => setRoleFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <Tabs defaultValue="members">
                <TabsList className="mb-4">
                  <TabsTrigger value="members">Team Members</TabsTrigger>
                  <TabsTrigger value="invites">Pending Invites</TabsTrigger>
                </TabsList>
                <TabsContent value="members">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredMembers.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMembers.map((member) => (
                          <Card key={member.id} className="flex flex-col justify-between">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={member.imageUrl} alt={`${member.firstName} ${member.lastName}`} />
                                  <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="mr-2 h-4 w-4" />
                                  <span className="truncate">
                                    {Array.isArray(member.emailAddresses)
                                      ? member.emailAddresses[0]
                                      : member.emailAddresses}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-10 mt-4">
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`/author/${member.id}`}>View Profile</Link>
                                  </Button>
                                  <Role
                                    teamid={teamid}
                                    userid={member.id}
                                    onValueChange={(newValue: string) => UpdateUserRole({role: newValue, userupdate: member.id})}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No team members found.</p>
                  )}
                </TabsContent>
                <TabsContent value="invites">
                  {getInvites && getInvites.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-2">Pending Invites</h2>
                      <p className="text-sm text-muted-foreground mb-4">Manage and view your pending invites</p>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {getInvites.map((invite: any) => (
                          <Card key={invite._id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>{invite.email[0].toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{invite.email}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{invite.role}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => CancelInvite(invite._id)}
                                  aria-label="Cancel invite"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Invitation Pending</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {!getInvites || getInvites.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">No pending invites.</p>
                  )}
                </TabsContent>
              </Tabs>
              <Separator className="my-6" />

            </CardContent>
          </Card>
          
        </main>
      </div>
    )
  }
  
export function Role({ onValueChange, userid, teamid }: any) {
    const getRole = useQuery(api.page.getRole, { externalId: userid });
    const role = getRole?.[0]?.permissions[0];
    const { user } = useUser();
    
    const { data: getUser } = useQuery<any>(api.users.getUsersAndRoles, {
      pageId: teamid,
      externalId: user?.id
    });
    
    const updatingUserRole = getUser?.roles?.[0]?.permissions[0];
  
    // Function to handle the role change
    const handleChange = (newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
  
    // Determine whether a role should be disabled
    const isDisabled = (itemRole: string) => {

      return rolesConfig[updatingUserRole as keyof typeof rolesConfig]?.includes(itemRole);
    };
  
    return (
      <Select value={role} onValueChange={handleChange} disabled={role === 'owner'}>
        <SelectTrigger>
          <SelectValue className="px-2 w-1/2 " />
        </SelectTrigger>
        <SelectContent className="z-50">
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="contributor" disabled={isDisabled('contributor')}>Contributor</SelectItem>
            <SelectItem value="author" disabled={isDisabled('author')}>Author</SelectItem>
            <SelectItem value="editor" disabled={isDisabled('editor')}>Editor</SelectItem>
            <SelectItem value="admin" disabled={isDisabled('admin')}>Admin</SelectItem>
            <SelectItem value="owner" disabled={true}>Owner</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

function RoleInvite({teamid}: any) {
  const [role, setRole] = useState("contributor");
  const {user} = useUser();
  const getUser = useQuery(api.users.getUsersAndRoles, {
    pageId: teamid,
    externalId: user?.id
  });
  
  // Role of the person trying to update roles
  const updatingUserRole = getUser?.roles?.[0]?.permissions[0];
  const onValueChange = (newValue: string) => {
    setRole(newValue);
  };

  const isDisabled = (itemRole: string) => {
  
    // Owners can update any role but the role of owner
    if (updatingUserRole === 'owner') {
      return itemRole === 'owner';
    }
    // If current user's role has restrictions, check if the target role is in the invalid list
    return rolesConfig[updatingUserRole as keyof typeof rolesConfig]?.includes(itemRole);
  };


  return (
    <Select value={role} name='role' onValueChange={onValueChange}>
        <SelectTrigger className='w-1/2'>
          <SelectValue className="px-2" />
        </SelectTrigger>
        <SelectContent className="z-50">
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="contributor" disabled={isDisabled('contributor')}>Contributor</SelectItem>
            <SelectItem value="author" disabled={isDisabled('author')}>Author</SelectItem>
            <SelectItem value="editor" disabled={isDisabled('editor')}>Editor</SelectItem>
            <SelectItem value="admin" disabled={isDisabled('admin')}>Admin</SelectItem>
            <SelectItem value="owner" disabled={isDisabled('owner')}>Owner</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
  );
}

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import HomeHeader from '@/components/header/homeheader';


export  function InviteTeamMember(getPage: any) {
  const { toast } = useToast();
  const user = useUser();
  const invitesender = useMutation(api.page.inviteUser);
  const getUser = useQuery(api.users.getUsersAndRoles, {
    pageId: getPage?.getPage?._id ?? '',
    externalId: user?.user?.id
  });

  if (!user || getUser?.roles[0]?.permissions[0] === 'contributor' || getUser?.roles[0]?.permissions[0] === 'author') {
    return null;
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const form = document.getElementById('formemailer') as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    if (!email || !role) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    fetch(`/api/get-email-user?userEmail=${email}`)
      .then((response) => response.json())
      .then((data) => {
        if (user?.user?.id === data.id) {
          toast({
            title: 'Error',
            description: 'You cannot invite yourself, Or can you?',
            variant: 'destructive',
          });
        } else if (data.error) {
          toast({
            title: 'Error',
            description: 'User does not exist',
            variant: 'destructive',
          });
        } else {
          invitesender({ email: data?.EmailAddress, role: role, pageId: getPage?.getPage?._id, externalId: data?.id });
          toast({
            title: 'Success',
            description: `${data?.firstName ?? ''} ${data?.lastName ?? ''} has been invited to join ${getPage?.getPage?.title} with a role of ${role}.`,
            action: <ToastAction altText="Undo">Undo</ToastAction>,
          });
        }
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Invite a new team member to your team</DialogDescription>
        </DialogHeader>
        <form id='formemailer' onSubmit={handleSubmit} className='flex flex-col gap-5 w-full'>
          <div className='flex flex-row gap-2'>
            <Input placeholder="Email Address" name='email' type='email' />
            <RoleInvite teamid={getPage?.getPage?._id} />
          </div>
          <DialogTrigger>
            <Button type='submit' className='w-full'>Invite</Button>
          </DialogTrigger>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function TeamMemberList({ users, isLoading, getPage, teamid }: { users: any | null; isLoading: boolean, getPage: any, teamid: string }) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const getInvites = useQuery(api.page.getPageInvites, { pageId: teamid });
    const { user } = useUser();
    const cancelInvite = useMutation(api.page.cancelInvite);
    const getUser = useQuery(api.users.getUsersAndRoles, {
      pageId: teamid,
      externalId: user?.id
    });
    const { toast } = useToast();

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

    function capitalise(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function CancelInvite(inviteId: any) {
      cancelInvite({ _id: inviteId });
      toast({
        title: 'Success',
        description: 'Invite has been cancelled',
      });
    }
    const updateRole = useMutation(api.users.updateRole);
    function UpdateUserRole({ role, userupdate }: any) {
      console.log(getUser);
    
      const updatingusersrole = getUser?.roles?.[0]?.permissions[0];
      console.log(updatingusersrole);

    
      if (updatingusersrole !== 'owner') {
      if (rolesConfig[updatingusersrole as keyof typeof rolesConfig]?.includes(role) || user === null) {
        toast({
        title: 'Error',
        description: `You do not have permission to update a user to the ${role} role`,
        variant: 'destructive',
        });
        return;
      }
      }
    
      updateRole({ externalId: userupdate, pageid: teamid, permissions: [role] });
      toast({
      title: 'Success',
      description: 'Role has been updated',
      });
    }
    if (!getInvites){
      return null;
    }
    return (
      <Card className="w-full border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage and view your team members <br/><span className='font-bold'>{teamMembers.length + getInvites?.length}/5</span> members invited</CardDescription>
              
            </div>
            <InviteTeamMember getPage={getPage} />
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
              <div className="flex flex-col gap-4">
                <div className='flex flex-row gap-4'>
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
                            ? member.emailAddresses.map((email) => email).join(", ")
                            : member.emailAddresses}
                        </span>
                      </div>
                      <div className='pt-2 flex flex-row gap-8'>
                        <Link href={`/author/${member.id}`}>
                          <Button variant="outline" className='text-left px-4 py-0.5 flex w-auto'>
                            <p className="text-xs font-bold text-primary">View Profile</p>
                          </Button>
                        </Link>
                        <Role teamid={teamid} userid={member.id} onValueChange={(newValue: string) => UpdateUserRole({role: newValue, userupdate: member.id})} />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                {getInvites.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Pending Invites</h2>
                      <p className="text-sm text-muted-foreground mb-4">Manage and view your pending invites</p>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {getInvites.map((invite) => (
                          <Card key={invite._id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>{invite.email.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{invite.email}</p>
                                    <p className="text-sm text-muted-foreground">{capitalise(invite.role)}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => CancelInvite(invite._id)}
                                  aria-label="Cancel invite"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <UserPlus className="h-4 w-4" />
                                <span>Invitation Pending</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center py-4">No team members found.</p>
          )}
        </CardContent>
      </Card>
    );
  }