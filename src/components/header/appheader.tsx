'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Wrench, FolderPen, Image as ImageIcon, Component, Settings, Search, ArrowUp, Home, ChevronRight } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useClerk } from '@clerk/nextjs'
import { UserButton } from '@clerk/clerk-react'
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelectedLayoutSegment } from 'next/navigation'
import { Moon, Sun } from "lucide-react"

export default function AppHeader({ teamid, activesection }: any) {
  const navItems = [
    { icon: Home, label: "Dashboard", route: `/application/${teamid}/dashboard`, activesection: "dashboard" },
    { icon: Wrench, label: "Templates", route: `/application/${teamid}/templates`, activesection: "templates" },
    { icon: FolderPen, label: "Content", route: `/application/${teamid}/content`, activesection: "content" },
    { icon: Component, label: "Components", route: `/application/${teamid}/components`, activesection: "components" },
  ];
  
  const { signOut } = useClerk()
  const [isdark, setDark] = useState(true);
  const [image, setImage] = useState("/IMG_6128.png");

  useEffect(() => {
    const themesetter = document.getElementById('themesetter');

    const handleThemeToggle = () => {
      if (isdark) {
        setDark(false);
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        setDark(true);
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    };

    if (localStorage.getItem('theme') === 'dark') {
      setDark(true);
      setImage("/IMG_6128.png");
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      setImage("/IMG_6129.png");
      document.documentElement.classList.remove('dark');
    }

    themesetter?.addEventListener('click', handleThemeToggle);

    return () => {
      themesetter?.removeEventListener('click', handleThemeToggle);
    };
  }, [isdark, image]);

  const router = useRouter()
  const { user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  return (
    <header className="w-full z-50 bg-transparent">
      <div className="md:px-10 mx-auto transition-all">
        <div className="flex w-full justify-between items-center py-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/application/home" className="flex items-center h-8 w-8">
              <img src={image} alt="Textuality Logo" className="h-8 w-8" />
              <span className="sr-only">Textuality</span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
            <Link href={item.route} key={item.label} >
              <button
                className={`font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 py-1 px-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-900/5 hover:text-accent-background dark:hover:bg-accent ${activesection === item.activesection ? 'border-blue-400 bg-blue-300/20 border text-blue-500' : ''}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </button>
            </Link>
))}

            </nav>
          </div>
          <div className="flex items-center gap-2">
            <PlanUpgrade />
            <CurrentlyIn whereat={activesection as any} information={teamid as any} />
            <Button size="icon" variant="ghost" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="sm" variant='outline' id="themesetter"> {isdark ? <Moon size={16} /> : <Sun size={16} />} </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={`${activesection === "settings" ? 'border-blue-400 bg-blue-300/20 border text-blue-500' : ''} p-1 rounded-md hover:bg-neutral-900/5 hover:text-accent-background dark:hover:bg-accent`}>
                  <Settings className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Page Settings</DropdownMenuLabel>
                <a href={`/application/${teamid}/settings?type=general`}>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </a>
                <a href={`/application/${teamid}/settings/users`}>
                  <DropdownMenuItem>Users</DropdownMenuItem>
                </a>
                <Link href={`/${teamid}/plans`} >
                  <DropdownMenuItem>Upgrade</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <Link href="./settings/users" passHref>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href="./settings/users" passHref>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user?.imageUrl && (
              <UserButton />
            )}
            <Button
              className="lg:hidden"
              size="icon"
              variant="ghost"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="lg:hidden bg-background py-2">
          {navItems.slice(0, 6).map((item) => (
            <Link href={item.route} key={item.label}>
              <Button
                variant="ghost"
                className={`w-full justify-start font-semibold py-2 ${pathname === item.route ? 'text-blue-500' : ''}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          <Button variant="ghost" className="w-full justify-start font-semibold py-2">
            <ArrowUp className="mr-2 h-4 w-4" />
            Upgrade plan
          </Button>
        </nav>
      )}
    </header>
  )
}

function PlanUpgrade() {
  return (
    <>
      <Button variant="ghost" className="hidden sm:flex items-center gap-1.5 mr-2">
        <ArrowUp className="h-4 w-4" />
        <span>Upgrade plan</span>
      </Button>
      <div className='absolute hidden bg-gradient-to-tr p-0.5 from-purple-300 to-cyan-300 hover:from-purple-600 rounded-lg hover:to-cyan-500 transition-all top-12 border-accent h-96 w-80 right-[22rem]'>
        <div className='bg-background flex flex-col rounded-lg h-full w-full '>
        <div className='flex items-center border-b w-full py-2.5 text-xs bg-gray-100/40 px-2 font-semibold text-accent-foreground'>
          You're currently on the Free plan
        </div>
        <div className='px-2 py-1.5 flex flex-col gap-1.5'>
          <h2 className='font-semibold text-md'>Experience more with paid plans</h2>
          <p className='text-sm'>Some examples</p>
        </div>
        </div>
      </div>
    </>
  )
}

function CurrentlyIn({ information, whereat }: { information: any, whereat: any }) {
  const whereatcapitalized = whereat.charAt(0).toUpperCase() + whereat.slice(1);
  return (
    <div className='border-green-500 hidden lg:flex border-l-8 border bg-green-500/20 p-2 rounded-md'>
      <p className='text-xs font-semibold flex flex-row items-center justify-center'>{information} <ChevronRight height={16} width={16} /> {whereatcapitalized}</p>
    </div>
  )
}