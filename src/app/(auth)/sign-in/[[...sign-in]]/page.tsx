"use client";
import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <main className="flex flex-col movinggradient items-center justify-center h-screen space-y-4">
        <div className='w-full h-full flex justify-center items-center'>
          <SignIn />
        </div>
      </main>
    </body>
  );
}