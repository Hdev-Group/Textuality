"use client"
import Image from "next/image"
import { useState } from "react"
import Header from "@/components/header/header"
import OverHeader from "@/components/header/overheader"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer/footer"
import {Cloud, Component, Pen, Stars, FileText, User, MessageSquare, Mail, Link2, Share2, Check, Star, BookMarkedIcon, FileSpreadsheetIcon, EditIcon, CloudUploadIcon, GalleryThumbnailsIcon, ChartArea, Clock10Icon, FileLock, Shield, Hand, BriefcaseBusiness, ActivitySquare, CheckSquare} from "lucide-react"
import { motion } from 'framer-motion'


export default function Home() {
  const companies = [
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
    {
      name: "Hdev Group",
      logo: "https://hdev.uk/favicon.ico"
    },
  ]
  return (
    <>
      <div className="flex bg flex-col min-h-screen w-full items-center justify-center">
        <div className="flex items-center justify-center ">
          <div className="w-full justify-center flex-col items-center flex">
            <OverHeader />
            <Header />
              <main className="flex-grow relative z-40 overflow-x-hidden bg-background w-full rounded-sm lg:mx-10 ">
                <div className="flex flex-col w-full items-center h-auto">
                  <div className="container px-4 mt-12 md:mt-44  mb-24">
                  <div className="flex flex-col md:flex-row items-start w-full">
                    <div className="flex flex-col w-auto">
                      <h1 className="font-bold lg:text-[52px] text-5xl space-grotesk-600 text-foreground">Content management that brings everyone together</h1>
                      <p className="text-lg text-muted-foreground mt-4 w-[75%]">Textuality is a new way to create, share, and manage your content. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.</p>
                      <div className="flex flex-row gap-2 mt-5">
                        <Button size="lg">Get Started</Button>
                        <Button variant="gradient" size="lg">Learn More</Button>
                      </div>
                    </div>
                    <div className="flex w-auto">
                      <Image src="/planimg/pro.png" alt="img" width={500} height={500} />
                    </div>
                  </div>
                  </div>
                  {/* <div className="w-full overflow-hidden  py-8">
                    <motion.div
                      className="flex  whitespace-nowrap"
                      animate={{
                        x: [0, -1920],
                      }}
                      transition={{
                        x: {
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 20,
                          ease: "linear",
                        },
                      }}
                    >
                      {[...companies, ...companies].map((company, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center justify-center mx-8 text-2xl font-bold text-muted-foreground"
                        >
                          <img src={company.logo} alt={company.name} className="h-10 w-10 filter grayscale" />
                          {company.name}
                        </div>
                      ))}
                    </motion.div>
                  </div> */}
                  <div className="flex flex-col container w-full lg:w-[80%] items-center justify-center gap-3 mt-20">
                    <h1 className="lg:text-[52px] text-5xl font-bold text-center">Create expertly, easily</h1>
                    <p className="lg:text-md text-sm text-muted-foreground text-center px-2 md:w-1/2">
                      Recreate what's possible with Textuality. Our platform is designed to help you create content that's engaging, informative, and beautiful while we handle all the heavy lifting.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10">
                      <Extrainfocard title="Create" description="Create content with ease using our powerful editor." icon={<Pen />} />
                      <Extrainfocard title="Collaborate" description="Work with your team in real-time to create amazing content." icon={<Stars />} />
                      <Extrainfocard title="Publish" description="Publish your content to the web with a single click." icon={<FileText />} />
                    </div>
                  </div>
                  <div className="w-full rounded-3xl bg-white/80 h-full container mx-10 md:py-0 py-10 relative mt-20">
                    <div className="absolute top-0 right-0 bg-gradient-to-br  from-blue-500 to-purple-500 w-full h-full opacity-20 rounded-3xl" />
                    <h1 className="lg:text-[52px] text-5xl text-black mt-20 text-center">Industry-Disruptive content management software</h1>
                    <p className="text-md text-muted-foreground dark:text-mutedd text-center px-2 mt-2">
                      Textuality is the perfect tool for your next project. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.
                    </p>
                    <div className="flex flex-col md:flex-row justify-between w-full mx-10 mt-10">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-md font-semibold space-grotesk-600 text-blue-900 ">BEST IN CLASS</h1>
                        <h1 className="text-3xl font-bold space-grotesk-600 text-black">Leading with ease</h1>
                        <p className="text-md text-muted-foreground dark:text-muted">Our content management system is the most secure, user friendy, easy to use system on the market, With top sub second performance to get your content where it needs to go</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>Low latency | ~600ms content paint</p>
                          </div>
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>Easy to use | No learning curve</p>
                          </div>
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>Secure | End-to-end encryption</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Image src="/images/hero.png" alt="img" width={500} height={500} />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between w-full mx-10 mt-2">
                      <div>
                        <Image src="/images/hero.png" alt="img" width={500} height={500} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-md font-semibold space-grotesk-600 text-blue-900 ">PRODUCTION-READY</h1>
                        <h1 className="text-3xl font-bold space-grotesk-600 text-black">Backed by developers</h1>
                        <p className="text-md text-muted-foreground dark:text-muted text-wrap break-words w-[90%]">From easy to use API's to publishing and monitoring your content developers choose Textuality because we build with them in mind.</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>API-first | Easy to integrate</p>
                          </div>
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>Monitoring | Real-time metrics</p>
                          </div>
                          <div className="flex flex-row gap-3 text-black">
                            <CheckSquare size={24} />
                            <p>Developer friendly | Easy to use</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full  items-start justify-start gap-3 mt-32 container">
                    <h1 className="lg:text-[52px] text-5xl px-4 font-bold text-start">A secure foundation to write on</h1>
                    <p className="lg:text-lg text-sm px-4 text-muted-foreground text-start">
                      Textuality is built with security in mind. Our platform is designed to keep your content safe and secure while you focus on creating amazing content.
                    </p>
                    <div>
                    <div className="flex flex-col  md:flex-row mt-10">
                          <Extrainfocard
                            title="Customizable Components"
                            description="Create custom components for your content, including buttons, forms, and more."
                            icon={<Component size={24} />
                          } />
                          <Extrainfocard
                            title="Real-time Collaboration"
                            description="Chat, edit, and publish content with your team in real-time."
                            icon={<MessageSquare size={24} />
                          } />
                          <Extrainfocard
                            title="Role Based Access Control"
                            description="Control who can view, edit, and publish content with role-based access control."
                            icon={<Hand size={24} />
                          } />
                          <Extrainfocard
                            title="SEO Optimized"
                            description="Optimize your content for search engines with built-in SEO tools."
                            icon={<Stars size={24} />
                          } />
                    </div>
                    <div className="flex flex-col md:flex-row">
                      <Extrainfocard
                        title={"Simple Setup"}
                        description="Get started in minutes with a simple setup process."
                        icon={<Check size={24} />}
                      />
                      <Extrainfocard
                        title={"Real-time Analytics"}
                        description="Monitor your content's performance with real-time analytics."
                        icon={<ChartArea size={24} />}
                      />
                      <Extrainfocard
                        title="Content Scheduling"
                        description="Schedule content to be published at a later date."
                        icon={<Clock10Icon size={24} />}
                      />
                    </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center gap-3 mt-20 container">
                  
                </div>
              </main>
              <Footer />
            </div>
        </div>
      </div>
    </>
  )
}

function Extrainfocard({ title, description, icon }) {
  return(
    <div className="md:border-l md:last:border-r relative gap-2 py-10 flex flex-col duration-500 transition-colors md:border-b bg-transparent hover:bg-gradient-to-t from-neutral-200/60 to-transparent dark:hover:bg-gradient-to-t dark:from-neutral-900 dark:to-transparent border-neutral-600 dark:border-white/50 p-4 w-full group">
      <div className="absolute left-0 top-[20%] w-1 h-7 rounded-r-md bg-muted group-hover:bg-blue-500 duration-500 transit transition-all group-hover:h-14" />
      <div className="flex flex-col gap-2">
      <div className="text-muted-foreground">
        {icon}
      </div>
      <h1 className="text-xl group-hover:ml-5 duration-500 ml-0 transition-all space-grotesk-600 font-bold leading-tight">
        {title}
      </h1>
      </div>
      <p className="text-muted-foreground text-sm sm:text-md">
      {description}
      </p>
    </div>
  )
}
