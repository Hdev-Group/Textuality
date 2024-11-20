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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewRequest() {
    const user = useUser()
    const { userId, isLoaded } = useAuth()
    const projects = useQuery(api.page.getPageSpecific, { userid: userId || user?.user?.id || "" })
    const helpmsg = document.getElementById("helpmsg") as HTMLInputElement
    const [firsthelp, setFirstHelp] = useState(false)
    const [secondhelp, setSecondHelp] = useState(false)
    const [messageBlock, SetMessageBlock] = useState(false)
    const [showrequestform, setShowRequestForm] = useState(false)
    const [pagename, setPageName] = useState('')
    const [chathelp, setChatHelp] = useState([
        
    ])
    const [isExpanded, setIsExpanded] = useState(secondhelp);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);
    const contentformRef = useRef(null);
    const [contentHeightform, setContentHeightForm] = useState(0);
  
    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
      if (contentformRef.current) {
        setContentHeightForm(contentformRef.current.scrollHeight);
      }

    }, [chathelp, secondhelp, contentRef, contentformRef]);
  
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
    const intents = [
        {
            intent: "content_issue",
            keywords: ["content", "not loading", "missing", "disappear"],
            response: "It seems you're facing issues with content not displaying. Could you check if the page is published and linked correctly? Let me know if the issue persists.",
        },
        {
            intent: "saving_issue",
            keywords: ["not saving", "error saving", "can't save"],
            response: "You're experiencing a saving error. Ensure all mandatory fields are filled, and check your internet connection. Let me know more details if possible.",
        },
        {
            intent: "layout_issue",
            keywords: ["layout", "broken", "design", "CSS"],
            response: "It seems like there are layout or design issues. Have you tried inspecting the browser console for CSS or rendering errors?",
        },
        {
            intent: "login_issue",
            keywords: ["login", "authentication", "sign in", "password"],
            response: "You're having trouble logging in. Please verify your credentials or try resetting your password. Do you need assistance with resetting?",
        },
        {
            intent: "performance_issue",
            keywords: ["slow", "lag", "performance"],
            response: "Performance seems to be an issue. Try clearing the cache, reducing large media files, or optimizing your CMS settings. Could you tell me what specifically feels slow?",
        },
        {
            intent: "unknown",
            keywords: [],
            response: "I'm not sure what the issue is. Could you provide more details or describe it differently? I'm here to help!",
        },
    ];
     
    function detectIntent(inputText) {
        inputText = inputText.toLowerCase();
    
        let matchedIntent = "unknown";
        let highestMatchCount = 0;
    
        intents.forEach((intent) => {
            let matchCount = 0;
    
            intent.keywords.forEach((keyword) => {
                if (inputText.includes(keyword.toLowerCase())) {
                    matchCount++;
                }
            });
    
            if (matchCount > highestMatchCount) {
                highestMatchCount = matchCount;
                matchedIntent = intent.intent;
            }
        });
    
        return matchedIntent;
    }
    function generateFollowUp(intent) {
        const followUpQuestions = {
            content_issue: "Is this happening on all pages or just one specific page?",
            saving_issue: "Did you notice any error messages while saving?",
            layout_issue: "Which browser are you using? Some design issues might be browser-specific.",
            login_issue: "Have you tried resetting your password? If so, did you receive an email?",
            performance_issue: "Are you uploading large files or experiencing slow responses while editing?",
            unknown: "Could you share more details about what you're trying to do?",
        };
    
        return followUpQuestions[intent] || "Can you tell me more about the issue?";
    }
    
    function secondSelect(value: string) {
        if (value) {
            setSecondHelp(true)
            const pagename = projects?.find((project) => project._id === value)?.title
            setPageName(pagename)
            setChatHelp((prev) => [...prev, { text: `Okay, What seems to be the problem in ${pagename}?`, isbot: true }])
            window.scrollBy({
                top: 350,
                behavior: 'smooth'
            })
        }
    }
    function generateResponse(inputText) {
        const intent = detectIntent(inputText);
        const matchedIntent = intents.find((i) => i.intent === intent);
            if (matchedIntent) {
            return matchedIntent.response;
        }
        return "I'm having trouble understanding the issue. Can you try explaining it differently?";
    }
    
    function sendHelpMessage(message) {
        const messageText = message.value;
        if (messageText === "") return;
        if (messageBlock) return;
        setChatHelp([...chathelp, { text: messageText, isbot: false }]);
    
        const intent = detectIntent(messageText);
        const botResponse = generateResponse(messageText);
    
        setChatHelp((prev) => [...prev, { text: botResponse, isbot: true }]);
    
        const followUp = generateFollowUp(intent);
        setChatHelp((prev) => [...prev, { text: followUp, isbot: true }]);
        message.value = "";
    
        if (chathelp.filter(chat => !chat.isbot).length >= 5) {
            SetMessageBlock(true)
            setChatHelp((prev) => [...prev, { text: "I'm sorry, but I'm unable to assist you further. You can submit a support request directly to our team. I will open a report for you based on what I think has gone wrong.", isbot: true }]);
        }
    }
    function bypassBot() {
        SetMessageBlock(true)
        setShowRequestForm(true)
        setChatHelp((prev) => [...prev, { text: "No Problem, I'll stop talking and send you the request report form.", isbot: true }]);
        window.scrollBy({
            top: 550,
            behavior: 'smooth'
        })
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
                                        <div className="flex flex-col p-4 gap-4 max-h-[60rem] overflow-y-auto h-auto items-start w-full">
                                            {chathelp.map((chat, index) => (
                                            <div className="flex flex-row gap-3" key={index}>
                                                <div className="flex rounded-full bg-black p-0.5 w-8 h-8 items-center justify-center">
                                                    <img
                                                        src={chat.isbot ? "/IMG_6128.png" : user.user.imageUrl}
                                                        alt="Textuality logo"
                                                        className="rounded-full w-8 h-8"
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
                                                placeholder={messageBlock ? "You've reached the limit of messages. Please submit a support request." : "Type your message here..."}
                                                className="w-full h-40"
                                                id="helpmsg"
                                                disabled={messageBlock}
                                            />
                                            <Button
                                                size="sm"
                                                className="absolute bottom-2 right-2"
                                                disabled={messageBlock}
                                                onClick={() => sendHelpMessage(helpmsg)}
                                            >
                                                Send
                                            </Button>
                                            </div>
                                        </div>
                                        <div className="border-t-muted flex justify-end gap-4 items-center text-[16px] border-t mt-3 p-4 w-full">
                                            Need help?
                                            <Button variant="outline" className="font-semibold" onClick={() => bypassBot()} disabled={messageBlock}>Start Request</Button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${showrequestform ? "flex" : "hidden"} w-full p-4 pt-5 pb-5 border-t border-muted`}
                                style={{ maxHeight: showrequestform ? `${contentHeightform + 25}px` : '0px' }} ref={contentformRef} >
                                    <form className="pb-10">
                                        <div className="flex flex-col gap-4">
                                            <h3 className="text-xl font-semibold">Request Form</h3>
                                            <div className="flex flex-col gap-4">
                                                <Label htmlFor="title">Title</Label>
                                                <Input type="text" id="title" className="w-full"></Input>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea id="description" className="w-full h-40"></Textarea>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <Label htmlFor="priority">Priority</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <div className="flex flex-row gap-4 items-center">
                                                            <Search className="w-4 h-4" />
                                                            <SelectValue>
                                                            </SelectValue>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="low">Low</SelectItem>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="high">High</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <Label htmlFor="category">Category</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <div className="flex flex-row gap-4 items-center">
                                                            <Search className="w-4 h-4" />
                                                            <SelectValue>
                                                            </SelectValue>
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="content">Content</SelectItem>
                                                            <SelectItem value="design">Design</SelectItem>
                                                            <SelectItem value="performance">Performance</SelectItem>
                                                            <SelectItem value="login">Login</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-row gap-3">
                                                <div className="flex items-center justify-center p-0.5 bg-background rounded-full">
                                                    <img src="/IMG_6128.png" alt="Textuality logo" className="w-8 h-8 rounded-full" />
                                                </div>
                                                <div className="flex flex-col gap-1 mt-1.5">
                                                    <p className="text-[16px] leading-7">So, Its in NAMEOFPAGE. Primarily because of CATEGORY and its PRIORITY. Is this correct?</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 ">
                                                <Button size="lg" className="font-semibold">Submit Request</Button>
                                            </div>
                                        </div>
                                    </form>
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