"use client"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/clerk-react"
import { Columns2, Columns3, Columns4, Search } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
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
import { useRouter } from "next/navigation"

export default function NewRequest() {
    const user = useUser();
    const router = useRouter();
    const { userId, isSignedIn } = useAuth();

    const projects = useQuery(api.page.getPageSpecific, {
      userid: userId || user?.user?.id || "",
    });
    // State Variables
    const [pageid, setPageID] = useState("");

    const [firstHelp, setFirstHelp] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [secondHelp, setSecondHelp] = useState(false);
    const [messageBlock, setMessageBlock] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [pageName, setPageName] = useState("");
    const [chatHelp, setChatHelp] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [contentHeightForm, setContentHeightForm] = useState(0);
    const [helpmsg, sethelpmsg] = useState("");
    const [reportform, FillRequestForm] = useState({
      title: "",
      description: "",
      priority: "",
      category: "",
    });
  
    const contentRef = useRef(null);
    const contentFormRef = useRef(null);


    useEffect(() => {
      setIsClient(true);
    }, []);
  
    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
      if (contentFormRef.current) {
        setContentHeightForm(contentFormRef.current.scrollHeight);
      }
    }, [chatHelp, secondHelp, contentRef, contentFormRef]);
  
    // Effect: Sync Expand State
    useEffect(() => {
      setIsExpanded(secondHelp);
    }, [secondHelp]);
  
    // Constants for Intents
    const intents = [
      {
        intent: "content_issue",
        response: "It seems you're facing issues with content not displaying. Could you check if the page is published and linked correctly? Let me know if the issue persists.",
        followUp: "Is this happening on all pages or just one specific page?",
      },
      {
        intent: "saving_issue",
        response: "You're experiencing a saving error. Ensure all mandatory fields are filled, and check your internet connection. Let me know more details if possible.",
        followUp: "Did you notice any error messages while saving? You should see a green save icon for autosave, yellow for pending changes, and red for errors.",
      },
      {
        intent: "layout_issue",
        response: "It seems like there are layout or design issues. Have you tried inspecting the browser console for CSS or rendering errors?",
        followUp: "Which browser are you using? Some design issues might be browser-specific.",
      },
      {
        intent: "login_issue",
        response: "You're having trouble logging in. Please verify your credentials or try resetting your password. Do you need assistance with resetting?",
        followUp: "Have you tried resetting your password? If so, did you receive an email?",
      },
      {
        intent: "performance_issue",
        response: "Performance seems to be an issue. Try clearing the cache, reducing large media files, or optimizing your CMS settings.",
        followUp: "Are you uploading large files or experiencing slow responses while editing?",
      },
      {
        intent: "api_issue",
        response: "It looks like you're experiencing an API-related problem. Could you verify the API connection and authentication keys?",
        followUp: "Is the API returning any specific error messages? Could you share the details in the request.",
      },
      {
        intent: "other",
        response: "Ah, I will open a support request for you. Please provide more details about the issue.",
        followUp: "Please describe the issue there.",
      },
    ];


  
    // Handle Help Button Click
    const beginHelp = () => {
      setFirstHelp(true);
      window.scrollBy({
        top: 150,
        behavior: "smooth",
      });
    };
  
    // Handle Follow-Up Response
    const handleFollowUpResponse = () => {
      setShowRequestForm(true);
      window.scrollBy({
        top: 550,
        behavior: "smooth",
      });
    };
  
    // Handle Project Selection
    const secondSelect = (value: string) => {
      if (value && projects) {
        setSecondHelp(true);
        const selectedPage = projects.find((project) => project._id === value)?.title;
        setPageName(selectedPage || "");
        setPageID(value);
        setChatHelp((prev) => [
          ...prev,
          { text: `Okay, What seems to be the problem in ${selectedPage}?`, isbot: true },
        ]);
        window.scrollBy({ top: 350, behavior: "smooth" });
      }
    };
    
  
    const sendHelpMessage = ({value}) => {
      if (!value || messageBlock) return;
    
      // Define message templates for display
      const intentMessageEditing = {
        content_issue: "I am having a problem with content not displaying or appearing incorrectly.",
        saving_issue: "I am having a problem with errors or issues encountered while trying to save changes.",
        layout_issue: "I am having a problem with the design or layout of the page.",
        login_issue: "I am having a problem with logging into the system or accessing my account.",
        performance_issue: "I am having a problem with slow performance or lag while using the application.",
        api_issue: "I am having a problem with API connections or data retrieval.",
        other: "I am having a problem with something not covered by the above categories.",
      };
    
      // Convert intent to user-friendly message
      const userMessage = intentMessageEditing[value];
      setChatHelp((prev) => [...prev, { text: userMessage, isbot: false }]);

      // Match intent and handle response
      const matchedIntent = intents.find((i) => i.intent === value);
    
      if (!matchedIntent) {
        setChatHelp((prev) => [
          ...prev,
          { text: "I'm having trouble understanding the issue. Can you explain it in more detail?", isbot: true },
        ]);
        return;
      }
    
      // Append bot's response and follow-up
      setChatHelp((prev) => [
        ...prev,
        { text: matchedIntent.response, isbot: true },
        { text: matchedIntent.followUp, isbot: true },
      ]);
      setMessageBlock(true)
      setShowRequestForm(true)

      const valueissues = [
        {
          value: "content_issue",
          text: "Content Issue",
          description: "I am having a problem with content not displaying or appearing incorrectly.",
          priority: "medium",
        },
        {
          value: "saving_issue",
          text: "Saving Issue",
          description: "I am having a problem with errors or issues encountered while trying to save changes.",
          priority: "medium",
        },
        {
          value: "layout_issue",
          text: "Layout Issue",
          description: "I am having a problem with the design or layout of the page.",
          priority: "medium",
        },
        {
          value: "login_issue",
          text: "Login Issue",
          description: "I am having a problem with logging into the system or accessing my account.",
          priority: "high",
        },
        {
          value: "performance_issue",
          text: "Performance Issue",
          description: "I am having a problem with slow performance or lag while using the application.",
          priority: "high",
        },
        {
          value: "api_issue",
          text: "API Issue",
          description: "I am having a problem with API connections or data retrieval.",
          priority: "high",
        },
        {
          value: "other",
          text: "Other",
        }
      ]

      FillRequestForm({
        title: valueissues.find((issue) => issue.value === value).text + " in " + pageName,
        description: valueissues.find((issue) => issue.value === value).description,
        priority: "medium",
        category: { value: value } as any,
      })
      // Block further messages after 5 user inputs
      if (chatHelp.filter((chat) => !chat.isbot).length >= 5) {
        setMessageBlock(true);
        setShowRequestForm(true)
        FillRequestForm({
          title: "Support Request for " + pageName + "due to " + value,
          description: chatHelp.map((chat) => chat.text).join("\n"),
          priority: "medium",
          category: { value: value  } as any,
        })
        setChatHelp((prev) => [
          ...prev,
          { text: "I will create a support issue now.", isbot: true },
        ]);
        handleFollowUpResponse();
      }
    };
    function bypassBot() {
        setMessageBlock(true)
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
            <div className="w-full flex items-center justify-center flex-col h-full rounded-sm">
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
                            <div className={`${firstHelp ? "fadein" : "hidden"}  flex-col mb-10 rounded-sm border border-muted mt-10 h-auto bg-accent/20`}>
                                <div className={`${firstHelp ? "fadein" : "hidden"} transition-all  flex-row gap-3 p-4`} id="firsthelp">
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
                                            {chatHelp.map((chat, index) => (
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
                                            <div className="relative flex flex-row gap-2">
                                              <Select onValueChange={sethelpmsg}>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Your issue?" className="placeholder:text-muted-foreground" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectGroup>
                                                    <SelectItem value="content_issue">Content Issue</SelectItem>
                                                    <SelectItem value="saving_issue">Saving Issue</SelectItem>
                                                    <SelectItem value="layout_issue">Layout Issue</SelectItem>
                                                    <SelectItem value="login_issue">Login Issue</SelectItem>
                                                    <SelectItem value="performance_issue">Performance Issue</SelectItem>
                                                    <SelectItem value="api_issue">API issue</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                  </SelectGroup>
                                                </SelectContent>
                                              </Select>
                                            <Button
                                                size="sm"
                                                className=""
                                                disabled={messageBlock}
                                                onClick={() => sendHelpMessage({ value: helpmsg })}
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
                                <SupportForm pageid={pageid} reportform={reportform} showRequestForm={showRequestForm} contentHeightForm={contentHeightForm} contentFormRef={contentFormRef} />
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

function SupportForm({ showRequestForm, contentHeightForm, contentFormRef, reportform, pageid }) {
  const user = useUser()
  const router = useRouter()
  const reportSubmit = useMutation(api.support.createTicket)

  const [showSuccess, setShowSuccess] = useState("false")
  const [submitted, setSubmitted] = useState(false)


  function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    // Check if all fields are filled
    if (!requestForm.title || !requestForm.description || !requestForm.priority) {
      alert("Please fill all fields before submitting the request.")
      return
    }
    // check if user is logged in
    if (!user?.user?.id) {
      alert("Please login to submit a request.")
      return
    }
    fetch("/api/support/restricted/email/startsupport", {
      method: "POST",
      body: JSON.stringify({
        email: user?.user?.emailAddresses[0].emailAddress,
        firstname: user?.user?.firstName,
        lastname: user?.user?.lastName,
        title: requestForm.title,
        priority: requestForm.priority,
        description: requestForm.description,
        status: "open",
        datetime: new Date().toLocaleDateString(),
        imageUrl: user?.user?.imageUrl,
        type: "requestsubmitted",
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SECURE_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));    

     const hassubmitted = reportSubmit({
      pageid: pageid,
      title: requestForm.title,
      content: requestForm.description,
      priority: requestForm.priority,
      userId: user?.user?.id,
    })
    setSubmitted(true)
    if (hassubmitted) {
      setShowSuccess("true")
      router.push("/support/tickets")
    } else {
      setShowSuccess("error")
    }
  }
  const [requestForm, FillRequestForm] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });

  useEffect(() => {
    FillRequestForm({
      title: reportform.title,
      description: reportform.description,
      priority: reportform.priority,
      category: reportform.category,
    })
  }, [reportform])  

  function changeReportForm(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    FillRequestForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  }


  return(
    <div className={`${showRequestForm ? "flex" : "hidden"} w-full p-4 pt-5  border-t border-muted`}
    style={{ minHeight: showRequestForm ? `${contentHeightForm + 5}px` : '0px' }} ref={contentFormRef} >
        <form className="pb-12 w-full" onSubmit={(e) => submitRequest(e)}>
            <div className="flex flex-col gap-4 w-full">
                <h3 className="text-xl font-semibold">Request Form</h3>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" id="title" className="w-full" required onChange={changeReportForm} value={requestForm.title}></Input>
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" className="w-full h-40" required onChange={changeReportForm} value={requestForm.description}></Textarea>
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="priority">Priority</Label>
                    <Select onValueChange={(value) => FillRequestForm((prev) => ({ ...prev, priority: value }))} value={requestForm.priority}>
                        <SelectTrigger>
                            <div className="flex flex-row gap-4 items-center">
                                <Search className="w-4 h-4" />
                                <SelectValue >
                                </SelectValue>
                            </div>
                        </SelectTrigger>
                        <SelectContent id="priority">
                            <SelectGroup>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-3 justify-center px-3 py-0.5 border-green-400 bg-green-400/20 rounded-lg border">
                                    <Columns2 className="w-5 h-5" /> Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-3 justify-center px-3 py-0.5 border-yellow-400 bg-yellow-400/20 rounded-lg border">
                                    <Columns3 className="w-5 h-5" /> Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-3 justify-center px-3 py-0.5 border-red-400 bg-red-400/20 rounded-lg border">
                                    <Columns4 className="w-5 h-5" /> High
                                  </div>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4 ">
                    <Button size="lg" type="submit" className="font-semibold" disabled={submitted === true}>Submit Request</Button>
                </div>
                <p className="text-muted-foreground text-sm">By submitting this request, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
                {
                  showSuccess === "true" && (
                    <div className="flex w-full border-green-400 border bg-green-500/20 rounded-xl">
                      <p className="text-green-400 font-semibold p-4">Your request has been submitted successfully. You will receive a confirmation email shortly.</p>
                    </div>
                  )
                }
            </div>
        </form>
    </div>
  )
}