"use client";
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const AuthWrapper = ({ children, _teamid }) => {
  const { userId, isLoaded, isSignedIn } = useAuth(); // Clerk auth data
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Track if auth has been checked

  // Fetch the page or team data based on team ID
  const getPage = useQuery(api.page.getPage, { _id: _teamid });

  useEffect(() => {
    if (isLoaded && getPage) {
      // Check if the user is authorized (e.g., if they belong to the team)
      if (getPage?.users?.includes(userId)) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
      setAuthChecked(true); // Mark the auth check as complete
    }
  }, [isLoaded, getPage, userId]);

  // Show loading state if data or auth is not yet loaded
  if (!isLoaded || isLoading) {
    return <IsLoadedEdge />;
  }

  if (authChecked && !isAuthorized) {
    return <IsAuthorizedEdge />;
  }
  return <div className='overflow-y-hidden'>{children}</div>;
};

export default AuthWrapper;
