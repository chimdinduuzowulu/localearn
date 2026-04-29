import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { getAllDocuments } from "../../db";
import {
  SUPPORTED_LANGUAGES,
  CurriculumDocument,
} from "../../utils/curriculum";

const IconSearch = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconX = ({ size = 14 }: { size?: number }) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconBookOpen = ({ color = "#fff" }: { color?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconPlay = ({ color = "#0EA5E9" }: { color?: string }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// const IconChevronRight = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="9 18 15 12 9 6" />
//   </svg>
// );

const IconPackage = ({ color = "#94A3B8" }: { color?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SUBJECT_CONFIG: Record<
  string,
  { emoji: string; bg: string; iconColor: string }
> = {
  Mathematics: { emoji: "📐", bg: "#EFF6FF", iconColor: "#3B82F6" },
  "English Language": { emoji: "📖", bg: "#F0FDF4", iconColor: "#22C55E" },
  "Basic Science": { emoji: "🔬", bg: "#FEF3C7", iconColor: "#F59E0B" },
  "Social Studies": { emoji: "🌍", bg: "#EEF2FF", iconColor: "#6366F1" },
  "Agricultural Science": { emoji: "🌾", bg: "#F0FDF4", iconColor: "#16A34A" },
  History: { emoji: "📜", bg: "#FFF7ED", iconColor: "#EA580C" },
  Geography: { emoji: "🗺️", bg: "#F0F9FF", iconColor: "#0284C7" },
  "Computer Studies": { emoji: "💻", bg: "#F8FAFC", iconColor: "#475569" },
  "Civic Education": { emoji: "🏛️", bg: "#FDF4FF", iconColor: "#A855F7" },
  "Business Studies": { emoji: "💼", bg: "#FFF1F2", iconColor: "#E11D48" },
  "Health Education": { emoji: "🏥", bg: "#ECFDF5", iconColor: "#059669" },
  "Home Economics": { emoji: "🏠", bg: "#FFFBEB", iconColor: "#D97706" },
};

export default function StudentLibrary() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<CurriculumDocument[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("hausa");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDocuments()
      .then((docs) => setDocuments(docs.filter((d) => d.status === "ready")))
      .finally(() => setLoading(false));
  }, []);

  const availableLangs = SUPPORTED_LANGUAGES.filter(
    (l) => l.code !== "english",
  );

  const filtered = documents.filter((doc) => {
    const hasLang =
      !!doc.translations[selectedLang as keyof typeof doc.translations];
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
    {} as Record<string, CurriculumDocument[]>,
  );

  const B = "#0EA5E9";

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 320,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `3px solid ${B}`,
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ fontSize: 14, color: "#94A3B8" }}>
              Loading your courses…
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            My Courses
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
            Learn every subject in the language you think in
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {availableLangs.map((lang) => {
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

        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <IconPackage color="#CBD5E1" />
            </div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              {searchQuery ? "No results found" : "No courses available yet"}
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              {searchQuery
                ? `Try searching for something else`
                : "Check back soon — your teacher will upload content"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row", gap: 36 }}>
            {Object.entries(grouped).map(([subject, docs], si) => {
              const cfg = SUBJECT_CONFIG[subject] ?? {
                emoji: "📄",
                bg: "#F8FAFC",
                iconColor: "#94A3B8",
              };
              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.06 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
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
                        {docs.length} {docs.length === 1 ? "doc" : "docs"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: 16,
                    }}
                  >
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
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = B)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#E2E8F0")
                        }
                        onClick={() => navigate(`/study/${doc.id}`)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: cfg.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                              border: "1px solid rgba(0,0,0,0.05)",
                              flexShrink: 0,
                            }}
                          >
                            {cfg.emoji}
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              padding: "3px 10px",
                              borderRadius: 99,
                              background: "#DCFCE7",
                              color: "#15803D",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            Ready
                          </span>
                        </div>

                        <div>
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#0F172A",
                              lineHeight: 1.4,
                            }}
                          >
                            {doc.title}
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#94A3B8",
                              marginTop: 3,
                            }}
                          >
                            {doc.gradeLevel}
                          </p>
                        </div>

                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {Object.keys(doc.translations).map((lang) => {
                            const l = SUPPORTED_LANGUAGES.find(
                              (x) => x.code === lang,
                            );
                            const isCurrent = lang === selectedLang;
                            return (
                              <span
                                key={lang}
                                style={{
                                  fontSize: 11,
                                  padding: "3px 10px",
                                  borderRadius: 99,
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
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

                        <div
                          style={{ display: "flex", gap: 8 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/study/${doc.id}`)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 7,
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
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = "0.85")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = "1")
                            }
                          >
                            <IconBookOpen color="#fff" />
                            Study
                          </button>
                          <button
                            onClick={() => navigate(`/quiz/${doc.id}`)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 7,
                              padding: "10px 0",
                              borderRadius: 9,
                              border: "1.5px solid #E2E8F0",
                              background: "#fff",
                              color: "#475569",
                              fontFamily: "inherit",
                              fontWeight: 600,
                              fontSize: 13,
                              cursor: "pointer",
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
      </div>
    </Layout>
  );
}
