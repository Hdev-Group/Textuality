import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { IsAuthorizedEdge, IsLoadedEdge } from "@/components/edgecases/Auth"


export default function CheckpointAuthWrapper({  teamid, children }) {

    const { userId, isLoaded, isSignedIn } = useAuth();

    const getRole = useQuery(api.page.getRoledetail, { externalId: userId ?? '', pageId: teamid })

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
  
    useEffect(() => {
      if (isLoaded && getRole) {
        console.log(getRole)
        // Check if the user is authorized (e.g., if they belong to the team)
        if (getRole?.[0]?.permissions?.includes('owner') || getRole?.[0]?.permissions?.includes('admin') || getRole?.[0]?.permissions?.includes('editor')) {
          setIsAuthorized(true);
        }
        setIsLoading(false);
      }
    }, [isLoaded, getRole, userId]);
  
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
