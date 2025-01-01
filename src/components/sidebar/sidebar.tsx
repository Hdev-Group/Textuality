import { AlignLeftIcon, ClipboardCheck, History, Timer } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ activeTab, setActiveTab, pageid, contentApproval }: {contentApproval: any, activeTab: string, setActiveTab: React.Dispatch<React.SetStateAction<string>>, pageid: string }) {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, tab: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setActiveTab(tab);
        }
    };

    return (
        <aside className="md:min-w-[13rem] min-w-[4.9rem] h-full relative">
            <div className='bg-white h-screen fixed dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800'>
                <div className='pt-5 pb-2 space-y-2 border-b flex flex-col'>
                <ul className='space-y-2 gap-2 px-1 md:px-4 border-b pb-2'>
                    <Link className='w-full' href={`/application/${pageid}/content?filter=all`}>
                    <li
                        className={`${activeTab === "all" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`}
                        onClick={() => setActiveTab('all')}
                        onKeyDown={(event) => handleKeyDown(event, 'all')}
                        tabIndex={0}
                    >
                        <AlignLeftIcon className='h-4 w-4' />
                        <span className="hidden md:inline">All Content</span>
                    </li>
                    </Link>
                    <Link className='w-full' href={`/application/${pageid}/content?filter=new`}>
                    <li
                        className={`${activeTab === "new" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`}
                        onClick={() => setActiveTab('new')}
                        onKeyDown={(event) => handleKeyDown(event, 'new')}
                        tabIndex={0}
                    >
                        <History className='h-4 w-4' />
                        <span className="hidden md:inline">New</span>
                    </li>
                    </Link>
                    <Link className='w-full' href={`/application/${pageid}/content?filter=scheduled`}>
                    <li
                        className={`${activeTab === "scheduled" ? "bg-accent/80" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`}
                        onClick={() => setActiveTab('scheduled')}
                        onKeyDown={(event) => handleKeyDown(event, 'scheduled')}
                        tabIndex={0}
                    >
                        <Timer className='h-4 w-4' />
                        <span className="hidden md:inline">Scheduled</span>
                    </li>
                    </Link>
                </ul>
                <ul className='space-y-2 px-1 md:px-4 '>
                    <Link className='w-full' href='./content/content-approval'>
                    <li
                        className={`${activeTab === "Content Approval" ? "bg-purple-300/60 text-purple-700 dark:bg-purple-700 dark:text-purple-300" : "hover:bg-card-foreground/5"} cursor-pointer text-sm  px-2 py-1 rounded-sm flex flex-row gap-2 items-center`}
                        onClick={() => setActiveTab('Content Approval')}
                        onKeyDown={(event) => handleKeyDown(event, 'Content Approval')}
                        tabIndex={0}
                    >
                        <ClipboardCheck className='h-4 w-4' />
                        <span className="hidden md:inline">Content Approval</span>
                        {
                            contentApproval?.length > 0 && (
                                <span className='bg-accent/80 text-foreground text-sm px-2.5 py-1 rounded-full'>{contentApproval?.length}</span>
                            )
                        }
                    </li>
                    </Link>
                </ul>
                </div>
                <nav>
                <ul className="space-y-2">
                </ul>
                </nav>
            </div>
        </aside>
    );
}