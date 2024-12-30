"use client"
import Image from "next/image"
import Header from "@/components/header/header"
import OverHeader from "@/components/header/overheader"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer/footer"
import { Cloud, Component, Pen, Stars, FileText, User, MessageSquare, Mail, Link2, Share2, Check, Star, BookMarkedIcon, FileSpreadsheetIcon, EditIcon, CloudUploadIcon, GalleryThumbnailsIcon, AreaChartIcon as ChartArea, Clock10Icon, FileLock, Shield, Hand, BriefcaseBusiness, ActivitySquare, CheckSquare, Play, Edit3, Users, Zap, BarChart2, LockIcon, Globe, Eye, ScreenShare, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from "next/link"
import { useState, useEffect, useRef } from 'react';
import { TypeIcon as type, type LucideIcon } from 'lucide-react'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function Home() {

    gsap.registerPlugin(ScrollTrigger);
    useEffect(() => {
      const headingWords = gsap.utils.toArray('.heading-word');
      gsap.fromTo(headingWords, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".main-heading",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none"
          }
        }
      );
    }, []);

    useEffect(() => {
      gsap.fromTo(".text-mid", 
      { y: 100, opacity: 0 },
      {
      scrollTrigger: {
      trigger: ".text-mid",
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none none",
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.8,
      ease: "bounce.out",
      }
      );
    }, []);

    useEffect(() => {
      gsap.fromTo(".fadeIn", 
      { y: 0, opacity: 0, filter: "blur(10px)" },
      {
      scrollTrigger: {
      trigger: ".fadeIn",
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none none",
      },
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      delay: 1.2,
      ease: "bounce.out",
      }
      );
    }, []);

    useEffect(() => {
      gsap.fromTo(".ZoomUp",
      { y: 100, opacity: 0 },
      {
      scrollTrigger: {
      trigger: ".ZoomUp",
      start: "top 80%",
      end: "top 20%",
      toggleActions: "play none none none",
      },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.8,
      }
      );
    }, []);

    useEffect(() => {
      gsap.to(".background-gradient", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    }, []);

    useEffect(() => {
      gsap.to(".title-secure", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".title-secure",
          start: "top 80%",
          end: "top 20%",
          scrub: 1
        }
      });
    } )

    useEffect(() => {
      const elements = document.querySelectorAll(".title-second");
      
      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 20, opacity: 0, filter: "blur(10px)" },
          {
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: 0,
            ease: "bounce.out",
          }
        );
      });
    
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, []);

    useEffect(() => {
      const elements = document.querySelectorAll(".title-third");
      
      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 20, opacity: 0, },
          {
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: 0.7,
            ease: "bounce.out",
          }
        );
      });
    
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, []);


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
          <div className="w-full relative justify-center flex-col items-center flex ">
            <OverHeader />
            <Header />
              <main className="flex-grow relative z-40 overflow-x-hidden bg-background w-full rounded-sm lg:mx-10 ">
                <div className="absolute left-1/2 top-[-50px] -translate-x-1/2 z-0 h-[80vh] w-[80vw] bg-[radial-gradient(ellipse_50%_80%_at_50%_-40%,rgba(64,224,208,0.3),rgba(255,255,255,0))] background-gradient"/>
                <div className="flex flex-col z-10 w-full items-center justify-start h-full">
                  <div className="container h-full px-4 md:px-1  mt-12 md:mt-44  mb-12">
                  <div className="flex flex-col lg:flex-row items-start justify-start w-full">
                    <div className="flex flex-col w-auto">
                      <h1 className="font-bold lg:text-[65px] text-5xl font-Funnel_Sansfont text-foreground main-heading">
                        <span className="heading-word">Content</span>{" "}
                        <span className="heading-word">management</span>{" "}
                        <span className="heading-word">that</span>{" "}
                        <span className="heading-word">brings</span>{" "}
                        <span className="heading-word">everyone</span>{" "}
                        <span className="heading-word">together</span>
                      </h1>
                      <p className="text-md text-muted-foreground mt-4 w-[90%] text-mid">Textuality is a new way to create, share, and manage your content. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.</p>
                      <div className="flex flex-row gap-2 mt-5">
                        <Link href="/application/home" className="fadeIn">
                          <Button size="lg">Get Started</Button>
                        </Link>
                        <Button variant="gradient" className="fadeIn" size="lg">Learn More</Button>
                      </div>
                    </div>
                    <VideoSection />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="dark:bg-neutral-900 ZoomUp w-11/12 h-auto px-0.5 mt-20 pb-0.5 shadow-md shadow-neutral-800/40 flex flex-col justify-center items-center rounded-lg">
                      <div className="w-full flex flex-row justify-between py-2">
                        <div className="flex flex-row gap-2 items-center w-full pl-3 justify-start">
                          <div className="bg-muted-foreground/30 md:w-4 md:h-4 h-3 w-3 rounded-full flex bg-red-400 transition-all items-center justify-center"/>
                          <div className="bg-muted-foreground/30 md:w-4 md:h-4 h-3 w-3 rounded-full flex bg-yellow-300 items-center justify-center"/>
                          <div className="bg-muted-foreground/30 md:w-4 md:h-4 h-3 w-3 rounded-full flex bg-green-400 items-center justify-center"/>
                        </div>
                        <div className="flex flex-row items-center w-full justify-center">
                          <div className="px-4 text-muted-foreground text-sm z-50 bg-white/20 flex items-center justify-center rounded-lg">
                            https://textuality.hdev.uk
                          </div>
                        </div>
                        <div className="w-full"></div>
                      </div>
                      <div className="w-full border-hidden">
                        <img src="/heromain.png" alt="img" className="w-full rounded-b-lg border-hidden h-auto" />
                      </div>
                    </div>
                  </div>
                  </div>
                  {/* <div className="w-full overflow-hidden flex items-center flex-col py-8">
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

                    </div>
                  </div> */}
                  <div className="flex flex-col container w-full lg:w-[80%] relative items-center justify-center gap-3 mt-20">
                  <div className="absolute inset-0 max-w-xs mx-auto h-44 blur-[118px]" style={{ background: 'linear-gradient(152.92deg, rgba(64, 224, 208, 0.2) 4.54%, rgba(64, 224, 208, 0.26) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)' }} />
                  <h1 className="lg:text-[52px] text-5xl font-bold text-center title-second">Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500"> expert level blogs</span>, easily</h1>
                    <p className="lg:text-md text-sm text-muted-foreground text-center px-2 w-full lg:w-1/2 title-third">
                      Recreate what's possible with Textuality. Our platform is designed to help you create content that's engaging, informative, and beautiful while we handle all the heavy lifting.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 feature-section">
                      <Extrainfocard title="Create" description="Create content with ease using our powerful editor." icon={<Pen />} />
                      <Extrainfocard title="Collaborate" description="Work with your team in real-time to create amazing content." icon={<Stars />} />
                      <Extrainfocard title="Publish" description="Publish your content to the web with a single click." icon={<FileText />} />
                    </div>
                  </div>
                </div>
                </main>
                <div className="w-full flex overflow-x-hidden">
                <div className="w-full rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-900/20 h-full  md:py-0 py-10 relative mt-20">
                    <h1 className="lg:text-[52px] text-5xl text-white mt-20 text-center">Industry-Disruptive content management software</h1>
                    <p className="text-md text-muted-foreground dark:text-muted-foreground text-center px-2 mt-2">
                      Textuality is the perfect tool for your next project. Whether you're a writer, designer, or developer, Textuality is the perfect tool for your next project.
                    </p>
                    <div className="flex flex-col md:flex-row justify-between w-full mx-10 mt-10">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-md font-semibold space-grotesk-600 text-blue-900 ">BEST IN CLASS</h1>
                        <h1 className="text-3xl font-bold space-grotesk-600 text-white">Leading with ease</h1>
                        <p className="text-md text-muted-foreground dark:text-muted-foreground">Our content management system is the most secure, user friendy, easy to use system on the market, With top sub second performance to get your content where it needs to go</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Low latency | ~750ms content delivery</p>
                          </div>
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Easy to use | No learning curve</p>
                          </div>
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Secure | End-to-end encryption</p>
                          </div>
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Secure | AES-256 bit encryption</p>
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
                        <h1 className="text-3xl font-bold space-grotesk-600 text-white">Backed by developers</h1>
                        <p className="text-md text-muted-foreground dark:text-muted-foreground text-wrap break-words w-[90%]">From easy to use API's to publishing and monitoring your content developers choose Textuality because we build with them in mind.</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>API-first | Easy to integrate</p>
                          </div>
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Monitoring | Real-time metrics</p>
                          </div>
                          <div className="flex flex-row gap-3 text-white">
                            <CheckSquare size={24} />
                            <p>Developer friendly | Easy to use</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <main className="flex-grow relative z-40 overflow-x-hidden bg-background w-full rounded-sm lg:mx-10 ">
                <div className="flex flex-col z-10 w-full items-center justify-start h-full">
                  <div className="flex flex-col w-full  items-start justify-start gap-3 mt-32 container relative">
                  <div className="absolute inset-0 max-w-xs  left-0 h-44 blur-[118px]" style={{ background: 'linear-gradient(152.92deg, rgba(64, 224, 208, 0.1) 4.54%, rgba(64, 224, 208, 0.16) 34.2%, rgba(37, 99, 235, 0.1) 77.55%)' }} />
                    <h1 className="lg:text-[52px] text-5xl px-4 font-bold text-start title-second">A <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-teal-600">secure foundation</span> to write on</h1>
                    <p className="lg:text-lg text-sm px-4 text-muted-foreground text-start title-third">
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
                  <div className="w-full mt-20 flex flex-col relative container">
                    <h1 className="lg:text-[52px] text-5xl px-4 font-bold text-end title-second">An <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-400">easy way</span> to do content.</h1>
                    <p className="lg:text-lg text-sm px-4 text-muted-foreground text-end title-third">
                      With multiple real time tools to help visulise how your content will look, Textuality is the perfect tool for your next project.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10 px-2">
                      <DiffFeatureCard
                        icon={Eye}
                        title="Content Visualization"
                        description="Visualize your content in real-time with our powerful visualization tools."
                      />
                      <DiffFeatureCard
                        icon={Check}
                        title="Content Review"
                        description="Ensure your content meets team standards by reviewing your team's content."
                      />
                      <DiffFeatureCard
                        icon={Edit3}
                        title="Content Editing"
                        description="Edit your content with our powerful and intuitive editing tools."
                      />
                      <DiffFeatureCard
                        icon={ScreenShare}
                        title="Split Screen"
                        description="Use both your screens to edit and see your content in real-time."
                      />
                      <DiffFeatureCard
                        icon={Globe}
                        title="Instant Components"
                        description="Use Textuality's in-house NPM components to have your blog up in minutes."
                      />
                      <DiffFeatureCard
                        icon={Save}
                        title="Automatic Saving"
                        description="Never lose your work with Textuality's automatic saving feature."
                      />
                    </div>
                  </div>
                  <section className="w-full mt-20 py-20">
                    <div className="container mx-auto px-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                      >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 title-second">
                            Don't just take it from us
                          </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto title-third">
                          See what our users have to say about their experience with Textuality.
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TestimonialCard
                          content="Textuality has revolutionized our content creation process. It's intuitive and powerful!"
                          author="Jane Doe"
                          role="Content Manager"
                          avatarSrc="/avatars/jane-doe.png"
                        />
                        <TestimonialCard
                          content="The collaboration features are top-notch. Our team's productivity has skyrocketed."
                          author="John Smith"
                          role="Editor-in-Chief"
                          avatarSrc="/avatars/john-smith.png"
                        />
                        <TestimonialCard
                          content="As a developer, I appreciate the API-first approach. Integration was a breeze!"
                          author="Alex Johnson"
                          role="Senior Developer"
                          avatarSrc="/avatars/alex-johnson.png"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </main>
          <Footer />
        </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface TestimonialCardProps {
  content: string
  author: string
  role: string
  avatarSrc: string
}
export function TestimonialCard({ content, author, role, avatarSrc }: TestimonialCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <blockquote className="text-lg font-medium text-muted-foreground mb-4">"{content}"</blockquote>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={avatarSrc} alt={author} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnimatedFeatureProps {
  icon: LucideIcon
  title: string
  description: string
}
function AnimatedFeature({ icon: Icon, title, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group flex items-center space-x-4 p-4 rounded-lg bg-muted/20 border border-muted shadow-md transition-shadow duration-300 hover:shadow-xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.div
        className="flex-shrink-0 p-4 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-lg"
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      <div className="flex flex-col">
        <motion.h3
          className="text-xl font-semibold text-gray-300 group-hover:text-cyan-300 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
function BlurCard({title, description, icon}){
  return (
    <Card className="overflow-hidden bg-gradient-to-br h-[20rem] gap-5 flex flex-col from-background/80 to-background/40 backdrop-blur-xl border-muted/15 group hover:border-primary/50 transition-all duration-300">
      <CardHeader className="relative z-10">
        <motion.div

          className="text-primary/80 group-hover:text-primary transition-colors duration-300"
        >
          {icon}
        </motion.div>
      </CardHeader>
      <CardContent className="relative z-10">
        <CardTitle className="text-4xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-md">{description}</p>
      </CardContent>
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(64, 224, 208, 0.1), transparent 50%), radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.1), transparent 50%)",
        }}
      />
    </Card>
  )
}

function Extrainfocard({ title, description, icon }) {
  return(
    <div className="feature-card md:border-l md:last:border-r backdrop-blur-xl relative gap-2 py-10 flex flex-col duration-500 transition-colors md:border-b bg-transparent hover:bg-gradient-to-t from-neutral-200/60 to-transparent dark:hover:bg-gradient-to-t dark:from-neutral-900 dark:to-transparent border-muted dark:border-muted group-hover:border-muted-foreground p-4 w-full group">
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


const VideoSection = () => {

  useEffect(() => {
    gsap.fromTo(".fadeInvideo", 
    { y: 0, opacity: 0, filter: "blur(10px)" },
    {
    scrollTrigger: {
    trigger: ".fadeInvideo",
    start: "top 80%",
    end: "top 20%",
    toggleActions: "play none none none",
    },
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1,
    delay: 1.2,
    ease: "bounce.out",
    }
    );
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (!isPlaying) { // If video is not playing, play and unmute
        videoRef.current.play();
        videoRef.current.muted = false;
        videoRef.current.setAttribute('controls', 'controls');

      } else { 
        videoRef.current.pause();
        videoRef.current.setAttribute('muted', 'muted');
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex w-full h-full fadeInvideo z-50 lg:mt-[-10rem]">
      <div className="spinnercard borderspincard">
        <div className="inner group z-10 relative items-center flex justify-center">
          {
            !isPlaying ? (
              <button
              className="group absolute z-50 inset-0 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 m-auto"
              onClick={handlePlayPause}
              aria-label="Play/Pause video"
            >
              <div className="absolute inset-0 rounded-full opacity-75"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <Play className="w-8 h-8 text-white transition-transform duration-300 ease-out group-hover:scale-125" />
              </div>
              {isPlaying && (
                <span className="absolute inset-0 rounded-full animate-ripple bg-white opacity-25"></span>
              )}
            </button>
            ) : null
          }
          <video
            ref={videoRef}
            loop
            muted
            autoPlay
            className="w-full h-full object-cover"
          >
            <source src="/HeroVid.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}
function DiffFeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group border rounded-lg p-6 hover:border-primary/60 transition-all duration-300 ease-in-out border-border bg-card hover:bg-card/80 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{description}</p>
    </div>
  )
}