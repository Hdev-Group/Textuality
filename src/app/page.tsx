"use client"
import Image from "next/image"
import { useState } from "react"
import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Footer from "@/components/footer/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Cloud, Component, Pen, Stars, FileText, User, MessageSquare, Mail, Link2, Share2, Check, Star} from "lucide-react"
import { motion } from 'framer-motion'
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto overflow-x-auto pt-28 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="movinggradient h-[50rem] justify-center flex flex-col rounded-3xl mx-auto text-center py-12 md:py-24">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl">
          <span className="text-primary flex justify-center gap-0">Transform your content. <br/> Engage your audience. Seamlessly</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground md:text-2xl">

        </p>
        <div>
          <button className="mt-8 px-10 md:w-1/6 bg-black h-full hover:bg-neutral-600/90 transition-all hover:ring-1 hover:ring-blue-300 rounded-full text-white text-lg font-bold">
              Start blogging
          </button>
        </div>
        </section>

        {/* Features Section */}
        <section className="container flex-col flex h-auto mx-auto py-12 md:py-24">
          <h1 className="text-3xl font-bold text-left mb-12">Personalise, Create, Push your content.</h1>
          <div className="flex flex-col md:flex-row gap-7 justify-between">              
            <div className="w-full h-full min-h-56  rounded-xl flex-col p-8 gap-5 border-2 flex">
                <div className="h-12 w-12 text-white flex items-center justify-center bg-blue-400 rounded-lg">
                  <Component size={32} name="edit-3" />
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="font-medium text-lg">Pixel Perfect Components</h1>
                  <p className="text-muted-foreground">Create beautiful blog layouts with our prebuilt components.</p>
                </div>
                <a>
                  <Button>Learn More</Button>
                </a>
            </div>
            <div className="w-full h-full min-h-56  rounded-xl flex-col p-8 gap-5 border-2 flex">
                <div className="h-12 w-12 bg-yellow-400 flex items-center justify-center text-white rounded-lg">
                  <Pen size={32} />
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="font-medium text-lg">Customize to your liking</h1>
                  <p className="text-muted-foreground">Change colors, fonts, and layout to match your brand.</p>
                </div>
                <a>
                  <Button>Learn More</Button>
                </a>
            </div>
            <div className="w-full h-full min-h-56  rounded-xl flex-col p-8 gap-5 border-2 flex">
                <div className="h-12 w-12 bg-purple-400 flex items-center justify-center text-white rounded-lg">
                  <Cloud size={32} />
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="font-medium text-lg">Seamless Integration</h1>
                  <p className="text-muted-foreground">Easily integrate with your existing blog or website.</p>
                </div>
                <a>
                  <Button>Learn More</Button>
                </a>
            </div>
            <div className="w-full h-full min-h-56  rounded-xl flex-col p-8 gap-5 border-2 flex">
                <div className="h-12 w-12 bg-green-400 flex items-center justify-center text-white rounded-lg">
                  <Stars size={32} />
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="font-medium text-lg">SEO Optimized</h1>
                  <p className="text-muted-foreground">Improve your search engine rankings with our SEO tools.</p>
                </div>
                <a>
                  <Button>Learn More</Button>
                </a>
            </div>
          </div>
        </section>
        <Separator />

        {/* Showcase Section */}
        <PrebuiltBlogComponents />

        <Separator />

        <Reviews />

        <Separator />

        <Prices />

        <Separator />

        {/* Call to Action Section */}
        <section className="container mx-auto text-center py-12 bg-gradient-to-tr from-teal-500/40 to-purple-700/40 dark:from-teal-500/20 dark:to-purple-400/20 rounded-3xl mb-12 mt-12 md:py-24">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Blog?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of content creators who trust HContent for their blogging needs
          </p>
          <Button size="lg">Sign Up Now</Button>
        </section>
        <Footer />
      </main>
    </>
  )
}

const blogComponents = [
  {
    name: "Article Card",
    icon: FileText,
    description: "Showcase your blog posts with style",
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>10 Tips for Better Productivity</CardTitle>
          <CardDescription>By Harry Campbell | 5 min read</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Boost your productivity with these simple yet effective tips...</p>
          <Button variant="link">Read More</Button>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Author Bio",
    icon: User,
    description: "Highlight the writer behind the words",
    preview: (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div>
            <CardTitle>Hdev Group HQ</CardTitle>
            <CardDescription>Explore what our company gets up to.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>The Hdev group is a software development company...</p>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Comment Section",
    icon: MessageSquare,
    description: "Foster engagement with a sleek comment area",
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Comments (2)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-semibold">Alice</p>
              <p>Great article! Very informative.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-semibold">Bob</p>
              <p>Thanks for sharing these insights!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Newsletter Signup",
    icon: Mail,
    description: "Grow your audience with an email form",
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to Our Newsletter</CardTitle>
          <CardDescription>Get the latest updates delivered to your inbox</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-grow px-3 py-2 border rounded" />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Related Posts",
    icon: Link2,
    description: "Keep readers engaged with suggestions",
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Related Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li><Button variant="link">5 Must-Have Productivity Apps</Button></li>
            <li><Button variant="link">The Art of Time Management</Button></li>
            <li><Button variant="link">Mindfulness at Work: A Beginner's Guide</Button></li>
          </ul>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Social Share",
    icon: Share2,
    description: "Spread the word with easy sharing",
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>Share This Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Link2 className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    )
  },
]

function PrebuiltBlogComponents() {
  const [activeTab, setActiveTab] = useState(blogComponents[0].name)

  return (
    <section className="container mx-auto py-12 md:py-24">
      <h2 className="text-3xl font-bold text-left mb-12">Prebuilt Blog Components,<br/> That will make you stand out.</h2>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 h-auto md:grid-cols-3 lg:grid-cols-6 gap-4">
          {blogComponents.map((component) => (
            <TabsTrigger
              key={component.name}
              value={component.name}
              className="flex flex-col items-center gap-2 p-4"
            >
              <component.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{component.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {blogComponents.map((component) => (
          <TabsContent key={component.name} value={component.name} className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{component.name}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Features:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Fully customizable design</li>
                      <li>Responsive layout</li>
                      <li>Easy integration with existing blogs</li>
                      <li>Optimized for performance</li>
                    </ul>
                    <Button>Add to Your Blog</Button>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-muted p-4 rounded-lg"
                  >
                    {component.preview}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

function Reviews() {
  const reviews = [
    {
      name: "Harry Campbell",
      role: "CEO, Hdev Group",
      content: "HContent has been a game changer for our blog. The prebuilt components make it easy to create stunning layouts in minutes.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Alice Johnson",
      role: "Freelance Writer",
      content: "I've tried many blogging platforms, but HContent is by far the best. The customization options are endless, and the support team is top-notch.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
  ]

  return (
    <section className="container mx-auto py-12 md:py-24">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Are Saying</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.name} />
                <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{review.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">{`"${review.content}"`}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
function Prices() {


  const plans = [
    {
      name: "Free",
      price: "£0",
      description: "Perfect for getting started",
      features: ["5 blog posts", "Basic components", "Email support", "500k/month API requests"],
    },
    {
      name: "Pro",
      price: "£19",
      description: "Best for growing blogs",
      features: ["Unlimited blog posts", "Advanced components", "Email + chat support", "1M/month API requests"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "£49",
      description: "For large-scale operations",
      features: ["Unlimited blog posts", "Custom components", "24/7 support", "50M/month API requests"],
    },
  ]

  return (
    <section className="container mx-auto py-12 md:py-24">
      <div className="text-left mb-12">
        <h2 className="text-3xl font-bold mb-2">Simple Pricing</h2>
        <p className="text-xl text-muted-foreground">Choose a plan that's right for you</p>
        <p className="text-sm font-medium mt-2">No hidden fees. Cancel anytime.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg md:rounded-md rounded-none' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow relative">
              {
                plan.popular && (
                  <div className="flex items-center mb-4 absolute top-[-127.9px] left-0 w-full justify-center">
                    <div className="flex flex-row gap-0.5 items-center px-5 py-1 md:w-auto w-full justify-center rounded-t-xl border-white border border-b-transparent">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-primary font-semibold text-sm ml-2">Most Popular</span>
                    </div>
                  </div>
                )
              }
              <div className="text-4xl font-bold mb-4">
                {plan.price}<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground' : ''}`}>
                Get Started
              </Button>
            </CardFooter>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}