import { useState } from "react";
import Layout from "../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getEnrolledVideos,
  EnrichedVideoEntry,
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  extractYouTubeId,
  isYouTubeUrl,
  getYouTubeThumbnail,
} from "../../utils/videoData";
import {
  isVideoWatched,
  markVideoWatched,
} from "../../utils/videoProgress";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconPlay = ({ size = 20, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconX = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconYouTube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

// ─── Subject config ───────────────────────────────────────────────────────────

const SUBJECT_CONFIG: Record<string, { emoji: string; bg: string; color: string }> = {
  Mathematics:            { emoji: "📐", bg: "#EFF6FF", color: "#3B82F6" },
  English:                { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  Science:                { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  "Social Studies":       { emoji: "🌍", bg: "#EEF2FF", color: "#6366F1" },
  Agriculture:            { emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  History:                { emoji: "📜", bg: "#FFF7ED", color: "#EA580C" },
  Geography:              { emoji: "🗺️", bg: "#F0F9FF", color: "#0284C7" },
  "Computer Science":     { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  Civic:                  { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  "Basic Technology":     { emoji: "⚙️", bg: "#FFF7ED", color: "#D97706" },
  "Home Economics":       { emoji: "🏠", bg: "#ECFDF5", color: "#059669" },
  "Fine Arts":            { emoji: "🎨", bg: "#FFF1F2", color: "#E11D48" },
  Music:                  { emoji: "🎵", bg: "#F5F3FF", color: "#7C3AED" },
  "Physical Education":   { emoji: "⚽", bg: "#F0FDF4", color: "#16A34A" },
  "Islamic Studies":      { emoji: "📿", bg: "#FEF9C3", color: "#CA8A04" },
  "Christian Religious Studies": { emoji: "✝️", bg: "#EFF6FF", color: "#1D4ED8" },
  General:                { emoji: "🎓", bg: "#F0F9FF", color: "#0EA5E9" },
};

function getSubjectCfg(subject: string) {
  return SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG["General"];
}

// ─── Language tabs ────────────────────────────────────────────────────────────

const LANG_TABS = [
  { code: "all",     label: "All",    flag: "🌍" },
  { code: "english", label: "English", flag: "🇬🇧" },
  { code: "hausa",   label: "Hausa",  flag: "🇳🇬" },
  { code: "igbo",    label: "Igbo",   flag: "🇳🇬" },
  { code: "yoruba",  label: "Yoruba", flag: "🇳🇬" },
];

const B = "#0EA5E9";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function VideoTutorials() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<EnrichedVideoEntry | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const allVideos = getEnrolledVideos(user.email);

  // Language filter
  const langFiltered =
    selectedLang === "all"
      ? allVideos
      : allVideos.filter((v) => v.language === selectedLang);

  // Derive subjects from language-filtered set
  const subjects = ["all", ...Array.from(new Set(langFiltered.map((v) => v.subject)))];

  // Subject + search filter
  const filtered = langFiltered.filter((v) => {
    const matchSubject = selectedSubject === "all" || v.subject === selectedSubject;
    const matchSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  // Group by subject
  const grouped = filtered.reduce(
    (acc, v) => {
      if (!acc[v.subject]) acc[v.subject] = [];
      acc[v.subject].push(v);
      return acc;
    },
    {} as Record<string, EnrichedVideoEntry[]>
  );

  // Not enrolled empty state
  if (allVideos.length === 0) {
    return (
      <Layout>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Video Tutorials
            </h1>
            <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
              Watch video lessons in your preferred language
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "72px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
            <p style={{ fontWeight: 700, fontSize: 18, color: "#334155", marginBottom: 8 }}>No videos yet</p>
            <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
              Enrol in a course to access its video tutorials.
            </p>
            <button
              onClick={() => navigate("/courses")}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: B,
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Browse Courses
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Video Tutorials
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
            Watch video lessons in your preferred language
          </p>
        </div>

        {/* Language tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LANG_TABS.map((lang) => {
            const active = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); setSelectedSubject("all"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: `1.5px solid ${active ? B : "#E2E8F0"}`,
                  background: active ? B : "#fff",
                  color: active ? "#fff" : "#475569",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subject filter + search */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <IconSearch />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos…"
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
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 6px",
                  cursor: "pointer",
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconX size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {subjects.map((s) => {
              const cfg = s !== "all" ? getSubjectCfg(s) : null;
              const active = selectedSubject === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "7px 14px",
                    borderRadius: 99,
                    border: `1.5px solid ${active ? B : "#E2E8F0"}`,
                    background: active ? "#EFF6FF" : "#fff",
                    color: active ? B : "#64748B",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cfg && <span>{cfg.emoji}</span>}
                  <span>{s === "all" ? "All Subjects" : s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video grid or empty */}
        {Object.keys(grouped).length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "72px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#334155", marginBottom: 6 }}>
              {searchQuery ? "No videos found" : "No videos available yet"}
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              {searchQuery ? "Try a different search or filter" : "Check back soon for video tutorials!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {Object.entries(grouped).map(([subject, videos], si) => {
              const cfg = getSubjectCfg(subject);
              const watchedCount = videos.filter((v) =>
                isVideoWatched(user.email, v.courseId, v.id)
              ).length;
              const progress = videos.length > 0 ? Math.round((watchedCount / videos.length) * 100) : 0;

              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.06 }}
                >
                  {/* Subject heading with progress */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

                    {/* Progress indicator */}
                    {progress > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: B }}>{progress}%</span>
                        <div style={{ width: 80, height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${progress}%`, height: "100%", background: B, borderRadius: 99 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video cards grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {videos.map((video, vi) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        delay={si * 0.05 + vi * 0.04}
                        cfg={cfg}
                        studentEmail={user.email}
                        onPlay={() => setActiveVideo(video)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            studentEmail={user.email}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  delay,
  cfg,
  studentEmail,
  onPlay,
}: {
  video: EnrichedVideoEntry;
  delay: number;
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
      transition={{ delay }}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        position: "relative",
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
      {/* Watched badge */}
      {watched && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 10,
          background: "#22C55E", color: "#fff",
          borderRadius: 99, padding: "4px 10px",
          fontSize: 11, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Watched
        </div>
      )}

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
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(14,165,233,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>
            <IconPlay size={22} color="#fff" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div style={{
            position: "absolute", bottom: 8, right: 8,
            background: "rgba(0,0,0,0.7)", color: "#fff",
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
          }}>
            {video.duration}
          </div>
        )}

        {/* Language badge */}
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.6)", color: "#fff",
          fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>{flag}</span>
          <span>{langLabel}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: cfg.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>
            {cfg.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", lineHeight: 1.4, marginBottom: 3 }}>
              {video.title}
            </p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              {video.subject} · {video.gradeLevel}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#64748B", marginTop: 8, lineHeight: 1.5 }}>
          From: <span style={{ color: "#0EA5E9", fontWeight: 600 }}>{video.courseTitle}</span>
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          style={{
            marginTop: 14,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 0",
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
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <IconPlay size={14} color="#fff" />
          Watch Video
        </button>
      </div>
    </motion.div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({
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
  const isYT = isYouTubeUrl(video.url);

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
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isYT && <IconYouTube />}
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{video.title}</p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>
                {flag} {langLabel} · {video.subject} · {video.gradeLevel}
              </p>
            </div>
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
                cursor: "pointer", color: "#64748B",
              }}
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Video embed */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000", flexShrink: 0 }}>
          {ytId ? (
            <iframe
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              controls
              autoPlay
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              src={video.url}
              onEnded={handleComplete}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid #F1F5F9",
          background: "#F8FAFC",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "#64748B" }}>
            From course: <span style={{ color: "#0EA5E9", fontWeight: 600 }}>{video.courseTitle}</span>
          </p>
          {!watched && (
            <button
              onClick={handleComplete}
              style={{
                padding: "8px 18px",
                borderRadius: 9,
                border: "none",
                background: "#22C55E",
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
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
