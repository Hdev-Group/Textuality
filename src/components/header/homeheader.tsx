'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, FolderPen, Image as ImageIcon, Component, Moon, Sun, Settings, Search, ArrowUp, House, Check, Diamond, SparklesIcon } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { UserButton } from '@clerk/clerk-react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


export default function HomeHeader({activesection}: any) {
  const [isdark, setDark] = useState(true);
  const [image, setImage] = useState("/IMG_6128.png");
  const [mainlocation, setMainLocation] = useState({left: 0, width: 0})
  const [hasScrolled, setHasScrolled] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: mainlocation.left, width: mainlocation.width })
  const [activeNav, setActiveNav] = useState<string | null>(null)

  useEffect(() => {
    const path = window.location.pathname
    const navItems = [
      { label: "Home", href: "/application/home" },
      { label: "Premium", href: "/application/premium" },
    ]
  
    const activeItem = navItems.find(item => path.includes(item.href))
    if (activeItem) {
      const element = document.querySelector(`a[href='${activeItem.href}']`) as HTMLElement
      if (element) {
        const { offsetLeft, offsetWidth } = element
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
        setMainLocation({ left: offsetLeft, width: offsetWidth })
      }
    }
  }, [])
  
  const handleMouseEnter = (e: React.MouseEvent, href: string) => {
    setActiveNav(href)
    const target = e.currentTarget as HTMLElement
    const { offsetLeft, offsetWidth } = target
    setUnderlineStyle({
      left: offsetLeft,
      width: offsetWidth,
    })
  }
  
  const handleMouseLeave = () => {
    setUnderlineStyle({ width: mainlocation.width, left: mainlocation.left })
  }
  

  useEffect(() => {
  const themesetter = document.getElementById('themesetter');

  if (localStorage.getItem('theme') === 'dark') {
    setDark(true);
    setImage("/IMG_6128.png");
    document.documentElement.classList.add('dark');
  } else {
    setDark(false);
    setImage("/IMG_6129.png");
    document.documentElement.classList.remove('dark');
  }

  themesetter?.addEventListener('click', () => {
    if (isdark) {
    setDark(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    } else {
    setDark(true);
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    }
  });

  return () => {
    themesetter?.removeEventListener('click', () => {});
  };
  }, [isdark, image]);
  const router = useRouter()
  const { user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();

  return (
  <header className="w-full z-50 bg-transparent">
    <div className="px-10 mx-auto transition-all">
    <div className="flex w-full justify-between items-center py-4">
      <div className="flex items-center gap-4 lg:gap-6">
      <Link href="/" className="flex items-center">
        <img src={image} alt="Textuality Logo" className="h-8 w-8" />
        <span className="sr-only">Textuality</span>
      </Link>

      <nav className="hidden lg:flex z-20 items-center space-x-8 relative">
          {[
            { label: "Home", icon: <House size={18} />, href: "/application/home" },
            { label: "Premium", icon: <SparklesIcon size={18} />, href: "/application/premium" },
          ].map((item) => (
            <Link
            key={item.href}
            href={item.href}
            className={`relative z-10 text-sm font-medium flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-primary ${pathname === item.href ? "text-primary font-semibold" : ""}`}
            onMouseEnter={(e) => handleMouseEnter(e, item.href)}
            onMouseLeave={handleMouseLeave}
            >
            {item.icon}
            {item.label}
            </Link>
          ))}
          <span
            className="absolute bottom-0 rounded-sm border-cyan-300/80 border h-[30px] z-0 bg-cyan-300/20 transition-all duration-300"
            style={{
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width > 1 ? underlineStyle.width + 20 : underlineStyle.width}px`,
            transform: `translate(-40px, 5px)`, 
            }}
          />
      </nav>
      </div>
      <div className="flex items-center gap-2">
      <PlanUpgrade />

      <Button size="icon" variant="ghost" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
      <Button size="sm" variant='outline' id="themesetter"> {isdark ? <Moon size={16} /> : <Sun size={16} />} </Button> 
      <Button size="icon" variant="ghost" aria-label="Settings">
        <Settings className="h-4 w-4" />
      </Button>
      {user?.imageUrl && (
        <UserButton />
      )}
      <Button
        className="md:hidden"
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
    <nav className="md:hidden bg-background py-2">
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
              price="£12.50"
              everythingin="Free"
              features={[
                "Advanced analytics", "Unlimited projects", "Content Approval", "AI tools", "Webhooks", "Priority support", "Role Based Access Control"
              ]}
            />
            <PlanOption
              name="Enterprise"
              everythingin="Pro"
              price="£23.50"
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
          Everything in {everythingin} and
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