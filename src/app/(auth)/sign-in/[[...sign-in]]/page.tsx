"use client";
import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dark } from "@clerk/themes";

export default function Page() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

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

  return (
  <body>
    <title>Sign In | Textuality</title>
    <main className="flex flex-col md:flex-row justify-between items-center h-screen bg-[#1f1f23]">
      <div className="w-full md:w-1/2 justify-between h-full hidden md:flex flex-col  bg-background shadow-lg to-transparent space-y-6">
        <div className='h-full'>
        <img src="/IMG_6128.png" onClick={() => router.push("/")} alt="Textuality" className="w-16 m-8 cursor-pointer" />
        </div>
        <div className='px-8 flex flex-col items-start h-full justify-start'>
          <h1 className="text-5xl lg:text-6xl font-bold text-muted-foreground">
            Welcome back.
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign into your account to continue.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center bg-dark">
        <div className="w-3/4 max-w-md space-y-4">
          <SignIn
            appearance={{
              baseTheme: dark,
            }}
          />
        </div>
      </div>
    </main>
  </body>
  );
}
