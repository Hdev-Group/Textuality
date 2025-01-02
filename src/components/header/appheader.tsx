'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Wrench, FolderPen, Image as ImageIcon, Component, Settings, Search, ArrowUp, Home, ChartArea, ChevronRight, Check } from "lucide-react"
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
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function AppHeader({ teamid, activesection }: any) {
  const navItems = [
    { icon: Home, label: "Dashboard", route: `/application/${teamid}/dashboard`, activesection: "dashboard" },
    { icon: Wrench, label: "Templates", route: `/application/${teamid}/templates`, activesection: "templates" },
    { icon: FolderPen, label: "Content", route: `/application/${teamid}/content`, activesection: "content" },
    { icon: Component, label: "Components", route: `/application/${teamid}/components`, activesection: "components" },
    // { icon: ChartArea, label: "Analytics", route: `/application/${teamid}/analytics`, activesection: "analytics" },
  ];
  const teamname = useQuery(api.page.getExactPage, { _id: teamid })?.title;
  const { signOut } = useClerk()
  const [isdark, setDark] = useState(true);
  const pathname = usePathname();
  const [image, setImage] = useState("/IMG_6128.png");
  const [mainlocation, setMainLocation] = useState({left: 35, width: 0})
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: mainlocation.left, width: mainlocation.width });

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/use-cases')) {
      setUnderlineStyle({ left: mainlocation.left + 10, width: mainlocation.width + 10 });
    } else if (path.includes('/blog')) {
      setUnderlineStyle({ left: mainlocation.left + 20, width: mainlocation.width + 20 });
    } else if (path.includes('/tutorials')) {
      setUnderlineStyle({ left: mainlocation.left + 30, width: mainlocation.width + 30 });
    } else if (path.includes('/support')) {
      setUnderlineStyle({ left: mainlocation.left + 40, width: mainlocation.width + 40 });
    } else if (path.includes('/plans')) {
      setUnderlineStyle({ left: mainlocation.left + 50, width: mainlocation.width + 50 });
    } else {
      setUnderlineStyle({ left: mainlocation.left, width: mainlocation.width });
    }
  }, []);

  useEffect(() => {
    const activeNavElement = document.querySelector(`[href='${activeNav}']`);
    if (activeNavElement) {
      const { offsetLeft, offsetWidth } = activeNavElement as HTMLElement;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeNav]);

  useEffect(() => {
    const activeItem = navItems.find((item) => pathname.startsWith(item.route));
    setActiveNav(activeItem?.route || null);
  }, [pathname]);

  const handleMouseEnter = (e: React.MouseEvent, href: string) => {
    const target = e.currentTarget as HTMLElement;
    const { offsetLeft, offsetWidth } = target;
    setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
  };

  const handleMouseLeave = () => {
    const activeNavElement = document.querySelector(`[href='${activeNav}']`);
    if (activeNavElement) {
      const { offsetLeft, offsetWidth } = activeNavElement as HTMLElement;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  };
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
  return (
    <header className="w-full z-50 bg-transparent">
      <div className="md:px-10 mx-auto transition-all">
        <div className="flex w-full justify-between items-center py-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <a href="/application/home" className="flex items-center h-8 w-8">
              <img src={image} alt="Textuality Logo" className="h-8 w-8" />
              <span className="sr-only">Textuality</span>
            </a>
            <nav className="hidden lg:flex relative items-center ">
            {navItems.map((item) => (
              <Link 
              href={item.route} 
              onClick={() => router.push(item.route)}
              key={item.route}
              onMouseEnter={(e) => handleMouseEnter(e, item.route)}
              onMouseLeave={handleMouseLeave}
              className='z-50'
              >
                <button
                  className={`font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 py-1 px-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-background`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </button>
              </Link>
            ))}
            <span
              className={` bottom-0 rounded-sm border h-[30px] z-0 border-blue-400  bg-blue-300/20  text-blue-500 transition-all duration-300 ${activeNav === null ? "hidden" : "absolute"}`}
              style={{
              left: `${underlineStyle.left + 40}px`,
              width: `${underlineStyle.width}px`,
              transform: `translate(-40px, 0px)`, 
              }}
            />
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <PlanUpgrade />
            <CurrentlyIn whereat={activesection as any} information={teamname as any} />
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
                <DropdownMenuItem onClick={() => { signOut({ redirectUrl: '/sign-in' }); router.push('/sign-in'); }}>
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
        <nav className="lg:hidden bg-background py-2 md:mx-auto md:px-6">
          {navItems.slice(0, 6).map((item) => (
            <div onClick={() => router.push(item.route)} key={item.label} className='w-full'>
              <Button
                variant="ghost"
                className={`w-full items-center justify-start ${pathname === item.route ? 'text-blue-500' : ''}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full justify-start font-semibold py-2" onClick={() => router.push(`/plans`)}>
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
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="hidden sm:flex items-center gap-1.5">
          <ArrowUp className="h-4 w-4" />
          <span>Upgrade Plan</span>
        </Button>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 p-4 bg-background rounded-lg shadow-md">
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-lg">Upgrade Your Experience</h3>
          <p className="text-sm text-muted-foreground">
            You’re currently on the <strong>Free</strong> plan
          </p>
          
          <div className="grid gap-4 mt-4">
            <PlanOption
              name="Pro"
              price="£19.99"
              everythingin="Free"
              features={[
                "Advanced analytics", "10 Pro Projects", "Content Approval", "AI tools", "Webhooks", "Priority support"
              ]}
            />
            <PlanOption
              name="Enterprise"
              everythingin="Pro"
              price="£49.99"
              features={[
                "Custom integrations", "Subscription & Paywall", "Social media scheduling", "Custom branding"
              ]}
            />
          </div>
          <a href="/plans" className="w-full">
          <Button className="w-full mt-4">View All Plans</Button>
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function PlanOption({ name, price, features, everythingin }) {
  return (
    <div className="flex items-start flex-col space-x-4 p-3 bg-muted rounded-lg shadow-sm">
      <div className="flex-shrink-0">
        <h4 className="font-semibold text-base">{name}</h4>
        <p className="text-sm text-muted-foreground">
          Starting at {price}/mo
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          {everythingin && `Everything in ${everythingin} and`}
        </p>
      </div>
      
      <ul className="space-y-1 mt-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CurrentlyIn({ information, whereat }: { information: any, whereat: any }) {
  const whereatcapitalized = whereat ? whereat.charAt(0).toUpperCase() + whereat.slice(1) : '';
  return (
    <div className='border-green-500 hidden lg:flex border-l-8 border bg-green-500/20 p-2 rounded-md'>
      <p className='text-xs font-semibold flex flex-row items-center justify-center'>{information} <ChevronRight height={16} width={16} /> {whereatcapitalized}</p>
    </div>
  )
}