"use client"

import AppHeader from "@/components/header/appheader"
import AuthWrapper from "../withAuth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChartArea } from "lucide-react"


export default function AnalyticsHome({ params }: { params: { _teamid: string} }){
    const { _teamid: teamid } = params
    return(
        <div>
        <body className='overflow-hidden'>
          <AuthWrapper _teamid={teamid}>
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
          <AppHeader activesection="analytics" teamid={teamid} />
          <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
            <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg space-y-8 h-screen overflow-y-auto pb-32">
          <div className="flex flex-col md:gap-0 gap-5 w-full justify-between">
            <div className="p-8 flex flex-row w-full border-b">
                <div className="flex flex-row w-full items-center justify-between">
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <Link href={`/application/${teamid}/analytics/tracknew`}>
                        <Button variant="gradient" className="mt-4 flex items-center justify-center flex-row"><span className="flex flex-row gap-1 items-center justify-center"><ChartArea className="w-5"/> Track New</span></Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col p-8">

            </div>
          </div>
          </div>
          </main>
        </div>
          </AuthWrapper>
        </body>
      </div>
    )
}