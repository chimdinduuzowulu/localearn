import { openDB, type IDBPDatabase } from "idb";
import {
  CurriculumDocument,
  QuizAttempt,
  StudentProgress,
  StudentStreak,
  OfflineSyncRecord,
  AppNotification,
} from "./utils/curriculum";

const DB_NAME    = "naija-learn-db";
const DB_VERSION = 3;

type NaijaLearnDB = {
  documents:       { key: string; value: CurriculumDocument };
  quizAttempts:    { key: string; value: QuizAttempt;   indexes: { "by-document": string } };
  studentProgress: { key: string; value: StudentProgress & { id: string }; indexes: { "by-document": string } };
  studentStreak:   { key: string; value: StudentStreak };
  offlineSync:     { key: string; value: OfflineSyncRecord; indexes: { "by-document": string } };
  notifications:   { key: string; value: AppNotification; indexes: { "by-read": number } };
  signupData:      { key: number; value: Record<string, unknown>; autoIncrement: true };
};

let _db: IDBPDatabase<NaijaLearnDB> | null = null;

async function getDB(): Promise<IDBPDatabase<NaijaLearnDB>> {
  if (_db) return _db;

  _db = await openDB<NaijaLearnDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains("signupData"))
          db.createObjectStore("signupData", { keyPath: "id", autoIncrement: true });
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains("documents"))
          db.createObjectStore("documents", { keyPath: "id" });
        if (!db.objectStoreNames.contains("quizAttempts")) {
          const qa = db.createObjectStore("quizAttempts", { keyPath: "id" });
          qa.createIndex("by-document", "documentId");
        }
        if (!db.objectStoreNames.contains("studentProgress")) {
          const sp = db.createObjectStore("studentProgress", { keyPath: "id" });
          sp.createIndex("by-document", "documentId");
        }
      }
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains("studentStreak"))
          db.createObjectStore("studentStreak", { keyPath: "studentId" });
        if (!db.objectStoreNames.contains("offlineSync")) {
          const os = db.createObjectStore("offlineSync", { keyPath: "id" });
          os.createIndex("by-document", "documentId");
        }
        if (!db.objectStoreNames.contains("notifications")) {
          const notif = db.createObjectStore("notifications", { keyPath: "id" });
          notif.createIndex("by-read", "read");
        }
      }
    },
  });
  return _db;
}



export async function saveDocument(doc: CurriculumDocument): Promise<void> {
  const db = await getDB();
  await db.put("documents", doc);
}

export async function getDocument(id: string): Promise<CurriculumDocument | undefined> {
  return (await getDB()).get("documents", id);
}

export async function getAllDocuments(): Promise<CurriculumDocument[]> {
  return (await getDB()).getAll("documents");
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("documents", id);
  // Also delete any offline caches for this doc
  const syncs = await db.getAllFromIndex("offlineSync", "by-document", id);
  await Promise.all(syncs.map(s => db.delete("offlineSync", s.id)));
}

export async function updateDocumentStatus(
  id: string,
  status: CurriculumDocument["status"],
  errorMessage?: string
): Promise<void> {
  const db  = await getDB();
  const doc = await db.get("documents", id);
  if (!doc) return;
  doc.status = status;
  if (errorMessage !== undefined) doc.errorMessage = errorMessage;
  await db.put("documents", doc);
}



export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  await (await getDB()).put("quizAttempts", attempt);
}

export async function getAttemptsByDocument(documentId: string): Promise<QuizAttempt[]> {
  return (await getDB()).getAllFromIndex("quizAttempts", "by-document", documentId);
}



export async function saveProgress(progress: StudentProgress & { id: string }): Promise<void> {
  await (await getDB()).put("studentProgress", progress);
}

export async function getProgress(id: string): Promise<(StudentProgress & { id: string }) | undefined> {
  return (await getDB()).get("studentProgress", id) as Promise<(StudentProgress & { id: string }) | undefined>;
}

export async function getAllProgress(): Promise<(StudentProgress & { id: string })[]> {
  return (await getDB()).getAll("studentProgress") as Promise<(StudentProgress & { id: string })[]>;
}


export async function saveStreak(streak: StudentStreak): Promise<void> {
  await (await getDB()).put("studentStreak", streak);
}

export async function getStreak(studentId: string): Promise<StudentStreak | undefined> {
  return (await getDB()).get("studentStreak", studentId);
}

/** Record today's activity and update streak atomically */
export async function recordActivity(studentId: string): Promise<StudentStreak> {
  const today = new Date().toISOString().slice(0, 10);
  const existing = await getStreak(studentId);

  if (existing) {
    const lastDate = existing.lastActivityDate;
    if (lastDate === today) return existing;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);

    const newStreak: StudentStreak = {
      ...existing,
      currentStreak: lastDate === yStr ? existing.currentStreak + 1 : 1,
      longestStreak: Math.max(existing.longestStreak, lastDate === yStr ? existing.currentStreak + 1 : 1),
      lastActivityDate: today,
      totalDaysActive: existing.totalDaysActive + 1,
    };
    await saveStreak(newStreak);
    return newStreak;
  }

  const fresh: StudentStreak = {
    studentId, currentStreak: 1, longestStreak: 1,
    lastActivityDate: today, totalDaysActive: 1,
  };
  await saveStreak(fresh);
  return fresh;
}



export async function saveOfflineSync(record: OfflineSyncRecord): Promise<void> {
  await (await getDB()).put("offlineSync", record);
}

export async function getOfflineSyncs(): Promise<OfflineSyncRecord[]> {
  return (await getDB()).getAll("offlineSync");
}

export async function getOfflineSyncsByDocument(documentId: string): Promise<OfflineSyncRecord[]> {
  return (await getDB()).getAllFromIndex("offlineSync", "by-document", documentId);
}


export async function saveNotification(n: AppNotification): Promise<void> {
  await (await getDB()).put("notifications", n);
}

export async function getUnreadNotifications(): Promise<AppNotification[]> {
  const all = await (await getDB()).getAll("notifications");
  return all.filter(n => !n.read).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationRead(id: string): Promise<void> {
  const db = await getDB();
  const n  = await db.get("notifications", id);
  if (n) { n.read = true; await db.put("notifications", n); }
}

export async function saveFormData(data: Record<string, unknown>): Promise<void> {
  await (await getDB()).put("signupData", data);
}

export async function getFormData(): Promise<Record<string, unknown>[]> {
  return (await getDB()).getAll("signupData");
}

export async function clearFormData(): Promise<void> {
  await (await getDB()).clear("signupData");
}