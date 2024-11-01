"use client";

import AppHeader from '@/components/header/appheader'
import AuthWrapper from '../../../withAuth'
import { api } from '../../../../../../../convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import React, { act, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation'
import { BotMessageSquare, ChevronLeft, LucideClipboardSignature, MessagesSquare, SidebarOpen, View } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/richtext/editor';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectSeparator
  } from "@/components/ui/select"
import { AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DoesExist } from '../../doesExist';
import { NotFoundError } from '@/components/edgecases/error';

export default function ContentEditPage({ params }: { params: Promise<{ _teamid: string, _fileid: string }> }) {
    const router = useRouter();
    const { userId } = useAuth();
    const { _teamid, _fileid } = React.use(params);
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const getContent = useQuery(api.content.getContentSpecific, { _id: _fileid as any });
    const getFields = useQuery(api.content.getFields, { templateid: getContent?.templateid });
    const changeAuthor = useMutation(api.content.changeAuthor);
    const getDepartments = useQuery(api.department.getDepartments, { pageid: _teamid as any });
    const [richTextValue, setRichTextValue] = useState('');
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
    const title = `${getPage?.title} — ${getContent?.title} — Textuality`;

    useEffect(() => {
        async function fetchUserData() {
            if (getContent?.authorid) {
                console.log(getContent?.authorid);
                try {
                    const response = await fetch(`/api/secure/get-user?userId=${getContent?.authorid}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setUserData(data.users);
                } catch (error) {
                    if (getDepartments?.[0]?._id === getContent?.authorid) {
                        setUserData(getDepartments.map(department => ({
                            firstName: department.departmentname,
                            lastName: '',
                            imageUrl: '',
                            authordescription: department.departmentdescription
                        })));
                    }
                } finally {
                    setDataLoaded(true);
                }
            }
        }
        fetchUserData();
    }, [getContent, getDepartments]);

    const handleSidebarClick = (sidebar: string) => {
        setActiveSidebar(sidebar);
        if (sidebar === activeSidebar) {
            setActiveSidebar(null);
        }
        if (!isSideBarOpen) {
            setIsSideBarOpen(true);
        }
    };

    function sidebardeployer() {
        setIsSideBarOpen(!isSideBarOpen);
        setActiveSidebar(null);
    }

    const renderField = (field) => {
        switch (field.type) {
            case "Rich text":
                return <RichTextEditor />;
            case "Short Text":
                return <Input type="text" className='border rounded-md p-2 w-full' placeholder={field.description} />;
            case "Number":
                return <Input type="number" className='border rounded-md p-2 w-full' min={0} placeholder={field.description} />;
            case "Boolean":
                return <Switch defaultChecked={false} />;
            case "Date and time":
                return <Input type="datetime-local" className='border rounded-md p-2 w-full' />;
            case "Location":
                return <Input type="text" className='border rounded-md p-2 w-full' placeholder='Enter location' />;
            case "JSON object":
                return <textarea className='border rounded-md p-2 w-full' placeholder='Enter JSON here' />;
            case "Media":
                return <Input type="file" className='border rounded-md p-2 w-full' />;
            default:
                return <Input type="text" className='border rounded-md p-2 w-full' placeholder="Unknown field type" />;
        }
    };

    async function setAuthor(selectedAuthor: string) {
        await changeAuthor({ _id: _fileid as any, authorid: selectedAuthor, previousauthors: [...getContent?.previousauthors, getContent.authorid] });
    }
    return (
        <body className='overflow-y-hidden bg-gray-100 dark:bg-neutral-900 h-full'>
            <title>{title}</title>
            <AuthWrapper _teamid={_teamid}>
                <DoesExist _fileid={_fileid}>
                <div className="h-full">
                    <AppHeader activesection="content" teamid={_teamid} />
                    <main className="md:mx-auto md:px-10 py-3 h-screen pb-20 transition-all">
                        <div className="bg-white dark:bg-neutral-950 w-full h-full rounded-lg shadow-lg">
                            <div className={`flex flex-row w-full h-full`}>
                                <div className={`${isSideBarOpen ? "md:w-full md:flex hidden" : "w-full flex"} flex-col h-full`}>
                                    <div className="border-b py-5 px-5 flex flex-row">
                                        <div className='flex flex-row gap-3'>
                                            <div onClick={() => router.push(`/application/${_teamid}/content`)} className='flex flex-row gap-2 border rounded-md hover:border-black hover:shadow-md cursor-pointer transition-all items-center'>
                                                <ChevronLeft />
                                            </div>
                                            <h1 className='text-2xl font-bold'>{getContent?.title}</h1>
                                        </div>
                                    </div>
                                    <div className='container mx-auto px-5 py-5 overflow-y-auto'>
                                        <div className='flex flex-col gap-5'>
                                            <Author authordetails={userData} getDepartments={getDepartments} onValueChange={setAuthor} teamid={_teamid} />
                                            {getFields?.sort((a, b) => a.fieldposition - b.fieldposition).map((field, index) => (
                                                <div key={index} className='flex flex-col gap-1'>
                                                    <Label className='text-sm font-medium text-gray-700 dark:text-gray-100'>{field?.fieldname}</Label>
                                                    {renderField(field)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isSideBarOpen ? "w-full md:w-[20rem]" : "w-[5rem]"} transition-all h-auto justify-center flex-1 border-x pt-5`}>
                                    <div className='flex flex-col h-auto w-full gap-5 px-5'>
                                        <div onClick={() => sidebardeployer()} className='border p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-full rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full'>
                                            <SidebarOpen className={`${isSideBarOpen ? '' : 'rotate-180'}`} />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Close</p> : null}
                                        </div>
                                        <div className='h-0.5 w-full border-t' />
                                        <div onClick={() => handleSidebarClick("chat")} className={`${activeSidebar === "chat" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex  flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <MessagesSquare />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Chat</p> : null}
                                        </div>
                                        <div onClick={() => handleSidebarClick("logs")} className={`${activeSidebar === "logs" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <LucideClipboardSignature />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide leading-tight flex-nowrap'>Logs</p> : null}
                                        </div>
                                        <div onClick={() => handleSidebarClick("ai")} className={`${activeSidebar === "ai" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <BotMessageSquare />
                                            {
                                                isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>AI</p> : null
                                            }
                                        </div>
                                        <div onClick={() => handleSidebarClick("viewer")} className={`${activeSidebar === "viewer" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <View />
                                            {
                                                isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Viewer</p> : null
                                            }
                                        </div>
                                        <div>
                                            <div className={`
                                            ${getContent?.status === "Published" ? "bg-green-300/60 text-green-700 dark:bg-green-700 dark:text-green-300" : ""}
                                            ${getContent?.status === "Draft" ? "bg-yellow-300/60 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300" : ""}
                                            ${getContent?.status === "Review" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : ""}
                                            px-2.5 py-1 h-auto min-h-8 rounded-sm w-full flex items-center 
                                        `}>
                                        <div className='flex flex-col gap-0.5'>
                                            {
                                                isSideBarOpen === true && activeSidebar === null ? <span className='font-bold'>{getContent?.status}</span> : null
                                            }
                                            {isSideBarOpen && activeSidebar === null  && (
                                                <>
                                                    {getContent?.status === "Published" && <span className='text-xs font-medium'>This content has been published.</span>}
                                                    {getContent?.status === "Draft" && <span className='text-xs font-medium'>This content is a draft. It has not been posted.</span>}
                                                    {getContent?.status === "Review" && <span className='text-xs font-medium'>This content is under review. An owner, admin or author needs to review this first.</span>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className='h-0.5 w-full border-t' />
                                    {/* autosave sector */}
                                    
                                </div>
                            </div>
                        </div>
                        <div className={`${isSideBarOpen && activeSidebar !== null  ? `${activeSidebar === "viewer" ? "w-[90%]" : "w-[30rem]"}` : "w-[0rem]"} : "w-[0rem]"} flex h-auto flex-col gap-5 transition-all`}>
                        {
                            activeSidebar === "viewer" ? (
                                <div className='flex flex-col gap-5'>
                                    <div className='border-b p-5'>
                                        <h1 className='text-2xl font-bold'>Content Preview</h1>
                                    </div>

                                </div>
                            ) : activeSidebar === "chat" ? (
                                <div className='flex flex-col gap-5 h-full overflow-y-hidden'>
                                    <div className='border-b p-5'>
                                        <h1 className='text-2xl font-bold'>Chat</h1>
                                    </div>
                                    <div className="flex flex-col h-full justify-between relative">
                                        <MessageList contentid={_fileid} teamid={_teamid} />
                                        <MessageInputter authorid={userId} teamid={_teamid} contentid={_fileid} />
                                    </div>
                                </div>
                            ) : activeSidebar === "logs" ? (
                                <div className='flex flex-col gap-5'>
                                    <div className='border-b p-5'>
                                        <h1 className='text-2xl font-bold'>Logs</h1>
                                    </div>
                                </div>
                            ) : activeSidebar === "ai" ? (
                                <div className='flex flex-col gap-5'>
                                    <div className='border-b p-5'>
                                        <h1 className='text-2xl font-bold'>AI</h1>
                                    </div>
                                </div>
                            ) : null
                        }
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </DoesExist>
    </AuthWrapper>
</body>
    )
}
interface Author {
    id: string
    firstName: string
    lastName: string
    imageUrl?: string
    authordescription: string
  }
  
function Author({ authordetails, onValueChange, teamid, getDepartments }: { authordetails: any, onValueChange: (selectedAuthor) => void, teamid: string, getDepartments: any }) {

    const mainAuthor = authordetails?.[0]
    const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>()

    function handleSelectedAuthor(selectedAuthor: string) {
        setSelectedAuthor(selectedAuthor)
        onValueChange(selectedAuthor)
    }
  
    if (!mainAuthor) {
      return null
    }
  
    return (
      <Select value={selectedAuthor} onValueChange={(value: string) => handleSelectedAuthor(value)}>
        <SelectTrigger className="w-full py-2">
          <SelectValue className='p-2'  />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Main Author</SelectLabel>
                {
                    getDepartments.some(dept => dept._id === mainAuthor._id) ? (
                        <SelectItem value={getDepartments?._id}>
                            <DepartmentOption
                                author={mainAuthor}
                                showImage={true}
                                label={mainAuthor.authordescription}
                            />
                        </SelectItem>
                    ) : (
                        <SelectItem value={mainAuthor._id}>
                        <AuthorOption
                            author={mainAuthor}
                            showImage={true}
                            label="Main author"
                        />
                        </SelectItem>
                    )
                }
            <SelectSeparator />
            <SelectLabel>Departments</SelectLabel>
            {
                getDepartments.length > 0 ? getDepartments.map((department) => (
                <SelectItem value={department._id} key={department._id}>
                    <DepartmentOption
                        author={department?.departmentname as any}
                        showImage={false}
                        label={department?.departmentdescription as any}
                    />
                </SelectItem>
                )) : <Link href={`/application/${teamid}/settings?type=content`}>
                    <Button className='w-full text-left'>Create a department</Button>
                </Link>
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  
  function AuthorOption({ author, showImage, label }: { author: any, showImage: boolean, label: string }) {
    const displayName = typeof author === 'string' ? author : `${author.firstName || ''} ${author.lastName || ''}`;
  
    return (
      <div className="flex items-center cursor-pointer justify-start gap-2">
        <Avatar>
          {showImage && author.imageUrl ? (
            <AvatarImage src={author.imageUrl} alt={displayName} />
          ) : (
            <AvatarFallback>{displayName}</AvatarFallback>
          )}
        </Avatar>
        <div className='flex flex-col items-start justify-center'>
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  }
  
  function DepartmentOption({ author, showImage, label }: { author: any, showImage: boolean, label: string }) {
    const displayName = typeof author === 'string' ? author : `${author.firstName || ''} ${author.lastName || ''}`;
  
    return (
      <div className="flex items-center cursor-pointer justify-start gap-2">
        <Avatar>
          {showImage && author.imageUrl ? (
            <AvatarImage src={author.imageUrl} alt={displayName} />
          ) : (
            <AvatarFallback>
              {typeof displayName === 'string' ? displayName.split(' ').map(word => word[0]).join('') : ''}
            </AvatarFallback>
          )}
        </Avatar>
        <div className='flex flex-col items-start justify-center'>
          <p className="text-sm font-semibold">{displayName}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  }
  
function MessageList({ teamid, contentid }: any) {
    const messages = useQuery(api.message.getMessages, { pageid: teamid, contentid: contentid });
    console.log(messages);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [userData, setUserData] = useState([]);
    const [storedMessages, setStoredMessages] = useState([]);

    useEffect(() => {
        async function fetchUserData() {
            if (messages?.length > 0) {
                const uniqueAuthorIds = [...new Set(messages.map((message: any) => message.authorid))];
                try {
                    const userDataPromises = uniqueAuthorIds.map(async (authorId) => {
                        const response = await fetch(`/api/secure/get-user?userId=${authorId}`);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const data = await response.json();
                        return { authorId, ...data.users[0] };
                    });
                    const usersData = await Promise.all(userDataPromises);
                    setUserData(usersData);
                } catch (error) {
                    throw new Error(`HTTP error! status: ${error}`);
                } finally {
                    setDataLoaded(true);
                }
            }
        }
        fetchUserData();
    }, [messages]);

    useEffect(() => {
        if (messages) {
            setStoredMessages((prevMessages) => {
                const newMessages = messages.filter(
                    (message) => !prevMessages.some((prevMessage) => prevMessage._id === message._id)
                );
                return [...prevMessages, ...newMessages];
            });
        }
    }, [messages]);

    return (
<div className='flex flex-col gap-3 px-2 flex-grow flex-shrink overflow-y-scroll overflow-x-hidden w-auto scrollbaredit'>
    <div className='flex flex-col gap-3 mb-28 flex-wrap'>
        {
            storedMessages?.map((message: any) => {
                const author = userData.find((user) => user.authorId === message.authorid);
                return dataLoaded ? (
                    <div key={message._id} className='flex flex-col gap-3 px-1'>
                        <div className='flex flex-row gap-2'>
                            <Avatar>
                                <AvatarImage src={author?.imageUrl} alt={author?.firstName} />
                                <AvatarFallback>{author?.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-1'>
                                <p className='text-sm font-medium'>{author?.firstName} {author?.lastName}</p>
                                <p className='text-xs text-muted-foreground'>{new Date(message.updated).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 px-12'>
                            <p className='text-sm font-medium break-all'>{message.message}</p>
                        </div>
                    </div>
                ) : (
                    <div key={message._id} className='flex flex-col gap-3 px-1'>
                        <div className='flex flex-row gap-2'>
                            <Avatar className='dark:bg-neutral-500 bg-neutral-800 animate-pulse'>
                                <AvatarImage src={author?.imageUrl} alt={author?.firstName} />
                                <AvatarFallback>{author?.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-1'>
                                <p className='text-sm font-medium w-20 h-1 dark:bg-neutral-500 bg-neutral-800 animate-pulse'></p>
                                <p className='text-sm font-medium w-20 h-1 dark:bg-neutral-500 bg-neutral-800 animate-pulse'></p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 px-12'>
                            <p className='text-sm font-medium w-20 h-1 dark:bg-neutral-500 bg-neutral-800 animate-pulse'></p>
                        </div>
                    </div>
                )
            })
        }
    </div>
</div>
    )
}

function MessageInputter({authorid, contentid, teamid}: any) {
    const messageSender = useMutation(api.message.sendMessage);
    function Subbmitter(event) {
        event.preventDefault();
        if (event.target[0].value.length === 0) {
            return alert('Please type a message');
        } else if (event.target[0].value.length > 500) {
            return alert('Message must be less than 500 characters');
        } 
        // check if messages are being sent too fast we will have to implement a cooldown

        const cooldown = 5000;
        const lastMessage = new Date().getTime();
        const timeDifference = lastMessage - cooldown;
        const lastMessageSent = new Date().getTime();
        if (lastMessageSent < timeDifference) {
            return alert('Please wait before sending another message');
        }


        messageSender({ message: event.target[0].value as any, authorid: authorid as any, contentid: contentid as any, pageid: teamid as any, updated: Date.now() });
        event.target[0].value = '';
    }
    return (
        <div className='flex flex-row gap-2 px-2 pb-3  sticky bottom-0'>
            <form onSubmit={(event) => {
                Subbmitter(event)
            }} className='flex flex-row gap-2 w-full'>
                <Input type='text' placeholder='Type a message' maxLength={500} className='w-full' />
                <Button type='submit'>Send</Button>
            </form>
        </div>
    )
}