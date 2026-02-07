"use client";

import { useEffect, useState } from "react";
import { Camera, Film, Sparkles, Hash, Music } from "lucide-react";
import { getJob } from "@/lib/api";

const steps = [
  { text: "Transcribing video", icon: Film },
  { text: "Gemini agent watching video", icon: Camera },
  { text: "Researching platforms", icon: Sparkles },
  { text: "Picking viral moments", icon: Camera },
  { text: "Generating hashtags", icon: Hash },
  { text: "Choosing background music", icon: Music },
];

export default function JobStatusCard({
  jobId,
  onComplete,
}: {
  jobId: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 1800);

    const poll = setInterval(async () => {
      const job = await getJob(jobId);
      if (job.status === "completed") {
        clearInterval(stepTimer);
        clearInterval(poll);
        onComplete();
      }
    }, 3000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(poll);
    };
  }, [jobId, onComplete]);

  const Icon = steps[step].icon;

  return (
    <div className="p-8 rounded-3xl border bg-white dark:bg-[#1A1A1A] text-center shadow-xl">
      <Icon className="w-10 h-10 mx-auto mb-4 text-emerald-500 animate-pulse" />
      <p className="text-xl font-semibold">{steps[step].text}</p>
      <div className="mt-6 flex justify-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= step ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
