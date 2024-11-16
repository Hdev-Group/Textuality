"use client"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"

export default function NewRequest() {
    return (
        <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center `}>
        <div className="flex items-center justify-center">
            <div className="border-x  border-neutral-600 h-screen max-w-[2000px] w-full z-30 dark:border-white/50 rounded-sm lg:mx-10 lg:mb-10 border-b">
            <Header />
            <div className="flex flex-col w-full items-center">
                <div className="flex flex-col w-full items-center gap-7 h-full">
                    
                </div>
            </div>
            <Footer />
            </div>
        </div>
        </body>
    )
}