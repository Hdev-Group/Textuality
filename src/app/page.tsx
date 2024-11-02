"use client"
import Image from "next/image"
import { useState } from "react"
import Header from "@/components/header/header"
import OverHeader from "@/components/header/overheader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Footer from "@/components/footer/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Cloud, Component, Pen, Stars, FileText, User, MessageSquare, Mail, Link2, Share2, Check, Star, BookMarkedIcon, FileSpreadsheetIcon} from "lucide-react"
import { motion } from 'framer-motion'
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import NiceButton from "@/components/buttons/nicebutton"

export default function Home() {
  return (
    <>
    <title>
      Textuality - Transform your content. Engage your audience. Seamlessly
    </title>
    <body className="flex bg flex-col min-h-screen">
      <div className="border-x bg-background border-neutral-600 z-50  dark:border-white/50 rounded-sm sm:mx-10 sm:my-10 border-y">
      <OverHeader />
      <Header />
        <main className="flex-grow relative z-40 ">
          <div className=" h-full mt-5">
            <section className="flex flex-col items-center mt-10  justify-center">
              <div className="flex flex-col md:flex-row items-end container mx-auto px-4 sm:px-6 lg:px-8 justify-center gap-14 md:gap-24">
                <div className="flex relative">
                <h1 className="font-bold flex  flex-row flex-wrap md:flex-col text-start text-foreground md:text-7xl sm:text-5xl text-5xl gap-2 md:gap-0 lg:text-8xl space-grotesk-600"><span>Content</span> <span>management</span> <span>that brings</span> <span>everyone</span>  together</h1>
                <div className="absolute right-[-30px] md:block hidden md:top-[50px] lg:top-[85px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-90" width="50" height="50" fill="none"><g stroke="#fff" stroke-miterlimit="10" stroke-opacity="0.9"><path d="M11.758 29.852 1.052 40.382M21.514 33.9l-.82 14.893M30.636 30.011l10.531 10.706M34.574 20.843l15.115-.358M30.791 11.13 41.497.598"></path></g></svg>
                </div>
                </div>
                <div className="flex flex-col md:w-1/3 justify-center space-y-4">
                  <div className="w-auto flex flex-col gap-4">
                    <p className="lg:text-2xl md:text-xl sm:text-md text-start text-cyan-400 dark:text-cyan-100/80">
                      Create quick event announcements or dive deep into detailed blogs with stunning, customized components—all in one collaborative, real-time workspace.
                    </p>
                  <div className="flex flex-row gap-4">
                    <Button variant="outline" className="w-1/2 space-grotesk-400">Get started</Button>
                    <Button variant="ghost" className="w-1/3 space-grotesk-400">Learn more</Button>
                  </div>
                  </div>
                </div>
              </div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 justify-center flex mt-32">
                <div className="grid grid-cols-4 w-full grid-rows-5">

                </div>
              </div>
              <div className="my-10 border-y flex items-center justify-center py-10 border-dashed w-full">
                <h1 className="text-5xl space-grotesk-600 text-center">All the features you need to manage your content, <br/> In one place.</h1>
              </div>
              <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 flex mt-12">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-8">
                    <div className="flex flex-col gap-4 w-1/3">
                      <FileSpreadsheetIcon size={50} />
                      <h1 className="text-6xl space-grotesk-600  font-bold leading-tight">
                        Real-time Content Management
                      </h1>
                      <p className="text-cyan-400 text-lg">
                        Chat about it, edit it, and publish it—all in one place. With Textuality, you can create, collaborate, and publish content in real-time.
                      </p>
                    </div>
                    <div className="flex flex-col w-1/2 h-full">
                      <img src="/IMG_6128.png" alt="Textuality" className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </div>
      </main>
      </div>

      </body>
    </>
  )
}
