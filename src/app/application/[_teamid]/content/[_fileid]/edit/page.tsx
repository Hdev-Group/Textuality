"use client";

import AppHeader from '@/components/header/appheader'
import AuthWrapper from '../../../withAuth'
import { api } from '../../../../../../../convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import React, { act, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation'
import { ArrowLeft, BotMessageSquare, CalendarDaysIcon, ChevronLeft, LucideClipboardSignature, MessagesSquare, Save, SidebarOpen, View } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
export default function ContentEditPage({ params }: { params: Promise<{ _teamid: string, _fileid: string }> }) {
    const router = useRouter();
    const { userId } = useAuth();
    const { _teamid, _fileid } = React.use(params);
    const getPage = useQuery(api.page.getPage, { _id: _teamid as any });
    const getContent = useQuery(api.content.getContentSpecific, { _id: _fileid as any });
    const getFields = useQuery(api.content.getFields, { templateid: getContent?.templateid });
    const changeAuthor = useMutation(api.content.changeAuthor);
    const getFieldValues = useQuery(api.fields.getFieldValues, { fileid: _fileid as string  });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: _teamid as any });
    const [richTextValue, setRichTextValue] = useState('');
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [userData, setUserData] = useState([]);
    const updateContent = useMutation(api.fields.updateField);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [updated, setUpdated] = useState("true");
    const debouncedFieldValues = useDebounce(fieldValues, 2000); 
    const structureFieldValues = (fieldValues) => {
        return Object.entries(fieldValues).map(([fieldid, value]) => ({
            fieldid,
            value
        }));
    };
    
    // Usage
    const structuredFieldValues = structureFieldValues(fieldValues);
    const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
    const title = `${getPage?.title} — ${getContent?.title} — Textuality`;

    useEffect(() => {
        if (getFieldValues?.length) {
            const initialFieldValues = getFieldValues.reduce((acc, field) => {
                acc[field.fieldid] = field.value;
                return acc;
            }, {});
            setFieldValues(initialFieldValues);
        }
    }, [getFieldValues]);
    
    useEffect(() => {
        async function fetchUserData() {
            if (getContent?.authorid) {
                try {
                    const response = await fetch(`/api/secure/get-user?userId=${getContent?.authorid}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setUserData(data.users);
                } catch (error) {
                    const department = getDepartments?.find(dept => dept._id === getContent?.authorid);
                    if (department && department._id) {
                        setUserData(getDepartments.map(department => ({
                            _id: department._id,
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
    useEffect(() => {
        const saveContent = async () => {
            setUpdated("pending")
            for (const field of structuredFieldValues) {
                try {
                    const updated = await updateContent({
                        fieldid: field.fieldid,
                        value: field.value as string,
                        fileid: _fileid,
                        externalId: userId,
                        teamid: _teamid,
                    });
                    if (updated) {
                        setUpdated("true");
                    }
                } catch (error) {
                    console.error("Error updating field:", field.fieldid, error);
                    setUpdated("false");
                }
            }
        };
    
        if (Object.keys(debouncedFieldValues).length > 0) {
            saveContent();
        }
    }, [debouncedFieldValues]);
    

    const renderLivePreviewFields = (field) => {
        const fieldValue = fieldValues[field._id];
    
        switch (field.type) {
            case "Rich text":
            return <RichTextViewer content={fieldValue || 'No content'} />; 
            case "Short Text":
            case "Number":
            case "Boolean":
            case "Date and time":
            case "Location":
            case "JSON object":
            case "Media":
                return <p>{fieldValue || `No ${field.type} provided`}</p>;
            default:
                return <p>Unknown field type</p>;
        }
    };
    const renderField = (field) => {
        const handleChange = (e) =>
            setFieldValues((prev) => ({ ...prev, [field._id]: e.target.value }));
    
        switch (field.type) {
            case "Rich text":
                return <RichTextEditor sendValue={fieldValues[field._id] || ''} onChange={(value) => setFieldValues(prev => ({ ...prev, [field._id]: value }))} />;
            case "Short Text":
                return <Input type="text" value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' placeholder={field.description} />;
            case "Number":
                return <Input type="number" value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' min={0} placeholder={field.description} />;
            case "Boolean":
                return <Switch checked={fieldValues[field._id] || false} onChange={(value) => setFieldValues(prev => ({ ...prev, [field._id]: value }))} />;
            case "Date and time":
                return <Input type="datetime-local" value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' />;
            case "Location":
                return <Input type="text" value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' placeholder='Enter location' />;
            case "JSON object":
                return <textarea value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' placeholder='Enter JSON here' />;
            case "Media":
                return <Input type="input" value={fieldValues[field._id] || ''} onChange={handleChange}  className='border rounded-md p-2 w-full' />;
            default:
                return <Input type="text" value={fieldValues[field._id] || ''} onChange={handleChange} className='border rounded-md p-2 w-full' placeholder="Unknown field type" />;
        }
    };
    const readtimecalc = (text: string) => {
        const wordsPerMinute = 200;
        const noOfWords = text.split(/\s/g).length;
        const minutes = noOfWords / wordsPerMinute;
        const readTime = Math.ceil(minutes);
    
        if (readTime < 1) {
            return `${Math.ceil(minutes * 60)} seconds`;
        } else if (readTime === 1) {
            return `${readTime} minute`;
        } else if (readTime < 60) {
            return `${readTime} minutes`;
        } else {
            const hours = Math.floor(readTime / 60);
            const remainingMinutes = readTime % 60;
            return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
        }
    }
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
                                            <Author authordetails={userData} getDepartments={getDepartments} getAuthorid={getContent?.authorid} onValueChange={setAuthor} teamid={_teamid} />
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
                                        <div onClick={() => sidebardeployer()} className='border p-1 flex flex-row gap-4 overflow-hidden items-center cursor-pointer h-full rounded-md hover:shadow-md shadow-none justify-center  hover:border-black hover:bg-neutral-50/40 transition-all w-full'>
                                            <SidebarOpen className={`${isSideBarOpen ? '' : 'rotate-180'}`} />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Close</p> : null}
                                        </div>
                                        <div className='h-0.5 w-full border-t' />
                                        <div onClick={() => handleSidebarClick("viewer")} className={`${activeSidebar === "viewer" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex justify-center  flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <View />
                                            {
                                                isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Viewer</p> : null
                                            }
                                        </div>
                                        <div onClick={() => handleSidebarClick("chat")} className={`${activeSidebar === "chat" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex justify-center  flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <MessagesSquare />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>Chat</p> : null}
                                        </div>
                                        <div onClick={() => handleSidebarClick("ai")} className={`${activeSidebar === "ai" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex flex-row justify-center  gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <BotMessageSquare />
                                            {
                                                isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide flex-nowrap leading-tight'>AI</p> : null
                                            }
                                        </div>
                                        <div onClick={() => handleSidebarClick("logs")} className={`${activeSidebar === "logs" ? "border-black dark:border-gray-300 border" : "border"} p-1 flex justify-center flex-row gap-4 overflow-hidden items-center cursor-pointer h-auto rounded-md hover:shadow-md shadow-none hover:border-black hover:bg-neutral-50/40 transition-all w-full`}>
                                            <LucideClipboardSignature />
                                            {isSideBarOpen && activeSidebar === null ? <p className='text-sm font-medium text-gray-700 dark:text-gray-100 tracking-wide leading-tight flex-nowrap'>Logs</p> : null}
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
                                    <div className='h-0.5 my-3 w-full border-t' />
                                    {/* autosave sector */}
                                    <div className={`
                                            ${updated === "true" ? "bg-green-300 text-green-700 dark:bg-green-700 dark:text-green-300" : ""}
                                            ${updated === "pending" ? "bg-yellow-300 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300" : ""}
                                            ${updated === "false" ? "bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300" : ""}
                                            px-2.5 py-1 h-auto min-h-8 rounded-sm w-full flex items-center`}>
                                            <div className='flex flex-col gap-0.5 items-center '>
                                                {
                                                    isSideBarOpen === true && activeSidebar === null ? <span className='font-bold'>Autosave</span> : <Save className='w-full h-full'  />
                                                }
                                                {isSideBarOpen && activeSidebar === null && (
                                                    <>
                                                        {updated === "true" && <span className='text-xs font-medium'>Content has been saved.</span>}
                                                        {updated === "pending" && <span className='text-xs font-medium'>Content is being saved.</span>}
                                                        {updated === "false" && <span className='text-xs font-medium'>Content could not be saved.</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                    <div className='flex px-5 flex-col justify-between'>
                                        <a className={`flex flex-row items-center text-xs w-auto gap-1 cursor-pointer`}>
                                            <ArrowLeft width={14} height={14} /> Back
                                        </a>
                                        
                                        {getFields?.sort((a, b) => a.fieldposition - b.fieldposition).map((field, index) => {
                                            if (field.type === "Rich text") {
                                                return <div key={index} id='richtext' className='flex flex-col gap-1'>
                                                    {renderLivePreviewFields(field)}
                                                </div>
                                            } else if (field.fieldname === "Title" || field.fieldname === "Main Title" || field.fieldname === "Heading" || field.fieldname === "Event Name" || field.fieldname === "Name" || field.fieldname === "Subject" || field.fieldname === "Event Title") {
                                                // check if its a department or a user
                                                if (getDepartments.some(dept => dept._id === getContent?.authorid)) {
                                                    const data= getDepartments.find(dept => dept._id === getContent?.authorid);
                                                    return (
                                                        <div key={index} className='flex font-bold text-3xl mt-2 dark:text-white text-black flex-col gap-1'>
                                                            <p>{fieldValues[field._id]}</p>
                                                            <div className="flex flex-row gap-2">
                                                                <Avatar>
                                                                    <AvatarFallback className="h-10 w-10 rounded-full">{data?.departmentname?.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col justify-between">
                                                                    <p className="font-normal text-sm">
                                                                        <span className='dark:text-gray-400'>By </span> 
                                                                        <b>{data?.departmentname}</b>
                                                                    </p>
                                                                    <div className="flex flex-row gap-2 items-center">
                                                                        <p className="font-normal text-xs dark:text-gray-400">{readtimecalc(richTextValue)} read</p>
                                                                        <p>·</p>
                                                                        <p className="font-normal text-xs dark:text-gray-400 flex items-center flex-row gap-0.5">
                                                                            <CalendarDaysIcon height={18} /> {new Date().toDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) 
                                                } else {
                                                return ( 
                                                    <div key={index} className='flex font-bold text-3xl mt-2 dark:text-white text-black flex-col gap-1'>
                                                    <p>{fieldValues[field._id]}</p>
                                                    <div className="flex flex-row gap-2">
                                                        <Avatar>
                                                            <AvatarImage src={userData?.[0]?.imageUrl} alt={userData?.[0]?.firstName} />
                                                            <AvatarFallback className="h-10 w-10 rounded-full">{userData?.[0]?.firstName?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col justify-between">
                                                            <p className="font-normal text-sm">
                                                                <span className='dark:text-gray-400'>By </span> 
                                                                <b>{userData?.[0]?.firstName} {userData?.[0]?.lastName}</b>
                                                            </p>
                                                            <div className="flex flex-row gap-2 items-center">
                                                                <p className="font-normal text-xs dark:text-gray-400">{readtimecalc(richTextValue)} read</p>
                                                                <p>·</p>
                                                                <p className="font-normal text-xs dark:text-gray-400 flex items-center flex-row gap-0.5">
                                                                    <CalendarDaysIcon height={18} /> {new Date().toDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                                }
                                            }  else if (field.type === "Short Text") {
                                                return <div key={index} className='flex flex-col gap-1'>
                                                    <p>{fieldValues[field._id]}</p>
                                                </div>
                                            }else if (field.type === "Number") {
                                                return <div key={index} className='flex flex-col gap-1'>
                                                    <p>{fieldValues[field._id]}</p>
                                                </div>
                                            } else if (field.type === "Boolean") {
                                                return <div key={index} className='flex flex-col gap-1'>
                                                    <p>{fieldValues[field._id]}</p>
                                                </div>
                                            } else if (field.type === "Date and time") {
                                                return (
                                                    <div key={index} className='flex flex-row gap-1'>
                                                    {
                                                        fieldValues[field._id] ? (
                                                            <p>
                                                                {field.fieldname}:&nbsp; 
                                                                <span className='font-semibold'>
                                                                    {new Date(fieldValues[field._id]).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </p>
                                                        ) : null
                                                    }
                                                </div>
                                                )
                                            }else if (field.type === "Location") {
                                                return (
                                                    <div key={index} className='flex flex-col gap-1'>
                                                        {fieldValues[field._id] ? (
                                                            <p>
                                                                At:{" "}
                                                                <a
                                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fieldValues[field._id])}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-semibold  underline"
                                                                >
                                                                    {fieldValues[field._id]}
                                                                </a>
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                );
                                            }
                                            else if (field.type === "Media") {
                                                return <div key={index} className='flex flex-col gap-1'>
                                                    <img src={`${fieldValues[field._id]}`} alt={field.fieldname} className='max-h-[200px] w-[100%] object-cover rounded-md' />
                                                </div>
                                            }
                                            return null;
                                        })}
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
  
function Author({ authordetails, onValueChange, teamid, getDepartments, getAuthorid }: { authordetails: any, onValueChange: (selectedAuthor) => void, teamid: string, getDepartments: any, getAuthorid: string }) {

    const mainAuthor = authordetails.find((author) => author._id === getAuthorid);
    const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>(mainAuthor?._id);

    function handleSelectedAuthor(selectedAuthor: string) {
        setSelectedAuthor(selectedAuthor)
        onValueChange(selectedAuthor)
    }
    useEffect(() => {
        if (getDepartments && mainAuthor) {
          setSelectedAuthor(mainAuthor._id);
        }
      }, [getDepartments, mainAuthor]);
      
    if (!mainAuthor) {
      return null
    }
  
    return (
        <Select
        value={selectedAuthor || mainAuthor?._id} 
        onValueChange={(value: string) => handleSelectedAuthor(value)}
        >        
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
            {(getDepartments && getDepartments.length > 0) ? (
                getDepartments.map((department) => (
                    <SelectItem value={department._id} key={department._id}>
                    <DepartmentOption
                        author={department.departmentname}
                        showImage={false}
                        label={department.departmentdescription}
                    />
                    </SelectItem>
                ))
                ) : (
                <Link href={`/application/${teamid}/settings?type=content`}>
                    <Button className='w-full text-left'>Create a department</Button>
                </Link>
                )}
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
        {storedMessages.length > 0 ? (
            storedMessages.map((message: any) => {
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
                );
            })
        ) : (
            <div className='flex items-center justify-center'>
                <p className='text-md text-start font-semibold'>No messages have been sent yet. <br/> We are counting on you to be the first :).</p>
            </div>
        )}
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

function RichTextViewer({ content }: { content: string }) {
    return (
        <div className='flex flex-col gap-1'>
            <div className='prose prose-headings:text-blue-600 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg text-sm font-medium break-all'>
                <div className='content prose' dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}


