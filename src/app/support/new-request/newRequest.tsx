"use client"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/clerk-react"
import { Search } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import AuthWrapper from "@/app/application/[_teamid]/withAuth"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState, useRef } from "react"

export default function NewRequest() {
    const user = useUser()
    const { userId, isLoaded } = useAuth()
    const projects = useQuery(api.page.getPageSpecific, { userid: userId || user?.user?.id || "" })
    const helpmsg = document.getElementById("helpmsg") as HTMLInputElement
    const [firsthelp, setFirstHelp] = useState(false)
    const [secondhelp, setSecondHelp] = useState(false)
    
    const [chathelp, setChatHelp] = useState([
        {
            text: "I see, What's the problem?",
            isbot: true,
        }
    ])
    const [isExpanded, setIsExpanded] = useState(secondhelp);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);
  
    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }, [chathelp, secondhelp]);
  
    useEffect(() => {
      setIsExpanded(secondhelp);
    }, [secondhelp]);
    function beginHelp() {
        setFirstHelp(true)
        window.scrollBy({
            top: 150,
            behavior: 'smooth'
        })
    }
    function secondSelect(value: string) {
        if (value) {
            setSecondHelp(true)
            window.scrollBy({
                top: 350,
                behavior: 'smooth'
            })
        }
    }

    function sendHelpMessage(message: HTMLInputElement) {
        const messageText = message.value
        setChatHelp([...chathelp, { text: messageText, isbot: false }])
        message.value = ""
    }

    return (
    <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center `}>
        <div className="flex items-center justify-center">
            <div className="border-x  border-neutral-600 h-full border-b max-w-[2000px] w-full z-30 dark:border-white/50 rounded-sm lg:mx-10 lg:mb-10 ">
                <Header />
                <div className="flex flex-col w-full items-center min-h-screen">
                    <div className="flex flex-col w-full h-auto mx-auto container gap-4 ">
                        <div className="flex container mx-auto max-w-[50rem]">
                            <div className="flex flex-col gap-0.5 items-center">
                            <div className="bg rounded-full mt-10 border-accent border flex items-center justify-center">
                            <Image
                                src={'/IMG_6128.png'}
                                alt="Textuality logo"
                                width={150}
                                height={150}
                            />
                            </div>
                            </div>
                            <div className="flex flex-col gap-0.5 my-5 items-center">
                                <h2 className="text-muted-foreground text-xl font-semibold space-grotesk-400">If your content shows on your Website, but doesn't work on Textuality</h2>
                                <h1 className="text-4xl font-semibold space-grotesk-600">Reach out on our offical support platform.</h1>
                            </div>
                            <div className="border border-muted my-5 flex flex-col  rounded-sm">
                                <div className="flex px-5 border-b py-5 text-lg font-semibold">
                                    <h3>Textuality Customer Support</h3>
                                </div>
                                <div className="flex flex-col px-5 py-5 gap-4">
                                    <p>Submit a request directly to our customer service team</p>
                                    <Button className="font-semibold" size="lg" onClick={() => beginHelp()}>Get Help</Button>
                                </div>
                            </div>
                            {/* Help assistant chat zone */}
                            <div className={`${firsthelp ? "fadein" : "hidden"}  flex-col mb-10 rounded-sm border border-muted mt-10 h-auto bg-accent/20`}>
                                <div className={`${firsthelp ? "fadein" : "hidden"} transition-all  flex-row gap-3 p-4`} id="firsthelp">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex rounded-full bg-black p-0.5 w-8 h-8 items-center justify-center">
                                            <img src="/IMG_6128.png" alt="Textuality logo" className="w-full h-full rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-1">
                                        <p className="text-[16px] leading-7">Hello {user?.user?.firstName}, I'm Text from Textuality. I will help create a support request for you. Which page are you inquiring about?</p>
                                        <Select onValueChange={(value) => secondSelect(value)}>
                                            <SelectTrigger className="w-1/2">
                                                <div className="flex flex-row gap-4 items-center">
                                                    <Search className="w-4 h-4" />
                                                    <SelectValue>
                                                    </SelectValue>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    projects?.map((project) => (
                                                        <SelectGroup key={project._id}>
                                                            <SelectLabel>{project.title}</SelectLabel>
                                                            <SelectItem key={project._id} value={project._id}>{project.title}</SelectItem>
                                                        </SelectGroup>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div 
                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                        isExpanded ? "opacity-100" : "opacity-0"
                                    }`}
                                    style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }}
                                    >
                                    <div ref={contentRef} className="flex flex-row gap-3 mt-1">
                                        <div className="flex flex-col gap-1 w-full">
                                        {/* Chat box */}
                                        <div className="flex flex-col p-4 gap-4 items-start w-full">
                                            {chathelp.map((chat, index) => (
                                            <div className="flex flex-row gap-3" key={index}>
                                                <div className="flex rounded-full bg-black p-0.5 w-8 h-8 items-center justify-center">
                                                <img
                                                    src={chat.isbot ? "/IMG_6128.png" : user.user.imageUrl}
                                                    alt="Textuality logo"
                                                    className="w-full h-full rounded-full"
                                                />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                <p className="text-[16px] leading-7">{chat.text}</p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        <div className="p-4">
                                            <div className="relative">
                                            <Textarea
                                                placeholder="Describe the issue you're facing"
                                                className="w-full h-40"
                                                id="helpmsg"
                                            />
                                            <Button
                                                size="sm"
                                                className="absolute bottom-2 right-2"
                                                onClick={() => sendHelpMessage(helpmsg)}
                                            >
                                                Send
                                            </Button>
                                            </div>
                                        </div>
                                        <div className="border-t-muted flex justify-end gap-4 items-center text-[16px] border-t mt-3 p-4 w-full">
                                            Need help?
                                            <Button variant="outline" className="font-semibold">Start Request</Button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
        </body>
    )
}