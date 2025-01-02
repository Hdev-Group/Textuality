import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import { ContentCreateButton } from '@/app/application/[_teamid]/content/contentMain'

interface WelcomeProps {
pageInfo: any
}

export default function CreateContent({ pageInfo }: WelcomeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`transition-all duration-500 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Card className="shadow-none border-none">
        <CardHeader className="p-0">
          <h2 className="text-2xl font-bold text-start">Create your content</h2>
          <p className="text-muted-foreground text-start mt-2">Let's now make your content to put on your website.</p>
        </CardHeader>
        <CardContent className="p-0 flex flex-col mt-2">
            <p className="text-muted-foreground text-start mt-2">Click the button below to create your content. You may need to create a template before you can start making content.</p>
            <div className="space-y-2 w-full mt-4">
                <ContentCreateButton className="w-full" _teamid={pageInfo._id} />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

