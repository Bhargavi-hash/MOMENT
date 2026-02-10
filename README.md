# MOMENT AI
## 💡 Inspiration

We’ve all seen the "Reddit Stories", "Instagram Reels", "Youtube Shorts" or "Podcast Clips" taking over our feeds. As creators ourselves, we realized that for every 1-minute viral clip, there are at least 3 hours of tedious scrubbing, transcribing, and editing behind the scenes. We wanted to build a "magic button" that does the heavy lifting, allowing creators to spend less time in the editor and more time being creative. MOMENT AI was born from the desire to make professional-grade content repurposing accessible to everyone.

## 🤖 What it does

**MOMENT AI** is an intelligent content engine that turns long-form video links into short-form gold.

1. **Gemini-Powered Analysis:** Unlike basic tools, we use Gemini 3 flash preview to "watch" and analyze the transcript, identifying hooks, emotional peaks, and high-retention segments.
2. **Smart Discovery:** Automatically extracts "viral-worthy" moments based on semantic meaning and intent.
3. **Auto-Transcription:** Uses high-accuracy AI to transcribe dialogue with millisecond precision.
4. **Background Processing:** Leveraging a distributed task queue, users can submit a link and walk away — MOMENT handles the heavy video processing in the background.

## 🏗 How we built it

We prioritized a scalable, industrial-strength stack:

1. **Intelligence:** Gemini 3 flash preview serves as our content strategist, analyzing the text to determine exactly where a "moment" begins and ends based on the narrative flow.
2. **Frontend:** Built with **Next.js 14** and **Tailwind CSS** for a fast, responsive user interface.
3. **Backend:** A **FastAPI** server handles requests, while **Celery** manages a worker pool for long-running tasks.
4. **Broker:** **Redis** acts as the heartbeat of our system, managing communication between the API and the workers.
5. **AI Core:** **Faster-Whisper** for transcription and **FFmpeg** for server-side media manipulation.

![Architecture Diagram](Screenshot%20from%202026-02-10%2011-52-40.png)

##🚧 Challenges We Ran Into
### 1. The Cloud Memory "Glass Ceiling"

Our biggest hurdle was the resource-intensive nature of AI video processing. We deployed our backend on Railway, which has a strict memory limit. Initially, our Celery workers would trigger a SIGKILL (Out of Memory error) the moment they tried to load the Whisper model while simultaneously holding video chunks in memory.

**The Solution:** We implemented Model Quantization, switching to the int8 version of our transcription model to reduce its RAM footprint by 50% without sacrificing accuracy. We also refined our file-handling logic to ensure video frames were processed as streams rather than being loaded entirely into the system's buffer.

### 2. Orchestrating a Distributed Symphony

Managing the communication between a Next.js frontend (Vercel), a FastAPI backend (Railway), and a background worker pool was a complex orchestration challenge. We had to ensure that if a user refreshed their page, they wouldn't lose their progress.

**The Solution:** We built a robust Polling & State Management system. By using Redis as a persistent message broker and a centralized SQLite database, we ensured that the frontend could "re-attach" to any ongoing job by its Unique ID, providing a seamless experience even during long-running AI tasks.

### 3. Contextual Slicing with Gemini 1.5 Pro

Identifying a "viral moment" isn't just about finding loud audio; it’s about understanding the narrative hook. Initially, our timestamps were slightly off, cutting speakers mid-sentence.

**The Solution:** We engineered a Refinement Pipeline using Gemini 1.5 Pro. Instead of just taking raw timestamps from the transcription, we pass the semantic transcript to Gemini to "reason" through the dialogue. Gemini identifies the logical start and end of a thought, ensuring every clip is a perfectly contained story with a beginning, middle, and end.

### 4. CORS and Connectivity Hurdles

Connecting a frontend on one platform to a backend on another often leads to "Cross-Origin Resource Sharing" (CORS) nightmares, especially when handling file uploads and status polling.

**The Solution:** We configured a strict but flexible middleware layer in FastAPI and used environment-variable-driven base URLs to ensure our local development environment and production deployment worked identically, eliminating "it works on my machine" bugs.

## 🏆 Accomplishments that we're proud of

- **Semantic Understanding:** Successfully using Gemini to identify "hooks" rather than just looking for loud noises.
- **Zero-Latency Feedback:** Building a polling system that allows the frontend to show real-time progress.
- **Distributed Architecture:** Getting a complex system (Frontend + Backend + Redis + Worker + External LLM) live and synced across different platforms.

## 📖 What we learned

We learned that LLMs are the new Video Editors. Integrating Gemini showed us that AI can understand the vibe of a video, not just the data. We also gained deep experience in optimizing Python memory and managing distributed systems with Celery.

## 🔮 What's Next for MOMENT AI

We aren’t just building a tool; we are building the future of autonomous media. Our roadmap focuses on shifting from "AI-Assisted" to "AI-Autonomous."
### 1. The "Director’s Lab" (Autonomous Creative Space)

We plan to introduce The Lab, an experimental space where the AI acts as a Producer, Editor, and Social Media Manager in one.

**Zero-Touch Pipeline:** A "Set it and Forget it" mode where MOMENT AI monitors your YouTube channel, automatically detects new uploads, clips them, and queues them for social media without you ever logging in.

**AI-Driven Narrative Re-Editing:** Using Gemini 1.5 Pro’s massive context window, the AI will "remix" your content—taking segments from different videos to create a new, cohesive story or a "Best of the Month" compilation.

### 2. Multi-Modal Vision Integration

While we currently focus on audio and semantic meaning, the next phase is Visual Intelligence.

**Active Speaker Tracking:** Using computer vision to identify who is speaking and automatically crop 16:9 footage into 9:16 vertical video, ensuring the subject is always perfectly framed (Face-Crop).

**Dynamic B-Roll Injection:** Gemini will analyze the script and automatically suggest (or overlay) relevant B-roll footage or memes to emphasize jokes and key points, significantly increasing viewer retention.

### 3. The "Moment Editor" (Browser-Based Refinement)

A lightweight, high-performance web editor designed specifically for AI-generated clips.

**Text-Based Editing:** Instead of moving bars on a timeline, users can edit the video by editing the transcript. Delete a sentence in the text, and the AI perfectly ripples the video cut to match.

**AI Style Transfer:** One-click branding. Choose a "vibe" (e.g., "Alex Hormozi Style" or "Minimalist Documentary"), and the AI will automatically apply captions, progress bars, and color grades.

### 4. Viral Predictor & Analytics Integration

Why guess what will go viral when you can know?

**Retention Heatmaps:** Before you even post, MOMENT AI will score your clips against current platform trends (TikTok/Reels) and predict which "hook" has the highest probability of hitting the FYP.

**Direct-to-Platform Publishing:** API integrations with TikTok, Instagram, and YouTube Shorts for seamless, one-click distribution.

### 5. Multi-Lingual Global Reach

Breaking the language barrier. We aim to implement AI Voice Cloning and Dubbing. Take a clip of a creator speaking English and instantly generate a version in Spanish or Hindi, keeping the creator’s original voice and tone, allowing "Moments" to go viral globally.


# NOTE
The Application uses heavy libraries like pytorch, ffmpeg, google-generativeAI etc. And the backend is hosted on Railways with frontend deployed on vercel. When you try out the website, it might take a few moments for the app to get up and running. So please be patient as your videos get processed. 
