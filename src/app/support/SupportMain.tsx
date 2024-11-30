"use client"
import Header from "@/components/header/header"
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search, LifeBuoy, Book, MessageCircle, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Footer from "@/components/footer/footer";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useMemo } from "react";

export default function SupportPage() {
    const user = useUser();

    const [searchQuery, setSearchQuery] = useState('')
    const checktickets = useQuery(api.support.getTickets, { userId: user.user?.id });

    const supportCategories = [
      { icon: <LifeBuoy className="h-6 w-6" />, title: 'General Help', href: '/general-help' },
      { icon: <Book className="h-6 w-6" />, title: 'Documentation', href: '/docs' },
      { icon: <MessageCircle className="h-6 w-6" />, title: 'Live Chat', href: '/support/new-request' },
      { icon: <Mail className="h-6 w-6" />, title: 'Email Support', href: '/support/new-request' },
    ]
  


    interface TypewriterEffectProps {
      firstName: string;
    }
    
    const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ firstName }) => {
      const [typedText, setTypedText] = useState("");
      const helptext = useMemo(() => `Hoow can we help, ${firstName}?`, [firstName]);
    
      useEffect(() => {
        let i = 0;
        const speed = 50;
        let isMounted = true;
    
        const typeWriter = () => {
          if (i < helptext.length && isMounted) {
            setTypedText((prev) => prev + helptext.charAt(i));
            i++;
            setTimeout(typeWriter, speed);
          }
        };
    
        typeWriter();
    
        return () => {
          isMounted = false;
        };
      }, [helptext]);
    
      return <span>{typedText}</span>;
    };
    

    return (
        <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center`}>
        <div className="flex items-center justify-center">
          <div className=" h-full w-full z-30 rounded-sm flex items-center justify-center flex-col border-b">
            <Header />
            <div className="flex flex-col w-full items-center">
              <div className="flex flex-col w-full items-center gap-7 h-full">
                <div className="bgfader w-full h-[27rem] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col mt-10 items-center gap-0.5 px-4">
                      <h1 className="text-6xl space-grotesk-600 text-left md:text-center text-foreground" id="blurin">{user.user ? <TypewriterEffect firstName={user.user.firstName} /> : ""}</h1>
                    </div>
                    <p className="text-xl text-left mt-1 text-muted-foreground px-4">
                      Search our knowledge base or browse categories below.
                    </p>
                  </div>
                  <div className="flex w-full z-50 mt-10 px-4 md:max-w-sm mx-auto items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search for help..."
                      className="z-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Search className="w-4 h-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                </div>
                </div>
              </div>
              {
                checktickets?.length > 0 &&
                <div className="container flex flex-col w-full items-center justify-center">
                  <h1 className="text-4xl font-bold tracking-tighter">Your Support Tickets</h1>
                </div>
              }
              <div className="container flex flex-col w-full items-center justify-center">
                <h1 className="text-4xl font-bold tracking-tighter">Popular Categories</h1>
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4 md:px-0">
                    {supportCategories.map((category, index) => (
                      <Link key={index} href={category?.href}>
                        <Button variant="gradient" className="h-24 w-full flex flex-col items-center justify-center ">
                          <div className="w-full items-center justify-center flex mb-1">
                          {category.icon}
                          </div>
                          <span>{category.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
              </div>
            </div>
            <Footer />
        </div>
        </div>
        </body>
    )
}