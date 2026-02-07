"use client";

import { useEffect, useState } from "react";
import { getClips } from "@/lib/api";
import ClipCard from "./ClipCard";
import { 
  Archive, 
  LayoutGrid, 
  Smartphone, 
  CheckCircle2, 
  LayoutTemplate
} from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function ResultsView({ jobId }: { jobId: string }) {
  const [clips, setClips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    getClips(jobId).then((res) => {
      const data = Array.isArray(res) ? res : res?.clips || [];
      setClips(data);
    });
  }, [jobId]);

  const platforms = Array.from(new Set(clips.map((c) => c.platform)));
  const filteredClips = activeTab === "all" 
    ? clips 
    : clips.filter(c => c.platform === activeTab);

  return (
    // Increased max-width to 7xl to prevent squishing
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      
      {/* Success Banner */}
      <header className="relative bg-white dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-[48px] p-10 md:p-16 shadow-2xl">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
            <CheckCircle2 size={16} />
            Moments Extracted
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Your Viral <br /> <span className="text-emerald-500">Inventory.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl leading-relaxed">
              We've generated {clips.length} high-potential clips. Browse by platform or download the entire production bundle below.
            </p>
          </div>

          <div className="pt-4">
            <a
              href={`${API_BASE}/downloads/${jobId}/zip`}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95"
            >
              <Archive size={22} />
              Download ZIP Bundle
            </a>
          </div>
        </div>
      </header>

      {/* Navigation & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-10">
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Filter by Destination</h2>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all ${
                activeTab === "all" 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              <LayoutGrid size={18} />
              All Clips
            </button>
            
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setActiveTab(platform)}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all capitalize ${
                  activeTab === platform 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <Smartphone size={18} />
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized Grid for Vertical 9:16 Content */}
      {/* We use grid-cols-1, then 2 on tablets, and only 3 on large desktops to avoid squishing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
        {filteredClips.map((clip, index) => (
          <div 
            key={clip.index || index} 
            className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <ClipCard clip={clip} jobId={jobId} />
          </div>
        ))}
      </div>

      {filteredClips.length === 0 && (
        <div className="py-40 text-center border-4 border-dotted border-slate-100 dark:border-white/5 rounded-[60px]">
          <LayoutTemplate size={64} className="mx-auto text-slate-200 dark:text-white/10 mb-6" />
          <h2 className="text-2xl font-bold text-slate-400">Nothing here yet...</h2>
        </div>
      )}
    </div>
  );
}