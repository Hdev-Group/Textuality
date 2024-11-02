import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api';
import { useState, useEffect } from 'react';

export const DoesExist = ({children, _fileid}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [doesExist, setDoesExist] = useState(false);
    const getContent = useQuery(api.content.getContentSpecific, { _id: _fileid});

    useEffect(() => {
        if (getContent) {
            if (getContent) {
                setDoesExist(true);
            }
            setIsLoading(false);
        }
    }, [getContent]);
    
    return <>{children}</>;
    }
