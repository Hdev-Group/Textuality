"use client"
import { Moon, Sun } from "lucide-react";
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
        <footer className="container mx-auto py-12 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-left flex justify-between text-muted-foreground">
          <div className="flex flex-col">
            © 2024 HContent. All rights reserved.
            <small className="block text-xs">HContent by the Hdev Group</small>
          </div>
          <div className="flex gap-4 flex-col">
            <Button size="sm" variant='outline' id="themesetter">
              {isdark ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </div>
        </div>
      </footer>
    )
}