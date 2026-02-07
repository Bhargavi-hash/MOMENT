"use client";

import { useEffect, useState } from "react";
import { getJob } from "@/lib/api";
import { 
  Film, 
  Scissors, 
  Globe, 
  Type, 
  Hash, 
  Music, 
  Sparkles, 
  PackageCheck,
  Loader2
} from "lucide-react";

const scenes = [
  { text: "Processing video...", icon: Film, color: "text-blue-500", anim: "animate-pulse" },
  { text: "Gemini is snipping bits...", icon: Scissors, color: "text-emerald-500", anim: "animate-bounce" },
  { text: "Researching platforms...", icon: Globe, color: "text-sky-500", anim: "animate-spin-slow" },
  { text: "Generating captions...", icon: Type, color: "text-violet-500", anim: "animate-bounce" },
  { text: "Thinking hashtags...", icon: Hash, color: "text-amber-500", anim: "animate-pulse" },
  { text: "Music recommendations...", icon: Music, color: "text-rose-500", anim: "animate-bounce" },
  { text: "Viral moments incoming...", icon: Sparkles, color: "text-emerald-400", anim: "animate-pulse" },
  { text: "Packing clips...", icon: PackageCheck, color: "text-emerald-600", anim: "animate-bounce" },
];

export default function JobStatusCard({
  jobId,
  onComplete,
}: {
  jobId: string;
  onComplete: () => void;
}) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Scene Cycler (Purely Visual)
    const sceneTimer = setInterval(() => {
      setSceneIndex((prev) => (prev < scenes.length - 1 ? prev + 1 : prev));
    }, 4500);

    // 2. Fake Progress Bar (Creeps up to 95%)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 0.5; // Fast start
        if (prev < 80) return prev + 0.2; // Medium middle
        if (prev < 95) return prev + 0.05; // Slow crawl near end
        return prev;
      });
    }, 100);

    // 3. Actual Backend Polling
    const poll = setInterval(async () => {
      try {
        const job = await getJob(jobId);
        if (job.status === "completed") {
          setProgress(100); // Snap to finish
          setTimeout(() => {
            clearInterval(poll);
            clearInterval(sceneTimer);
            clearInterval(progressTimer);
            onComplete();
          }, 800);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 3000);

    return () => {
      clearInterval(sceneTimer);
      clearInterval(progressTimer);
      clearInterval(poll);
    };
  }, [jobId, onComplete]);

  const CurrentIcon = scenes[sceneIndex].icon;

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#121212] rounded-[32px] shadow-2xl border border-slate-100 dark:border-white/5">
      <div className="flex flex-col items-center text-center">
        
        {/* Animated Icon Stage */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl" />
          <div className={`relative z-10 transition-all duration-500 transform ${scenes[sceneIndex].anim}`}>
            <CurrentIcon className={`w-16 h-16 ${scenes[sceneIndex].color}`} strokeWidth={1.5} />
          </div>
          {/* Subtle spinning ring */}
          <div className="absolute inset-0 border-t-2 border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Text Section */}
        <div className="space-y-2 mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-all duration-500">
            {scenes[sceneIndex].text}
          </h2>
          <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-[0.2em]">
            <Loader2 className="w-3 h-3 animate-spin" />
            AI Agent Active
          </div>
        </div>

        {/* Real Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            <span>Analyzing</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-1.5 mt-8">
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === sceneIndex ? "w-4 bg-emerald-500" : "w-1.5 bg-slate-200 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}