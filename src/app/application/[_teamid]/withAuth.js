"use client"
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const AuthWrapper = ({ children, _teamid }) => {
  const { userId, isLoaded, isSignedIn } = useAuth(); // Clerk auth data
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the page or team data based on team ID
  const getPage = useQuery(api.page.getPage, { _id: _teamid });

  useEffect(() => {
    if (isLoaded && getPage) {
      // Check if the user is authorized (e.g., if they belong to the team)
      if (getPage?.users?.includes(userId)) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    }
  }, [isLoaded, getPage, userId]);

  // Show loading state if data or auth is not yet loaded
  if (!isLoaded || isLoading) {
    return <IsLoadedEdge />;
  }

  // Show unauthorized state if user is not authorized
  if (!isAuthorized) {
    return <IsAuthorizedEdge />;
  }

  // Render children (i.e., the page content) if the user is authorized
  return <>{children}</>;
};

export default AuthWrapper;
