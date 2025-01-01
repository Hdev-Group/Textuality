import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { api } from '../../../convex/_generated/api'
import { query } from '../../../convex/_generated/server'
import { useQuery } from 'convex/react'
import Link from 'next/link'


const apiCode = `import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const token = process.env.TEXTUALITY_API_KEY;
  const pageid = process.env.TEXTUALITY_PAGE_ID;

  const response = await fetch("http://textuality.hdev.uk/api/content/full/{pageid}", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    }
  });
  const data = await response.json();
  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  } else {
    return NextResponse.json({ blogs: data }, { status: 200 });
  }
}`

const usageCode = `import { useEffect, useState } from 'react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/textuality/full')
      .then(response => response.json())
      .then(data => {
        setBlogs(data.blogs);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {blogs.map(blog => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  );
}`

export default function ApiSetup({ pageInfo }: { pageInfo: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [responseData, setResponseData] = useState<string | null>(null)
  const getAnalytics = useQuery(api.analytics.getAnalytics, { pageid: pageInfo?._id })

  const handleApiRequest = async () => {
    setIsLoading(true)
    setStatus('idle')
    setResponseData(null)
    if (getAnalytics.length >= 1) {
      setStatus('success')
      setResponseData(JSON.stringify(getAnalytics, null, 2))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className='flex flex-col w-full items-start justify-start mt-4 space-y-6'>
      <div className="flex items-center space-x-2">
        <h3 className='text-2xl font-bold'>Your API Setup</h3>
      </div>
      <Alert>
        <AlertTitle>Endpoint URL</AlertTitle>
        <AlertDescription className="font-mono">/api/textuality/full</AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList>
          <TabsTrigger value="setup">API Setup</TabsTrigger>
          <TabsTrigger value="usage">Usage Example</TabsTrigger>
        </TabsList>
        <TabsContent value="setup">
          <div className="relative">
            <SyntaxHighlighter language="javascript" style={materialDark} className="w-full rounded-lg overflow-scroll max-h-[400px]">
              {apiCode}
            </SyntaxHighlighter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(apiCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
        <TabsContent value="usage">
          <div className="relative">
            <SyntaxHighlighter language="javascript" style={materialDark} className="rounded-md overflow-scroll max-h-[400px]">
              {usageCode}
            </SyntaxHighlighter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(usageCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center space-x-4">
        <Button 
          onClick={handleApiRequest} 
          disabled={isLoading}
          className="transition-all duration-300"
          variant={status === 'success' ? 'publish' : 'default'}
        >
            {isLoading && status !== 'success' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
            ) : status === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Success
            </>
            ) : (
            'Test API'
            )}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href='https://textualitydocs.hdev.uk/setup/'>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open API documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {status !== 'idle' && (
        <Alert variant={status === 'success' ? 'default' : 'destructive'}>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>{status === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>
            {status === 'success' ? 'We have got your request!' : 'An error occurred during the API request.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

