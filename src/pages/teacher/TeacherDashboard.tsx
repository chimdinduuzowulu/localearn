import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatFileSize } from "../../utils/extractText";
import { SupportedLanguage, SUPPORTED_LANGUAGES } from "../../utils/curriculum";
import { useDocumentProcessor, UploadMeta } from "../../utils/useDocumentProcessor";
import { useAuth } from "../../context/AuthContext";
import {
  getAllCourses,
  getAllEnrollments,
  deleteCourse,
  getSubjectConfig,
  LANGUAGE_LABELS,
  LANGUAGE_FLAGS,
  type Course,
} from "../../utils/videoData";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconFile = ({ size = 20, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconUpload = ({ size = 26, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconVideo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheckCircle = ({ size = 18, color = "#22C55E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SUBJECTS = ["Mathematics","English Language","Basic Science","Social Studies","Agricultural Science","History","Geography","Computer Studies","Civic Education","Business Studies","Health Education","Hausa Language","Igbo Language","Yoruba Language","Religious Studies","Physical Education","Fine Art","Music","Home Economics","Technical Drawing"];
const GRADE_LEVELS = ["Pre-Primary","Primary 1","Primary 2","Primary 3","Primary 4","Primary 5","Primary 6","JSS 1","JSS 2","JSS 3","SSS 1","SSS 2","SSS 3"];

const B = "#0EA5E9";

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents, processing, loadDocuments, uploadAndProcess, removeDocument } = useDocumentProcessor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curriculum upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [meta, setMeta] = useState<UploadMeta>({
    title: "", subject: "Mathematics", gradeLevel: "JSS 1",
    originalLanguage: "english", targetLanguages: ["hausa", "igbo", "yoruba"],
    uploadedBy: user?.email ?? "teacher",
  });

  // Course state
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({ courses: 0, videos: 0, students: 0, docs: 0 });

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  useEffect(() => {
    if (!user) return;
    const all = getAllCourses().filter(c => c.createdBy === user.email);
    setMyCourses(all);

    const enrollments = getAllEnrollments();
    const myCourseIds = new Set(all.map(c => c.id));
    const students = new Set(
      enrollments.filter(e => myCourseIds.has(e.courseId)).map(e => e.studentEmail)
    );

    setStats({
      courses: all.length,
      videos: all.reduce((s, c) => s + c.videos.length, 0),
      students: students.size,
      docs: documents.length,
    });
  }, [user, documents]);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    setUploadError(null);
    if (f && !meta.title) setMeta(m => ({ ...m, title: f.name.replace(/\.[^.]+$/, "") }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    const valid = f && (f.type === "application/pdf" || f.name.endsWith(".txt") || f.name.endsWith(".md"));
    if (valid) {
      setSelectedFile(f);
      setUploadError(null);
      if (!meta.title) setMeta(m => ({ ...m, title: f.name.replace(/\.[^.]+$/, "") }));
    } else {
      setUploadError("Only PDF, TXT, or Markdown files are accepted.");
    }
  };

  const toggleLanguage = (lang: SupportedLanguage) => {
    if (lang === "english") return;
    setMeta(m => ({
      ...m,
      targetLanguages: m.targetLanguages.includes(lang)
        ? m.targetLanguages.filter(l => l !== lang)
        : [...m.targetLanguages, lang],
    }));
  };

  const handleDocSubmit = async () => {
    if (!selectedFile) { setUploadError("Please select a file first."); return; }
    if (!meta.title.trim()) { setUploadError("Please enter a document title."); return; }
    if (meta.targetLanguages.length === 0) { setUploadError("Select at least one target language."); return; }
    setUploadError(null);
    setShowUploadForm(false);
    try {
      await uploadAndProcess(selectedFile, { ...meta, uploadedBy: user?.email ?? "teacher" });
      setSelectedFile(null);
      setMeta(m => ({ ...m, title: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocuments();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourse(courseId);
    setMyCourses(prev => prev.filter(c => c.id !== courseId));
    setDeleteConfirmId(null);
  };

  const isProcessing = processing.status === "extracting" || processing.status === "processing";

  const statCards = [
    { label: "Courses Created", value: stats.courses, bg: "#E0F2FE", color: B },
    { label: "Videos Uploaded", value: stats.videos, bg: "#DCFCE7", color: "#16A34A" },
    { label: "Total Students", value: stats.students, bg: "#EDE9FE", color: "#7C3AED" },
    { label: "Documents", value: stats.docs, bg: "#FEF3C7", color: "#D97706" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>Teacher Portal</p>
          <p style={{ fontSize: 12, color: "#64748B" }}>{user?.fname} {user?.lname}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/teacher/create-course")}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <IconPlus /> Create Course
          </button>
          <button onClick={() => navigate("/index")}
            style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", color: "#475569", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Dashboard
          </button>
        </div>
      </div>

      <div style={{ width: "99%", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #E2E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.color, opacity: 0.8 }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* My Courses */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>My Courses</h2>
            <button onClick={() => navigate("/teacher/create-course")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `1.5px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              <IconPlus /> New Course
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div style={{ padding: "56px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#334155", marginBottom: 6 }}>No courses yet</p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 18 }}>Create your first course to get started</p>
              <button onClick={() => navigate("/teacher/create-course")}
                style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Create Course
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Course", "Subject", "Grade", "Language", "Videos", "Students", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map((course) => {
                    const cfg = getSubjectConfig(course.subject);
                    const allEnrollments = getAllEnrollments();
                    const studentCount = allEnrollments.filter(e => e.courseId === course.id).length;
                    const flag = LANGUAGE_FLAGS[course.language] ?? "🌍";
                    const langLabel = LANGUAGE_LABELS[course.language] ?? course.language;

                    return (
                      <tr key={course.id} style={{ borderTop: "1px solid #F1F5F9", transition: "background 0.12s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{course.title}</p>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: cfg.bg, color: cfg.color, fontWeight: 600 }}>
                            {cfg.emoji} {course.subject}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{course.gradeLevel}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{flag} {langLabel}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{course.videos.length}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{studentCount}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => navigate(`/teacher/manage-videos/${course.id}`)}
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: `1px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                              <IconVideo /> Videos
                            </button>
                            {deleteConfirmId === course.id ? (
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => handleDeleteCourse(course.id)}
                                  style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                                  Confirm
                                </button>
                                <button onClick={() => setDeleteConfirmId(null)}
                                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirmId(course.id)}
                                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1px solid #FECACA", background: "#FFF1F2", color: "#EF4444", fontFamily: "inherit", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                                <IconTrash /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Curriculum Documents */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Curriculum Documents</h2>
              <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Upload PDF/TXT curriculum for AI translation</p>
            </div>
            <button onClick={() => setShowUploadForm(true)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <IconPlus /> Upload Document
            </button>
          </div>

          {/* Processing progress */}
          {isProcessing && (
            <div style={{ padding: "16px 24px", background: "#EFF6FF", borderBottom: "1px solid #BFDBFE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${B}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: "#1E40AF" }}>
                    {processing.status === "extracting" ? "Extracting text…" : "Translating with AI…"}
                  </p>
                  {processing.progress > 0 && (
                    <div style={{ height: 4, background: "#DBEAFE", borderRadius: 99, overflow: "hidden", marginTop: 6 }}>
                      <div style={{ width: `${processing.progress}%`, height: "100%", background: B, borderRadius: 99, transition: "width 0.3s" }} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: B }}>{processing.progress}%</span>
              </div>
            </div>
          )}

          {documents.length === 0 && !isProcessing ? (
            <div style={{ padding: "56px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📄</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#334155", marginBottom: 6 }}>No documents yet</p>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Upload a curriculum PDF to get started</p>
            </div>
          ) : (
            <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {documents.map((doc, i) => {
                const cfg = getSubjectConfig(doc.subject);
                const isReady = doc.status === "ready";
                const hasError = doc.status === "error";

                return (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {cfg.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{doc.subject} · {doc.gradeLevel} · {formatFileSize(doc.fileSize)}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {isReady ? (
                          <><IconCheckCircle size={14} color="#16A34A" /><span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>Ready</span></>
                        ) : hasError ? (
                          <><IconAlertCircle /><span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>Error</span></>
                        ) : (
                          <span style={{ fontSize: 11, color: "#F59E0B", fontWeight: 600 }}>Processing…</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {isReady && (
                          <button onClick={() => navigate(`/view-document/${doc.id}`)}
                            style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
                            View
                          </button>
                        )}
                        <button onClick={() => removeDocument(doc.id)}
                          style={{ padding: "5px 8px", borderRadius: 7, border: "1px solid #FECACA", background: "#FFF1F2", color: "#EF4444", fontFamily: "inherit", fontWeight: 600, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setShowUploadForm(false)}
          >
            <motion.div initial={{ scale: 0.96, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
            >
              <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Upload New Document</h2>
                  <p style={{ fontSize: 13, color: "#64748B", marginTop: 3 }}>Add curriculum content for your students</p>
                </div>
                <button onClick={() => setShowUploadForm(false)}
                  style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #E2E8F0", background: "#F8FAFC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
                  <IconX />
                </button>
              </div>

              <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 18, maxHeight: "64vh", overflowY: "auto" }}>
                {/* Drop zone */}
                <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${selectedFile ? "#86EFAC" : isDragging ? B : "#CBD5E1"}`, borderRadius: 14, padding: "28px 22px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: selectedFile ? "#F0FDF4" : isDragging ? "#E0F2FE" : "#F8FAFC" }}>
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" style={{ display: "none" }} onChange={handleFileChange} />
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: selectedFile ? "#DCFCE7" : "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    {selectedFile ? <IconFile size={24} color="#16A34A" /> : <IconUpload size={24} color={B} />}
                  </div>
                  {selectedFile ? (
                    <>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{selectedFile.name}</p>
                      <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{formatFileSize(selectedFile.size)}</p>
                      <p style={{ fontSize: 12, color: B, marginTop: 4, fontWeight: 500 }}>Click to replace</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "#334155" }}>Drop your file here, or click to browse</p>
                      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>PDF, TXT, or Markdown — max 10 MB</p>
                    </>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Document Title *</label>
                  <input type="text" value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="e.g., Basic Science — Week 3 Notes"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontFamily: "inherit", fontSize: 14, color: "#0F172A", outline: "none", background: "#fff", transition: "border-color 0.15s", boxSizing: "border-box" as const }}
                    onFocus={e => (e.target.style.borderColor = B)} onBlur={e => (e.target.style.borderColor = "#E2E8F0")} />
                </div>

                {/* Subject + Grade */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[{ label: "Subject", key: "subject" as const, options: SUBJECTS }, { label: "Grade Level", key: "gradeLevel" as const, options: GRADE_LEVELS }].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                      <select value={meta[f.key]} onChange={e => setMeta(m => ({ ...m, [f.key]: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontFamily: "inherit", fontSize: 14, color: "#0F172A", background: "#fff", cursor: "pointer", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" as const }}
                        onFocus={e => (e.currentTarget.style.borderColor = B)} onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}>
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Languages */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Translate Into *</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SUPPORTED_LANGUAGES.filter(l => l.code !== "english").map(lang => {
                      const active = meta.targetLanguages.includes(lang.code);
                      return (
                        <button key={lang.code} type="button" onClick={() => toggleLanguage(lang.code)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, border: `1.5px solid ${active ? B : "#E2E8F0"}`, background: active ? "#EFF6FF" : "#fff", color: active ? B : "#64748B", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                          <span style={{ fontSize: 15 }}>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {meta.targetLanguages.length === 0 && <p style={{ fontSize: 12, color: "#F59E0B", marginTop: 6 }}>Select at least one language</p>}
                </div>

                {uploadError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <IconAlertCircle />
                    <p style={{ fontSize: 13, color: "#B91C1C" }}>{uploadError}</p>
                  </div>
                )}
              </div>

              <div style={{ padding: "16px 26px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 12 }}>
                <button onClick={() => setShowUploadForm(false)}
                  style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 14, color: "#475569", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleDocSubmit} disabled={!selectedFile}
                  style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: selectedFile ? B : "#CBD5E1", color: "#fff", fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: selectedFile ? "pointer" : "not-allowed", transition: "background 0.15s" }}>
                  Process & Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
