const COURSES_KEY = "wl_courses_v2";
const ENROLLMENTS_KEY = "wl_enrollments";


export interface VideoEntry {
  id: string;
  title: string;
  url: string;
  duration?: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  language: "english" | "hausa" | "igbo" | "yoruba";
  description: string;
  createdBy: string;
  createdAt: string;
  videos: VideoEntry[];
  curriculumDocId?: string;
}

export interface Enrollment {
  studentEmail: string;
  courseId: string;
  enrolledAt: string;
}



export interface EnrichedVideoEntry extends VideoEntry {
  courseId: string;
  courseTitle: string;
  subject: string;
  language: "english" | "hausa" | "igbo" | "yoruba";
  gradeLevel: string;
}

// ─── Language helpers ─────────────────────────────────────────────────────────

export const LANGUAGE_FLAGS: Record<string, string> = {
  english: "🇬🇧",
  hausa: "🇳🇬",
  igbo: "🇳🇬",
  yoruba: "🇳🇬",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  english: "English",
  hausa: "Hausa",
  igbo: "Igbo",
  yoruba: "Yoruba",
};

// ─── Course CRUD helpers ──────────────────────────────────────────────────────

export function getAllCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    return raw ? (JSON.parse(raw) as Course[]) : [];
  } catch {
    return [];
  }
}

export function saveCourses(courses: Course[]): void {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function getCourseById(id: string): Course | undefined {
  return getAllCourses().find((c) => c.id === id);
}

export function updateCourse(updated: Course): void {
  const all = getAllCourses();
  const idx = all.findIndex((c) => c.id === updated.id);
  if (idx !== -1) {
    all[idx] = updated;
    saveCourses(all);
  }
}

export function deleteCourse(courseId: string): void {
  const all = getAllCourses().filter((c) => c.id !== courseId);
  saveCourses(all);
  // Also remove enrollments for this course
  const enrollments = getAllEnrollments().filter(
    (e) => e.courseId !== courseId
  );
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
}

// ─── Enrollment helpers ───────────────────────────────────────────────────────

export function getAllEnrollments(): Enrollment[] {
  try {
    const raw = localStorage.getItem(ENROLLMENTS_KEY);
    return raw ? (JSON.parse(raw) as Enrollment[]) : [];
  } catch {
    return [];
  }
}

export function getEnrollmentsForStudent(studentEmail: string): Enrollment[] {
  return getAllEnrollments().filter((e) => e.studentEmail === studentEmail);
}

export function isEnrolled(studentEmail: string, courseId: string): boolean {
  return getAllEnrollments().some(
    (e) => e.studentEmail === studentEmail && e.courseId === courseId
  );
}

export function enrollStudent(studentEmail: string, courseId: string): void {
  if (isEnrolled(studentEmail, courseId)) return;
  const all = getAllEnrollments();
  all.push({
    studentEmail,
    courseId,
    enrolledAt: new Date().toISOString(),
  });
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(all));
}

export function getEnrolledCourses(studentEmail: string): Course[] {
  const enrollments = getEnrollmentsForStudent(studentEmail);
  const courses = getAllCourses();
  return enrollments
    .map((e) => courses.find((c) => c.id === e.courseId))
    .filter((c): c is Course => c !== undefined);
}

// ─── Primary helper: get flat video list for a student ────────────────────────

export function getEnrolledVideos(studentEmail: string): EnrichedVideoEntry[] {
  const courses = getEnrolledCourses(studentEmail);
  const result: EnrichedVideoEntry[] = [];
  for (const course of courses) {
    for (const video of course.videos) {
      result.push({
        ...video,
        courseId: course.id,
        courseTitle: course.title,
        subject: course.subject,
        language: course.language,
        gradeLevel: course.gradeLevel,
      });
    }
  }
  return result;
}

// ─── YouTube URL helpers ──────────────────────────────────────────────────────

export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return (
    /youtube\.com\/watch\?v=/.test(url) ||
    /youtu\.be\//.test(url) ||
    /youtube\.com\/embed\//.test(url)
  );
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

export function normaliseYouTubeUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (id) return `https://www.youtube.com/watch?v=${id}`;
  return url;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SUBJECTS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Social Studies",
  "Agricultural Science",
  "History",
  "Geography",
  "Computer Studies",
  "Civic Education",
  "Business Studies",
  "Health Education",
  "Hausa Language",
  "Igbo Language",
  "Yoruba Language",
  "Religious Studies",
  "Physical Education",
  "Fine Art",
  "Music",
  "Home Economics",
  "Technical Drawing",
];

export const GRADE_LEVELS = [
  "Pre-Primary",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

export const SUBJECT_CONFIG: Record<
  string,
  { emoji: string; bg: string; color: string }
> = {
  Mathematics: { emoji: "📐", bg: "#EFF6FF", color: "#3B82F6" },
  "English Language": { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  "Basic Science": { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  "Social Studies": { emoji: "🌍", bg: "#EEF2FF", color: "#6366F1" },
  "Agricultural Science": { emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  History: { emoji: "📜", bg: "#FFF7ED", color: "#EA580C" },
  Geography: { emoji: "🗺️", bg: "#F0F9FF", color: "#0284C7" },
  "Computer Studies": { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  "Civic Education": { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  "Business Studies": { emoji: "💼", bg: "#FFF1F2", color: "#E11D48" },
  "Health Education": { emoji: "🏥", bg: "#ECFDF5", color: "#059669" },
  "Hausa Language": { emoji: "🇳🇬", bg: "#FFF7ED", color: "#EA580C" },
  "Igbo Language": { emoji: "🇳🇬", bg: "#F0FDF4", color: "#16A34A" },
  "Yoruba Language": { emoji: "🇳🇬", bg: "#EEF2FF", color: "#6366F1" },
  "Religious Studies": { emoji: "🕌", bg: "#FEF3C7", color: "#D97706" },
  "Physical Education": { emoji: "⚽", bg: "#ECFDF5", color: "#059669" },
  "Fine Art": { emoji: "🎨", bg: "#FDF4FF", color: "#A855F7" },
  Music: { emoji: "🎵", bg: "#FFF1F2", color: "#E11D48" },
  "Home Economics": { emoji: "🏠", bg: "#F0FDF4", color: "#16A34A" },
  "Technical Drawing": { emoji: "📏", bg: "#F8FAFC", color: "#475569" },
  General: { emoji: "🎓", bg: "#F0F9FF", color: "#0EA5E9" },
};

export function getSubjectConfig(subject: string) {
  return SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG["General"];
}


export function getVideosBySubjectAndLanguage(
  subject: string,
  languageCode: string
): EnrichedVideoEntry[] {
  try {
    const all = getAllCourses();
    const result: EnrichedVideoEntry[] = [];
    for (const course of all) {
      if (
        course.subject === subject &&
        course.language === languageCode
      ) {
        for (const video of course.videos) {
          result.push({
            ...video,
            courseId: course.id,
            courseTitle: course.title,
            subject: course.subject,
            language: course.language,
            gradeLevel: course.gradeLevel,
          });
        }
      }
    }
    return result;
  } catch {
    return [];
  }
}

export { getWatchedCount } from "./videoProgress";
