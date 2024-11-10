"use client"
import Image from "next/image"
import { useState } from "react"
import Header from "@/components/header/header"
import OverHeader from "@/components/header/overheader"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer/footer"
import {Cloud, Component, Pen, Stars, FileText, User, MessageSquare, Mail, Link2, Share2, Check, Star, BookMarkedIcon, FileSpreadsheetIcon, EditIcon, CloudUploadIcon, GalleryThumbnailsIcon, ChartArea, Clock10Icon, FileLock} from "lucide-react"
import { motion } from 'framer-motion'


export default function Home() {
  return (
    <>
      <body className="flex bg flex-col min-h-screen w-full items-center justify-center">
        <div className="flex items-center justify-center ">
          <div className="border-x bg-background border-neutral-600 max-w-[2000px] w-full z-30  dark:border-white/50 rounded-sm lg:mx-10 lg:mb-10 border-y">
            <OverHeader />
            <Header />
              <main className="flex-grow relative z-40 overflow-x-hidden">
                <div className=" h-full mt-5">
                  <section className="flex flex-col items-center mt-10  justify-center">
                    <div className="flex flex-col lg:flex-row items-end container mx-auto px-4 sm:px-6 lg:px-8 justify-center gap-14 md:gap-24">
                      <div className="flex relative">
                      <h1 className="font-bold flex  flex-row flex-wrap text-center lg:flex-col sm:text-start md:text-7xl sm:text-5xl text-5xl gap-2 lg:gap-0 lg:text-8xl space-grotesk-600 bg-gradient-to-r from-neutral-900 dark:from-pink-100 to-cyan-700 dark:to-cyan-200 bg-clip-text text-transparent"><span>Content</span> <span>management</span> <span>that brings</span> <span>everyone</span>  together</h1>
                      <div className="absolute right-[230px] lg:right-[-30px] md:block hidden md:top-[60px] lg:top-[85px]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="-rotate-90" width="50" height="50" fill="none"><g stroke="#fff" strokeMiterlimit="10" strokeOpacity="0.9"><path d="M11.758 29.852 1.052 40.382M21.514 33.9l-.82 14.893M30.636 30.011l10.531 10.706M34.574 20.843l15.115-.358M30.791 11.13 41.497.598"></path></g></svg>
                      </div>
                      </div>
                      <div className="flex flex-col lg:w-1/3 justify-center space-y-4">
                        <div className="w-auto flex flex-col gap-4">
                          <p className="lg:text-2xl md:text-xl sm:text-md text-start space-grotesk-400">
                            Create quick event announcements or dive deep into detailed blogs with stunning, customized components—all in one collaborative, real-time workspace.
                          </p>
                        <div className="flex flex-col md:flex-row gap-4">
                          <a href="/application/home">
                            <Button className="font-semibold md:w-auto w-full" size="lg">Get Textuality free</Button>
                          </a>
                          <Button className="font-semibold" size="lg" variant="outline">Learn more</Button>
                        </div>
                        </div>
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, translateY: 50 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 1 }} className="flex flex-col items-center mt-10 justify-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 justify-center flex mt-32">
                      <img src="https://hdev.uk/textuality/textuality-6.png" alt="Textuality" className="object-cover border overflow-hidden rounded-xl w-full" />
                    </div>
                    </motion.div>
                    <div className="my-10 mt-24 border-y  flex items-start justify-start py-10 border-dashed w-full">
                        <div className="container mx-auto  w-full px-4 sm:px-6 lg:px-8 flex ">
                        <h1 className="text-6xl space-grotesk-800 text-start bg-gradient-to-r from-black to-black dark:bg-gradient-to-r dark:from-accent-foreground dark:via-pink-500 dark:to-pink-500 bg-clip-text text-transparent">All the features you need to manage your content, <br/>
                        In one place.</h1>
                        </div>
                      </div>
                    <div className=" mx-auto w-full px-4 sm:px-6 lg:px-8 flex mt-12">
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-20">
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Main Feature Section */}
                          <div className="flex flex-col gap-6 w-full lg:w-1/3">
                            <FileSpreadsheetIcon size={50} />
                            <h1 className="text-xl sm:text-6xl space-grotesk-600 font-bold leading-tight">
                              Instant Visual Collaboration
                            </h1>
                            <p className="text-cyan-400 text-md sm:text-lg">
                              Create, edit, and publish content with your team in real-time. With Textuality, you can collaborate visually and seamlessly.
                            </p>
                          </div>
                          <motion.div initial={{ opacity: 0, translateY: -50 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 1 }}  className="flex flex-col w-full h-full">
                          <img src="https://hdev.uk/textuality/textuality-5.png" alt="Textuality" className="object-cover border overflow-hidden rounded-xl w-full" />
                          </motion.div>
                        </div>
                        <div className="flex flex-col lg:flex-row items-end gap-8 mb-10">
                          {/* Main Feature Section */}
                          <motion.div initial={{ opacity: 0, translateY: 50 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 1 }}  className="lg:flex hidden flex-col w-full h-full">
                            <img src="https://hdev.uk/textuality/textuality-2.png" alt="Textuality" className="object-cover border overflow-hidden rounded-xl w-full" />
                          </motion.div>
                          <div className="flex flex-col gap-6 w-full lg:w-1/3">
                            <FileSpreadsheetIcon size={50} />
                            <h1 className="text-xl sm:text-6xl space-grotesk-600 font-bold leading-tight">
                              Real-time Content Management
                            </h1>
                            <p className="text-cyan-400 text-md sm:text-lg">
                              Chat about it, edit it, and publish it—all in one place. With Textuality, you can create, collaborate, and publish content in real-time.
                            </p>
                          </div>
                          <div className="lg:hidden flex flex-col w-full h-full">
                            <img src="https://hdev.uk/textuality/textuality-2.png" alt="Textuality" className="object-cover border overflow-hidden rounded-xl w-full" />
                          </div>
                        </div>
                        </div>
                          {/* Additional Features Section */}
                          <div className="flex flex-col md:flex-row mt-10">
                            {/* Feature 1 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <EditIcon size={50} />
                              <h2 className="text-2xl font-semibold ">Advanced Editing Tools</h2>
                              <p className="text-gray-400 text-base">
                                Enjoy a rich text editor with support for formatting, media embedding, and custom styling to ensure your content shines.
                              </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <CloudUploadIcon size={50} />
                              <h2 className="text-2xl font-semibold ">Cloud Storage</h2>
                              <p className="text-gray-400 text-base">
                                Save your drafts and published works to the cloud for secure access from any device, anytime.
                              </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <GalleryThumbnailsIcon size={50} />
                              <h2 className="text-2xl font-semibold ">Seamless Collaboration</h2>
                              <p className="text-gray-400 text-base">
                                Collaborate with team members in real-time, with instant updates and shared editing rights for seamless teamwork.
                              </p>
                            </div>
                          </div>

                          {/* Additional Features Row 2 */}
                          <div className="flex flex-col sm:flex-row ">
                            {/* Feature 4 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <ChartArea size={50} />
                              <h2 className="text-2xl font-semibold ">Content Analytics</h2>
                              <p className="text-gray-400 text-base">
                                Track engagement metrics, view audience insights, and optimize content based on performance data.
                              </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <Clock10Icon size={50} />
                              <h2 className="text-2xl font-semibold ">Scheduled Publishing</h2>
                              <p className="text-gray-400 text-base">
                                Plan ahead by scheduling posts for future publication, keeping your content calendar organized and on track.
                              </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="flex flex-col w-full border p-3 shadow-sm hover:shadow-accent-foreground hover:shadow-md hover:border-accent-foreground transition-all items-start gap-4 sm:w-1/3">
                              <FileLock size={50} />
                              <h2 className="text-2xl font-semibold ">Top-notch Security</h2>
                              <p className="text-gray-400 text-base">
                                Protect your content and user data with industry-leading security measures and encryption.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-10 mt-24 border-y flex items-start justify-start py-10 border-dashed w-full">
                        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 flex ">
                        <h1 className="text-6xl space-grotesk-800  text-start bg-gradient-to-r from-black to-black dark:bg-gradient-to-r dark:from-accent-foreground dark:via-pink-500 dark:to-pink-50 bg-clip-text text-transparent">Built for security and control</h1>
                        </div>
                      </div>
                      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 flex ">
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-8">
                            {/* Main Feature Section */}
                            <div className="flex flex-col gap-6 w-full md:w-1/3">
                              <h1 className="text-3xl text-pink-300 font-medium leading-tight">
                                Enterprise-grade security and privacy compliance for you.
                              </h1>
                              <div className="gap-0.5 flex flex-col">
                                <h2 className="text-2xl font-semibold">
                                  Effective authentication and authorization.
                                </h2>
                                <p className="text-pink-400 text-md">
                                  Google sign-in option, two-factor authentication, and role-based access control.
                                </p>
                              </div>
                              <div className="gap-0.5 flex flex-col">
                                <h2 className="text-2xl font-semibold">
                                  Secure databases and data encryption.
                                </h2>
                                <p className="text-pink-400 text-md">
                                  End-to-end encryption, secure data storage, and regular security audits.
                                </p>
                              </div>
                            </div>
                            <div className="hidden md:flex flex-col  md:w-1/2 h-full">
                              <img src="/IMG_6128.png" alt="Textuality" className="object-cover" />
                            </div>
                          </div>
                          </div>
                          </div>
                          <div className="mt-24 border-y flex items-start justify-start py-10 border-dashed w-full">
                            <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 flex ">
                              <h1 className="text-6xl space-grotesk-800  text-start bg-gradient-to-r from-black to-black dark:bg-gradient-to-r dark:from-accent-foreground dark:via-pink-500 dark:to-pink-50 bg-clip-text text-transparent">Ready to transform your content?
                              </h1>
                            </div>
                          </div>
                          <div className="mb-10 border-y flex items-center justify-center border-dashed w-full">
                            <div className="md:container md:mx-auto justify-center items-center w-full lg:px-8 flex ">
                              <div className="flex flex-col md:flex-row w-full gap-4">
                                <div className="flex flex-col px-8 md:items-end py-10 border-b md:border-r md:px-4 border-dashed h-full gap-4 w-full">
                                  <div className="flex flex-col items-start">
                                  <h2 className="text-3xl space-grotesk-800 text-start">Getting started in a few clicks</h2>
                                  <p className="text-lg text-pink-300 w-[80%]">Setup and connect Textuality to your website and start to make great things</p>
                                  <a href="/application/home" className="w-full">
                                    <Button className="font-semibold w-full mt-4 text-lg" size="lg" >Get Started</Button>
                                  </a>
                                </div>
                                </div>
                                <div className="flex flex-col px-8 gap-4 items-start w-full py-10">
                                  <h2 className="text-lg space-grotesk-400 text-start">Need some more power? Check out our plans to fit with you, your team or organization.</h2>
                                  <a href="/pricing" className="md:w-auto w-full">
                                    <Button className="font-semibold"  variant="outline">View Pricing</Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                    </section>
                  <Footer />
                </div>
            </main>
            </div>
        </div>
      </body>
    </>
  )
}
