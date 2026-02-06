"use client";

import { useState, useEffect } from "react";

export default function Landing() {
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // create a local preview URL when file is uploaded
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVideoUrl(""); // clear YouTube URL if a file is uploaded
    }
  };

  const handleSubmit = async () => {
    if (!videoUrl && !file) {
      alert("Please provide a YouTube URL or upload a video file.");
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would normally send videoUrl or file to your backend API
      // For now, we simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      alert("Video submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting the video.");
    } finally {
      setIsProcessing(false);
    }
  };

  // helper to convert a normal YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">MOMENT</h1>

      <div className="flex flex-col gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Paste YouTube link"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            setFile(null);
          }}
          className="border p-2 rounded w-full"
          disabled={isProcessing}
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Submit"}
      </button>

      {isProcessing && (
        <div className="mt-4 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <p className="mt-2">Your video is being processed...</p>
        </div>
      )}

      {filePreview && !isProcessing && (
        <div className="mt-4">
          <p className="mb-2">Video Preview:</p>
          <video
            src={filePreview}
            controls
            className="max-w-full rounded border"
          />
        </div>
      )}

      {videoUrl && getYouTubeEmbedUrl(videoUrl) && !isProcessing && (
        <div className="mt-4 w-full max-w-md aspect-video">
          <iframe
            src={getYouTubeEmbedUrl(videoUrl) || undefined}
            title="YouTube Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}
