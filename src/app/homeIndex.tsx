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
    <div>
      <div className="flex bg flex-col min-h-screen w-full items-center justify-center">
        <div className="flex items-center justify-center ">
          <div className="w-full justify-center flex-col items-center flex">
            <OverHeader />
            <Header />
              <main className="flex-grow relative z-40 overflow-x-hidden bg-background w-full rounded-sm lg:mx-10 ">
                <div className="absolute left-1/2 -translate-x-1/2 h-[80vh] w-[80vw] bg-[radial-gradient(ellipse_50%_80%_at_50%_-40%,rgba(64,224,208,0.3),rgba(255,255,255,0))]"/>
                <div className="flex flex-col w-full items-center justify-start h-full">
                  <div className="container h-full px-4 mt-12 md:mt-44  mb-12">
                  <div className="flex flex-col md:flex-row items-start justify-start w-full">
                    <div className="flex flex-col w-auto">
                      <h1 className="font-bold lg:text-[52px] text-5xl space-grotesk-600 text-foreground">Content management that brings everyone together</h1>
                      <p className="text-lg text-muted-foreground mt-4 w-[75%]">Textuality is a new way to create, share, and manage your content. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.</p>
                      <div className="flex flex-row gap-2 mt-5">
                        <Button size="lg">Get Started</Button>
                        <Button variant="gradient" size="lg">Learn More</Button>
                      </div>
                    </div>
                    <div className="flex w-1/2 h-full mt-[-5rem]">
                      <div className="spinnercard borderspincard">
                        <div className="inner z-10">
                          <video autoPlay loop muted className="w-full h-full object-cover">
                            <source src="/videos/hero.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className="w-full overflow-hidden flex items-center flex-col py-8">
                    <h1 className="lg:text-[32px] text-2xl font-semibold text-center">Trusted by </h1>
                    <p className="text-muted-foreground text-center text-sm mb-4">Some of the world's leading companies trust Textuality to create, share, and manage their content.</p>
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
                          className="inline-flex items-center justify-center mx-12 text-2xl font-bold text-muted-foreground"
                        >
                          <img src={company.logo} alt={company.name} className="h-10 w-10 filter grayscale" />
                          {company.name}
                        </div>
                      ))}
                    </motion.div>
                    <div className="flex flex-row gap-2 mt-10">
                      <h1 className="text-2xl font-semibold">Over 1k users wordwide</h1>

                    </div>
                  </div>
                  <div className="flex flex-col container w-full lg:w-[80%] relative items-center justify-center gap-3 mt-20">
                  <div className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]" style={{ background: 'linear-gradient(152.92deg, rgba(64, 224, 208, 0.2) 4.54%, rgba(64, 224, 208, 0.26) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)' }} />
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
                    <p className="text-md text-muted-foreground dark:text-muted text-center px-2 mt-2">
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
                            <p>Low latency | ~750ms content delivery</p>
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
                  <div className="flex flex-col w-full  items-start justify-start gap-3 mt-32 container relative">
                  <div className="absolute inset-0 max-w-xs  left-0 h-44 blur-[118px]" style={{ background: 'linear-gradient(152.92deg, rgba(64, 224, 208, 0.1) 4.54%, rgba(64, 224, 208, 0.16) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)' }} />
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
                  <div className="flex flex-col w-full  items-end justify-end gap-3 mt-32 container">
                  <h1 className="lg:text-[52px] text-5xl px-4 font-bold text-start">Protecting you and your page.</h1>
                  <p className="lg:text-md text-sm px-4 text-muted-foreground text-start">
                    With Textuality all your content is encrypted in AES 256-bit encryption, with end-to-end encryption and secure backups you can be sure your content is safe.
                  </p>
                  <div className="flex flex-row mt-5">
                    <Extrainfocard
                      title="End-to-end Encryption"
                      description="Encrypt your content with AES 256-bit encryption."
                      icon={<Shield size={24} />
                    } />
                    <Extrainfocard
                      title="Secure Backups"
                      description="Automatically backup your content to the cloud."
                      icon={<Cloud size={24} />
                    } />
                    <Extrainfocard
                      title="Two-Factor Authentication"
                      description="Secure your account with two-factor authentication."
                      icon={<FileLock size={24} />
                    } />
                    <Extrainfocard
                      title="Secure Sharing"
                      description="Share your content securely with anyone."
                      icon={<Share2 size={24} />
                    } />
                    <Extrainfocard
                      title={"Secure API's"}
                      description="By default all API's are secure and require authentication before accessing content."
                      icon={<Link2 size={24} />}
                    />
                  </div>
                  <div>
                  <div className="flex flex-col w-full  items-start justify-start gap-3 mt-32 container">
                  <h1 className="lg:text-[52px] text-5xl px-4 font-bold text-start">Built for the modern business</h1>
                  <p className="lg:text-md text-sm px-4 text-muted-foreground text-start">
                    Textuality is the perfect tool for your next project. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.
                  </p>
                    </div>
                </div>
                </div>
                </div>
              </main>
              <Footer />
            </div>
        </div>
      </div>
    </div>
  )
}

function Extrainfocard({ title, description, icon }) {
  return(
    <div className="md:border-l md:last:border-r relative gap-2 py-10 flex flex-col duration-500 transition-colors md:border-b bg-transparent hover:bg-gradient-to-t from-neutral-200/60 to-transparent dark:hover:bg-gradient-to-t dark:from-neutral-900 dark:to-transparent border-muted dark:border-muted group-hover:border-muted-foreground p-4 w-full group">
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
