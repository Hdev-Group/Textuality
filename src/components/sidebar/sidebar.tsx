import { AlignLeftIcon, ClipboardCheck, History, Timer } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ activeTab, setActiveTab, pageid }: { activeTab: string, setActiveTab: React.Dispatch<React.SetStateAction<string>>, pageid: string }) {
    return (
        <aside className="md:min-w-[13rem] w-auto bg-white h-screen dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800">
            <div className='pt-5 pb-2 space-y-2 border-b flex flex-col'>
            <ul className='space-y-2 gap-2 px-1 md:px-4 border-b pb-2'>
                <Link className='w-full' href={`/application/${pageid}/content?filter=all`}>
                <li className={`${activeTab === "all" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('all')}>
                    <AlignLeftIcon className='h-4 w-4' />
                    <span className="hidden md:inline">All Content</span>
                </li>
                </Link>
                <Link className='w-full' href={`/application/${pageid}/content?filter=new`}>
                <li className={`${activeTab === "new" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('new')}>
                    <History className='h-4 w-4' />
                    <span className="hidden md:inline">New</span>
                </li>
                </Link>
                <Link className='w-full' href={`/application/${pageid}/content?filter=scheduled`}>
                <li className={`${activeTab === "scheduled" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('scheduled')}>
                    <Timer className='h-4 w-4' />
                    <span className="hidden md:inline">Scheduled</span>
                </li>
                </Link>
            </ul>
            <ul className='space-y-2 px-1 md:px-4 '>
                <Link className='w-full' href='./content/content-approval'>
                <li className={`${activeTab === "Content Approval" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`} onClick={() => setActiveTab('Content Approval')}>
                    <ClipboardCheck className='h-4 w-4' />
                    <span className="hidden md:inline">Content Approval</span>
                    <div className='rounded-full bg-red-400 h-5 w-5 hidden md:flex items-center justify-center p-2'>1</div>
                </li>
                </Link>
            </ul>
            </div>
            <nav>
            <ul className="space-y-2">
            </ul>
            </nav>
        </aside>
    );
}