"use client"
import { Facebook, Instagram, Twitter, Youtube, Moon, Sun, LogIn, LucideTwitter, LucideLinkedin } from "lucide-react"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [isdark, setDark] = useState(true);
  const [image, setImage] = useState("");

    useEffect(() => {
      const themesetter = document.getElementById('themesetter');

      if (localStorage.getItem('theme') === 'light') {
        setDark(false);
        document.documentElement.classList.add('light');
        setImage("/IMG_6129.png")
      } else {
        setDark(true);
        document.documentElement.classList.remove('light');
        setImage("/IMG_6128.png")
      }

      themesetter?.addEventListener('click', () => {
        if (isdark) {
          setDark(false);
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
          setImage("/IMG_6129.png")
        } else {
          setDark(true);
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          setImage("/IMG_6128.png")
        }
      });

      return () => {
        themesetter?.removeEventListener('click', () => {});
      };
    }, [isdark]);


    return(
      <footer className="bg-background mx-0 w-full mt-20 relative">
            <div className="w-full bg-muted/10 border-t">
              <div className="container relative mx-auto py-8 px-4 ">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-[0.9rem] font-bold text-muted-foreground">PRODUCT</h1>
                    <Link href={"/plans"}>
                    <p className="text-sm text-muted-foreground">Pricing</p>
                    </Link>
                    <Link href={"/"}>
                    <p className="text-sm text-muted-foreground">Use Cases</p>
                    </Link>
                    <Link href={"/"}>
                    <p className="text-sm text-muted-foreground">Blog</p>
                    </Link>
                    <Link href={"/"}>
                    <p className="text-sm text-muted-foreground">Tutorials</p>
                    </Link>
                    <Link href={"/support"}>
                    <p className="text-sm text-muted-foreground">Support</p>
                    </Link>

                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-muted/20 border-t">
              <div className="container mx-auto  pb-8 px-4 w-full">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5 items-center text-sm text-muted-foreground">
                    <Link href={"/"}>
                    <div className="rounded-full p-2 bg-blue-500/20 text-blue-600 transition-all hover:bg-blue-400/30">
                      <LucideTwitter size={24} />
                    </div>
                    </Link>
                    <Link href={"/"}>
                    <div className="rounded-full text-blue-600 p-2 bg-blue-500/20 transition-all hover:bg-blue-400/30">
                      <LucideLinkedin size={24} />
                    </div>
                    </Link>
                    <Link href={"/"}>
                    <p>Textuality Terms of Service</p>
                    </Link>
                    <Link href={"/"}>
                    <p>Textuality Privacy Policy</p>
                    </Link>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="items-end justify-end">
                      <img src={"/hdev/hdevlogo.png"} alt="HDev Logo" className="w-auto h-24" />
                    </div>
                    <p className="text-muted-foreground text-sm">© {new Date().getFullYear()}, Textuality, Inc. All Rights Reserved</p>
                  </div>
                </div>
              </div>
            </div>
      </footer>

    )
}