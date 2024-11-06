export default function NiceButton({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-r from-cyan-300/80 to-purple-400/80">
            <button className=" text-white  font-bold py-2 px-4 rounded">
                {children}
            </button>
        </div>
    );
}