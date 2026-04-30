import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBook = ({ size = 20, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconClock = ({ size = 20, color = "#F59E0B" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCheckCircle = ({ size = 20, color = "#22C55E" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconTrendingUp = ({ size = 20, color = "#8B5CF6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const IconPlay = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconChevronRight = ({ size = 16, color = "#0EA5E9" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconGrad = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconRefresh = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.7"/>
  </svg>
);

// ─── Language selector full screen ───────────────────────────────────────────
const LANGUAGES = [
  { code: "english", name: "English", flag: "🇬🇧", desc: "International curriculum", available: true },
  { code: "hausa",   name: "Hausa",   flag: "🇳🇬", desc: "Northern Nigeria",        available: true },
  { code: "igbo",    name: "Igbo",    flag: "🇳🇬", desc: "Eastern Nigeria",         available: true },
  { code: "yoruba",  name: "Yoruba",  flag: "🇳🇬", desc: "South-West Nigeria",      available: true },
];

const COURSES = [
  { id: 1, title: "Basic Mathematics", progress: 65, emoji: "📐", subject: "Mathematics" },
  { id: 2, title: "English Language", progress: 40, emoji: "📖", subject: "Language" },
  { id: 3, title: "Agricultural Science", progress: 20, emoji: "🌾", subject: "Science" },
  { id: 4, title: "Digital Literacy", progress: 75, emoji: "💻", subject: "Technology" },
];

const B = "#0EA5E9";

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [pickingLang, setPickingLang] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("learningLanguage");
    if (saved) { setSelectedLang(saved); setPickingLang(false); }
  }, []);

  const chooseLang = (lang: typeof LANGUAGES[0]) => {
    if (!lang.available) return;
    setSelectedLang(lang.code);
    localStorage.setItem("learningLanguage", lang.code);
    setPickingLang(false);
  };

  // ── Language picker ────────────────────────────────────────────────────────
  if (pickingLang) {
    return (
      <Layout>
        <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 16 }}>
          <div style={{ marginBottom: 36 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: B, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 99, background: "#E0F2FE", marginBottom: 16 }}>
              🌍 Language Setup
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8 }}>
              How would you like to learn?
            </h1>
            <p style={{ fontSize: 15, color: "#64748B" }}>
              Choose your preferred language for accessing course materials
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LANGUAGES.map((lang, i) => (
              <motion.button key={lang.code}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => chooseLang(lang)}
                disabled={!lang.available}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
                  borderRadius: 14, border: `1.5px solid ${lang.available ? "#E2E8F0" : "#F1F5F9"}`,
                  background: lang.available ? "#fff" : "#FAFAFA",
                  cursor: lang.available ? "pointer" : "not-allowed",
                  opacity: lang.available ? 1 : 0.5,
                  textAlign: "left", fontFamily: "inherit", width: "100%",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => { if (lang.available) { (e.currentTarget.style.borderColor = B); (e.currentTarget.style.boxShadow = `0 0 0 4px ${B}18`); } }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = lang.available ? "#E2E8F0" : "#F1F5F9"); (e.currentTarget.style.boxShadow = "none"); }}
              >
                <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 16, color: lang.available ? "#0F172A" : "#94A3B8" }}>{lang.name}</p>
                  <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{lang.desc}</p>
                </div>
                {lang.available && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <IconChevronRight size={14} color="#94A3B8" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  const currentLang = LANGUAGES.find(l => l.code === selectedLang);

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 18, padding: "28px 32px", background: "#0F172A", position: "relative", overflow: "hidden" }}>
          {/* Subtle grid */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px" }} />
          {/* Glow */}
          <div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${B}40, transparent 70%)` }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: B, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                {currentLang?.flag} Learning in {currentLang?.name}
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                Welcome back, {user?.fname ?? "Learner"}! 👋
              </h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>You're on a streak — keep it going 🔥</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPickingLang(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.75)", fontFamily: "inherit", fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
                <IconRefresh size={13} /> Change Language
              </button>
              <button onClick={() => navigate("/courses")}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                <IconPlay size={13} /> Continue Learning
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Enrolled", value: "4", icon: <IconBook />, bg: "#EFF6FF", iBg: "#DBEAFE" },
            { label: "Hours Learned", value: "24", icon: <IconClock />, bg: "#FFFBEB", iBg: "#FEF3C7" },
            { label: "Completed", value: "1", icon: <IconCheckCircle />, bg: "#F0FDF4", iBg: "#DCFCE7" },
            { label: "Avg. Score", value: "85%", icon: <IconTrendingUp />, bg: "#F5F3FF", iBg: "#EDE9FE" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #E2E8F0" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                {s.icon}
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Courses */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>My Courses</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}>Pick up where you left off</p>
            </div>
            <button onClick={() => navigate("/courses")}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: B, fontFamily: "inherit", padding: 0 }}>
              View all <IconChevronRight size={14} color={B} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {COURSES.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #E2E8F0", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                onClick={() => navigate("/courses")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "#F8FAFC", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {course.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: B, flexShrink: 0 }}>{course.progress}%</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{course.subject}</p>
                    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                        style={{ height: "100%", background: B, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teacher portal CTA */}
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
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Upload and manage curriculum documents</p>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: `1.5px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Open Portal <IconChevronRight size={14} color={B} />
          </button>
        </motion.div>

      </div>
    </Layout>
  );
}