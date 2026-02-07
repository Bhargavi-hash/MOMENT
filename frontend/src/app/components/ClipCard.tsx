"use client";

import { Download, Share2, Flame, Copy } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function ClipCard({
  clip,
  jobId,
}: {
  clip: any;
  jobId: string;
}) {
  const downloadUrl = `${API_BASE}/clips/${jobId}/${clip.clip_filename}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clip.caption);
    alert("Caption copied!");
  };

  return (
    <div className="group relative rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* Video Container (9:16 Aspect Ratio) */}
      <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
        <video
          src={downloadUrl}
          controls
          className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        
        {/* Virality Badge Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide">
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          {Math.round(clip.virality * 100)}% Viral
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 italic">
              "{clip.caption}"
            </p>
            <button 
              onClick={copyToClipboard}
              className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
              title="Copy Caption"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {clip.hashtags.map((h: string, i: number) => (
              <span
                key={i}
                className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <a
            href={downloadUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white text-sm font-bold hover:opacity-90 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <button className="px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}