"use client"
import { useUser } from "@clerk/clerk-react";
import HomeHeader from "@/components/header/homeheader";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, BookOpen, Users, ArrowRight, Crown, Sparkles, ArrowLeft, Plus, Minus, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Team() {
  const { user } = useUser();
  const projects = useQuery(api.page.getPages);
  const filteredprojects = projects?.filter((page) => page.users.includes(user?.id));
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
    <div className="bg-gradient-to-t z-10 from-purple-700 to-indigo-800/20 h-auto overflow-y-hidden ">
      <HomeHeader activesection="premium" />
      <main className="md:mx-auto md:px-10 py-3 h-full transition-all ">
      <div className="bg-gradient-to-t  from-purple-700 z-50 to-indigo-800/20 h-screen rounded-lg overflow-y-auto p-8 space-y-8" style={{ boxShadow: '0 4px 6px 1px rgba(0, 0, 0, 0.1), 0 2px 4px 1px rgba(0, 0, 0, 0.06), inset 0 0 10px rgba(255, 255, 255, 0.5)' }}>
      <div className="w-full h-full inset-0 bgstars"></div>
          <div className="flex flex-col md:gap-0 gap-5 md:flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">
            Welcome to your Premium, {user?.firstName}.
          </h1>
          <div className="text-lg text-neutral-600 dark:text-neutral-200 flex flex-row items-center gap-2">
            You have {premiumProjects.length === 0 ? "0 premium tokens, Buy some here:" : `${premiumProjects} upgrade token available. Use it to upgrade a page to premium.` }
            <PlanSender priceId={"price_1Qa17KG1nQ3zP4pJz8fnzYIq"} productid={"prod_RSx1eBHERSrufq"} />
          </div>
        </div>
        </div>
        <div className="flex flex-col md:gap-0 gap-5 mt-5">
          <div className="flex flex-col gap-5 mb-5">
            <h2 className="text-2xl font-bold">Upgraded Pages</h2>
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
                premiumlevel={page.product?.name}
              />
            ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col justify-between w-full">
              <h2 className="text-2xl font-bold">Standard Pages</h2>
              <div className="flex flex-col md:flex-row gap-5 mt-5 w-full">
                {
                  filteredprojects?.filter(page => !premiumProjects.some(premiumPage => premiumPage._id === page._id)).map((page) => (
                  <Project
                    key={page._id}
                    title={page.title}
                    description={page.content}
                    users={page.users}
                    date={page._creationTime}
                    category={page.category}
                    content={page.content}
                    _id={page._id}
                    _creationTime={page._creationTime}
                    product={null}
                    premiumlevel={premiumProjects?.[0]?.name}
                  />
                  ))
                }
              </div>
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

export function Project({
  title,
  description,
  users,
  date,
  category,
  content,
  _id,
  _creationTime,
  product = "Standard",
  premiumlevel = null,
}: ProjectProps) {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userCache: { [key: string]: UserData } = {};

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
    <Card className="overflow-hidden transition-all hover:shadow-lg md:min-w-[30rem] md:w-min w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold truncate">{title}</h3>
          <Badge variant="secondary" className="font-normal">
            <CalendarDays className="w-3 h-3 mr-1" />
            {creationDate.toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>
              {/* Placeholder for post count */}
              No posts
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{teamMemberCount} {teamMemberCount >= 1 ? "member" : "members"}</span>
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
            <div className="flex flex-row gap-3">
            <Link href={`/application/${_id}/dashboard`}>
            <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <span className="flex flex-row justify-between items-center">View Project <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Button>
            </Link>
            <Link href={`/application/${_id}/dashboard`}>
            <Button variant="default" size="sm" asChild className="bg-gradient-to-r from-cyan-400 to-blue-600 text-primary-foreground hover:from-cyan-400/80 hover:to-blue-600/80">
                <span className="flex flex-row justify-between items-center">Upgrade <Sparkles className="w-4 h-4 ml-1" /></span>
            </Button>
            </Link>
            </div>
          </CardFooter>
    </Card>
  )
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
  className="overflow-hidden transition-all hover:shadow-2xl md:min-w-[30rem] md:w-min w-full 
           border-[1px] border-white/10 backdrop-blur-2xl 
           bg-black bg-opacity-25
           rounded-lg px-4 pb-4">
    <CardHeader className="pb-2 px-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-col">
          <div className="flex flex-row gap-0 items-center">
            <Crown className={`w-5 h-5 mr-2 ${premiumlevel !== "Pro" ? "text-cyan-400" : "text-yellow-200"} `} />
            <h3 className="text-sm font-bold truncate">{premiumlevel}</h3>
          </div>
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
                <span className="flex flex-row justify-between items-center">View {premiumlevel} Project <ArrowRight className="w-4 h-4 ml-1" /></span>
              </Link>
            </Button>
          </CardFooter>
  </Card>
  )
}

function PlanSender({
  productid,
  priceId,
}) {
  const { user } = useUser();
  const router = useRouter();
  const [isopen, setIsOpen] = useState(false);

  const [items, totalItems] = useState(1);
  var totalCost = items * 2.50

  useEffect(() => {
    if (isopen){
      document.body.style.overflow = "hidden";
    }
  }, [isopen])
  const handleCheckout = async (priceId: string, totalItems: string) => {
    const mainemail = user.emailAddresses[0].emailAddress;
    if (!user || !mainemail) {
      router.push("/sign-in?redirect=/plans?priceId=" + priceId);
      return;
    }
    const subscriptionInstanceId = "sub_" + "textuality" + "_" + user.id + "_" + productid + "_" + Date.now();

    const bundel = { priceId, mainemail, userid: user.id, productid: productid, subscriptionInstanceId, quantity: items };
    const response = await fetch('/api/payments/create-checkout-session-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bundel }),
    });
  
    const data = await response.json();
    if (data.url) {
      router.push(data.url);
    } else {
      console.error(data.error);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isopen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target === document.getElementById("outer-modal")) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isopen]);

  return(
    <>
    <Button variant="default" size="sm" asChild className="bg-gradient-to-r from-cyan-400 to-blue-600 text-primary-foreground hover:from-cyan-400/80 hover:to-blue-600/80" onClick={() => setIsOpen(true)}>
      <span className="flex flex-row justify-between items-center">Upgrade to Pro <Sparkles className="w-4 h-4 ml-1" /></span>
    </Button>
    {isopen && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" id="outer-modal">
    <div className="bg-background rounded-lg shadow-lg overflow-hidden w-11/12 md:w-1/4 max-h-[90vh]">
      <div className="p-6 border-b flex justify-between">
        <div>
          <h2 className="text-xl font-bold">Upgrade to Pro</h2>
          <p className="mt-2 text-sm text-gray-600">Unlock additional pro slots for your subscription</p>
        </div>
        <Button 
          variant="ghost"
          className="p-1 h-7"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-6 flex flex-col items-center space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-start">How many pro tokens?</h2>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-14 rounded-full `}
                onClick={() => totalItems(Math.max(0, items - 1))}
                disabled={items === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                className="h-12 text-center text-xl font-semibold"
                value={items}
                min={0}
                max={99}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value))
                  totalItems(isNaN(value) ? 0 : value)
                }}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-14 rounded-full"
                onClick={() => totalItems(items + 1)}
                disabled={items === 99}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => handleCheckout(priceId, totalItems as unknown as string)
            }
            disabled={items === 0}
          >
            £{totalCost.toFixed(2)}/month - Upgrade to Pro
          </Button>
        </div>
    </div>
  </div>
    )}
    </>
  )
}