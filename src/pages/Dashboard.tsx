import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getEnrolledCourses,
  getAllEnrollments,
  getSubjectConfig,
  getWatchedCount,
} from "../utils/videoData";
import { getTotalWatchedCount } from "../utils/videoProgress";
import { getAllDocuments } from "../db";
import type { StudentProgress } from "../utils/curriculum";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconBook = ({ size = 20, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconVideo = ({ size = 20, color = "#F59E0B" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconCheckCircle = ({ size = 20, color = "#22C55E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconTrendingUp = ({ size = 20, color = "#8B5CF6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconPlay = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconChevronRight = ({ size = 14, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconGrad = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconRefresh = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.7" />
  </svg>
);

// ─── Language selector ────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "english", name: "English", flag: "🇬🇧", desc: "International curriculum", available: true },
  { code: "hausa",   name: "Hausa",   flag: "🇳🇬", desc: "Northern Nigeria",        available: true },
  { code: "igbo",    name: "Igbo",    flag: "🇳🇬", desc: "Eastern Nigeria",         available: true },
  { code: "yoruba",  name: "Yoruba",  flag: "🇳🇬", desc: "South-West Nigeria",      available: true },
];

const B = "#0EA5E9";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [pickingLang, setPickingLang] = useState(true);

  // Live stats
  const [stats, setStats] = useState({
    enrolled: 0,
    videosWatched: 0,
    completed: 0,
    avgScore: 0,
  });

  const [enrolledCourses, setEnrolledCourses] = useState<ReturnType<typeof getEnrolledCourses>>([]);

  useEffect(() => {
    const saved = user?.preferredLanguage || localStorage.getItem("learningLanguage");
    if (saved) { setSelectedLang(saved); setPickingLang(false); }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const courses = getEnrolledCourses(user.email);
    setEnrolledCourses(courses);

    const watchedTotal = getTotalWatchedCount(user.email);

    // Completed = all videos watched in a course
    const completed = courses.filter((c) => {
      if (c.videos.length === 0) return false;
      return getWatchedCount(user.email, c.id) >= c.videos.length;
    }).length;

    // Avg quiz score from IndexedDB (async)
    let avgScore = 0;
    (async () => {
      try {
        const { getAllProgress } = await import("../db");
        const allProgress: (StudentProgress & { id: string })[] =
          await getAllProgress();
        const mine = allProgress.filter((p) => (p as any).studentId === user.email);
        if (mine.length > 0) {
          const sum = mine.reduce((a, p) => a + (p.bestScore ?? 0), 0);
          avgScore = Math.round(sum / mine.length);
        }
      } catch { avgScore = 0; }
      setStats({ enrolled: courses.length, videosWatched: watchedTotal, completed, avgScore });
    })();
  }, [user]);

  const chooseLang = (lang: typeof LANGUAGES[0]) => {
    if (!lang.available) return;
    setSelectedLang(lang.code);
    localStorage.setItem("learningLanguage", lang.code);
    updateUser({ preferredLanguage: lang.code });
    setPickingLang(false);
  };

  // ── Language picker ────────────────────────────────────────────────────────
  if (pickingLang) {
    return (
      <Layout>
        <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: 8 }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: B, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 99, background: "#E0F2FE", marginBottom: 14 }}>
              🌍 Language Setup
            </span>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 6 }}>
              How would you like to learn?
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              Choose your preferred language for course materials
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LANGUAGES.map((lang, i) => (
              <motion.button key={lang.code}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => chooseLang(lang)}
                disabled={!lang.available}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
                  borderRadius: 14, border: `1.5px solid #E2E8F0`,
                  background: "#fff", cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit", width: "100%", transition: "border-color 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = B); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = "#E2E8F0"); }}
              >
                <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{lang.name}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{lang.desc}</p>
                </div>
                <IconChevronRight size={14} color="#94A3B8" />
              </motion.button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  const currentLang = LANGUAGES.find(l => l.code === selectedLang);

  const statCards = [
    { label: "Enrolled Courses", value: stats.enrolled, icon: <IconBook />, iBg: "#DBEAFE" },
    { label: "Videos Watched",   value: stats.videosWatched, icon: <IconVideo />, iBg: "#FEF3C7" },
    { label: "Completed",        value: stats.completed, icon: <IconCheckCircle />, iBg: "#DCFCE7" },
    { label: "Avg. Score",       value: stats.avgScore > 0 ? `${stats.avgScore}%` : "—", icon: <IconTrendingUp />, iBg: "#EDE9FE" },
  ];

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 18, padding: "28px 30px", background: "#0F172A", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${B}40, transparent 70%)` }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                {currentLang?.flag} Learning in {currentLang?.name}
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                Welcome back, {user?.fname ?? "Learner"}! 👋
              </h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Keep the momentum going 🔥</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPickingLang(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.75)", fontFamily: "inherit", fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
                <IconRefresh size={12} /> Change Language
              </button>
              <button onClick={() => navigate("/courses")}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                <IconPlay size={12} /> Browse Courses
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #E2E8F0" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                {s.icon}
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>My Courses</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Pick up where you left off</p>
            </div>
            <button onClick={() => navigate("/courses")}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: B, fontFamily: "inherit", padding: 0 }}>
              View all <IconChevronRight size={14} color={B} />
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📚</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#334155", marginBottom: 6 }}>No courses yet</p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 18 }}>Browse and enrol in a course to get started</p>
              <button onClick={() => navigate("/courses")}
                style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Browse Courses
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {enrolledCourses.map((course, i) => {
                const cfg = getSubjectConfig(course.subject);
                const watched = getWatchedCount(user?.email ?? "", course.id);
                const total = course.videos.length;
                const pct = total > 0 ? Math.round((watched / total) * 100) : 0;

                return (
                  <motion.div key={course.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #E2E8F0", cursor: "pointer", transition: "border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = B)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                    onClick={() => navigate("/videos")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {cfg.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</p>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{course.subject} · {course.gradeLevel}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: B, flexShrink: 0 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                        style={{ height: "100%", background: B, borderRadius: 99 }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>{watched} / {total} videos watched</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teacher portal CTA — only if teacher */}
        {user?.role === "teacher" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={() => navigate("/teacher")}
            style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = B)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconGrad size={20} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Teacher Portal</p>
                <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Upload and manage curriculum documents</p>
              </div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Open Portal <IconChevronRight size={14} color={B} />
            </button>
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
