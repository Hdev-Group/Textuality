"use client"
import {use, useState} from 'react';
import AppHeader from '@/components/header/appheader';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import { useAuth } from '@clerk/clerk-react';
import { IsAuthorizedEdge, IsLoadedEdge } from '@/components/edgecases/Auth';
import { useMutation, useQuery } from 'convex/react';
import { api} from '../../../../../convex/_generated/api';
import AuthWrapper from '../withAuth';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Page({ params }: { params: any, _teamid: any }) {
    const { _teamid }: {_teamid: any} = use(params)
    const router = useRouter()
    const user = useAuth()
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getPage = useQuery(api.page.getPage, { _id: _teamid });

    const { userId, isLoaded, isSignedIn } = useAuth();
    useEffect(() => {
        if (getPage?.users?.includes(userId as string)) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      }, [userId, getPage, getPage?.users]);
    if (!isLoaded) {
        return <IsLoadedEdge />;
      }
      if (!isAuthorized) {
        return <IsAuthorizedEdge />;
      }

    return(
        <body>
            <AuthWrapper _teamid={_teamid}>
            <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
            <AppHeader activesection="content" teamid={_teamid} />
                <main className="mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-y-auto h-full">
                <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg overflow-y-auto">
                    <div className="flex">
                        <div className="w-1/4 border-r dark:border-gray-800">
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-4">Content</h2>
                                <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start">
                                    Pages
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                </Button>

                            </div>
                        </div>
                        </div>
                            <div className="w-full flex-col flex">
                                <div className='border-b p-6 items-center justify-between flex'>
                                    <h1 className="text-2xl font-bold">Test</h1>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="default"  className='gap-2'>
                                                New Entry
                                                <ChevronDown className="ml-auto h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </DropdownMenu>
                                </div>
                                <div className='p-6'>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            </AuthWrapper>
        </body>
    )
}
