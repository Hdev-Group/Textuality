"use client";
import AppHeader from '@/components/header/appheader';
import AuthWrapper from '../../withAuth';
import Sidebar from '@/components/sidebar/sidebar';
import { useState, useEffect, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlignLeftIcon, CalendarDaysIcon, Plus, Search, X} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { RichTextViewer } from '../[_fileid]/edit/ContentEditPage';

export default function ContentApproval({ params }) {
    const user = useUser();
    const { _teamid } = params;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Content Approval');
    const getContent = useQuery(api.content.getContent, { pageid: _teamid });
    const getDepartments = useQuery(api.department.getDepartments, { pageid: _teamid });
    const departmentFilter = getDepartments?.filter((department) => department._id === getContent?.[0]?.authorid);
    const [userData, setUserData] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const getRole = useQuery(api.page.getRoledetail, { externalId: user?.user?.id ?? 'none', pageId: _teamid });
    const [filteredContentItems, setFilteredContentItems] = useState(getContent || []);
    const [viewextended, setViewExtended] = useState(true);
    const [previewedFile, setPreviewedFile] = useState(null);

    useEffect(() => {
        if (previewedFile !== null) {
            setViewExtended(true);
        } else {
            setViewExtended(false);
        }
    }, [previewedFile]);

        useEffect(() => {
            async function fetchAllUserData() {
                if (getContent && getContent.length > 0) {
                    try {
                        const authorIds = getContent.map((item) => item.authorid);
                        const uniqueAuthorIds = [...new Set(authorIds)];
                        const userAuthorIds = uniqueAuthorIds.filter((id) => id.includes("user_"));
                        const response = await fetch(`/api/secure/get-user?userId=${userAuthorIds.join(",")}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const data = await response.json();
                        setUserData(data.users);
                        setDataLoaded(true);
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    } finally {
                        setDataLoaded(true);
                    }
                }
            }
            fetchAllUserData();
        }, [getContent]);

    const handleSelectAllChange = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            const allIds = getContent?.map((item) => item._id) || [];
            setSelectedItems(allIds);
        } else {
            setSelectedItems([]);
        }
    };
    useEffect(() => {
        const filteredItems = getContent?.filter(
            (item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredContentItems(filteredItems || []);
    }, [search, getContent]);

    const handleCheckboxChange = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, itemId]);
        } else {
            setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        }
    };
    function filterContentItem(selectedItemId: string) {
        if (selectedItemId === "all") {
            setFilteredContentItems(getContent || []); // Show all content
        } else {
            const filteredItems = getContent?.filter(
                (item) => item.authorid === selectedItemId || item._id === selectedItemId
            );
            setFilteredContentItems(filteredItems || []); // Update filtered items
        }
    }
    return(
        <div className='overflow-y-hidden'>
        <AuthWrapper _teamid={_teamid}>
            <div className="bg-gray-100 dark:bg-neutral-900 h-auto min-h-screen">
                <AppHeader activesection="content" teamid={_teamid} />
                <main className="md:mx-auto md:px-10 py-3 h-full transition-all">
                    <div className="bg-white dark:bg-neutral-950 w-full rounded-lg shadow-lg h-screen overflow-y-auto">
                        <div className='flex'>
                            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pageid={_teamid} />
                            <main className="flex-1">
                                <div className="p-8 space-y-8 border-b bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-2xl font-bold">Content Review</h1>
                                    </div>
                                </div>
                                <div className={`${viewextended ? "md:pl-3 md:pr-2" : ""} flex md:p-8  flex-row justify-between  bg-white gap-4  dark:bg-neutral-950 `}>
                                    <div className={`${viewextended ? "w-1/3" : "w-full"} flex flex-col gap-4 transition-all duration-500 ease-in-out`}>
                                    <div className="flex gap-4 mb-6 ">
                                        {/* Filter by Author */}
                                            <Select defaultValue="all" onValueChange={(value) => filterContentItem(value)}>
                                                <SelectTrigger className="w-auto">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>All Authors</SelectLabel>
                                                        <SelectItem value="all">All</SelectItem> {/* Option to show all */}
                                                        {userData?.map((user) => (
                                                            <SelectItem value={user.id} key={user.id}>
                                                                {user.firstName} {user.lastName}
                                                            </SelectItem>
                                                        ))}

                                                        <SelectSeparator />
                                                        <SelectLabel>All Departments</SelectLabel>
                                                        {getDepartments?.map((department) => (
                                                            <SelectItem value={department._id} key={department._id}>{department.departmentname}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input className="pl-10" placeholder="Search content..." onChange={(e) => setSearch(e.target.value)} value={search} />
                                        </div>
                                    </div>
                                    <div className="flex-1 gap-4 mb-6 ">
                                        <div className='border rounded-md'>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            <Checkbox
                                                                checked={selectAll}
                                                                onCheckedChange={(checked) => handleSelectAllChange(checked as boolean)}
                                                            />
                                                        </TableHead>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Updated</TableHead>
                                                        <TableHead>Author</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        {
                                                            ["admin", "owner", "author"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                                                <TableHead>Actions</TableHead>
                                                            ) : null
                                                        }
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        selectedItems.length > 0 && (
                                                            <TableRow className='transition-height duration-500 ease-in-out h-0'>
                                                                <TableCell colSpan={7} className="text-center items-center justify-center w-full">
                                                                    <div className="flex flex-col gap-2 py-2 px-11 items-start w-auto">
                                                                        <p>{selectedItems.length} item(s) entry selected:</p>
                                                                        <div className="w-auto flex flex-row gap-2">
                                                                            <Button variant="publish" className='h-8'>Approve</Button>
                                                                            <Button variant="destructive" className='h-8'>Reject</Button>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) 
                                                    }
                                                    {filteredContentItems?.length > 0 ? (
                                                    filteredContentItems?.map((item) => (
                                                        item.status === "Review" ? (
                                                            <TableRow key={item._id} className="cursor-pointer hover:border-b-red-300/60">
                                                                    <TableCell>
                                                                    <Checkbox
                                                                        checked={selectedItems.includes(item._id)}
                                                                        onCheckedChange={(checked) =>
                                                                            handleCheckboxChange(item._id, checked as boolean)
                                                                        }
                                                                        className='ml-2'
                                                                    />
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                                    <TableCell>{timeAgo(new Date(item.updated))}</TableCell>    
                                                                    <TableCell>
                                                                            {userData?.map((user) => {
                                                                                if (user.id === item.authorid) {
                                                                                    return (
                                                                                        <div className="flex flex-row items-center gap-2" key={user.id}>
                                                                                            <Avatar className='w-7 h-7'>
                                                                                                <AvatarImage src={user.imageUrl} alt={user.firstName} />
                                                                                                <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                                                                                            </Avatar>
                                                                                            <p>{user.firstName} {user.lastName}</p>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })}
                                                                            {departmentFilter?.map((department) => {
                                                                                if (department._id === item.authorid) {
                                                                                    return (
                                                                                        <div className="flex flex-row items-center gap-2" key={department._id}>
                                                                                            <Avatar className='w-7 h-7'>
                                                                                                <AvatarFallback>{department.departmentname.charAt(0)}</AvatarFallback>
                                                                                            </Avatar>
                                                                                            <p>{department.departmentname}</p>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            <div className={`${
                                                                                item.status === "Review" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : ""
                                                                            } w-min px-2.5 py-1 rounded-sm`}>
                                                                                {item.status}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    {
                                                                        ["admin", "owner", "author"].some(role => getRole?.[0]?.permissions.includes(role)) ? (
                                                                            <TableCell>
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger>
                                                                                        <Button variant="ghost" size="icon">
                                                                                            <AlignLeftIcon className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent align="start">
                                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                        <DropdownMenuSeparator />
                                                                                        <DropdownMenuItem onSelect={() => setPreviewedFile(item._id)}>View</DropdownMenuItem>
                                                                                        <DropdownMenuItem onSelect={() => alert('Approve action')}>Approve</DropdownMenuItem>
                                                                                        <DropdownMenuItem onSelect={() => alert('Reject action')}>Reject</DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        ) : (
                                                                        <TableRow>
                                                                            <TableCell className="text-center" colSpan={6}>
                                                                                No content available for review
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        )
                                                                    }
                                                            </TableRow>
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell className="text-center" colSpan={6}>
                                                                    No content available for review
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell className="text-center" colSpan={6}>
                                                                No content available for review
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    </div>
                                    <div className={`${viewextended ? "w-3/4" : "w-0"} flex flex-col transition-all duration-500 ease-in-out gap-1 overflow-hidden`}>
                                        <div className='flex flex-row justify-between items-center'>
                                            <h1 className='text-2xl font-bold'>Content Preview</h1>
                                            <Button variant='outline' size='icon' onClick={() => { setViewExtended(false); setPreviewedFile(null); }}><X className='w-4 h-4' /> </Button>
                                        </div>
                                        <div className='p-2 mb-16 border px-4 rounded-md flex flex-row justify-between gap-1'>
                                            <div className='flex flex-col gap-1'>
                                                <ContentPreview _fileid={previewedFile} getContent={getContent} getDepartments={getDepartments} userData={userData}  />
                                            </div>
                                            <CommentLine />
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </main>
            </div>
        </AuthWrapper>
        </div>
    )
}

interface Comment {
    id: number
    position: number
    text: string
    userid: string
  }
  
function CommentLine() {
    const [mousePosition, setMousePosition] = useState<number | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [showAddComment, setShowAddComment] = useState(false)
    const [newCommentPosition, setNewCommentPosition] = useState<number | null>(null)
    const borderRef = useRef<HTMLDivElement>(null)
    const [showComments, setShowComments] = useState(false)
    const [userData, setUserData] = useState<any[]>([]);
    const user = useUser();
    const [lastclickposition, setLastClickPosition] = useState<number | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (borderRef.current) {
        const rect = borderRef.current.getBoundingClientRect()
        setMousePosition(e.clientY - rect.top - 20)
        setShowComments(true)
      }
    }
    const handleMouseLeave = () => {
      setMousePosition(null)
      setShowComments(false)
    }
  
    const handleClick = () => {
      if (mousePosition !== null) {
        setNewCommentPosition(mousePosition)
        setShowAddComment(true)
        setLastClickPosition(mousePosition)
      }
    }

    useEffect(() => {
        async function fetchAllUserData() {
            if (comments && comments.length > 0) {
                try {
                    const authorIds = comments.map((item) => item.userid);
                    const uniqueAuthorIds = [...new Set(authorIds)];
                    const userAuthorIds = uniqueAuthorIds.filter((id) => id.includes("user_"));
                    const response = await fetch(`/api/secure/get-user?userId=${userAuthorIds.join(",")}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setUserData(data.users);
                    setDataLoaded(true);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setDataLoaded(true);
                }
            }
        }
        fetchAllUserData();
    }, [comments]);

    const addComment = (text: string) => {
      if (newCommentPosition !== null) {
        const newComment: Comment = {
          id: Date.now(),
          position: newCommentPosition,
          text: text,
          userid: user.user.id
        }
        setComments([...comments, newComment])
        setShowAddComment(false)
        setNewCommentPosition(null)
      }
    }
  
    return (
      <div className='flex flex-col gap-4 h-full pl-4 relative'>
        <div 
          ref={borderRef}
          className='flex flex-row h-full border-l-4 hover:border-l-8 transition-all duration-200 border-gray-200 relative'
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {mousePosition !== null && (
            <div 
              className='absolute left-0 transform -translate-x-1/2 cursor-pointer bg-muted border p-0.5 rounded-md shadow'
              style={{ top: mousePosition }}
            >
              <Plus className='text-muted-foreground' />
            </div>
          )}
          {comments.map((comment) => {
            const user = userData.find((user) => user.id === comment.userid);
            return (
              <div 
                key={comment.id}
                className={`absolute right-[1.5px] w-1 h-4 bg-yellow-400 cursor-pointer`}
                style={{ top: comment.position }}
                onMouseEnter={() => setShowComments(true)}
                onMouseLeave={() => setShowComments(false)}
              >
                {showComments && (
                  <div className='bg-muted border p-2 text-sm rounded shadow absolute w-[12rem] transform -translate-x-full'>
                    <p>{comment.text}</p>
                    {user && (
                      <div className='flex items-center gap-2 mt-2'>
                        <Avatar className='w-6 h-6'>
                          <AvatarImage src={user.imageUrl} alt={user.firstName} />
                          <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p>{user.firstName} {user.lastName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showAddComment && (
          <AddCommentForm 
            onSubmit={addComment}
            onCancel={() => setShowAddComment(false)}
            lastPosition={lastclickposition}
          />
        )}
      </div>
    )
  }
  
  interface AddCommentFormProps {
    onSubmit: (text: string) => void
    onCancel: () => void
    lastPosition: number | null
  }
  
  function AddCommentForm({ onSubmit, onCancel, lastPosition }: AddCommentFormProps) {
    const [text, setText] = useState('')
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (text.trim()) {
        onSubmit(text)
        setText('')
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className={`absolute right-4  bg-background border p-4 rounded shadow`} style={{ top: lastPosition }}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='w-full p-2 border rounded'
          placeholder='Add your comment...'
        />
        <div className='flex justify-end mt-2'>
          <Button type='button' variant='outline' onClick={onCancel} className='mr-2'>
            Cancel
          </Button>
          <Button type='submit'>Add Comment</Button>
        </div>
      </form>
    )
  }

function timeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} days ago`;
    } else if (hours > 0) {
        return `${hours} hours ago`;
    } else if (minutes > 0) {
        return `${minutes} minutes ago`;
    } else {
        return `a few seconds ago`;
    }
}

  function ContentPreview({ getDepartments, userData, getContent, _fileid }) {
    const getFields = useQuery(api.content.getFields, { templateid: getContent.length > 0 ? getContent[0].templateid : '' });
    const getFieldValues = useQuery(api.fields.getFieldValues, {fileid: _fileid as string});
    const [fieldValues, setFieldValues] = useState({});

    useEffect(() => {
        if (getFieldValues?.length) {
          const values = getFieldValues.reduce((acc, field) => {
            acc[field.fieldid] = field.value;
            return acc;
          }, {});
          setFieldValues(values);
        }
      }, [getFieldValues]);

    const renderLivePreviewFields = (field: any) => {
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
    const richTextFields = getFields?.filter((field: any) => field.type === "Rich text").map((field: any) => {
        const fieldValueObj = getContent[field._id] || getContent[field.fieldname];
        return fieldValueObj?.value || null;
    }).join(' ');

    return(
        getFields?.sort((a, b) => a.fieldposition - b.fieldposition).map((field, index) => {
            if (field.type === "Rich text") {
                return <div key={index} id='richtext' className='flex flex-col gap-1'>
                    {renderLivePreviewFields(field)}
                </div>
            } else if (field.type === "Title") {
                // check if its a department or a user
                if (getDepartments?.some(dept => dept._id === getContent?.authorid)) {
                    const data= getDepartments.find(dept => dept._id === getContent?.authorid);
                    return (
                        <div key={index} className='flex font-bold mb-2 text-3xl mt-2 dark:text-white text-black flex-col gap-1'>
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
                                        {
                                            getFields?.some(f => f._id === field._id && f.type === "Rich text") ? (
                                                <>
                                                    <p className="font-normal text-xs dark:text-gray-400">{readtimecalc({ text: richTextFields})} read</p>
                                                    <p>·</p>
                                                </>
                                            ) : null
                                        }
                                        <p className="font-normal text-xs dark:text-gray-400 flex items-center flex-row gap-0.5">
                                            <CalendarDaysIcon height={18} /> {new Date(getContent[0]?.updated).toDateString()}
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
                                <p className="font-normal text-xs dark:text-gray-400">{readtimecalc(fieldValues[field.description] || '')} read</p>
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
                // check to see the fieldappearance
                if (field.fieldappearance === "rating"){
                    // star rating
                    const rating = fieldValues[field._id] || 0 ;
                    return (
                        <div key={index} className='flex flex-col gap-1'>
                            <div className='flex flex-row'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={star <= rating ? "currentColor" : "none"}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className={`w-6 h-6 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    );
                } else if (field.fieldappearance === "number") {
                    return <div key={index} className='flex flex-col gap-1'>
                        <p>{fieldValues[field._id]}</p>
                    </div>
                }
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
        })
    )
}


function readtimecalc({ text }: { text: any }) {
    const wordsPerMinute = 200;
    const noOfWords = text ? text.split(/\s/g).length : 0;
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