'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileCode, Copy, CheckCircle, ExternalLink } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

export default function ContentSetup() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const fetchExample = `import { useState, useEffect } from 'react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/textuality/full")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBlogs(data.blogs);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {blogs.map((blog) => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  );
}`

  const displayExample = `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function BlogGrid() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/textuality/full")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBlogs(data.blogs);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <Card key={blog.id}>
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
            <p className="mt-2">{blog.content.substring(0, 100)}...</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`

  return (
      <CardContent>
        <div className="flex items-center justify-between mb-5">
          <div>
            <CardTitle className="text-2xl">Your Content Page Setup</CardTitle>
            <CardDescription>Learn how to fetch and display your blog content</CardDescription>
          </div>
        </div>
        <div className="space-y-6">
          <Alert>
            <FileCode className="h-4 w-4" />
            <AlertTitle>Getting Started</AlertTitle>
            <AlertDescription>
              Follow these steps to integrate your blog content into your Next.js application.
            </AlertDescription>
          </Alert>
          <Tabs defaultValue="fetch">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fetch">Fetch Data</TabsTrigger>
              <TabsTrigger value="display">Display Content</TabsTrigger>
            </TabsList>
            <TabsContent value="fetch">
              <div className="relative">
                <SyntaxHighlighter 
                  language="javascript" 
                  style={materialDark} 
                  className="rounded-md overflow-scroll max-h-[400px]"
                >
                  {fetchExample}
                </SyntaxHighlighter>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(fetchExample, 'fetch')}
                      >
                        {copiedTab === 'fetch' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedTab === 'fetch' ? 'Copied!' : 'Copy code'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsContent>
            <TabsContent value="display">
              <div className="relative">
                <SyntaxHighlighter 
                  language="javascript" 
                  style={materialDark} 
                  className="rounded-md overflow-scroll max-h-[400px]"
                >
                  {displayExample}
                </SyntaxHighlighter>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(displayExample, 'display')}
                      >
                        {copiedTab === 'display' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedTab === 'display' ? 'Copied!' : 'Copy code'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Need more help? Check out our detailed documentation.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href='https://textualitydocs.hdev.uk/setup/#general-blog-page'>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open documentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
  )
}