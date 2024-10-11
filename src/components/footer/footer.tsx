"use client"
import { Facebook, Instagram, Twitter, Youtube, Moon, Sun } from "lucide-react"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isdark, setDark] = useState(true);
    useEffect(() => {
      const themesetter = document.getElementById('themesetter');

      if (localStorage.getItem('theme') === 'dark') {
        setDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setDark(false);
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
    }, [isdark]);

    return(
      <footer className="bg-background border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex flex-row">
              <img src="/IMG_6128.png" alt="Textuality" className="h-8 w-8" />
              <h2 className="text-2xl font-bold ml-[-8px] mt-0.5 mb-4">extuality</h2>
            </div>
            <p className="text-muted-foreground mb-4">Empowering your digital narrative.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Community</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">© 2024 Textuality. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Textuality by the Hdev Group</p>
          </div>
          <div className="flex items-center space-x-4">
          <Button size="sm" variant='outline' id="themesetter"> {isdark ? <Moon size={16} /> : <Sun size={16} />} </Button> 
          </div>
        </div>
      </div>
    </footer>
    )
}