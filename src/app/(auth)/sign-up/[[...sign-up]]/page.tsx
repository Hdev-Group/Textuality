"use client"
import { SignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { dark } from "@clerk/themes";
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  const colourgradientsandimages = [
    { color: '#00ffff', image: '/IMG_6128.png' }, // Cyan
    { color: '#0088ff', image: '/IMG_6128.png' }, // Ocean Blue
    { color: '#4b0082', image: '/IMG_6128.png' }, // Indigo
    { color: '#6a5acd', image: '/IMG_6128.png' }, // Slate Blue
    { color: '#7fffd4', image: '/IMG_6128.png' }, // Aquamarine
    { color: '#5f9ea0', image: '/IMG_6128.png' }, // Cadet Blue
    { color: '#483d8b', image: '/IMG_6128.png' }, // Dark Slate Blue
    { color: '#8a2be2', image: '/IMG_6128.png' }, // Blue Violet
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      setRedirectUrl(redirectUrl);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn && redirectUrl) {
      router.push(redirectUrl);
    }
  }, [isSignedIn, redirectUrl, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 90);
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colourgradientsandimages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [colourgradientsandimages.length]);

  const currentColor = colourgradientsandimages[currentColorIndex].color;

  return (
    <body className='overflow-hidden'>
      <title>Sign Up | Textuality</title>
      <main className="flex flex-col md:flex-row justify-between items-start h-screen bg-background">
        <div className='mx-auto md:px-10 h-screen flex flex-col w-full'>
          <div className='w-full h-20 md:px-0 px-3 py-3 flex items-center justify-between'>
            <img src="/wordmarks/light-removebg-preview.png" className='w-auto h-10'></img>
            <div className='flex flex-row gap-2 items-center'>
              <p className='text-muted-foreground text-sm'>Already have an account?</p>
              <Link href='/sign-in'>
                <Button variant='secondary'>Log in</Button>
              </Link>
            </div>
          </div>
          <div className='w-full rounded-t-2xl bg-gradient-to-t flex items-center flex-col h-full from-background to-[#1f1f23] p-8'>
            <div className='flex flex-col gap-4 items-center md:mt-[3%]'>
              <div className='relative w-16 h-16 rounded-full bg-transparent flex items-center justify-center'>
              <div
                className='w-16 h-16 rounded-xl z-20 absolute flex items-center justify-center'
                id='spinzoner'
                style={{
                  transform: `rotate(${rotation}deg)`,
                  backgroundColor: rotation % 360 === 0 ? '#1f1f23' : currentColor,
                  transition: 'transform 0.5s, background-color 0.5s',
                }}
              />
              <img src='/IMG_6128.png' className='w-full p-1.5 z-50' id='spinzonerimg'></img>
              </div>
              <h1 className='text-[40px] md:text-[63px] font-semibold text-white'>Create your content</h1>
              <SignUp
                appearance={{
                  baseTheme: dark,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </body>
  );
}
