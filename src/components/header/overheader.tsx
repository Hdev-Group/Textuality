import { useEffect, useState } from 'react';

export default function OverHeader() {
    const values = [
        "👷‍♂️ Creating new components",
        "🖐 We are hiring",
        "🚀 Launching new features",
    ];

    const [randomValue, setRandomValue] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setRandomValue(values[Math.floor(Math.random() * values.length)]);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [values]);

    return (
        <div className="overflow-hidden mainstopper border border-cyan-300 rounded-t-sm w-full py-2 bg-cyan-400/20">
            <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-cyan-600">📢</p>
                <p className="text-sm  font-semibold">
                    {randomValue}
                </p>
            </div>
        </div>
    );
}
