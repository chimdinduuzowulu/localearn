import { CoursesData } from "../../public/assets/data/CoursesData";

export interface VideoModule {
  id: string;
  title: string;
  subject: string;
  language: string;
  languageFlag: string;
  gradeLevel: string;
  youtubeUrl: string;
  offlineUrl: string;
  duration: string;
  moduleIndex: number;
  totalModules: number;
  description: string;
  isYouTubeValid: boolean;
}

const SUBJECT_MAPPING: Record<string, string> = {
  "LAFIYA DA GINDI": "Health Education",
  "CANJIN NONO DA YANAYI": "Agricultural Science",
  "BASIC ILTERACY DA LISSAFI": "Mathematics",
  "ILMIN KASUWANCI DA KUDI": "Business Studies",
  "AIKI DA KWAMFUTA": "Computer Studies",
};

const LANGUAGE_MAPPING: Record<string, { code: string; flag: string; name: string }> = {
  "English": { code: "english", flag: "🇬🇧", name: "English" },
  "Hausa": { code: "hausa", flag: "🇳🇬", name: "Hausa" },
  "Igbo": { code: "igbo", flag: "🇳🇬", name: "Igbo" },
  "Yoruba": { code: "yoruba", flag: "🇳🇬", name: "Yoruba" },
};

function detectLanguageFromCourse(courseName: string): string {
  const hausaKeywords = ["LAFIYA", "CANJIN", "ILMIN", "AIKI", "LISSAFI", "DA GINDI", "DA YANAYI", "DA KWAMFUTA"];
  if (hausaKeywords.some(kw => courseName.includes(kw))) return "Hausa";
  return "English";
}

function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  if (url.includes("drive.google.com")) return false;
  
  const patterns = [
    /youtube\.com\/watch\?v=/,
    /youtu\.be\//,
    /youtube\.com\/embed\//
  ];
  return patterns.some(pattern => pattern.test(url));
}

function extractYouTubeId(url: string): string | null {
  if (!url || !isValidYouTubeUrl(url)) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/v\/)([^?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function getAllVideoModules(): VideoModule[] {
  const modules: VideoModule[] = [];
  
  CoursesData.forEach((course) => {
    const subject = SUBJECT_MAPPING[course.courseName] || "General Studies";
    const language = detectLanguageFromCourse(course.courseName);
    const langInfo = LANGUAGE_MAPPING[language] || LANGUAGE_MAPPING["English"];
    
    course.videoLinks.forEach((link, idx) => {
      const offlineLink = course.offlineLinks?.[idx] ?? "";
      const isValidYouTube = isValidYouTubeUrl(link);
      const youtubeId = isValidYouTube ? extractYouTubeId(link) : null;
      console.log(offlineLink, link, youtubeId, isValidYouTube);
      
      
      if (!youtubeId && !offlineLink) return;
      
      modules.push({
        id: `${course.courseName.replace(/\s/g, "_")}_${idx}`,
        title: `${course.courseName} - ${idx + 1}`,
        subject: subject,
        language: langInfo.name,
        languageFlag: langInfo.flag,
        gradeLevel: "JSS 1-3",
        youtubeUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "",
        offlineUrl: offlineLink,
        duration: "10:00",
        moduleIndex: idx + 1,
        totalModules: course.courseTotalModule,
        description: `${course.translate} - Part ${idx + 1}`,
        isYouTubeValid: !!youtubeId,
      });
    });
  });
  
  return modules;
}

export function getVideosBySubjectAndLanguage(
  subject: string,
  languageCode: string
): VideoModule[] {
  const allVideos = getAllVideoModules();
  const languageName = Object.values(LANGUAGE_MAPPING).find(
    l => l.code === languageCode
  )?.name;
  
  if (!languageName) return [];
  
  return allVideos.filter(
    v => v.subject === subject && v.language === languageName
  );
}

export function getVideosByLanguage(languageCode: string): VideoModule[] {
  const allVideos = getAllVideoModules();
  const languageName = Object.values(LANGUAGE_MAPPING).find(
    l => l.code === languageCode
  )?.name;
  
  if (!languageName) return [];
  
  return allVideos.filter(v => v.language === languageName);
}