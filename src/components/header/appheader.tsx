'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, FolderPen, Image as ImageIcon, Component, Settings, Search, ArrowUp, Home } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

const navItems = [
  { icon: Home, label: "Dashboard", route: "./dashboard", activesection: "dashboard" },
  { icon: Wrench, label: "Templates", route: "./templates", activesection: "templates" },
  { icon: FolderPen, label: "Content", route: "./content", activesection: "content" },
  { icon: ImageIcon, label: "Media", route: "./media", activesection: "media" },
  { icon: Component, label: "Components", route: "./components", activesection: "components" },
]

export default function AppHeader({activesection}: any) {
  const [isdark, setDark] = useState(true);
  const [image, setImage] = useState("/IMG_6128.png");

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
  
  
  return (
    <header className="w-full z-50 bg-transparent">
    <div className="px-10 mx-auto">
    <div className="flex w-full justify-between items-center py-4">
      <div className="flex items-center gap-4 lg:gap-6">
      <Link href="/application/home" className="flex items-center">
        <img src={image} alt="Textuality Logo" className="h-8 w-8" />
        <span className="sr-only">Textuality</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          </DropdownMenuTrigger>
        </DropdownMenu>
          {navItems.map((item) => (
          <Link href={item.route} key={item.label}>
            <Button
            variant="ghost"
            className={`font-semibold ${activesection === item.activesection ? 'border-blue-400 bg-blue-300/20 border text-blue-500' : ''}`}
            >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
            </Button>
          </Link>
          ))}
      </nav>
      </div>
      <div className="flex items-center gap-2">
      <Button variant="ghost" className="hidden sm:flex items-center gap-1.5 mr-2">
        <ArrowUp className="h-4 w-4" />
        <span>Upgrade plan</span>
      </Button>
      <Button size="icon" variant="ghost" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
      <Button size="sm" variant='outline' id="themesetter"> {isdark ? <Moon size={16} /> : <Sun size={16} />} </Button> 
      <Button size="icon" variant="ghost" aria-label="Settings">
        <Settings className="h-4 w-4" />
      </Button>
      {user?.imageUrl && (
        <img 
        src={user.imageUrl} 
        alt={user.fullName || "User avatar"} 
        className="h-8 w-8 rounded-full ml-2 border-2 border-neutral-600/20 p-0.5"
        />
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
      {navItems.slice(0, 6).map((item) => (
      <Link href={item.route} key={item.label}>
        <Button
        variant="ghost"
        className={`w-full justify-start font-semibold py-2 ${router?.pathname === item.route ? 'text-blue-500' : ''}`}
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
