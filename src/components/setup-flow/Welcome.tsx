import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

interface WelcomeProps {
pageInfo: any
}

export default function Welcome({ pageInfo }: WelcomeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setupSteps = [
    "Configure your environment",
    "Set up your content",
    "Configure API settings",
    "Review and finish"
  ]

  return (
    <div className={`transition-all duration-500 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Card className="shadow-none border-none">
        <CardHeader className="p-0">
          <div className="flex justify-start mb-4">
            <img src="/wordmarks/light-removebg-preview.png" alt="Textuality" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-start">Welcome to Textuality</h2>
          <p className="text-muted-foreground text-start mt-2">Let's get you set up in just a few easy steps</p>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <div className="space-y-2">
            {setupSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

