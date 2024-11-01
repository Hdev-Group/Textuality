"use client"
import AppHeader from "@/components/header/appheader"
import AuthWrapper from '../withAuth'
import React from 'react'
import {api} from '../../../../../convex/_generated/api'
import { useQuery } from "convex/react"
import ComponentCustomization from '@/components/customisation/Componentcust'

export default function Page({ params }: { params: Promise<{ _teamid: string}> }) {
    const { _teamid: teamid } = React.use(params)
    const getPage = useQuery(api.page.getPage, { _id: teamid as any })
    const title = getPage?.title + ' — Components' + ' — Textuality'
    return (
      <body className='overflow-y-hidden'>
        <title>{title}</title>
        <AuthWrapper _teamid={teamid}>
          <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen">
            <AppHeader activesection="components" teamid={teamid} />
            <main className="md:mx-auto md:px-10 py-3 transition-all ">
              <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg h-screen scrollbaredit overflow-y-scroll">
                <ComponentCustomization />
              </div>
            </main>
            </div>
        </AuthWrapper>
        </body>
  );
}