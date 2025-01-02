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

  const getUserQuery = useQuery<any>(api.users.getUsersAndRoles, {
      pageId: teamid,
      externalId: user?.id,
  });
  const getUser = getUserQuery?.data;

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