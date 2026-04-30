import { VideoModule } from "./videoData";
interface VideoProgress {
  videoId: string;
  watchedAt: number;
  watchedDuration: number;
}

interface CourseProgress {
  courseId: string;
  videos: VideoProgress[];
  lastUpdated: number;
}

export function getVideoProgressKey(userId: string = "default"): string {
  return `video_progress_${userId}`;
}

export function markVideoWatched(videoId: string, durationWatched: number = 0) {
  const key = getVideoProgressKey();
  const stored = localStorage.getItem(key);
  const progress: CourseProgress[] = stored ? JSON.parse(stored) : [];
  

  const courseId = videoId.split("_")[0];
  let courseProgress = progress.find(p => p.courseId === courseId);
  
  if (!courseProgress) {
    courseProgress = { courseId, videos: [], lastUpdated: Date.now() };
    progress.push(courseProgress);
  }
  
  const existingVideo = courseProgress.videos.find(v => v.videoId === videoId);
  if (existingVideo) {
    existingVideo.watchedAt = Date.now();
    existingVideo.watchedDuration = Math.max(existingVideo.watchedDuration, durationWatched);
  } else {
    courseProgress.videos.push({
      videoId,
      watchedAt: Date.now(),
      watchedDuration: durationWatched,
    });
  }
  
  courseProgress.lastUpdated = Date.now();
  localStorage.setItem(key, JSON.stringify(progress));
}

export function isVideoWatched(videoId: string): boolean {
  const key = getVideoProgressKey();
  const stored = localStorage.getItem(key);
  if (!stored) return false;
  
  const progress: CourseProgress[] = JSON.parse(stored);
  const courseId = videoId.split("_")[0];
  const courseProgress = progress.find(p => p.courseId === courseId);
  
  return courseProgress?.videos.some(v => v.videoId === videoId) || false;
}

export function getCourseProgress(videoModules: VideoModule[]): number {
  if (videoModules.length === 0) return 0;
  
  const watchedCount = videoModules.filter(v => isVideoWatched(v.id)).length;
  return Math.round((watchedCount / videoModules.length) * 100);
}

export function IsCompleted(videoModules: VideoModule[]): boolean {
  if (videoModules.length === 0) return false;
  const watchedCount = videoModules.filter(v => isVideoWatched(v.id)).length;
  return watchedCount === videoModules.length;
}

export function getWatchedVideosCount(courseId: string): number {
  const key = getVideoProgressKey();
  const stored = localStorage.getItem(key);
  if (!stored) return 0;
  
  const progress: CourseProgress[] = JSON.parse(stored);
  const courseProgress = progress.find(p => p.courseId === courseId);
  
  return courseProgress?.videos.length || 0;
}