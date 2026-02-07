"use client";

import { useEffect, useState } from "react";
import { getJob, getClips } from "@/lib/api";
import styles from "./JobStatus.module.css";

const API_BASE = "http://localhost:8000";

const STAGES = [
  { emoji: "🎥", text: "Camera is rolling...", class: styles.rolling },
  { emoji: "✂️", text: "Cutting the perfect frames...", class: styles.cutting },
  { emoji: "✍️", text: "Transcribing audio to text...", class: styles.typing },
  { emoji: "📦", text: "Packing viral moments...", class: styles.packing },
];

export default function JobStatus({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState("processing");
  const [clips, setClips] = useState<any[]>([]);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Cycle through animation stages every 3 seconds
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 3000);

    const checkJob = setInterval(async () => {
      try {
        const job = await getJob(jobId);
        setStatus(job.status);
        if (job.status === "completed") {
          const res = await getClips(jobId);
          setClips(res.clips || []);
          clearInterval(checkJob);
          clearInterval(stageInterval);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    return () => {
      clearInterval(checkJob);
      clearInterval(stageInterval);
    };
  }, [jobId]);

  if (status !== "completed") {
    return (
      <div className={styles.loaderWrapper}>
        <div className={`${styles.stageContainer} ${STAGES[stageIndex].class}`}>
          {STAGES[stageIndex].emoji}
        </div>
        <h2 className={styles.statusText}>{STAGES[stageIndex].text}</h2>
        <p style={{ color: "#666", marginTop: "10px" }}>Job ID: {jobId}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Viral Moments</h1>
        <a href={`${API_BASE}/jobs/${jobId}/download`} className={styles.zipBtn} download>
          Download ZIP
        </a>
      </header>

      <div className={styles.grid}>
        {clips.map((clip) => (
          <div key={clip.index} className={styles.clipCard}>
            <video
              className={styles.videoPlayer}
              controls
              src={`${API_BASE}/results/${jobId}/clip/${clip.clip_filename}`}
            />
            <div className={styles.content}>
              <span className={styles.badge}>{clip.platform}</span>
              <p style={{ margin: "15px 0", lineHeight: 1.5 }}>{clip.caption}</p>
              
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "15px" }}>
                {clip.hashtags.map((h: string, i: number) => (
                  <span key={i} style={{ color: "#6366f1", fontSize: "0.85rem" }}>#{h}</span>
                ))}
              </div>

              <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px" }}>
                Virality Score: <strong>{(clip.virality * 100).toFixed(0)}%</strong>
              </div>

              <a 
                href={`${API_BASE}/downloads/${jobId}/clip/${clip.clip_filename}`} 
                className={styles.downloadBtn} 
                download
              >
                Download Clip
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}