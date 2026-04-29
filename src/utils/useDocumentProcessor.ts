import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  extractTextFromFile,
  truncateForAI,
  formatFileSize,
} from "../utils/extractText";

import {
  saveDocument,
  getAllDocuments,
  deleteDocument,
  updateDocumentStatus,
} from "../db";
import { processDocument } from "./aiService";
import { SupportedLanguage, CurriculumDocument } from "./curriculum";

export interface UploadMeta {
  title: string;
  subject: string;
  gradeLevel: string;
  originalLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  uploadedBy: string;
}

export interface ProcessingState {
  status: "idle" | "extracting" | "processing" | "done" | "error";
  step: string;
  progress: number;
  error?: string;
}

export function useDocumentProcessor() {
  const [documents, setDocuments] = useState<CurriculumDocument[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    step: "",
    progress: 0,
  });

  const loadDocuments = useCallback(async () => {
    const docs = await getAllDocuments();
    setDocuments(
      docs.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      ),
    );
  }, []);

  const uploadAndProcess = useCallback(async (file: File, meta: UploadMeta) => {
    const docId = uuidv4();

    // Validate file type
    const allowed = ["pdf", "txt", "md"];
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowed.includes(ext)) {
      throw new Error(
        `Unsupported file type ".${ext}". Please upload a PDF, TXT, or MD file.`,
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        `File too large (${formatFileSize(file.size)}). Maximum size is 10 MB.`,
      );
    }

    setProcessing({
      status: "extracting",
      step: "Reading document…",
      progress: 5,
    });

    let rawText: string;
    try {
      rawText = await extractTextFromFile(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to read file";
      setProcessing({ status: "error", step: msg, progress: 0, error: msg });
      throw err;
    }

    const safeText = truncateForAI(rawText);

    const doc: CurriculumDocument = {
      id: docId,
      title: meta.title,
      subject: meta.subject,
      gradeLevel: meta.gradeLevel,
      originalLanguage: meta.originalLanguage,
      rawText: safeText,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: meta.uploadedBy,
      status: "processing",
      translations: {},
    };

    await saveDocument(doc);
    setDocuments((prev) => [doc, ...prev]);

    const langs = meta.targetLanguages;
    let step = 0;

    for (const lang of langs) {
      step++;
      const baseProgress = 10 + ((step - 1) / langs.length) * 80;

      setProcessing({
        status: "processing",
        step: `Generating ${lang} content (${step}/${langs.length})…`,
        progress: Math.round(baseProgress),
      });

      try {
        const translated = await processDocument(
          safeText,
          lang,
          docId,
          (substep) => {
            setProcessing((prev) => ({
              ...prev,
              step: `[${lang}] ${substep}`,
            }));
          },
        );

        const fresh = await import("../db").then((m) => m.getDocument(docId));
        if (fresh) {
          fresh.translations[lang] = translated;
          await saveDocument(fresh);
          setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? { ...fresh } : d)),
          );
        }
      } catch (err) {
        console.error(`Failed to process language ${lang}:`, err);
      }
    }

    await updateDocumentStatus(docId, "ready");
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: "ready" } : d)),
    );

    setProcessing({
      status: "done",
      step: "All content generated!",
      progress: 100,
    });

    return docId;
  }, []);

  const removeDocument = useCallback(async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const resetProcessing = useCallback(() => {
    setProcessing({ status: "idle", step: "", progress: 0 });
  }, []);

  return {
    documents,
    processing,
    loadDocuments,
    uploadAndProcess,
    removeDocument,
    resetProcessing,
  };
}
