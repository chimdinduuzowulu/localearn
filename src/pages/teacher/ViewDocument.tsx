import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDocument } from "../../db";
import {
  CurriculumDocument,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
} from "../../utils/curriculum";

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

const IconBookOpen = ({ size = 16, color = "#0EA5E9" }) => (
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
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconTranslate = ({ size = 16, color = "#0EA5E9" }) => (
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
    <path d="M5 8l6 6" />
    <path d="M4 14l6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="M22 22l-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const IconQuiz = ({ size = 16, color = "#0EA5E9" }) => (
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
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconChevronDown = ({ size = 18 }) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconChevronUp = ({ size = 18 }) => (
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
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const IconCheckCircle = ({ size = 14, color = "#22C55E" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// const IconXCircle = ({ size = 14, color = "#EF4444" }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={color}
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="10" />
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// const IconArrowLeft = () => (
//   <svg
//     width="15"
//     height="15"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="15 18 9 12 15 6" />
//   </svg>
// );


const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function ViewDocument() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<CurriculumDocument | null>(null);
  const [lang, setLang] = useState<SupportedLanguage>("hausa");
  const [tab, setTab] = useState<"guide" | "translation" | "quiz">("guide");
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(
    new Set(),
  );

  const brandBlue = "#0EA5E9";

  useEffect(() => {
    if (!documentId) return;
    getDocument(documentId).then((d) => {
      setDoc(d ?? null);
      setLoading(false);
    });
  }, [documentId]);

  const toggleAnswer = (i: number) => {
    setRevealedAnswers((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              margin: "0 auto 16px",
              border: `3px solid ${brandBlue}`,
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontSize: 13, color: "#94A3B8" }}>Loading document…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!doc) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 400,
            background: "#fff",
            borderRadius: 20,
            padding: "48px 32px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: 8,
            }}
          >
            Document Not Found
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>
            This document doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate("/teacher")}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: brandBlue,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  const availableLangs = Object.keys(doc.translations) as SupportedLanguage[];
  const translation = doc.translations[lang];
  const quiz = translation?.quizzes?.[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
    
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
          >
            <IconHome /> Dashboard
          </button>
          <IconChevronRight />
          <button
            onClick={() => navigate("/teacher")}
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
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Teacher Portal
          </button>
          <IconChevronRight />
          <span
            style={{
              color: "#0F172A",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.title}
          </span>
        </nav>

        
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 99,
              background: "#F1F5F9",
              color: "#475569",
            }}
          >
            {doc.subject}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 99,
              background: "#F1F5F9",
              color: "#475569",
            }}
          >
            {doc.gradeLevel}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 99,
              background: "#DCFCE7",
              color: "#15803D",
            }}
          >
            Ready
          </span>
        </div>
      </div>

      
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.01em",
              marginBottom: 6,
            }}
          >
            {doc.title}
          </h1>
          <p style={{ fontSize: 13, color: "#94A3B8" }}>
            Available in {availableLangs.length} language
            {availableLangs.length !== 1 ? "s" : ""} ·{" "}
            {formatFileSize(doc.fileSize)}
          </p>
        </div>


        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginRight: 4,
            }}
          >
            Language:
          </span>
          {availableLangs.map((l) => {
            const info = SUPPORTED_LANGUAGES.find((x) => x.code === l);
            const active = lang === l;
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: 99,
                  border: active ? "none" : "1px solid #E2E8F0",
                  background: active ? brandBlue : "#fff",
                  color: active ? "#fff" : "#475569",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "#fff";
                }}
              >
                <span style={{ fontSize: 15 }}>{info?.flag}</span>
                <span>{info?.label}</span>
              </button>
            );
          })}
        </div>

        
        <div
          style={{
            display: "flex",
            gap: 6,
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: 0,
          }}
        >
          {[
            { id: "guide" as const, label: "Study Guide", icon: IconBookOpen },
            {
              id: "translation" as const,
              label: "Full Text",
              icon: IconTranslate,
            },
            {
              id: "quiz" as const,
              label: `Quiz${quiz?.questions?.length ? ` (${quiz.questions.length})` : ""}`,
              icon: IconQuiz,
            },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  marginBottom: -1,
                  borderBottom: active
                    ? `2px solid ${brandBlue}`
                    : "2px solid transparent",
                  background: "none",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  color: active ? brandBlue : "#64748B",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                <t.icon size={16} color={active ? brandBlue : "#94A3B8"} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${lang}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "guide" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {!translation?.keyPoints?.length && !translation?.summary ? (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "64px 32px",
                      textAlign: "center",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <p style={{ fontSize: 14, color: "#94A3B8" }}>
                      No study guide available for this language.
                    </p>
                  </div>
                ) : (
                  <>
                    {translation?.summary && (
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 16,
                          padding: "24px 28px",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#64748B",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                          }}
                        >
                          Summary
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: "#334155",
                            lineHeight: 1.6,
                          }}
                        >
                          {translation.summary}
                        </p>
                      </div>
                    )}
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "24px 28px",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 16,
                        }}
                      >
                        Key Points
                      </p>
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {translation.keyPoints.map((point, i) => (
                          <li key={i} style={{ display: "flex", gap: 12 }}>
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 8,
                                background: "#E0F2FE",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: brandBlue,
                                }}
                              >
                                {i + 1}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: 14,
                                color: "#334155",
                                lineHeight: 1.5,
                                margin: 0,
                              }}
                            >
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "translation" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "28px 32px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Full Translation
                </p>
                {translation?.translatedText ? (
                  <div
                    style={{
                      fontSize: 14,
                      color: "#334155",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {translation.translatedText}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#94A3B8",
                      textAlign: "center",
                      padding: "40px 0",
                    }}
                  >
                    No translation available for this language.
                  </p>
                )}
              </div>
            )}

            {tab === "quiz" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {!quiz?.questions?.length ? (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "64px 32px",
                      textAlign: "center",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <p style={{ fontSize: 14, color: "#94A3B8" }}>
                      No quiz available for this language.
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#64748B",
                        }}
                      >
                        {quiz.questions.length} question
                        {quiz.questions.length !== 1 ? "s" : ""}
                      </p>
                      <button
                        onClick={() => setRevealedAnswers(new Set())}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#94A3B8",
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: 8,
                        }}
                      >
                        Hide all answers
                      </button>
                    </div>
                    {quiz.questions.map((q: any, i: number) => {
                      const isExpanded = expandedQ === i;
                      return (
                        <motion.div
                          key={i}
                          style={{
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #E2E8F0",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => setExpandedQ(isExpanded ? null : i)}
                            style={{
                              width: "100%",
                              padding: "20px 24px",
                              display: "flex",
                              alignItems: "center",
                              gap: 14,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "inherit",
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 10,
                                background: "#E0F2FE",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: brandBlue,
                                }}
                              >
                                {i + 1}
                              </span>
                            </div>
                            <p
                              style={{
                                flex: 1,
                                fontWeight: 600,
                                fontSize: 14,
                                color: "#0F172A",
                                margin: 0,
                              }}
                            >
                              {q.question}
                            </p>
                            {isExpanded ? (
                              <IconChevronUp size={18} />
                            ) : (
                              <IconChevronDown size={18} />
                            )}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                style={{
                                  overflow: "hidden",
                                  borderTop: "1px solid #F1F5F9",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "20px 24px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                  }}
                                >
                                  {q.options?.map((opt: string, oi: number) => {
                                    const isCorrect = opt === q.correctAnswer;
                                    const revealed = revealedAnswers.has(i);
                                    return (
                                      <div
                                        key={oi}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 12,
                                          padding: "12px 16px",
                                          borderRadius: 12,
                                          background:
                                            revealed && isCorrect
                                              ? "#F0FDF4"
                                              : "#FAFAFA",
                                          border:
                                            revealed && isCorrect
                                              ? "1px solid #BBF7D0"
                                              : "1px solid #F1F5F9",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 20,
                                            border: `2px solid ${revealed && isCorrect ? "#22C55E" : "#CBD5E1"}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background:
                                              revealed && isCorrect
                                                ? "#22C55E"
                                                : "transparent",
                                          }}
                                        >
                                          {revealed && isCorrect && (
                                            <IconCheckCircle
                                              size={12}
                                              color="#fff"
                                            />
                                          )}
                                        </div>
                                        <span
                                          style={{
                                            fontSize: 14,
                                            color:
                                              revealed && isCorrect
                                                ? "#15803D"
                                                : "#475569",
                                          }}
                                        >
                                          {opt}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  <button
                                    onClick={() => toggleAnswer(i)}
                                    style={{
                                      marginTop: 8,
                                      alignSelf: "flex-start",
                                      padding: "8px 20px",
                                      borderRadius: 40,
                                      border: "none",
                                      background: revealedAnswers.has(i)
                                        ? "#FEE2E2"
                                        : "#E0F2FE",
                                      color: revealedAnswers.has(i)
                                        ? "#DC2626"
                                        : brandBlue,
                                      fontWeight: 600,
                                      fontSize: 12,
                                      cursor: "pointer",
                                      fontFamily: "inherit",
                                    }}
                                  >
                                    {revealedAnswers.has(i)
                                      ? "Hide answer"
                                      : "Reveal answer"}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
