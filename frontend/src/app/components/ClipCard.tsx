"use client";

const API_BASE = "http://localhost:8000";

export default function ClipCard({
  clip,
  jobId,
}: {
  clip: any;
  jobId: string;
}) {
  return (
    <div className="rounded-2xl border p-4 bg-white dark:bg-[#1A1A1A] shadow">
      <video
        src={`${API_BASE}/clips/${jobId}/${clip.clip_filename}`}
        controls
        className="w-full rounded-xl mb-4"
      />

      <div className="space-y-2">
        <p className="font-semibold">{clip.caption}</p>
        <p className="text-sm text-slate-500">
          Virality score: {clip.virality.toFixed(2)}
        </p>

        <div className="flex flex-wrap gap-2">
          {clip.hashtags.map((h: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700"
            >
              #{h}
            </span>
          ))}
        </div>

        <a
          href={`${API_BASE}/clips/${jobId}/${clip.clip_filename}`}
          download
          className="inline-block mt-3 text-emerald-600 font-medium"
        >
          Download clip
        </a>
      </div>
    </div>
  );
}
