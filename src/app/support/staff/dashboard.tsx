"use client"
import Header from "@/components/header/header";
import { useUser } from "@clerk/clerk-react";

export default function DashboardStaff() {
    const user = useUser();
    return (
        <body className={`flex bgmain flex-col min-h-screen w-full items-center justify-center`}>
            <div className="flex items-center flex-col justify-center">
                <Header />
                <div className=" h-full w-full z-30 rounded-sm flex items-center justify-center flex-col border-b">
                    <div className="flex flex-col items-start w-full pb-5 mx-auto container justify-center">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-bold text-white mt-10">Welcome {user?.user?.firstName},</h1>
                            <p className="text-muted-foreground text-md">You are a <b>Senior Developer</b> at the <b>Hdev Group</b>.</p>
                        </div>
                    </div>
                </div>
                <div className="h-screen w-full mt-5 flex items-center justify-center flex-col">

                </div>
            </div>
        </body>
    );
}