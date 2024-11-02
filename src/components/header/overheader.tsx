export default function OverHeader() {
    const values = [
        "👷‍♂️ Creating new components",
        "🖐 We are hiring",
        "🚀 Launching new features",
    ];

    return (
        <div className="overflow-hidden mainstopper border border-cyan-300 rounded-t-sm w-full py-2 bg-cyan-400/20">
            <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center">
                    {values.map((value, index) => (
                        <div key={index} className="flex hover:bg-cyan-800 bg-none rounded-sm px-4 transition-all items-center">
                            <h1 className="text-xl">{value}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
