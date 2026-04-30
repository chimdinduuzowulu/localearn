import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDocument } from "../../db";
import {
  SupportedLanguage,
  CurriculumDocument,
  SUPPORTED_LANGUAGES,
} from "../../utils/curriculum";
import {
  getVideosBySubjectAndLanguage,
  VideoModule,
} from "../../utils/videoData";
import {
  getCourseProgress,
  isVideoWatched,
  markVideoWatched,
} from "../../utils/videoProgress";
import VideoPlayer from "../../components/VideoPlayer";

const IconArrowLeft = () => (
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
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

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

const IconChevronRight = ({
  size = 12,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
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

const IconDocumentText = ({ size = 16, color = "#0EA5E9" }) => (
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
  </svg>
);

const IconQuestionMarkCircle = ({ size = 16, color = "#0EA5E9" }) => (
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

const IconSparkle = ({ size = 16, color = "#0EA5E9" }) => (
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
  </svg>
);

const IconLightBulb = ({ size = 16, color = "#F59E0B" }) => (
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
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconPlay = ({ size = 16, color = "#fff" }) => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
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

const IconTranslate = ({ size = 14, color = "#64748B" }) => (
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

const IconVideo = ({ size = 16, color = "#0EA5E9" }) => (
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
    <rect x="2" y="7" width="15" height="10" rx="2" />
    <polygon fill={color} stroke={color} points="17 9 22 5 22 19 17 15 17 9" />
  </svg>
);

const IconClose = () => (
  <svg
    width="20"
    height="20"
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

const IconYouTube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

type TabId = "guide" | "full" | "quiz" | "videos";

const SUBJECT_CFG: Record<
  string,
  { emoji: string; bg: string; color: string }
> = {
  Mathematics: { emoji: "📐", bg: "#EFF6FF", color: "#3B82F6" },
  "English Language": { emoji: "📖", bg: "#F0FDF4", color: "#22C55E" },
  "Basic Science": { emoji: "🔬", bg: "#FEF3C7", color: "#F59E0B" },
  "Social Studies": { emoji: "🌍", bg: "#EEF2FF", color: "#6366F1" },
  "Agricultural Science": { emoji: "🌾", bg: "#F0FDF4", color: "#16A34A" },
  History: { emoji: "📜", bg: "#FFF7ED", color: "#EA580C" },
  Geography: { emoji: "🗺️", bg: "#F0F9FF", color: "#0284C7" },
  "Computer Studies": { emoji: "💻", bg: "#F8FAFC", color: "#475569" },
  "Civic Education": { emoji: "🏛️", bg: "#FDF4FF", color: "#A855F7" },
  "Business Studies": { emoji: "💼", bg: "#FFF1F2", color: "#E11D48" },
  "Health Education": { emoji: "🏥", bg: "#ECFDF5", color: "#059669" },
  General: { emoji: "🎓", bg: "#F0F9FF", color: "#0EA5E9" },
};

export default function StudyPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const langParam = (searchParams.get("lang") ?? "hausa") as SupportedLanguage;

  const [doc, setDoc] = useState<CurriculumDocument | null>(null);
  const [lang, setLang] = useState<SupportedLanguage>(langParam);
  const [activeTab, setActiveTab] = useState<TabId>("guide");
  const [loading, setLoading] = useState(true);
  const [expandedPoints, setExpandedPoints] = useState<number[]>([]);

  const brandBlue = "#0EA5E9";

  useEffect(() => {
    if (!documentId) return;
    getDocument(documentId).then((d) => {
      setDoc(d ?? null);
      setLoading(false);
    });
  }, [documentId]);

  const togglePoint = (index: number) => {
    setExpandedPoints((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
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
          <p style={{ fontSize: 13, color: "#94A3B8" }}>
            Loading study material…
          </p>
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
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
            The document you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/courses")}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: brandBlue,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconArrowLeft /> Back to Library
          </button>
        </div>
      </div>
    );
  }

  const translation = doc.translations[lang];
  const availableLangs = Object.keys(doc.translations) as SupportedLanguage[];
  const quiz = translation?.quizzes[0] ?? null;

  const tabs = [
    {
      id: "guide" as const,
      label: "Study Guide",
      icon: IconBookOpen,
      count: translation?.keyPoints?.length,
    },
    { id: "full" as const, label: "Full Text", icon: IconDocumentText },
    {
      id: "quiz" as const,
      label: "Quiz",
      icon: IconQuestionMarkCircle,
      count: quiz?.questions?.length,
    },
    {
      id: "videos" as const,
      label: "Videos",
      icon: IconVideo,
    },
  ];

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
            onClick={() => navigate("/courses")}
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Library
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 99,
              background: "#DCFCE7",
              color: "#15803D",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            Ready to Learn
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
            {doc.subject} · {doc.gradeLevel} · {formatFileSize(doc.fileSize)}
          </p>
        </div>

        {availableLangs.length > 1 && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748B",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Learning in
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {availableLangs.map((l) => {
                const langInfo = SUPPORTED_LANGUAGES.find((x) => x.code === l);
                const isActive = lang === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 18px",
                      borderRadius: 99,
                      border: isActive ? "none" : "1px solid #E2E8F0",
                      background: isActive ? brandBlue : "#fff",
                      color: isActive ? "#fff" : "#475569",
                      fontFamily: "inherit",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{langInfo?.flag}</span>
                    <span>{langInfo?.label}</span>
                    {isActive && <IconCheckCircle size={14} color="#fff" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!translation ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "64px 32px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <span style={{ fontSize: 32 }}>🌍</span>
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
                marginBottom: 8,
              }}
            >
              Translation Coming Soon
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#94A3B8",
                maxWidth: 400,
                margin: "0 auto 20px",
              }}
            >
              {SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label}{" "}
              translation is not available yet.
            </p>
            <button
              onClick={() => setLang(availableLangs[0])}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: brandBlue,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <IconTranslate /> Try Another Language
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: 6,
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: 0,
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 20px",
                      marginBottom: -1,
                      borderBottom: isActive
                        ? `2px solid ${brandBlue}`
                        : "2px solid transparent",
                      background: "none",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                      color: isActive ? brandBlue : "#64748B",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 14,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={16} color={isActive ? brandBlue : "#94A3B8"} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: isActive ? "#E0F2FE" : "#F1F5F9",
                          color: isActive ? brandBlue : "#64748B",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "guide" && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "24px 28px",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: "#E0F2FE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconSparkle size={16} color={brandBlue} />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: brandBlue,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        AI Generated Summary
                      </span>
                    </div>
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

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: "#FEF3C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconLightBulb size={16} color="#F59E0B" />
                      </div>
                      <h2
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        Key Learning Points
                      </h2>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {translation.keyPoints.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #E2E8F0",
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                          onClick={() => togglePoint(i)}
                        >
                          <div
                            style={{
                              padding: "18px 22px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 14,
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
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontSize: 14,
                                  color: "#334155",
                                  fontWeight: 500,
                                  margin: 0,
                                }}
                              >
                                {expandedPoints.includes(i)
                                  ? point
                                  : point.length > 120
                                    ? point.substring(0, 120) + "..."
                                    : point}
                              </p>
                            </div>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              style={{
                                transform: expandedPoints.includes(i)
                                  ? "rotate(90deg)"
                                  : "none",
                                transition: "transform 0.2s",
                                flexShrink: 0,
                                color: "#94A3B8",
                              }}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                          {expandedPoints.includes(i) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{
                                borderTop: "1px solid #F1F5F9",
                                padding: "16px 22px 20px 64px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 14,
                                  color: "#64748B",
                                  lineHeight: 1.6,
                                  margin: 0,
                                }}
                              >
                                {point}
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {quiz && (
                    <button
                      onClick={() => setActiveTab("quiz")}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        borderRadius: 16,
                        border: "none",
                        background: "#F0FDF4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#DCFCE7")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#F0FDF4")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "#22C55E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconPlay size={20} color="#fff" />
                        </div>
                        <div style={{ textAlign: "left" }}>
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#0F172A",
                              marginBottom: 2,
                            }}
                          >
                            Ready to Test Your Knowledge?
                          </p>
                          <p style={{ fontSize: 13, color: "#64748B" }}>
                            Take the adaptive quiz with {quiz.questions.length}{" "}
                            questions
                          </p>
                        </div>
                      </div>
                      <IconChevronRight
                        size={16}
                        style={{ color: "#94A3B8" }}
                      />
                    </button>
                  )}
                </motion.div>
              )}

              {activeTab === "full" && (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 24px",
                      borderBottom: "1px solid #F1F5F9",
                      background: "#F8FAFC",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <IconDocumentText size={16} color={brandBlue} />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#0F172A",
                        }}
                      >
                        Full Text in{" "}
                        {
                          SUPPORTED_LANGUAGES.find((l) => l.code === lang)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "28px 32px",
                      maxHeight: 600,
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        color: "#334155",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {translation.translatedText
                        .split("\n\n")
                        .map((paragraph, i) => (
                          <p key={i} style={{ marginBottom: 16 }}>
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ textAlign: "center", padding: "48px 24px" }}
                >
                  {quiz ? (
                    <div style={{ maxWidth: 400, margin: "0 auto" }}>
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 18,
                          background: "#E0F2FE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                        }}
                      >
                        <IconQuestionMarkCircle size={32} color={brandBlue} />
                      </div>
                      <h2
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#0F172A",
                          marginBottom: 8,
                        }}
                      >
                        Adaptive Quiz Ready
                      </h2>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#64748B",
                          marginBottom: 6,
                        }}
                      >
                        Test your understanding with {quiz.questions.length}{" "}
                        adaptive questions
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#94A3B8",
                          marginBottom: 24,
                        }}
                      >
                        Questions adjust to your skill level · Instant feedback
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => setActiveTab("guide")}
                          style={{
                            padding: "10px 20px",
                            borderRadius: 10,
                            border: "1px solid #E2E8F0",
                            background: "#fff",
                            color: "#64748B",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          Review First
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/quiz/${doc.id}?lang=${lang}`)
                          }
                          style={{
                            padding: "10px 24px",
                            borderRadius: 10,
                            border: "none",
                            background: brandBlue,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          Start Quiz <IconChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 18,
                          background: "#F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <span style={{ fontSize: 32 }}>📝</span>
                      </div>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0F172A",
                          marginBottom: 6,
                        }}
                      >
                        No Quiz Available
                      </h3>
                      <p style={{ fontSize: 13, color: "#94A3B8" }}>
                        This document doesn't have a quiz yet. Check back later!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "videos" && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <CourseVideosTab docSubject={doc.subject} docLang={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

function CourseVideosTab({
  docSubject,
  docLang,
}: {
  docSubject: string;
  docLang: string;
}) {
  const [activeVideo, setActiveVideo] = useState<VideoModule | null>(null);
  const brandBlue = "#0EA5E9";


  const videos = getVideosBySubjectAndLanguage(docSubject, docLang);

  
  const grouped = videos.reduce(
    (acc, v) => {
      const moduleKey = `Module ${v.moduleIndex}`;
      if (!acc[moduleKey]) acc[moduleKey] = [];
      acc[moduleKey].push(v);
      return acc;
    },
    {} as Record<string, VideoModule[]>,
  );

  const totalProgress = getCourseProgress(videos);
  const watchedCount = videos.filter((v) => isVideoWatched(v.id)).length;

  if (videos.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: "64px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: 6,
          }}
        >
          No Videos in{" "}
          {SUPPORTED_LANGUAGES.find((l) => l.code === docLang)?.label}
        </h3>
        <p style={{ fontSize: 13, color: "#94A3B8" }}>
          Video tutorials for {docSubject} in your selected language will appear
          here soon.
        </p>
        <button
          onClick={() => {
            
            const hasEnglish = videos.length === 0;
            if (hasEnglish) {
              
            }
          }}
          style={{
            marginTop: 20,
            padding: "8px 16px",
            borderRadius: 8,
            border: `1px solid ${brandBlue}`,
            background: "transparent",
            color: brandBlue,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Check English Videos Instead
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Overall progress bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
            Course Video Progress
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: brandBlue }}>
            {totalProgress}%
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: "#F1F5F9",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${totalProgress}%`,
              height: "100%",
              background: brandBlue,
              borderRadius: 99,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>
          {watchedCount} of {videos.length} videos watched
        </p>
      </div>

      {/* Videos by module */}
      {Object.entries(grouped).map(([moduleName, moduleVideos]) => {
        const moduleProgress = getCourseProgress(moduleVideos);
        return (
          <div key={moduleName}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {moduleName}
              </h3>
              {moduleProgress > 0 && moduleProgress < 100 && (
                <span
                  style={{ fontSize: 11, color: brandBlue, fontWeight: 600 }}
                >
                  {moduleProgress}% complete
                </span>
              )}
              {moduleProgress === 100 && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#22C55E",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <IconCheckCircle size={12} color="#22C55E" /> Complete
                </span>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {moduleVideos.map((video) => (
                <VideoCardComponent
                  key={video.id}
                  video={video}
                  cfg={SUBJECT_CFG[video.subject] || SUBJECT_CFG["General"]}
                  onPlay={() => setActiveVideo(video)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModalComponent
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Video Card Component for StudyPage ──────────────────────────────────────
function VideoCardComponent({
  video,
  cfg,
}: {
  video: VideoModule;
  cfg: { emoji: string; bg: string; color: string };
  onPlay: () => void;
}) {
  const B = "#0EA5E9";
  const watched = isVideoWatched(video.id);
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <VideoModalComponent video={video} onClose={() => setShowPlayer(false)} />
    );
  }

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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
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

      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          background: "#0F172A",
          overflow: "hidden",
        }}
      >
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

        {/* Play button */}
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
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(14,165,233,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <IconPlay size={20} color="#fff" />
          </div>
        </div>

        {/* Duration */}
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

        {/* Language */}
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
      <div style={{ padding: "14px 16px" }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: "#0F172A",
            lineHeight: 1.4,
            marginBottom: 4,
          }}
        >
          {video.title}
        </p>
        <p style={{ fontSize: 12, color: "#94A3B8" }}>{video.gradeLevel}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPlayer(true);
          }}
          style={{
            marginTop: 12,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "8px 0",
            borderRadius: 8,
            border: "none",
            background: B,
            color: "#fff",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <IconPlay size={12} color="#fff" />
          Watch Video
        </button>
      </div>
    </motion.div>
  );
}

// ─── Video Modal Component ───────────────────────────────────────────────────
function VideoModalComponent({
  video,
  onClose,
}: {
  video: VideoModule;
  onClose: () => void;
}) {
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
        {/* Header */}
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
              <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                {video.title}
              </p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>
                {video.languageFlag} {video.language} · {video.subject} · Module{" "}
                {video.moduleIndex} of {video.totalModules}
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
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
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
            {video.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
