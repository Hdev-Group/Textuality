"use client";
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const StaffOnlyWrapper = ({ children }) => {
  const { userId, isLoaded, isSignedIn } = useAuth(); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); 

  const checkifstaff = useQuery(api.staff.getStaff, { staffIds: userId ? [userId] : [] });
  console.log(checkifstaff);

  useEffect(() => {
    if (isLoaded && checkifstaff) {
      if (checkifstaff.length > 0) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [isLoaded, checkifstaff, userId]);

  if (!isLoaded || isLoading) {
    return <IsLoadedEdge />;
  }

  if (authChecked && !isAuthorized) {
    return <IsAuthorizedEdge />;
  }
  return <>{children}</>;
};

export default StaffOnlyWrapper;
