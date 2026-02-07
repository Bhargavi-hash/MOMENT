"use client";

import { useEffect, useState } from "react";
import { getClips } from "@/lib/api";
import ClipCard from "./ClipCard";

const API_BASE = "http://localhost:8000";

export default function ResultsView({ jobId }: { jobId: string }) {
  const [clips, setClips] = useState<any[]>([]);

  useEffect(() => {
    getClips(jobId).then(setClips);
  }, [jobId]);

  const grouped = clips.reduce((acc, clip) => {
    acc[clip.platform] = acc[clip.platform] || [];
    acc[clip.platform].push(clip);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-12">
      <div className="flex justify-end">
        <a
          href={`${API_BASE}/downloads/${jobId}/zip`}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold"
        >
          Download all clips
        </a>
      </div>

      {Object.entries(grouped).map(([platform, clips]) => {
        const platformClips = clips as any[];
        return (
          <section key={platform}>
            <h3 className="text-2xl font-bold mb-4 capitalize">{platform}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {platformClips.map((clip) => (
                <ClipCard key={clip.index} clip={clip} jobId={jobId} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
