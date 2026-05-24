import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { getAllDocuments } from "../../db";
import { SUPPORTED_LANGUAGES, CurriculumDocument } from "../../utils/curriculum";
import { useAuth } from "../../context/AuthContext";
import {
  getEnrolledVideos,
  EnrichedVideoEntry,
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  extractYouTubeId,
  getYouTubeThumbnail,
  isYouTubeUrl,
} from "../../utils/videoData";
import { isVideoWatched, markVideoWatched } from "../../utils/videoProgress";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconX = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconBookOpen = ({ color = "#fff" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconPlay = ({ color = "#0EA5E9" }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPackage = ({ color = "#94A3B8" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Subject config ───────────────────────────────────────────────────────────

const SUBJECT_CONFIG: Record<string, { emoji: string; bg: string; color: string }> = {
  Mathematics:            { emoji: "📐", bg: "#EFF6FF", color: "#3B82F6" },
  "English Language":     { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  English:                { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  "Basic Science":        { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  Science:                { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  "Social Studies":       { emoji: "🌍", bg: "#EEF2FF", color: "#6366F1" },
  "Agricultural Science": { emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  Agriculture:            { emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  History:                { emoji: "📜", bg: "#FFF7ED", color: "#EA580C" },
  Geography:              { emoji: "🗺️", bg: "#F0F9FF", color: "#0284C7" },
  "Computer Studies":     { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  "Computer Science":     { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  "Civic Education":      { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  Civic:                  { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  "Business Studies":     { emoji: "💼", bg: "#FFF1F2", color: "#E11D48" },
  "Health Education":     { emoji: "🏥", bg: "#ECFDF5", color: "#059669" },
  "Basic Technology":     { emoji: "⚙️", bg: "#FFF7ED", color: "#D97706" },
  "Home Economics":       { emoji: "🏠", bg: "#ECFDF5", color: "#059669" },
  "Fine Arts":            { emoji: "🎨", bg: "#FFF1F2", color: "#E11D48" },
  Music:                  { emoji: "🎵", bg: "#F5F3FF", color: "#7C3AED" },
  "Physical Education":   { emoji: "⚽", bg: "#F0FDF4", color: "#16A34A" },
  "Islamic Studies":      { emoji: "📿", bg: "#FEF9C3", color: "#CA8A04" },
  "Christian Religious Studies": { emoji: "✝️", bg: "#EFF6FF", color: "#1D4ED8" },
  General:                { emoji: "🎓", bg: "#F0F9FF", color: "#0EA5E9" },
};

function getCfg(subject: string) {
  return SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG["General"];
}

const B = "#0EA5E9";

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<CurriculumDocument[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("hausa");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "videos">("courses");
  const [activeVideo, setActiveVideo] = useState<EnrichedVideoEntry | null>(null);

  useEffect(() => {
    getAllDocuments()
      .then((docs) => setDocuments(docs.filter((d) => d.status === "ready")))
      .finally(() => setLoading(false));
  }, []);

  const availableLangs = SUPPORTED_LANGUAGES.filter((l) => l.code !== "english");

  const filtered = documents.filter((doc) => {
    const hasLang = !!doc.translations[selectedLang as keyof typeof doc.translations];
    const matchSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return hasLang && matchSearch;
  });

  const grouped = filtered.reduce(
    (acc, doc) => {
      if (!acc[doc.subject]) acc[doc.subject] = [];
      acc[doc.subject].push(doc);
      return acc;
    },
    {} as Record<string, CurriculumDocument[]>
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: `3px solid ${B}`, borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ fontSize: 14, color: "#94A3B8" }}>Loading your courses…</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Page heading */}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            My Library
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
            Learn every subject in the language you think in
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #E2E8F0", paddingBottom: 0 }}>
          {(
            [
              ["courses", "📚", "Course Materials"],
              ["videos",  "🎬", "Video Tutorials"],
            ] as const
          ).map(([id, emoji, label]) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", marginBottom: -1,
                  borderBottom: active ? `2px solid ${B}` : "2px solid transparent",
                  background: "none",
                  borderTop: "none", borderLeft: "none", borderRight: "none",
                  color: active ? B : "#64748B",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Videos Tab ── */}
        {activeTab === "videos" ? (
          <VideoSection
            studentEmail={user?.email ?? ""}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        ) : (
          /* ── Course Materials Tab ── */
          <>
            {/* Language selector */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {availableLangs.map((lang) => {
                const active = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 18px", borderRadius: 10,
                      border: `1.5px solid ${active ? B : "#E2E8F0"}`,
                      background: active ? B : "#fff",
                      color: active ? "#fff" : "#475569",
                      fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <IconSearch />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or subject…"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: "#0F172A",
                  background: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = B)}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "#F1F5F9", border: "none", borderRadius: 6,
                    padding: "4px 6px", cursor: "pointer", color: "#64748B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <IconX size={13} />
                </button>
              )}
            </div>

            {/* Documents grouped by subject */}
            {Object.keys(grouped).length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #E2E8F0", padding: "72px 32px", textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <IconPackage color="#CBD5E1" />
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#334155", marginBottom: 6 }}>
                  {searchQuery ? "No results found" : "No course materials yet"}
                </p>
                <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
                  {searchQuery
                    ? "Try searching for something else"
                    : "Your teacher hasn't uploaded materials yet, or none match this language."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate("/courses")}
                    style={{
                      padding: "9px 22px", borderRadius: 10, border: "none",
                      background: B, color: "#fff", fontWeight: 600, fontSize: 14,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Browse Courses
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                {Object.entries(grouped).map(([subject, docs], si) => {
                  const cfg = getCfg(subject);
                  return (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.06 }}
                    >
                      {/* Subject heading */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 11,
                          background: cfg.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 20, flexShrink: 0, border: "1px solid rgba(0,0,0,0.06)",
                        }}>
                          {cfg.emoji}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{subject}</h2>
                          <span style={{
                            fontSize: 11, padding: "2px 9px", borderRadius: 99,
                            background: "#F1F5F9", color: "#64748B", fontWeight: 600,
                          }}>
                            {docs.length} {docs.length === 1 ? "doc" : "docs"}
                          </span>
                        </div>
                      </div>

                      {/* Document cards */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 16,
                      }}>
                        {docs.map((doc, di) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: si * 0.05 + di * 0.04 }}
                            style={{
                              background: "#fff",
                              borderRadius: 14,
                              border: "1px solid #E2E8F0",
                              padding: "20px",
                              cursor: "pointer",
                              transition: "border-color 0.15s",
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = B)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                            onClick={() => navigate(`/study/${doc.id}`)}
                          >
                            {/* Doc header */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                              <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: cfg.bg,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 22, border: "1px solid rgba(0,0,0,0.05)", flexShrink: 0,
                              }}>
                                {cfg.emoji}
                              </div>
                              <span style={{
                                fontSize: 11, padding: "3px 10px", borderRadius: 99,
                                background: "#DCFCE7", color: "#15803D", fontWeight: 600, flexShrink: 0,
                              }}>
                                Ready
                              </span>
                            </div>

                            {/* Doc title */}
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", lineHeight: 1.4 }}>
                                {doc.title}
                              </p>
                              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{doc.gradeLevel}</p>
                            </div>

                            {/* Language chips */}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {Object.keys(doc.translations).map((lang) => {
                                const l = SUPPORTED_LANGUAGES.find((x) => x.code === lang);
                                const isCurrent = lang === selectedLang;
                                return (
                                  <span
                                    key={lang}
                                    style={{
                                      fontSize: 11, padding: "3px 10px", borderRadius: 99,
                                      fontWeight: 600,
                                      display: "flex", alignItems: "center", gap: 4,
                                      background: isCurrent ? "#EFF6FF" : "#F8FAFC",
                                      color: isCurrent ? B : "#94A3B8",
                                      border: `1px solid ${isCurrent ? "#BAE6FD" : "#F1F5F9"}`,
                                    }}
                                  >
                                    {l?.flag} {l?.label}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => navigate(`/study/${doc.id}`)}
                                style={{
                                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                  gap: 7, padding: "10px 0", borderRadius: 9,
                                  border: "none", background: B, color: "#fff",
                                  fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
                                  transition: "opacity 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                              >
                                <IconBookOpen color="#fff" />
                                Study
                              </button>
                              <button
                                onClick={() => navigate(`/quiz/${doc.id}`)}
                                style={{
                                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                  gap: 7, padding: "10px 0", borderRadius: 9,
                                  border: "1.5px solid #E2E8F0", background: "#fff", color: "#475569",
                                  fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = B;
                                  e.currentTarget.style.color = B;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "#E2E8F0";
                                  e.currentTarget.style.color = "#475569";
                                }}
                              >
                                <IconPlay color="#475569" />
                                Quiz
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <LibraryVideoModal
          video={activeVideo}
          studentEmail={user?.email ?? ""}
          onClose={() => setActiveVideo(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}

// ─── Video Section (inside Library) ──────────────────────────────────────────

function VideoSection({
  studentEmail,
  activeVideo,
  setActiveVideo,
}: {
  studentEmail: string;
  activeVideo: EnrichedVideoEntry | null;
  setActiveVideo: (v: EnrichedVideoEntry | null) => void;
}) {
  const navigate = useNavigate();
  const allVideos = getEnrolledVideos(studentEmail);

  // Group by subject
  const grouped = allVideos.reduce(
    (acc, v) => {
      if (!acc[v.subject]) acc[v.subject] = [];
      acc[v.subject].push(v);
      return acc;
    },
    {} as Record<string, EnrichedVideoEntry[]>
  );

  if (allVideos.length === 0) {
    return (
      <div style={{
        background: "#fff", borderRadius: 16,
        border: "1px solid #E2E8F0", padding: "72px 32px", textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#334155", marginBottom: 6 }}>
          No videos yet
        </p>
        <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
          Enrol in a course to access video tutorials here.
        </p>
        <button
          onClick={() => navigate("/courses")}
          style={{
            padding: "9px 22px", borderRadius: 10, border: "none",
            background: B, color: "#fff", fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {Object.entries(grouped).map(([subject, videos], si) => {
        const cfg = getCfg(subject);
        return (
          <motion.div
            key={subject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.06 }}
          >
            {/* Subject heading */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: cfg.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0, border: "1px solid rgba(0,0,0,0.06)",
              }}>
                {cfg.emoji}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{subject}</h2>
                <span style={{
                  fontSize: 11, padding: "2px 9px", borderRadius: 99,
                  background: "#F1F5F9", color: "#64748B", fontWeight: 600,
                }}>
                  {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
              </div>
            </div>

            {/* Horizontal scroll row of video cards */}
            <div style={{
              display: "flex", flexDirection: "row",
              overflowX: "auto", gap: 16, paddingBottom: 16,
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
            } as React.CSSProperties}>
              {videos.map((video) => (
                <LibraryVideoCard
                  key={video.id}
                  video={video}
                  cfg={cfg}
                  studentEmail={studentEmail}
                  onPlay={() => setActiveVideo(video)}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Library Video Card ───────────────────────────────────────────────────────

function LibraryVideoCard({
  video,
  cfg,
  studentEmail,
  onPlay,
}: {
  video: EnrichedVideoEntry;
  cfg: { emoji: string; bg: string; color: string };
  studentEmail: string;
  onPlay: () => void;
}) {
  const watched = isVideoWatched(studentEmail, video.courseId, video.id);
  const ytId = extractYouTubeId(video.url);
  const thumb = ytId ? getYouTubeThumbnail(ytId) : null;
  const flag = LANGUAGE_FLAGS[video.language] ?? "🌐";
  const langLabel = LANGUAGE_LABELS[video.language] ?? video.language;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        minWidth: "280px",
        width: "280px",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = B;
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={onPlay}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#0F172A", overflow: "hidden" }}>
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: cfg.bg,
          }}>
            <span style={{ fontSize: 48 }}>{cfg.emoji}</span>
          </div>
        )}

        {/* Play overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(14,165,233,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Duration */}
        {video.duration && (
          <div style={{
            position: "absolute", bottom: 8, right: 8,
            background: "rgba(0,0,0,0.7)", color: "#fff",
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
          }}>
            {video.duration}
          </div>
        )}

        {/* Language */}
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.6)", color: "#fff",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>{flag}</span>
          <span>{langLabel}</span>
        </div>

        {/* Watched badge */}
        {watched && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: "#22C55E", color: "#fff",
            borderRadius: 99, padding: "3px 8px",
            fontSize: 11, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Watched
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: "#0F172A", lineHeight: 1.4, marginBottom: 4 }}>
          {video.title}
        </p>
        <p style={{ fontSize: 12, color: "#94A3B8" }}>{video.gradeLevel}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          style={{
            marginTop: 12, width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7, padding: "9px 0", borderRadius: 9,
            border: "none", background: B, color: "#fff",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Watch
        </button>
      </div>
    </motion.div>
  );
}

// ─── Library Video Modal ──────────────────────────────────────────────────────

function LibraryVideoModal({
  video,
  studentEmail,
  onClose,
}: {
  video: EnrichedVideoEntry;
  studentEmail: string;
  onClose: () => void;
}) {
  const [watched, setWatched] = useState(isVideoWatched(studentEmail, video.courseId, video.id));
  const ytId = extractYouTubeId(video.url);
  const flag = LANGUAGE_FLAGS[video.language] ?? "🌐";
  const langLabel = LANGUAGE_LABELS[video.language] ?? video.language;

  const handleComplete = () => {
    markVideoWatched(studentEmail, video.courseId, video.id);
    setWatched(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#fff", borderRadius: 20, overflow: "hidden",
          width: "100%", maxWidth: 800,
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9",
        }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{video.title}</p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              {flag} {langLabel} · {video.subject} · {video.courseTitle}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {watched && (
              <div style={{
                background: "#DCFCE7", color: "#15803D",
                padding: "4px 12px", borderRadius: 99,
                fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                background: "#F1F5F9", border: "none", borderRadius: "50%",
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Video */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          {ytId ? (
            <iframe
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              controls autoPlay
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              src={video.url}
              onEnded={handleComplete}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px", borderTop: "1px solid #F1F5F9", background: "#F8FAFC",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 13, color: "#64748B" }}>
            From: <span style={{ color: B, fontWeight: 600 }}>{video.courseTitle}</span>
          </p>
          {!watched && (
            <button
              onClick={handleComplete}
              style={{
                padding: "8px 18px", borderRadius: 9, border: "none",
                background: "#22C55E", color: "#fff",
                fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark as Watched
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
