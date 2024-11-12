'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, PenSquare, Search, ChevronDown, Columns3Icon, GraduationCap, Book, ShapesIcon, Boxes } from 'lucide-react'
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
  const [hasScrolled, setHasScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  return (
    <header className={`sticky top-0 w-full z-50 ${hasScrolled ? "border-b bg-background" : ""} `}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start items-center gap-5 lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <img src="/IMG_6128.png" alt="Textuality Logo" className="h-8 w-8 dark:flex hidden" />
              <img src="/IMG_6129.png" alt="Textuality Logo" className="h-8 w-8 dark:hidden flex" />
              <span className="sr-only">Textuality</span>
              <span className="text-xl mt-1.5 ml-[-8px] font-bold text-foreground hidden sm:block">extuality</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center space-x-3">
              <button className="text-sm flex items-center hover:border-input hover:shadow-md px-4 py-2 border-background border flex-row gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ShapesIcon size={18} /> Product <ChevronDown size={12} />
              </button>
              <button className="text-sm flex items-center hover:border-input hover:shadow-md px-4 py-2 border-background border flex-row gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Boxes size={18} /> Use Cases <ChevronDown size={12} />
              </button>
              <button className="text-sm flex items-center hover:border-input hover:shadow-md px-4 py-2 border-background border flex-row gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Book size={18} /> Blog <ChevronDown size={12} />
              </button>
              <Link href="/tutorials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <button className="text-sm flex items-center hover:border-input hover:shadow-md px-4 py-2 border-background border flex-row gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
                <GraduationCap size={18} />  Tutorials
              </button>
              </Link>
              <Link href="/plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <button className="text-sm flex items-center hover:border-input hover:shadow-md px-4 py-2 border-background border flex-row gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Columns3Icon size={18} />  Pricing
              </button>
              </Link>
          </nav>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
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

          <div className="flex md:hidden">
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
            <Link href="/blog" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/tutorials" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Tutorials
            </Link>
            <Link href="/resources" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Resources
            </Link>
            <Link href="/about" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
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