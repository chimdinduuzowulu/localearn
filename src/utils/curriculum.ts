export type SupportedLanguage = "hausa" | "igbo" | "yoruba" | "english";

export interface LanguageMeta {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "english", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hausa",   label: "Hausa",   nativeLabel: "Hausa",   flag: "🇳🇬" },
  { code: "igbo",    label: "Igbo",    nativeLabel: "Igbo",    flag: "🇳🇬" },
  { code: "yoruba",  label: "Yoruba",  nativeLabel: "Yorùbá",  flag: "🇳🇬" },
];



export interface CurriculumDocument {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  originalLanguage: SupportedLanguage;
  rawText: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;           // ISO
  uploadedBy: string;           // teacher id
  status: "pending" | "processing" | "ready" | "error";
  errorMessage?: string;
  translations: Partial<Record<SupportedLanguage, TranslatedContent>>;
}


export interface TranslatedContent {
  language: SupportedLanguage;
  translatedText: string;
  summary: string;
  keyPoints: string[];
  generatedAt: string;
  ttsEnabled: boolean;          
  quizzes: Quiz[];
}


export interface Quiz {
  id: string;
  language: SupportedLanguage;
  documentId: string;
  questions: QuizQuestion[];
  generatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}


export interface QuizAttempt {
  id: string;
  quizId: string;
  documentId: string;
  language: SupportedLanguage;
  studentId: string;
  answers: number[];            
  score: number;                
  completedAt: string;
  timeTakenSeconds: number;
}

export interface StudentProgress {
  documentId: string;
  language: SupportedLanguage;
  studyGuideRead: boolean;
  quizAttempts: QuizAttempt[];
  bestScore: number;
  lastAccessedAt: string;
}


export interface StudentStreak {
  studentId: string;
  currentStreak: number;        
  longestStreak: number;
  lastActivityDate: string;     
  totalDaysActive: number;
}


export interface OfflineSyncRecord {
  id: string;
  documentId: string;
  language: SupportedLanguage;
  cachedAt: string;
  sizeBytes: number;
}



export interface TeacherStats {
  totalDocuments: number;
  processedDocuments: number;
  totalStudents: number;
  averageQuizScore: number;
  languageBreakdown: Record<SupportedLanguage, number>;
}

export type NotificationKind = "new_document" | "quiz_ready" | "score_update" | "streak_reminder";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  documentId?: string;
  createdAt: string;
  read: boolean;
}