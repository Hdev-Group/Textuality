'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import HeroComponent from './components/hero'
import FeatureCardComponent from './components/featurecard'
import CallToActionComponent from './components/cta'
import { Star } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { Textarea } from '../ui/textarea'

export default function ComponentCustomization() {
    const { user } = useUser()
  const [blogpost, setblogpostProps] = useState({
    Author: `${user.firstName} ${user.lastName}`,
    title: 'A blog preview',
    readtimeon: true,
    bodytext: 'This is the body text of the blog post. It can be as long as you want it to be (up to 2000 chars for the preview).',
    tags: ['cool', 'editable', 'component'],
    bannerimage: "https://i.pinimg.com/originals/dd/5a/6b/dd5a6bebdb5854f9d988abd62ec8e121.jpg",
    boldText: '',
    hoverandlinks: ''
  })

  const [featureProps, setFeatureProps] = useState({
    title: 'Cool Blog Name',
    description: 'This blog is the best blog ever. It has all the best posts and the best content. You should definitely read it.',
    totalposts: "3",
    borderhovercolour: 'rgb(135, 135, 135)',
    bordercolour: 'rgb(106, 106, 106)',
  })

  const [ctaProps, setCtaProps] = useState({
    title: 'Ready to get started?',
    description: 'Join thousands of satisfied customers today.',
    buttonText: 'Sign Up Now',
    backgroundColor: '#4F46E5'
  })

  return (
    <div className="p-6 overflow-y-auto max-h-full pb-36">
      <h1 className="text-2xl font-bold mb-6">Component Customization</h1>
      <Tabs defaultValue="blogpost">
        <TabsList>
          <TabsTrigger value="blogpost">Blog Post</TabsTrigger>
          <TabsTrigger value="postsection">Post Section</TabsTrigger>
          <TabsTrigger value="cta">Reviews</TabsTrigger>
          <TabsTrigger value='share'>Share</TabsTrigger>
          <TabsTrigger value='comment'>Comment</TabsTrigger>
          <TabsTrigger value='articlecard'>Article Card</TabsTrigger>
          <TabsTrigger value='newsletter'>Newsletter</TabsTrigger>
        </TabsList>
        <TabsContent value="blogpost">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 mt-4">Blog Post Customization</h2>
              <div className="space-y-4">
                <div>
                    <Label htmlFor="heroBackgroundImage">Banner Image</Label>
                    <Input id="heroBackgroundImage" value={blogpost.bannerimage} onChange={(e) => setblogpostProps({...blogpost, bannerimage: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="heroTitle">Title</Label>
                  <Input id="heroTitle" maxLength={150} value={blogpost.title} onChange={(e) => setblogpostProps({...blogpost, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Author</Label>
                  <Input id="heroSubtitle" value={blogpost.Author} onChange={(e) => setblogpostProps({...blogpost, Author: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="heroCtaText">Body Text</Label>
                  <Textarea id="heroCtaText" maxLength={2000} value={blogpost.bodytext} onChange={(e) => setblogpostProps({...blogpost, bodytext: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="heroBackgroundImage">Tags</Label>
                    <Input id="heroBackgroundImage" value={blogpost.tags.join(', ')} onChange={(e) => setblogpostProps({...blogpost, tags: e.target.value.split(', ')})} />
                </div>
                <div className='flex flex-row gap-4 w-full justify-between'>
                    {/* this will be for the colours */}
                    <div className='w-full flex flex-col gap-0.5'>
                    <Label htmlFor="boldText">Bold Text</Label>
                    <Input id="boldtext" type='color' value={blogpost.boldText} onChange={(e) => setblogpostProps({...blogpost, boldText: e.target.value})} />
                    </div>
                    <div className='w-full flex flex-col gap-0.5'>
                    <Label htmlFor='hoverandlinks'>Hover and Links</Label>
                    <Input id='hoverandlinks' type='color' value={blogpost.hoverandlinks} onChange={(e) => setblogpostProps({...blogpost, hoverandlinks: e.target.value})} />
                    </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <HeroComponent {...blogpost} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="postsection">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 mt-4">Post Page Customization</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="numberofposts">Number of Posts</Label>
                  <Input id="numberofposts" type="number" min={0} max={20} value={featureProps.totalposts} onChange={(e) => setFeatureProps({...featureProps, totalposts: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="featureTitle">Title</Label>
                  <Input id="featureTitle" value={featureProps.title} onChange={(e) => setFeatureProps({...featureProps, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="featureDescription">Description</Label>
                  <Input id="featureDescription" value={featureProps.description} onChange={(e) => setFeatureProps({...featureProps, description: e.target.value})} />
                </div>
                <div className='flex flex-row gap-4 w-full justify-between'>
                <div className='w-full flex flex-col gap-0.5'>
                  <Label htmlFor='diffsidesborder'>Border Colour</Label>
                  <Input id='diffsidesborder' className='w-full' type='color' value={featureProps.bordercolour} onChange={(e) => setFeatureProps({...featureProps, bordercolour: e.target.value})} />
                  </div>
                  <div className='w-full flex flex-col gap-0.5'>
                    <Label htmlFor='hoverborder'>Hover Border</Label>
                    <Input id='hoverborder' className='w-full' type='color' value={featureProps.borderhovercolour} onChange={(e) => setFeatureProps({...featureProps, borderhovercolour: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <FeatureCardComponent {...featureProps} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="cta">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Call to Action Customization</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ctaTitle">Title</Label>
                  <Input id="ctaTitle" value={ctaProps.title} onChange={(e) => setCtaProps({...ctaProps, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="ctaDescription">Description</Label>
                  <Input id="ctaDescription" value={ctaProps.description} onChange={(e) => setCtaProps({...ctaProps, description: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="ctaButtonText">Button Text</Label>
                  <Input id="ctaButtonText" value={ctaProps.buttonText} onChange={(e) => setCtaProps({...ctaProps, buttonText: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="ctaBackgroundColor">Background Color</Label>
                  <Input id="ctaBackgroundColor" type="color" value={ctaProps.backgroundColor} onChange={(e) => setCtaProps({...ctaProps, backgroundColor: e.target.value})} />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <CallToActionComponent {...ctaProps} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}