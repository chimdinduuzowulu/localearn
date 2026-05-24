import { useState, useEffect, useCallback } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAllCourses,
  enrollStudent,
  isEnrolled,
  getAllEnrollments,
  getSubjectConfig,
  getWatchedCount,
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  type Course,
} from "../utils/videoData";
import { toast } from "react-toastify";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const B = "#0EA5E9";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterLang, setFilterLang] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    const all = getAllCourses();
    setCourses(all);
    if (user) {
      const enrolled: string[] = getAllEnrollments()
        .filter((e: { studentEmail: string }) => e.studentEmail === user.email)
        .map((e: { courseId: string }) => e.courseId);
      setEnrolledIds(new Set(enrolled));
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Dynamic filter options
  const subjects = ["all", ...Array.from(new Set(courses.map(c => c.subject))).sort()];
  const grades = ["all", ...Array.from(new Set(courses.map(c => c.gradeLevel))).sort()];
  const languages = ["all", "english", "hausa", "igbo", "yoruba"];

  const filtered = courses.filter(c => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === "all" || c.subject === filterSubject;
    const matchLang = filterLang === "all" || c.language === filterLang;
    const matchGrade = filterGrade === "all" || c.gradeLevel === filterGrade;
    return matchSearch && matchSubject && matchLang && matchGrade;
  });

  const handleEnrol = (courseId: string) => {
    if (!user) { navigate("/login"); return; }
    enrollStudent(user.email, courseId);
    setEnrolledIds(prev => new Set(prev).add(courseId));
    toast.success("Enrolled successfully! 🎉");
  };

  const sel = (val: string, onChange: (v: string) => void) => ({
    value: val,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
    style: {
      padding: "9px 12px",
      borderRadius: 10,
      border: "1px solid #E2E8F0",
      fontFamily: "inherit",
      fontSize: 13,
      color: "#475569",
      background: "#fff",
      outline: "none",
      cursor: "pointer",
    },
  });

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Browse Courses</h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            {courses.length} course{courses.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <IconSearch />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              style={{ width: "100%", padding: "9px 12px 9px 40px", borderRadius: 10, border: "1px solid #E2E8F0", fontFamily: "inherit", fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B" }}>
            <IconFilter />
          </div>
          <select {...sel(filterSubject, setFilterSubject)}>
            {subjects.map(s => <option key={s} value={s}>{s === "all" ? "All Subjects" : s}</option>)}
          </select>
          <select {...sel(filterLang, setFilterLang)}>
            {languages.map(l => <option key={l} value={l}>{l === "all" ? "All Languages" : LANGUAGE_LABELS[l] ?? l}</option>)}
          </select>
          <select {...sel(filterGrade, setFilterGrade)}>
            {grades.map(g => <option key={g} value={g}>{g === "all" ? "All Grades" : g}</option>)}
          </select>
        </div>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📚</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#334155", marginBottom: 6 }}>
              {search || filterSubject !== "all" || filterLang !== "all" || filterGrade !== "all"
                ? "No courses match your filters"
                : "No courses available yet"}
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              {search ? "Try a different search term or remove filters" : "Check back soon — teachers are creating courses!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((course, i) => {
              const cfg = getSubjectConfig(course.subject);
              const enrolled = enrolledIds.has(course.id);
              const watched = user ? getWatchedCount(user.email, course.id) : 0;
              const total = course.videos.length;
              const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
              const flag = LANGUAGE_FLAGS[course.language] ?? "🌍";
              const langLabel = LANGUAGE_LABELS[course.language] ?? course.language;

              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", transition: "border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = B)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                >
                  {/* Card header */}
                  <div style={{ padding: "20px 20px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {cfg.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", lineHeight: 1.3, marginBottom: 4 }}>{course.title}</p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.color, fontWeight: 600 }}>
                            {course.subject}
                          </span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#F1F5F9", color: "#64748B", fontWeight: 600 }}>
                            {course.gradeLevel}
                          </span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#F1F5F9", color: "#64748B", fontWeight: 600 }}>
                            {flag} {langLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {course.description && (
                      <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 12 }}>
                        {course.description.length > 100 ? course.description.slice(0, 100) + "…" : course.description}
                      </p>
                    )}

                    <p style={{ fontSize: 11, color: "#94A3B8" }}>
                      {total} video{total !== 1 ? "s" : ""}
                    </p>

                    {enrolled && total > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: "#64748B" }}>{watched}/{total} watched</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: B }}>{pct}%</span>
                        </div>
                        <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: B, borderRadius: 99 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ padding: "0 20px 18px" }}>
                    {enrolled ? (
                      <button
                        onClick={() => navigate("/videos")}
                        style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: B, color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                      >
                        Continue Learning →
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrol(course.id)}
                        style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: `1.5px solid ${B}`, background: "transparent", color: B, fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                      >
                        Enrol in Course
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
