"use client"
import OverHeader from "@/components/header/overheader";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

const tutorials = [
    { title: "Getting Started", description: "Learn how to set up your account and get started with Textuality.", video: "/HeroVid.mp4" },
    { title: "Creating Content", description: "Discover how to create and manage content with Textuality's powerful tools.", video: "https://youtu.be/7w27YfFnd0g" },
    { title: "Collaboration", description: "Explore how to collaborate with your team in real-time using Textuality.", video: "/tutorials/collaboration.mp4" },
    { title: "Content Publishing", description: "Discover how to publish and distribute content using Textuality's powerful tools.", video: "/tutorials/content-publishing.mp4" },
    { title: "Content Management", description: "Explore how to manage and organize your content with Textuality's versatile tools.", video: "/tutorials/content-management.mp4" },
];

export default function Tutorials() {
    return(
            <div className="w-full relative justify-center flex-col items-center flex"> 
            <OverHeader /> 
            <Header /> 
            <main className="flex-grow w-full bg-background">
                <div className="container mx-auto px-4 py-16">
                <h1 className="text-5xl font-extrabold text-start pb-2 b-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                    Textuality Tutorials
                </h1>
                <p className="text-start text-xl text-muted-foreground mb-12  ">
                    Make the most of Textuality with our comprehensive tutorials and guides. Learn how to use our powerful features and tools to create, manage, and innovate with your team.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tutorials.map((tutorial, index) => (
                        <div className="bg-gradient-to-b from-white/15  hover:from-white/30 transition-all pb-2 to-white/0 p-0.5 rounded-lg w-full md:w-full" key={index}>
                            <div className="bg-background pb-2 rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <div className="p-4 pb-0 rounded-md ">
                                        <VideoSection source={tutorial?.video} />
                                    </div>
                                    <h1 className="text-xl font-bold text-start p-4 pb-0">
                                        {tutorial.title}
                                    </h1>
                                    <p className="text-foreground/60 text-start p-4 pt-1">
                                        {tutorial.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </main>
        <Footer />
        </div>
    )
}

const VideoSection = ({source}: any) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
  
    const handlePlayPause = () => {
      if (videoRef.current) {
        if (!isPlaying) { // If video is not playing, play and unmute
          videoRef.current.play();
          videoRef.current.muted = false;
          videoRef.current.setAttribute('controls', 'controls');
        } else { 
          videoRef.current.pause();
          videoRef.current.setAttribute('muted', 'muted');
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    return (
      <div className="flex w-full h-full fadeInvideo z-50 ">
        <div className="spinnercard">
          <div className="inner group z-10 relative items-center flex justify-center">
            {
              !isPlaying ? (
                <button
                className="group absolute z-50 inset-0 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 m-auto"
                onClick={handlePlayPause}
                aria-label="Play/Pause video"
              >
                <div className="absolute inset-0 rounded-full opacity-75"></div>
                <div className="relative flex items-center justify-center w-full h-full">
                  <Play className="w-8 h-8 text-white transition-transform duration-300 ease-out group-hover:scale-125" />
                </div>
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full animate-ripple bg-white opacity-25"></span>
                )}
              </button>
              ) : null
            }
            <video
              ref={videoRef}
              loop
              muted={!isPlaying}
              autoPlay={isPlaying}
              className="w-full h-full object-cover"
            >
              <source src={source} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    );
  };
