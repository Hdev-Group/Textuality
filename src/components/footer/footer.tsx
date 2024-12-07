"use client"

import { Twitter, Linkedin } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Footer() {
  const [isDark, setIsDark] = useState(true)
  const [logoSrc, setLogoSrc] = useState("/IMG_6128.png")

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDark(savedTheme !== 'light')
    setLogoSrc(savedTheme === 'light' ? "/IMG_6129.png" : "/IMG_6128.png")

    const themeSetter = document.getElementById('themesetter')
    themeSetter?.addEventListener('click', toggleTheme)

    return () => themeSetter?.removeEventListener('click', toggleTheme)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    document.documentElement.classList.toggle('light', !newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    setLogoSrc(newIsDark ? "/IMG_6128.png" : "/IMG_6129.png")
  }

  const footerLinks = [
    { name: "Pricing", href: "/plans" },
    { name: "Use Cases", href: "/" },
    { name: "Blog", href: "/" },
    { name: "Tutorials", href: "/" },
  ]

  const helpLinks = [
    { name: "Support", href: "/support" },
    { name: "FAQ", href: "/faq" },
    { name: "Status", href: "/status" },
  ]

  return (
    <footer className="bg-background w-full mt-20">
      <div className="border-t border-muted/20">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Product</h2>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Help</h2>
              <ul className="space-y-2">
                {helpLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>          </div>
        </div>
      </div>
      <div className="border-t border-muted/20">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-end space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
            <div className="flex flex-col items-end">
              <img src={logoSrc} alt="Textuality Logo" className="w-auto h-12 mb-2" />
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Textuality, Inc. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

