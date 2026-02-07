"use client";

import { useState } from "react";
import Landing from "./Landing";
// import JobStatus from "./components/JobStatus";

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <>
      <Landing onJobCreated={(jobId) => {
        setJobId(jobId);
      }} />
    </>
  );
}
