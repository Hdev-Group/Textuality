'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, PenSquare, Search, ChevronDown, Columns3Icon, GraduationCap, Book, ShapesIcon, Boxes, Hand } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@clerk/clerk-react'
import { Input } from "@/components/ui/input"
import { useClerk } from '@clerk/nextjs'


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useUser()
  const { signOut } = useClerk()
  const [mainlocation, setMainLocation] = useState({left: 0, width: 0})
  const [hasScrolled, setHasScrolled] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: mainlocation.left, width: mainlocation.width })
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 250 && currentScrollY > lastScrollY) {
      setIsHeaderVisible(false)
      } else {
      setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)

      if (currentScrollY > 1) {
      setHasScrolled(true)
      } else {
      setHasScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  // auto set underline based on URL
  useEffect(() => {
    const path = window.location.pathname
    const navItems = [
      { label: "Use Cases", href: "/use-cases" },
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Support", href: "/support" },
      { label: "Pricing", href: "/plans" },
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
  return (
    <header className={`sticky container px-4 top-0 z-50 rounded-b-lg bg-background/20 backdrop-blur-xl transition-transform duration-300 ${hasScrolled ? "border-b  border-x" : ""} ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4 lg:justify-start md:space-x-10">
          <div className="flex justify-start items-center gap-5 lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <img src="/IMG_6128.png" alt="Textuality Logo" className="h-8 w-8 dark:flex hidden" />
              <img src="/IMG_6129.png" alt="Textuality Logo" className="h-8 w-8 dark:hidden flex" />
              <span className="sr-only">Textuality</span>
              <span className="text-xl mt-1.5 ml-[-8px] font-bold text-foreground hidden sm:block">extuality</span>
            </Link>
          </div>

            <nav className="hidden lg:flex z-20 items-center space-x-8 relative">
            {[
              { label: "Use Cases", icon: <Boxes size={18} />, href: "/use-cases" },
              { label: "Blog", icon: <Book size={18} />, href: "/blog" },
              { label: "Tutorials", icon: <GraduationCap size={18} />, href: "/tutorials" },
              { label: "Support", icon: <Hand size={18} />, href: "/support" },
              { label: "Pricing", icon: <Columns3Icon size={18} />, href: "/plans" },
            ].map((item) => (
              <Link
              key={item.href}
              href={item.href}
              className="relative z-10 text-sm font-medium flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-primary"
              onMouseEnter={(e) => handleMouseEnter(e, item.href)}
              onMouseLeave={handleMouseLeave}
              >
              {item.icon}
              {item.label}
              </Link>
            ))}
            <span
              className="absolute bottom-0 rounded-sm border-accent h-[30px] z-0 bg-muted-foreground/20 transition-all duration-300"
              style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width > 1 ? underlineStyle.width + 20 : underlineStyle.width}px`,
              transform: `translate(-40px, 5px)`, 
              }}
            />
            </nav>

          <div className="hidden lg:flex items-center justify-end flex-1 lg:w-0 space-x-4">
            <Button asChild className='hidden lg:flex'>
              <Link href="/application/home">
                Create Content
              </Link>
            </Button>
            {user.isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <img src={user?.user?.imageUrl} alt="User avatar" className="w-8 h-8 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/application/home">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/application/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant='outline' asChild>
                <Link href="/sign-in">
                  Log in
                </Link>
              </Button>
            )}
          </div>

          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed w-full h-screen inset-0 z-50 bg-background/80 backdrop-blur-sm transform ${
          isMenuOpen ? 'translate-x-0 flex' : 'translate-x-full hidden'
        } transition-transform duration-300 ease-in-out `}
      >
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="ml-2 text-xl font-bold text-foreground">Textuality</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="space-y-6">
            <Link href="/use-cases" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Use Cases
            </Link>
            <Link href="/blog" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/tutorials" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Tutorials
            </Link>
            <Link href="/support" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Support
            </Link>
            <Link href="/plans" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
          </nav>
          <div className="mt-8 space-y-4">
            <Button asChild className="w-full">
              <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                Create Content
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}