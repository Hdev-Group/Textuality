"use client"
import { SignUp } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import { useRouter } from 'next/navigation';

export default function Page() {
  const route = useRouter();
  return (
    <body>
    <title>Sign In | Textuality</title>
    <main className="flex flex-col md:flex-row justify-between items-center h-screen bg-[#1f1f23]">
    <div className="w-full md:w-1/2 justify-between h-full hidden md:flex flex-col  bg-background shadow-lg to-transparent space-y-6">
        <div className='h-full'>
          <img src="/IMG_6128.png" onClick={() => route.push("/")} alt="Textuality" className="w-16 cursor-pointer m-8" />
        </div>
        <div className='px-8 flex flex-col items-start h-full justify-start'>
          <h1 className="text-5xl lg:text-6xl font-bold text-muted-foreground">
            Welcome to Textuality.
          </h1>
          <p className="text-lg text-muted-foreground">
            Your content management system, Crafted for all.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center bg-dark">
        <div className="w-3/4 max-w-md space-y-4">
          <SignUp
            appearance={{
                baseTheme: dark,
            }}
          />
        </div>
      </div>
    </main>
  </body>
  )
}