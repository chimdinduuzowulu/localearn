import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatFileSize } from "../../utils/extractText";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "../../utils/curriculum";
import {
  useDocumentProcessor,
  UploadMeta,
} from "../../utils/useDocumentProcessor";

// ─── Icon Components ───────────────────────────────────────────────────────────
const IconHome = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconChevronRight = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconFile = ({
  size = 20,
  color = "#0EA5E9",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconCheckCircle = ({
  size = 20,
  color = "#22C55E",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconGlobe = ({
  size = 20,
  color = "#8B5CF6",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconUpload = ({
  size = 28,
  color = "#0EA5E9",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const IconX = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconEye = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconClock = ({
  size = 20,
  color = "#F59E0B",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconAlertCircle = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#EF4444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconSparkle = ({
  size = 20,
  color = "#0EA5E9",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.88 5.63L19 10l-5.12 1.37L12 17l-1.88-5.63L5 10l5.12-1.37L12 3z" />
    <path d="M5 3l.94 2.82L8.5 7 5.94 7.18 5 10l-.94-2.82L1.5 7l2.56-.18L5 3z" />
    <path d="M19 15l.94 2.82L22.5 19l-2.56.18L19 22l-.94-2.82L15.5 19l2.56-.18L19 15z" />
  </svg>
);

// ─── Subjects & Grades ────────────────────────────────────────────────────────
const SUBJECTS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Social Studies",
  "Civic Education",
  "Agricultural Science",
  "History",
  "Geography",
  "Business Studies",
  "Computer Studies",
  "Health Education",
  "Home Economics",
];
const GRADE_LEVELS = [
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const {
    documents,
    processing,
    loadDocuments,
    uploadAndProcess,
    removeDocument,
    resetProcessing,
  } = useDocumentProcessor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [meta, setMeta] = useState<UploadMeta>({
    title: "",
    subject: "Mathematics",
    gradeLevel: "JSS 1",
    originalLanguage: "english",
    targetLanguages: ["hausa", "igbo", "yoruba"],
    uploadedBy: "teacher-01",
  });

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    setUploadError(null);
    if (f && !meta.title)
      setMeta((m) => ({ ...m, title: f.name.replace(/\.[^.]+$/, "") }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    const valid =
      f &&
      (f.type === "application/pdf" ||
        f.name.endsWith(".txt") ||
        f.name.endsWith(".md"));
    if (valid) {
      setSelectedFile(f);
      setUploadError(null);
      if (!meta.title)
        setMeta((m) => ({ ...m, title: f.name.replace(/\.[^.]+$/, "") }));
    } else {
      setUploadError("Only PDF, TXT, or Markdown files are accepted.");
    }
  };

  const toggleLanguage = (lang: SupportedLanguage) => {
    if (lang === "english") return;
    setMeta((m) => ({
      ...m,
      targetLanguages: m.targetLanguages.includes(lang)
        ? m.targetLanguages.filter((l) => l !== lang)
        : [...m.targetLanguages, lang],
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }
    if (!meta.title.trim()) {
      setUploadError("Please enter a document title.");
      return;
    }
    if (meta.targetLanguages.length === 0) {
      setUploadError("Select at least one target language.");
      return;
    }
    setUploadError(null);
    setShowUploadForm(false);
    try {
      await uploadAndProcess(selectedFile, meta);
      setSelectedFile(null);
      setMeta((m) => ({ ...m, title: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocuments();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    }
  };

  const closeModal = () => {
    setShowUploadForm(false);
    setUploadError(null);
  };
  const isProcessing =
    processing.status === "extracting" || processing.status === "processing";
  const readyCount = documents.filter((d) => d.status === "ready").length;

  const B = "#0EA5E9"; // brand blue

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#64748B",
          }}
        >
          <button
            onClick={() => navigate("/index")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748B",
              fontFamily: "inherit",
              fontSize: 13,
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
          >
            <IconHome /> Dashboard
          </button>
          <IconChevronRight />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#0F172A",
              fontWeight: 600,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={B}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Teacher Portal
          </span>
        </nav>

        {/* Upload button */}
        <button
          onClick={() => {
            setShowUploadForm(true);
            resetProcessing();
          }}
          disabled={isProcessing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "0 20px",
            height: 40,
            borderRadius: 10,
            border: "none",
            background: B,
            color: "#fff",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 14,
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.55 : 1,
            transition: "opacity 0.15s",
          }}
        >
          <IconPlus /> Upload Content
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {[
            {
              label: "Total Documents",
              value: documents.length,
              icon: <IconFile />,
              bg: "#EFF6FF",
              iconBg: "#DBEAFE",
            },
            {
              label: "Ready for Students",
              value: readyCount,
              icon: <IconCheckCircle />,
              bg: "#F0FDF4",
              iconBg: "#DCFCE7",
            },
            {
              label: "Languages Active",
              value: 3,
              icon: <IconGlobe />,
              bg: "#F5F3FF",
              iconBg: "#EDE9FE",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 28px",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#0F172A",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </p>
              </div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Processing Banner ────────────────────────────────────────────── */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 24px",
                border: `1px solid #BAE6FD`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#E0F2FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconSparkle color={B} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>
                  AI is processing your document…
                </p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  {processing.step}
                </p>
                <div
                  style={{
                    marginTop: 10,
                    height: 6,
                    background: "#E0F2FE",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{ height: "100%", background: B, borderRadius: 99 }}
                    animate={{ width: `${processing.progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: B,
                  flexShrink: 0,
                }}
              >
                {processing.progress}%
              </span>
            </motion.div>
          )}

          {processing.status === "done" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: "#F0FDF4",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid #BBF7D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconCheckCircle size={20} color="#16A34A" />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#15803D" }}>
                  Document processed — students can now access it.
                </p>
              </div>
              <button
                onClick={resetProcessing}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#64748B",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Documents Section ────────────────────────────────────────────── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.2,
                }}
              >
                Curriculum Documents
              </h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
                {documents.length} total uploaded
              </p>
            </div>
          </div>

          {documents.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "2px dashed #E2E8F0",
                padding: "64px 32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "#E0F2FE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <IconUpload color={B} />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0F172A",
                  marginBottom: 6,
                }}
              >
                No documents yet
              </p>
              <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
                Upload your first curriculum PDF to get started
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                style={{
                  padding: "12px 28px",
                  borderRadius: 10,
                  border: "none",
                  background: B,
                  color: "#fff",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {documents.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          doc.status === "ready"
                            ? "#DBEAFE"
                            : doc.status === "processing"
                              ? "#FEF3C7"
                              : "#FEE2E2",
                      }}
                    >
                      {doc.status === "ready" ? (
                        <IconFile color={B} />
                      ) : doc.status === "processing" ? (
                        <IconClock color="#F59E0B" />
                      ) : (
                        <IconFile color="#EF4444" />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#0F172A",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 380,
                          }}
                        >
                          {doc.title}
                        </span>
                        {/* Status badge */}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 10px",
                            borderRadius: 99,
                            letterSpacing: "0.03em",
                            background:
                              doc.status === "ready"
                                ? "#DCFCE7"
                                : doc.status === "processing"
                                  ? "#FEF9C3"
                                  : "#FEE2E2",
                            color:
                              doc.status === "ready"
                                ? "#15803D"
                                : doc.status === "processing"
                                  ? "#A16207"
                                  : "#B91C1C",
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <p
                        style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}
                      >
                        {doc.subject} · {doc.gradeLevel} ·{" "}
                        {formatFileSize(doc.fileSize)}
                      </p>
                      {/* Language chips */}
                      {doc.status === "ready" && (
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            marginTop: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {Object.keys(doc.translations).map((lang) => {
                            const l = SUPPORTED_LANGUAGES.find(
                              (x) => x.code === lang,
                            );
                            return (
                              <span
                                key={lang}
                                style={{
                                  fontSize: 12,
                                  padding: "3px 10px",
                                  borderRadius: 99,
                                  background: "#F1F5F9",
                                  color: "#475569",
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                {l?.flag} {l?.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {doc.errorMessage && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#EF4444",
                            marginTop: 4,
                          }}
                        >
                          {doc.errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      {doc.status === "ready" && (
                        <button
                          onClick={() => navigate(`/view-document/${doc.id}`)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 18px",
                            borderRadius: 9,
                            border: "none",
                            background: B,
                            color: "#fff",
                            fontFamily: "inherit",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <IconEye /> View
                        </button>
                      )}
                      {deleteConfirm === doc.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => {
                              removeDocument(doc.id);
                              setDeleteConfirm(null);
                            }}
                            style={{
                              padding: "7px 14px",
                              borderRadius: 8,
                              border: "none",
                              background: "#EF4444",
                              color: "#fff",
                              fontFamily: "inherit",
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{
                              padding: "7px 14px",
                              borderRadius: 8,
                              border: "1px solid #E2E8F0",
                              background: "#fff",
                              color: "#64748B",
                              fontFamily: "inherit",
                              fontWeight: 500,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(doc.id)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            border: "1px solid #E2E8F0",
                            background: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94A3B8",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FEE2E2";
                            e.currentTarget.style.color = "#EF4444";
                            e.currentTarget.style.borderColor = "#FECACA";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.color = "#94A3B8";
                            e.currentTarget.style.borderColor = "#E2E8F0";
                          }}
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Processing progress bar */}
                  {doc.status === "processing" && (
                    <div style={{ height: 3, background: "#E0F2FE" }}>
                      <motion.div
                        style={{ height: "100%", background: B }}
                        animate={{ width: ["0%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Upload Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.55)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 20,
                width: "100%",
                maxWidth: 540,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: "24px 28px 20px",
                  borderBottom: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}
                  >
                    Upload New Document
                  </h2>
                  <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}>
                    Add curriculum content for your students
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    border: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748B",
                    flexShrink: 0,
                  }}
                >
                  <IconX />
                </button>
              </div>

              {/* Modal body */}
              <div
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  maxHeight: "68vh",
                  overflowY: "auto",
                }}
              >
                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${selectedFile ? "#86EFAC" : isDragging ? B : "#CBD5E1"}`,
                    borderRadius: 14,
                    padding: "32px 24px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedFile
                      ? "#F0FDF4"
                      : isDragging
                        ? "#E0F2FE"
                        : "#F8FAFC",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: selectedFile ? "#DCFCE7" : "#E0F2FE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    {selectedFile ? (
                      <IconFile size={26} color="#16A34A" />
                    ) : (
                      <IconUpload size={26} color={B} />
                    )}
                  </div>
                  {selectedFile ? (
                    <>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#0F172A",
                        }}
                      >
                        {selectedFile.name}
                      </p>
                      <p
                        style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}
                      >
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: B,
                          marginTop: 6,
                          fontWeight: 500,
                        }}
                      >
                        Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          color: "#334155",
                        }}
                      >
                        Drop your file here, or click to browse
                      </p>
                      <p
                        style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}
                      >
                        PDF, TXT, or Markdown — max 10 MB
                      </p>
                    </>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748B",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={meta.title}
                    onChange={(e) =>
                      setMeta((m) => ({ ...m, title: e.target.value }))
                    }
                    placeholder="e.g., Basic Science — Week 3 Notes"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: "1px solid #E2E8F0",
                      fontFamily: "inherit",
                      fontSize: 14,
                      color: "#0F172A",
                      outline: "none",
                      background: "#fff",
                      transition: "border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = B)}
                    onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                  />
                </div>

                {/* Subject + Grade */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "Subject",
                      key: "subject" as const,
                      options: SUBJECTS,
                    },
                    {
                      label: "Grade Level",
                      key: "gradeLevel" as const,
                      options: GRADE_LEVELS,
                    },
                  ].map((f) => (
                    <div key={f.key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        {f.label}
                      </label>
                      <select
                        value={meta[f.key]}
                        onChange={(e) =>
                          setMeta((m) => ({ ...m, [f.key]: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: 10,
                          border: "1px solid #E2E8F0",
                          fontFamily: "inherit",
                          fontSize: 14,
                          color: "#0F172A",
                          background: "#fff",
                          cursor: "pointer",
                          outline: "none",
                          transition: "border-color 0.15s",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = B)}
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#E2E8F0")
                        }
                      >
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Languages */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748B",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Translate Into *
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SUPPORTED_LANGUAGES.filter(
                      (l) => l.code !== "english",
                    ).map((lang) => {
                      const active = meta.targetLanguages.includes(lang.code);
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => toggleLanguage(lang.code)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 99,
                            border: `1.5px solid ${active ? B : "#E2E8F0"}`,
                            background: active ? "#EFF6FF" : "#fff",
                            color: active ? B : "#64748B",
                            fontFamily: "inherit",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {meta.targetLanguages.length === 0 && (
                    <p style={{ fontSize: 12, color: "#F59E0B", marginTop: 6 }}>
                      Select at least one language
                    </p>
                  )}
                </div>

                {/* Error */}
                {uploadError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                    }}
                  >
                    <IconAlertCircle />
                    <p style={{ fontSize: 13, color: "#B91C1C" }}>
                      {uploadError}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div
                style={{
                  padding: "18px 28px",
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  gap: 12,
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                  style={{
                    flex: 2,
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "none",
                    background: selectedFile ? B : "#CBD5E1",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: selectedFile ? "pointer" : "not-allowed",
                    transition: "background 0.15s",
                  }}
                >
                  Process & Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
