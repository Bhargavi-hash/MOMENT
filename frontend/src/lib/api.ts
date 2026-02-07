const API_BASE = "http://localhost:8000";

// create a new job
export async function createJob(videoUrl: string) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_url: videoUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json();
}

// get job metadata including zip download url
export async function getJob(jobId: string) {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

// get individual clips for this job
export async function getClips(jobId: string) {
  const res = await fetch(`${API_BASE}/results/${jobId}`);  // <-- use /results/{jobId}
  if (!res.ok) throw new Error("Failed to fetch clips");
  const data = await res.json();
  return data.clips;  // because results.py returns { clips: [...] }
}
