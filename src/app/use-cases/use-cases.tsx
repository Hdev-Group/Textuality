"use client"
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import OverHeader from "@/components/header/overheader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, Zap, BookOpen } from 'lucide-react';
import Link from "next/link";

const useCases = [
    { title: "Web Content Management", image: "", description: "Efficiently manage, create, and explore digital content with our comprehensive suite of real-time tools.", icon: Globe, color: "text-blue-500" },
    { title: "Remote Collaboration", image: "", description: "Facilitate seamless collaboration among remote teams with our advanced tools designed for real-time interaction.", icon: Users, color: "text-green-500" },
    { title: "Team Productivity", image: "", description: "Enhance team productivity by streamlining workflows and automating routine tasks.", icon: Zap, color: "text-yellow-500" },
    { title: "E-Learning Platforms", image: "", description: "Develop interactive and engaging e-learning experiences with our versatile tools.", icon: BookOpen, color: "text-red-500" },
    { title: "Marketing Campaigns", image: "", description: "Create and manage impactful marketing campaigns with our comprehensive suite of tools.", icon: Globe, color: "text-pink-500" },
    { title: "Data Visualization", image: "", description: "Transform complex data into insightful visualizations with our powerful tools.", icon: Zap, color: "text-teal-500" },
];

export default function UseCases() {
  return (
    <div className="w-full relative justify-center flex-col items-center flex"> 
    <OverHeader /> 
    <Header /> 
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-extrabold text-start mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Use Cases
          </h1>
          <p className="text-start text-xl text-muted-foreground mb-12  ">
            Discover how Textuality can be applied across various industries and scenarios to solve complex problems and drive innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
                <div className="bg-gradient-to-b from-white/15 hover:from-white/30 transition-all pb-2 to-white/0 p-0.5 rounded-lg" key={index}>
                    <div className="bg-background pb-2 rounded-lg">
                        <div className="flex flex-col gap-2">
                            <div className="p-4 pb-0 rounded-md ">
                                <img src={useCase.image} alt={useCase.title} className="w-full h-52 bg-black object-cover rounded-lg" />
                            </div>
                            <h1 className="text-xl font-bold text-start p-4 pb-0">
                                {useCase.title}
                            </h1>
                            <p className="text-foreground/60 text-start p-4 pt-1">
                                {useCase.description}
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
  );
}

