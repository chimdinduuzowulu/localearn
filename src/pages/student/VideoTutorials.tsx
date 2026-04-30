import { useState } from "react";
import Layout from "../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { getAllVideoModules, getVideosByLanguage, VideoModule } from "../../utils/videoData";
import { getCourseProgress, markVideoWatched, isVideoWatched } from "../../utils/videoProgress";
import VideoPlayer from "../../components/VideoPlayer";

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

const SUBJECT_CONFIG: Record<string, { emoji: string; bg: string; color: string }> = {
  Mathematics:          { emoji: "📐", bg: "#EFF6FF", color: "#3B82F6" },
  "English Language":   { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  "Basic Science":      { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  "Social Studies":     { emoji: "🌍", bg: "#EEF2FF", color: "#6366F1" },
  "Agricultural Science":{ emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  History:              { emoji: "📜", bg: "#FFF7ED", color: "#EA580C" },
  Geography:            { emoji: "🗺️", bg: "#F0F9FF", color: "#0284C7" },
  "Computer Studies":   { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  "Civic Education":    { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  "Business Studies":   { emoji: "💼", bg: "#FFF1F2", color: "#E11D48" },
  "Health Education":   { emoji: "🏥", bg: "#ECFDF5", color: "#059669" },
  "General":            { emoji: "🎓", bg: "#F0F9FF", color: "#0EA5E9" },
};

const LANG_TABS = [
  { code: "all",     label: "All",    flag: "🌍" },
  { code: "english", label: "English", flag: "🇬🇧" },
  { code: "hausa",   label: "Hausa",  flag: "🇳🇬" },
  { code: "igbo",    label: "Igbo",   flag: "🇳🇬" },
  { code: "yoruba",  label: "Yoruba", flag: "🇳🇬" },
];

const B = "#0EA5E9";

function getFilteredVideos(language: string, subject: string = "all"): VideoModule[] {
  if (language === "all") {
    const allVideos = getAllVideoModules();
    return subject === "all" ? allVideos : allVideos.filter(v => v.subject === subject);
  }
  
  const videos = getVideosByLanguage(language);
  return subject === "all" ? videos : videos.filter(v => v.subject === subject);
}

export default function VideoTutorials() {
  const [selectedLang, setSelectedLang] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<VideoModule | null>(null);

  const videos = getFilteredVideos(selectedLang, selectedSubject);
  const subjects = ["all", ...Array.from(new Set(videos.map(v => v.subject)))];

  const filtered = videos.filter((v) => {
    const matchSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const grouped = filtered.reduce(
    (acc, v) => {
      if (!acc[v.subject]) acc[v.subject] = [];
      acc[v.subject].push(v);
      return acc;
    },
    {} as Record<string, VideoModule[]>,
  );

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Header */}
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
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
                onClick={() => setSelectedLang(lang.code)}
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
              const cfg = s !== "all" ? SUBJECT_CONFIG[s] ?? SUBJECT_CONFIG["General"] : null;
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

        {/* Video grid */}
        {Object.keys(grouped).length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              padding: "72px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              {searchQuery ? "No videos found" : "No videos available yet"}
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              {searchQuery
                ? "Try a different search or filter"
                : "Check back soon for video tutorials!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {Object.entries(grouped).map(([subject, videos], si) => {
              const cfg = SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG["General"];
              const subjectProgress = getCourseProgress(videos);
              
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
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: cfg.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {cfg.emoji}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h2
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#0F172A",
                          }}
                        >
                          {subject}
                        </h2>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "2px 9px",
                            borderRadius: 99,
                            background: "#F1F5F9",
                            color: "#64748B",
                            fontWeight: 600,
                          }}
                        >
                          {videos.length} {videos.length === 1 ? "video" : "videos"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Subject progress */}
                    {subjectProgress > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: B }}>
                          {subjectProgress}%
                        </span>
                        <div style={{ width: 80, height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${subjectProgress}%`, height: "100%", background: B, borderRadius: 99 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {videos.map((video, vi) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        delay={si * 0.05 + vi * 0.04}
                        cfg={cfg}
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
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </Layout>
  );
}

// ─── Video Card Component ──────────────────────────────────────────────────────────────
function VideoCard({
  video,
  delay,
  cfg,
  onPlay,
}: {
  video: VideoModule;
  delay: number;
  cfg: { emoji: string; bg: string; color: string };
  onPlay: () => void;
}) {
  const B = "#0EA5E9";
  const watched = isVideoWatched(video.id);
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={() => setShowPlayer(false)}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            width: "100%",
            maxWidth: 900,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{video.title}</p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>
                {video.languageFlag} {video.language} · {video.subject} · Module {video.moduleIndex} of {video.totalModules}
              </p>
            </div>
            <button
              onClick={() => setShowPlayer(false)}
              style={{
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconClose />
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <VideoPlayer
              youtubeUrl={video.youtubeUrl}
              fallbackUrl={video.offlineUrl}
              title={video.title}
              onComplete={() => {
                markVideoWatched(video.id, 0);
                setShowPlayer(false);
                onPlay();
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

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
      onClick={() => setShowPlayer(true)}
    >
      {/* Watched badge */}
      {watched && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            background: "#22C55E",
            color: "#fff",
            borderRadius: 99,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Watched
        </div>
      )}

      {/* Module indicator */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          borderRadius: 6,
          padding: "3px 8px",
          fontSize: 10,
          fontWeight: 600,
        }}
      >
        Module {video.moduleIndex} of {video.totalModules}
      </div>

      {/* Thumbnail area */}
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#0F172A", overflow: "hidden" }}>
        {video.youtubeUrl ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeUrl.split("v=")[1]?.split("&")[0] || video.youtubeUrl.split("/").pop()}/mqdefault.jpg`}
            alt={video.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: cfg.bg,
            }}
          >
            <span style={{ fontSize: 48 }}>{cfg.emoji}</span>
          </div>
        )}

        {/* Play button overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(14,165,233,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              transition: "transform 0.15s",
            }}
          >
            <IconPlay size={22} color="#fff" />
          </div>
        </div>

        {/* Duration badge */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          {video.duration}
        </div>

        {/* Language badge */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>{video.languageFlag}</span>
          <span>{video.language}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: cfg.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {cfg.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "#0F172A",
                lineHeight: 1.4,
                marginBottom: 3,
              }}
            >
              {video.title}
            </p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              {video.subject} · {video.gradeLevel}
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#64748B",
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          {video.description.length > 90 ? video.description.slice(0, 90) + "…" : video.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPlayer(true);
          }}
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

function VideoModal({ video, onClose }: { video: VideoModule; onClose: () => void }) {
  const [isWatched, setIsWatched] = useState(isVideoWatched(video.id));

  const handleComplete = () => {
    markVideoWatched(video.id, 0);
    setIsWatched(true);
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
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F1F5F9",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconYouTube />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{video.title}</p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>
                {video.languageFlag} {video.language} · {video.subject} · {video.gradeLevel}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {isWatched && (
              <div
                style={{
                  background: "#DCFCE7",
                  color: "#15803D",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748B",
              }}
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <VideoPlayer
            youtubeUrl={video.youtubeUrl}
            fallbackUrl={video.offlineUrl}
            title={video.title}
            onComplete={handleComplete}
          />
        </div>

        {/* Description */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #F1F5F9",
            background: "#F8FAFC",
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{video.description}</p>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 99,
                background: "#E2E8F0",
                color: "#475569",
              }}
            >
              Module {video.moduleIndex} of {video.totalModules}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}