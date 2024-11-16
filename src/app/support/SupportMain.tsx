"use client"
import Header from "@/components/header/header"
import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search, LifeBuoy, Book, MessageCircle, Mail } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Footer from "@/components/footer/footer";
export default function SupportPage(){
    const user = useUser();

    const [searchQuery, setSearchQuery] = useState('')

    const supportCategories = [
      { icon: <LifeBuoy className="h-6 w-6" />, title: 'General Help' },
      { icon: <Book className="h-6 w-6" />, title: 'Documentation' },
      { icon: <MessageCircle className="h-6 w-6" />, title: 'Live Chat' },
      { icon: <Mail className="h-6 w-6" />, title: 'Email Support' },
      { icon: <LifeBuoy className="h-6 w-6" />, title: 'General Help' },
    ]
  
    const faqs = [
      { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.' },
      { question: 'Can I change my username?', answer: 'Yes, you can change your username in your account settings.' },
      { question: 'How do I cancel my subscription?', answer: 'To cancel your subscription, please go to your account settings and select "Manage Subscription".' },
    ]

    return (
        <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center `}>
        <div className="flex items-center justify-center">
          <div className="border-x  border-neutral-600 h-full max-w-[2000px] w-full z-30 dark:border-white/50 rounded-sm lg:mx-10 lg:mb-10 border-b">
            <Header />
            <div className="flex flex-col w-full items-center">
              <div className="flex flex-col w-full items-center gap-7 h-full">
                <div className="bgfader w-full h-[27rem] flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col mt-10 items-center gap-0.5 px-4">
                      <h1 className="text-6xl space-grotesk-600 text-left md:text-center text-foreground">How can we help, {user?.user?.firstName}?</h1>
                    </div>
                    <p className="text-xl text-left mt-1 text-muted-foreground px-4">
                      Search our knowledge base or browse categories below.
                    </p>
                  </div>
                  <div className="flex w-full z-50 mt-10 px-4 md:max-w-sm mx-auto items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search for help..."
                      className="z-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Search className="w-4 h-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                </div>
                </div>
              </div>
              <div className="container flex flex-col w-full items-center justify-center">
                <h1 className="text-4xl font-bold tracking-tighter">Your Support Tickets</h1>
                
              </div>
              <div className="container flex flex-col w-full items-center justify-center">
                <h1 className="text-4xl font-bold tracking-tighter">Popular Categories</h1>
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4 md:px-0">
                    {supportCategories.map((category, index) => (
                      <Button key={index} variant="outline" className="h-24 w-full flex flex-col items-center justify-center space-y-2">
                        {category.icon}
                        <span>{category.title}</span>
                      </Button>
                    ))}
                  </div>
              </div>

              <div className="space-y-4 my-10 w-full container">
                <h2 className="text-2xl font-bold tracking-tighter">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Footer />
        </div>
        </div>
        </body>
    )
}