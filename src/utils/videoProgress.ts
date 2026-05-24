const PROGRESS_KEY = "wl_video_progress";
const LEGACY_PROGRESS_KEY = "videoProgress";

export interface VideoProgressEntry {
  studentEmail: string;
  courseId: string;
  videoId: string;
  watchedAt: string; // ISO
}


function readAll(): VideoProgressEntry[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as VideoProgressEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: VideoProgressEntry[]): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(entries));
}


function legacyIsWatched(videoId: string): boolean {
  try {
    const raw = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return false;
    
    const stored: { courseId: string; videos: { videoId: string }[] }[] =
      JSON.parse(raw);
    return stored.some((c) => c.videos.some((v) => v.videoId === videoId));
  } catch {
    return false;
  }
}

function legacyMarkWatched(videoId: string): void {
  try {
    const raw = localStorage.getItem(LEGACY_PROGRESS_KEY);
    const stored: { courseId: string; videos: { videoId: string }[] }[] = raw
      ? JSON.parse(raw)
      : [];
    // Put under a generic "legacy" course bucket
    const bucket = stored.find((c) => c.courseId === "__legacy__");
    if (bucket) {
      if (!bucket.videos.some((v) => v.videoId === videoId)) {
        bucket.videos.push({ videoId });
      }
    } else {
      stored.push({ courseId: "__legacy__", videos: [{ videoId }] });
    }
    localStorage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify(stored));
  } catch {
  
  }
  
  const all = readAll();
  const exists = all.some(
    (e) =>
      e.videoId === videoId &&
      e.courseId === "__legacy__" &&
      e.studentEmail === "__legacy__"
  );
  if (!exists) {
    all.push({
      studentEmail: "__legacy__",
      courseId: "__legacy__",
      videoId,
      watchedAt: new Date().toISOString(),
    });
    writeAll(all);
  }
}


export function markVideoWatched(
  studentEmailOrVideoId: string,
  courseIdOrAny?: string | number,
  videoId?: string
): void {
  if (videoId !== undefined && typeof courseIdOrAny === "string") {
    const all = readAll();
    const exists = all.some(
      (e) =>
        e.studentEmail === studentEmailOrVideoId &&
        e.courseId === courseIdOrAny &&
        e.videoId === videoId
    );
    if (!exists) {
      all.push({
        studentEmail: studentEmailOrVideoId,
        courseId: courseIdOrAny,
        videoId,
        watchedAt: new Date().toISOString(),
      });
      writeAll(all);
    }
  } else {
    
    legacyMarkWatched(studentEmailOrVideoId);
  }
}


export function isVideoWatched(
  studentEmailOrVideoId: string,
  courseId?: string,
  videoId?: string
): boolean {
  if (videoId !== undefined && courseId !== undefined) {
    // New 3-arg call
    return readAll().some(
      (e) =>
        e.studentEmail === studentEmailOrVideoId &&
        e.courseId === courseId &&
        e.videoId === videoId
    );
  } else {
    
    const inNew = readAll().some((e) => e.videoId === studentEmailOrVideoId);
    const inLegacy = legacyIsWatched(studentEmailOrVideoId);
    return inNew || inLegacy;
  }
}

export function getWatchedCount(
  studentEmail: string,
  courseId: string
): number {
  return readAll().filter(
    (e) => e.studentEmail === studentEmail && e.courseId === courseId
  ).length;
}


export function getCourseProgressPercent(
  studentEmail: string,
  courseId: string,
  totalVideos: number
): number {
  if (totalVideos === 0) return 0;
  const watched = getWatchedCount(studentEmail, courseId);
  return Math.round((watched / totalVideos) * 100);
}


export function getCourseProgress(
  videos: { id: string; [key: string]: unknown }[],
  studentEmail?: string,
  courseId?: string
): number {
  if (videos.length === 0) return 0;
  let watchedCount: number;
  if (studentEmail && courseId) {
    watchedCount = videos.filter((v) =>
      isVideoWatched(studentEmail, courseId, v.id)
    ).length;
  } else {
    watchedCount = videos.filter((v) => isVideoWatched(v.id)).length;
  }
  return Math.round((watchedCount / videos.length) * 100);
}

export function getTotalWatchedCount(studentEmail: string): number {
  return readAll().filter((e) => e.studentEmail === studentEmail).length;
}


export function getWatchedEntriesForStudent(
  studentEmail: string
): VideoProgressEntry[] {
  return readAll().filter((e) => e.studentEmail === studentEmail);
}
