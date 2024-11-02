import React from 'react';

export default function NiceButton({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative inline-block p-[1px] bg-gradient-to-tr from-cyan-200/80 transition-colors to-purple-200/80 hover:from-cyan-300 hover:to-purple-400">
            <button className="text-white space-grotesk-400 bg-black/40 backdrop-blur-md py-2 px-4 transition-all duration-300 ease-in-out focus:outline-none">
                {children}
            </button>
        </div>
    );
}
