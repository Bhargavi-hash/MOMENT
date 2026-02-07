"use client";

import { useState, useEffect } from "react";
import { createJob } from "@/lib/api";
import { Moon, Sun, Youtube, Sparkles, Loader2, Camera, ArrowRight } from "lucide-react";

function extractVideoId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
  return match?.[1];
}

export default function Landing({
  onJobCreated,
}: {
  onJobCreated: (jobId: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light for the new fresh look

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const videoId = extractVideoId(url);

  async function handleSubmit() {
    if (!url) return;
    setLoading(true);
    try {
      const job = await createJob(url);
      onJobCreated(job.job_id);
    } catch (e) {
      console.error(e);
      alert("Backend unreachable or job creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#FAFAFA] dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans">
      {/* Header / Nav */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl">MOMENT</span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16 md:py-28">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-100 dark:border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Clipping</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
            Own the <span className="text-emerald-500">Moment.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-lg mx-auto leading-relaxed">
            Paste a YouTube link and let our AI handle the editing. Get viral-ready clips in seconds.
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Youtube className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Paste YouTube link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A1A1A] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-lg"
            />
          </div>

          {videoId && (
            <div className="overflow-hidden rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !url}
            className="group w-full py-5 px-8 rounded-3xl font-bold text-white bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Video...</span>
              </>
            ) : (
              <>
                <span>Create Moments</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <footer className="mt-32 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-sm font-medium tracking-widest uppercase">
            Powered by Moment AI
          </p>
        </footer>
      </main>
    </div>
  );
}