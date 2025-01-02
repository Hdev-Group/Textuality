"use client";
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const TicketAuthWrapper = ({ children, ticketID }) => {
  const { userId, isLoaded, isSignedIn } = useAuth(); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); 

  const getTicket = useQuery(api.support.getTicketsbyID, { _id: ticketID });

  useEffect(() => {
    if (isLoaded && getTicket) {
      if (getTicket?.[0]?.userId === userId) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [isLoaded, getTicket, userId]);

  if (!isLoaded || isLoading) {
    return <IsLoadedEdge />;
  }

  if (authChecked && !isAuthorized) {
    return <IsAuthorizedEdge />;
  }
  return <>{children}</>;
};

export default TicketAuthWrapper;
