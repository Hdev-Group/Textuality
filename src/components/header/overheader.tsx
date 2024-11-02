export default function OverHeader() {
    const values = [
        "👷‍♂️ Creating new components",
        "🖐 We are hiring",
        "🚀 Launching new features",
    ];

    return (
        <div className="overflow-hidden mainstopper border border-cyan-300 rounded-t-sm w-full py-2 bg-cyan-400/20">
            <div className="flex items-center justify-center space-x-2">
                <p className="text-sm text-cyan-600">📢</p>
                <p className="text-sm  font-semibold">
                    {values[Math.floor(Math.random() * values.length)]}
                </p>
            </div>
        </div>
    );
}
