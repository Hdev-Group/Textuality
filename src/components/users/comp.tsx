import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
  } from "@/components/ui/select";
  import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from 'convex/react';
import { useUser } from "@clerk/clerk-react";
import { api} from '../../../convex/_generated/api';
import { Button } from "@/components/ui/button"
import { UserPlus} from "lucide-react"
import { useState } from 'react';
import rolesConfig from '../../config/rolesConfig.json';


type RoleProps = {
    onValueChange: (value: string) => void;
    userid: string;
    teamid: string;
};
export function Role({ onValueChange, userid, teamid }: RoleProps) {
  
    const getRole = useQuery(api.page.getRoledetail, { externalId: userid, pageId: teamid });
    const role = getRole?.[0]?.permissions[0] || ''; // Ensure there's a fallback
    const { user } = useUser();

    const { data: getUser } = useQuery<any>(api.users.getUsersAndRoles, {
        pageId: teamid,
        externalId: user?.id,
    });

    const updatingUserRole = getUser?.roles?.[0]?.permissions[0];

    const handleChange = (newValue: string) => {
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    const isDisabled = (itemRole: string) => {
        return rolesConfig[updatingUserRole as keyof typeof rolesConfig]?.includes(itemRole);
    };

    return (
        <Select value={role} onValueChange={handleChange} disabled={role === 'owner'}>
            <SelectTrigger>
                <SelectValue className="px-2 w-1/2" />
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
  } from "@/components/ui/dialog";
export function InviteTeamMember(getPage: any) {
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
    console.log(email, role);
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
        <RoleInvite value="" onValueChange={() => {}} teamid={getPage?.getPage?._id} />
      </div>
      <DialogTrigger>
        <Button type='submit' className='w-full'>Invite</Button>
      </DialogTrigger>
      </form>
    </DialogContent>
    </Dialog>
  );
  }
  
  function RoleInvite({ teamid, value }: any) {
  const [role, setRole] = useState("contributor");
  const { user } = useUser();
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
    <Select value={role || ''} onValueChange={onValueChange} disabled={role === 'owner'}>
    <SelectTrigger className='w-1/2'>
      <SelectValue className="px-2" />
    </SelectTrigger>
    <SelectContent className="z-50"></SelectContent>
      <SelectGroup>
      <SelectLabel>Role</SelectLabel>
      <SelectItem value="contributor" disabled={isDisabled('contributor')}>Contributor</SelectItem>
      <SelectItem value="author" disabled={isDisabled('author')}>Author</SelectItem>
      <SelectItem value="editor" disabled={isDisabled('editor')}>Editor</SelectItem>
      <SelectItem value="admin" disabled={isDisabled('admin')}>Admin</SelectItem>
      <SelectItem value="owner" disabled={isDisabled('owner')}>Owner</SelectItem>
      </SelectGroup>
    </Select>
  );
  }
