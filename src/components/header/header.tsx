'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, PenSquare, Search, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b w-full fixed shadow-sm z-50 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start items-center gap-5 lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <img src="/IMG_6128.png" alt="Textuality" className="h-8 w-8" />
              <span className="sr-only">Textuality</span>
              <span className="text-xl mt-1.5 ml-[-8px] font-bold text-foreground hidden sm:block">extuality</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center space-x-3">
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                </Button>
            </Link>
            <Link href="/tutorials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Tutorials
                </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent >
                <DropdownMenuItem>
                  <Link href="/ebooks">eBooks</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/webinars">Webinars</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/podcasts">Podcasts</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    About
                </Button>
            </Link>
          </nav>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <Button asChild>
              <Link href="/create">
                Create Content
              </Link>
            </Button>
            <Button variant='outline' asChild>
                <Link href="/sign-in">
                    Log in
                </Link>
            </Button>
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
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
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