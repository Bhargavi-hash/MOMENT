"use client";

import { useEffect, useState } from "react";
import { getClips } from "@/lib/api";
import ClipCard from "./ClipCard";
import { 
  Archive, 
  LayoutGrid, 
  Smartphone, 
  CheckCircle2, 
  LayoutTemplate,
  Instagram,
  Youtube as YoutubeIcon,
  Play,
  Twitter,
  Loader2,
  Check
} from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function ResultsView({ jobId }: { jobId: string }) {
  const [clips, setClips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    getClips(jobId).then((res) => {
      const data = Array.isArray(res) ? res : res?.clips || [];
      setClips(data);
    });
  }, [jobId]);

  const handleDownloadBundle = async () => {
    setDownloadState("loading");
    try {
      const response = await fetch(`${API_BASE}/downloads/${jobId}/zip`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `moment_bundle_${jobId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 3000);
    } catch (error) {
      console.error(error);
      setDownloadState("idle");
      alert("ZIP bundle is still being prepared. Please try again in a few seconds.");
    }
  };

  const platforms = Array.from(new Set(clips.map((c) => c.platform)));
  const filteredClips = activeTab === "all" 
    ? clips 
    : clips.filter(c => c.platform === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      
      {/* Success Banner */}
      <header className="relative overflow-hidden bg-white dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-[48px] p-10 md:p-16 shadow-2xl">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none hidden lg:block">
          <div className="relative h-full w-full">
             <div className="absolute top-10 right-10 p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 rotate-12 animate-bounce duration-[3000ms]">
                <YoutubeIcon className="text-emerald-500 w-12 h-12" />
             </div>
             <div className="absolute bottom-10 right-32 p-4 rounded-3xl bg-slate-900/10 dark:bg-white/10 border border-slate-500/20 -rotate-12 animate-pulse">
                <Instagram className="text-pink-500 w-10 h-10" />
             </div>
             <div className="absolute top-1/2 right-72 p-3 rounded-full bg-blue-500/10 border border-blue-500/20 animate-bounce duration-[4000ms]">
                <Play className="text-blue-500 w-8 h-8 fill-blue-500" />
             </div>
             <div className="absolute top-1/5 right-52 p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 animate-pulse">
                <Twitter className="text-yellow-500 w-10 h-10 fill-yellow-500" />
             </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
              <CheckCircle2 size={16} />
              Moments Extracted
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Your Viral <br /> <span className="text-emerald-500">Inventory.</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed">
                Browse by platform or download the entire production bundle below.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleDownloadBundle}
                disabled={downloadState === "loading"}
                className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
                  downloadState === "success" 
                    ? "bg-emerald-600 text-white shadow-emerald-500/40" 
                    : "bg-slate-900 dark:bg-emerald-500 text-white hover:shadow-2xl hover:shadow-emerald-500/30"
                }`}
              >
                {downloadState === "idle" && (
                  <>
                    <Archive size={22} />
                    Download ZIP Bundle
                  </>
                )}
                
                {downloadState === "loading" && (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Generating...
                  </>
                )}

                {downloadState === "success" && (
                  <>
                    <Check size={22} />
                    Ready! Check Downloads
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side Stats */}
          <div className="hidden xl:flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-slate-200 dark:border-white/5 min-w-[200px]">
             <span className="text-6xl font-black text-slate-900 dark:text-white">{clips.length}</span>
             <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Clips</span>
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

      {/* Results Grid */}
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
          <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Awaiting Content</h2>
        </div>
      )}
    </div>

    
  );
}