"use client"
import { useUser } from "@clerk/clerk-react";
import HomeHeader from "@/components/header/homeheader";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, BookOpen, Users, ArrowRight, Crown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Team() {
  const { user } = useUser();
  const projects = useQuery(api.page.getPages);
  const premiumcheck = useQuery(api.page.getPremiumPages, { userid: user?.id });
  const [premiumProjects, setPremiumProjects] = useState([]);
  console.log(premiumProjects);

  useEffect(() => {
    const fetchPremiumProjects = async () => {
      if (!projects || !premiumcheck?.[0] || !user?.id) return;
  
      try {
        const response = await fetch("/api/premium/getPremiumProjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            premiumcheck,
            projects,
            userId: user.id,
          }),
        });
  
        if (response.ok) {
          const premiumPages = await response.json();
          setPremiumProjects(premiumPages);
        } else {
          console.error("Failed to fetch premium projects:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching premium projects:", error);
      }
    };
  
    fetchPremiumProjects();
  }, [projects, premiumcheck, user?.id]);

    return(
    <div className="overflow-y-hidden">
      <title>Premium | Textuality</title>
    <div className="bg-gradient-to-t z-10 from-purple-700 to-indigo-800/20 h-auto overflow-y-hidden relative">
      <HomeHeader activesection="premium" />
      <main className="md:mx-auto md:px-10 py-3 h-full transition-all relative">
      <div className="bg-gradient-to-t relative from-purple-700 z-50 to-indigo-800/20 h-screen rounded-lg overflow-y-auto p-8 space-y-8" style={{ boxShadow: '0 4px 6px 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.06), inset 0 0 10px rgba(255, 255, 255, 0.5)' }}>
      <div className="w-full h-full inset-0 bgstars"></div>
          <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome to your Premium, {user?.firstName}.
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-200">
            You have 1 upgrade token available. Use it to upgrade a page to premium.
          </p>
        </div>
        </div>
        <div className="flex flex-col md:gap-0 gap-5 mt-5">
          <div className="flex flex-col gap-5 mb-5">
            <h2 className="text-2xl font-bold">Premium Pages</h2>
            <div className="flex flex-col md:flex-row gap-5 w-full">
            {premiumProjects?.map((page) => (
              <PremiumProject
                key={page._id}
                title={page.title}
                description={page.content}
                users={page.users}
                date={page._creationTime}
                category={page.category}
                content={page.content}
                _id={page._id}
                _creationTime={page._creationTime}
                product={page.product}
                premiumlevel={premiumProjects?.[0]?.name}
              />
            ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-row justify-between w-full items-center">
              <h2 className="text-2xl font-bold">Standard Pages</h2>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
    </div>
    )
}
interface ProjectProps {
  title: string;
  description: string;
  users: string[];
  _id: string;
  category: string;
  content: string;
  date: any;
  _creationTime: any;
  product: any;
  premiumlevel: string;
}
interface UserData {
  id: string
  firstName: string
  imageUrl: string
}

export function PremiumProject({
  title,
  description,
  users,
  date,
  category,
  content,
  product,
  _id,
  _creationTime,
  premiumlevel,
}: ProjectProps) {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userCache: { [key: string]: UserData } = {};

  console.log(premiumlevel);
  useEffect(() => {
    async function fetchAssigneeData() {
      if (users && users.length > 0) {
        const usersToFetch = users.filter((user: string) => !userCache[user]);

        if (usersToFetch.length > 0) {
          setIsLoading(true);
          try {
            const response = await fetch(`/api/get-user?userId=${usersToFetch.join(",")}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            data.users.forEach((user: UserData) => {
              userCache[user.id] = user;
            });

            setUserData(users.map((user: string) => userCache[user]));

          } catch (error) {
            console.error("Error fetching assignee data:", error);
            setUserData([]);
          } finally {
            setIsLoading(false);
          }
        } else {
          setUserData(users.map((user: string) => userCache[user]));
        }
      }
    }

    fetchAssigneeData();
  }, [users]);

  const teamMemberCount = users.length;
  const creationDate = new Date(_creationTime);

  return (
<Card 
  key={_id} 
  className="overflow-hidden transition-all hover:shadow-2xl  md:min-w-[30rem] md:w-min w-full 
           border-[1px] border-white/10 backdrop-blur-2xl 
           bg-black bg-opacity-25
           rounded-lg px-4 pb-4">
    <CardHeader className="pb-2 px-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-col">
          <Crown className="w-5 h-5 mr-2 text-yellow-200" />
          <h3 className="text-xl font-bold truncate">{title}</h3>
        </div>
        <Badge variant="secondary" className="font-normal bg-primary/20 text-primary">
          <CalendarDays className="w-3 h-3 mr-1" />
          {new Date(_creationTime).toLocaleDateString()}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="pb-0 px-2">
      <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-primary/80">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-1" />
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>{teamMemberCount} {teamMemberCount === 1 ? "member" : "members"}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex flex-row items-center justify-between mt-4 bg-primary/5">
            <div className="flex flex-row items-center justify-between overflow-hidden">
              {!isLoading && userData.slice(0, 3).map((member, index) => (
                <Avatar key={index} className="w-8 h-8 border-2 border-primary">
                  <AvatarImage src={member.imageUrl} alt={member.firstName} />
                  <AvatarFallback>{member.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {teamMemberCount > 3 && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium border-2 border-primary text-primary">
                  +{teamMemberCount - 3}
                </div>
              )}
            </div>
            <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={`/application/${_id}/dashboard`}>
                <span className="flex flex-row justify-between items-center">View Premium Project <ArrowRight className="w-4 h-4 ml-1" /></span>
              </Link>
            </Button>
          </CardFooter>
  </Card>
  )
}