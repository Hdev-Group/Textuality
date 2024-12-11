"use client"
import { SignIn, useAuth } from '@clerk/nextjs';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageState, setImageState] = useState('entering');

  const colourgradientsandimages = [
    { color: '#00ffff', image: '/IMG_6128.png' }, // Cyan
    { color: '#0088ff', image: '/icons/IMG_6489.png' }, // Ocean Blue
    { color: '#4b0082', image: '/icons/IMG_6490.png' }, // Indigo
    { color: '#6a5acd', image: '/icons/IMG_6491.png' }, // Slate Blue
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
      setImageState('leaving'); 

      setTimeout(() => {
        setRotation((prev) => prev + 90);
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colourgradientsandimages.length);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % colourgradientsandimages.length);

        setImageState('entering');
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, [colourgradientsandimages.length]);

  const currentColor = colourgradientsandimages[currentColorIndex].color;
  const currentImage = currentImageIndex === 4 ? '/IMG_6128.png' : colourgradientsandimages[currentImageIndex].image;

  return (
    <body>
      <title>Sign In | Textuality</title>
      <main className="flex flex-col md:flex-row justify-between items-start h-screen bg-background">
      <div className='mx-auto md:px-10 h-screen flex flex-col w-full'>
        <div className='w-full h-20 md:px-0 px-3 py-3 flex items-center justify-between'>
            <a href='/'>
              <img src="/wordmarks/light-removebg-preview.png" className='w-auto h-10'></img>
            </a>            
            <div className='flex flex-row gap-4 items-center'>
              <p className='text-muted-foreground text-sm'>New to Textuality?</p>
              <Link href='/sign-up'>
                <Button variant='secondary'>Create account</Button>
              </Link>
            </div>
          </div>
          <div className='w-full rounded-t-2xl bg-gradient-to-t flex items-center flex-col h-full from-background to-[#1f1f23] p-8'>
            <div className='flex flex-col gap-4 items-center md:mt-[3%]'>
              <div className='relative w-20 h-20 overflow-hidden bg-transparent flex items-center justify-center'>
                <div
                  className='w-16 h-16 rounded-xl overflow-hidden z-20 m-4 absolute flex items-center justify-center'
                  id='spinzoner'
                  style={{
                  transform: `rotate(${rotation}deg)`,
                  backgroundColor: rotation % 360 === 0 ? '#111114' : currentColor,
                  transition: 'transform 0.5s, background-color 0.5s',
                  }}
                />
                <div className='w-14 h-14 overflow-hidden flex items-center justify-center'>
                  <img
                    src={currentImage}
                    className={`w-14 h-14 object-contain z-50 p-1.5 transition-transform duration-500 ease-in-out ${
                      imageState === 'entering'
                      ? 'translate-x-[0%]'
                      : 'translate-x-[100%]'
                    }`}
                    />
                </div>
              </div>
              <h1 className='text-[40px] md:text-[63px] font-semibold text-white'>Welcome back</h1>
              <SignIn
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
