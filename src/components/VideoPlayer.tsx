import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  youtubeUrl: string;
  fallbackUrl: string;
  title: string;
  onWatchProgress?: (duration: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({
  youtubeUrl,
  fallbackUrl,
  title,
  onWatchProgress,
  onComplete,
}: VideoPlayerProps) {
  const [useFallback, setUseFallback] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
//   const [loadAttempted, setLoadAttempted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };
  
  const youtubeId = extractYouTubeId(youtubeUrl);
  
  useEffect(() => {
    if (!youtubeId && fallbackUrl) {
      console.log("No valid YouTube URL, using local video:", fallbackUrl);
      setUseFallback(true);
      setLoading(false);
    } else if (!youtubeId && !fallbackUrl) {
      setError(true);
      setLoading(false);
    } else if (youtubeId) {
      setLoading(false);
    }
  }, [youtubeId, fallbackUrl]);
  
  const handleYouTubeError = () => {
    console.log("YouTube video failed, trying fallback...");
    if (fallbackUrl) {
      setUseFallback(true);
    } else {
      setError(true);
    }
  };
  
  const handleVideoError = (e: any) => {
    console.error("Video playback error:", e);
    setError(true);
  };
  
  const handleVideoLoad = () => {
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading video...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <h3 className="text-red-800 font-semibold mb-2">Video Unavailable</h3>
        <p className="text-red-600 text-sm">
          This video couldn't be loaded. Please check your connection or try again later.
        </p>
        {fallbackUrl && !useFallback && (
          <button
            onClick={() => setUseFallback(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Try Local Version
          </button>
        )}
      </div>
    );
  }
  
  
  if (!useFallback && youtubeId) {
    return (
      <div className="relative pt-[56.25%] bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleYouTubeError}
        />
      </div>
    );
  }
  
  
  if (fallbackUrl) {
    const videoPath = fallbackUrl.startsWith('/') ? fallbackUrl : `/${fallbackUrl}`;
    
    return (
      <div className="bg-black">
        <video
          ref={videoRef}
          className="w-full"
          controls
          autoPlay
          controlsList="nodownload"
          onTimeUpdate={() => {
            if (videoRef.current && onWatchProgress) {
              onWatchProgress(videoRef.current.currentTime);
            }
          }}
          onEnded={() => {
            if (onComplete) onComplete();
          }}
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
        >
          <source src={videoPath} type="video/mp4" />
          <p className="text-white p-4">Your browser does not support the video tag.</p>
        </video>
      </div>
    );
  }
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
      <div className="text-yellow-500 text-4xl mb-3">📹</div>
      <h3 className="text-yellow-800 font-semibold mb-2">No Video Source Available</h3>
      <p className="text-yellow-600 text-sm">
        Video content for this module is coming soon.
      </p>
    </div>
  );
}