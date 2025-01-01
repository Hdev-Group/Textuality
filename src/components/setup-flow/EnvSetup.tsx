'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeOff, Eye, Copy, Check, AlertTriangle } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PageInfo {
  _id: string;
  accesstoken: string;
}

export default function EnvSetup({ pageInfo }: { pageInfo: PageInfo }) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'env' | 'code'>('env')

  const envContent = `TEXTUALITY_PAGE_ID=${pageInfo?._id}
TEXTUALITY_API_KEY=${showApiKey ? pageInfo?.accesstoken : '**********'}`

  const codeContent = `import { TextualityClient } from '@textuality/sdk'

const client = new TextualityClient({
  pageId: process.env.TEXTUALITY_PAGE_ID,
  apiKey: process.env.TEXTUALITY_API_KEY,
})

// Use the client to interact with the Textuality API
const result = await client.someMethod()`

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full border-none max-w-3xl gap-2 flex flex-col mx-auto">
        <CardTitle>Setup your Textuality API</CardTitle>
        <CardDescription>Configure your environment variables and start using the Textuality API</CardDescription>
      <CardContent className='mt-2'>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your API key controls access to your content and limits. Be cautious when sharing it.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'env' | 'code')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="env">Environment Variables</TabsTrigger>
            <TabsTrigger value="code">Code Example</TabsTrigger>
          </TabsList>
          <TabsContent value="env">
            <div className="relative">
              <SyntaxHighlighter 
                language="bash" 
                style={materialDark} 
                className="rounded-md"
              >
                {envContent}
              </SyntaxHighlighter>
              <div className="absolute top-2 right-2 space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(envContent)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <SyntaxHighlighter 
              language="javascript" 
              style={materialDark} 
              className="rounded-md"
            >
              {codeContent}
            </SyntaxHighlighter>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="pageId" className="block text-sm font-medium text-muted-foreground">
              Page ID
            </label>
            <Input
              id="pageId"
              value={pageInfo?._id}
              readOnly
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-muted-foreground">
              API Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={pageInfo?.accesstoken}
                readOnly
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-full"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

