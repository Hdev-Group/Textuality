"use client"
import { useUser } from "@clerk/clerk-react";
import HomeHeader from "@/components/header/homeheader";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";


export default function Team(){
    const { user } = useUser();
    
    return(
        <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
        <HomeHeader activesection="teams" />
        <main className="mx-auto px-10 py-8">
          <div className="bg-white h-screen dark:bg-neutral-950 rounded-lg shadow-lg p-8 space-y-8">
            <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
                <div>
                    <h1 className="text-4xl font-bold">{user?.firstName}, Here are your teams</h1>
                </div>
                <div className="flex items-start">
                  <CreateTeam />
                </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Teams</h2>
              <div className="flex p-2 rounded-xl items-start bg-neutral-100 dark:bg-neutral-900 flex-wrap gap-6">

              </div>
            </div>
          </div>
        </main>
      </div>
    )
}
function CreateTeam(){
    return(
        <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:flex items-center gap-1.5 mr-2">
                <ArrowUp className="h-4 w-4" />
                <span>Create a new team</span>
            </Button>
        </div>
    )
}