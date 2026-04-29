import { useEffect, useState, type CSSProperties } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDocument } from "../../db";
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  CurriculumDocument,
  Quiz,
} from "../../utils/curriculum";
import { useQuizSession } from "../../utils/useQuizSession";

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconChevronRight = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconCheck = ({ size = 18, color = "#22C55E", style }: { size?: number; color?: string; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = ({ size = 18, color = "#EF4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconClock = ({ size = 16, color = "#64748B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconChartBar = ({ size = 16, color = "#64748B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconRefresh = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconFlag = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const IconSparkle = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.88 5.63L19 10l-5.12 1.37L12 17l-1.88-5.63L5 10l5.12-1.37L12 3z" />
  </svg>
);

const IconBookOpen = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function QuizPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lang = (searchParams.get("lang") ?? "hausa") as SupportedLanguage;
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

  const [doc, setDoc] = useState<CurriculumDocument | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    state,
    currentQuestion,
    // isCorrect,
    correctCount,
    // allQuestionsAnswered,
    startSession,
    submitAnswer,
    nextQuestion,
    finishSession,
    resetSession,
  } = useQuizSession(quiz, documentId ?? "", lang, "student-local");

  const brandBlue = "#0EA5E9";

  useEffect(() => {
    if (!documentId) {
      setError("No document ID provided");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const docData = await getDocument(documentId);
        if (docData) {
          setDoc(docData);
          const quizData = docData.translations[lang]?.quizzes[0] ?? null;
          setQuiz(quizData);
          if (!quizData) {
            setError("No quiz available for this document");
          }
        } else {
          setError("Document not found");
        }
      } catch (err) {
        setError("Failed to load quiz data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [documentId, lang]);

  useEffect(() => {
    if (quiz && state.status === "idle" && !error) {
      startSession();
    }
  }, [quiz, state.status, startSession, error]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "#DCFCE7", color: "#15803D" };
      case "medium": return { bg: "#FEF3C7", color: "#B45309" };
      case "hard": return { bg: "#FEE2E2", color: "#B91C1C" };
      default: return { bg: "#F1F5F9", color: "#475569" };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", margin: "0 auto 16px", border: `3px solid ${brandBlue}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 13, color: "#94A3B8" }}>Loading your quiz...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !quiz || !doc) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 400, background: "#fff", borderRadius: 20, padding: "48px 32px", border: "1px solid #E2E8F0" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: 32 }}>😕</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Quiz Not Available</h2>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>{error || "This quiz isn't available right now."}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate(`/study/${documentId}?lang=${lang}`)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: brandBlue, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconBookOpen size={14} /> Back to Study
            </button>
            <button onClick={() => navigate("/courses")} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconHome /> Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const progressPct = totalQuestions > 0 ? (state.currentIndex / totalQuestions) * 100 : 0;

  if (state.status === "complete") {
    const percentage = state.score;
    let emoji = "📚";
    let message = "Keep practicing! You'll get better.";
    let gradient = "from-gray-500 to-gray-600";
    console.log("Quiz complete! Score:", gradient);

    if (percentage >= 90) {
      emoji = "🏆";
      message = "Outstanding! You're a master of this topic!";
      gradient = "from-amber-500 to-orange-600";
    } else if (percentage >= 70) {
      emoji = "🎉";
      message = "Great job! You really know your stuff!";
      gradient = "from-green-500 to-emerald-600";
    } else if (percentage >= 50) {
      emoji = "👍";
      message = "Good effort! A bit more practice and you'll nail it!";
      gradient = "from-blue-500 to-brandBlue";
    } else {
      emoji = "💪";
      message = "Keep going! Review the material and try again.";
      gradient = "from-red-500 to-pink-600";
    }

    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", display: "flex", alignItems: "center", height: 60 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B" }}>
            <button onClick={() => navigate("/index")} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontFamily: "inherit", fontSize: 13, padding: 0 }}>
              <IconHome /> Dashboard
            </button>
            <IconChevronRight />
            <button onClick={() => navigate("/courses")} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontFamily: "inherit", fontSize: 13, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              Library
            </button>
            <IconChevronRight />
            <span style={{ color: "#0F172A", fontWeight: 600 }}>{doc.title}</span>
            <IconChevronRight />
            <span style={{ color: "#0F172A", fontWeight: 600 }}>Quiz Results</span>
          </nav>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ padding: "32px 40px", textAlign: "center", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{emoji}</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Quiz Complete!</h1>
              <p style={{ fontSize: 14, color: "#64748B" }}>{message}</p>
            </div>

            <div style={{ padding: "32px 40px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
                  <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="80" cy="80" r="70" stroke="#E2E8F0" strokeWidth="10" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke={brandBlue} strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: "#0F172A" }}>{percentage}%</span>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>Score</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ textAlign: "center", padding: "16px", background: "#F8FAFC", borderRadius: 14 }}>
                  <IconCheck size={22} color="#22C55E" style={{ margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>{correctCount}</p>
                  <p style={{ fontSize: 12, color: "#64748B" }}>Correct</p>
                </div>
                <div style={{ textAlign: "center", padding: "16px", background: "#F8FAFC", borderRadius: 14 }}>
                  <div style={{ margin: "0 auto 8px" }}>
                    <IconX size={22} color="#EF4444" />
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>{totalQuestions - correctCount}</p>
                  <p style={{ fontSize: 12, color: "#64748B" }}>Incorrect</p>
                </div>
                <div style={{ textAlign: "center", padding: "16px", background: "#F8FAFC", borderRadius: 14 }}>
                  <div style={{ margin: "0 auto 8px" }}>
                    <IconClock size={22} color={brandBlue} />
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A" }}>{formatTime(state.elapsedSeconds)}</p>
                  <p style={{ fontSize: 12, color: "#64748B" }}>Time Taken</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "32px 40px", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconChartBar size={16} color={brandBlue} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Question Review</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
                {quiz.questions.map((q, i) => {
                  const userAnswer = state.answers[i];
                  const isAnswerCorrect = userAnswer !== null && userAnswer === q.correctIndex;
                  return (
                    <div key={q.id} style={{ padding: "14px 18px", borderRadius: 12, background: isAnswerCorrect ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${isAnswerCorrect ? "#BBF7D0" : "#FECACA"}` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 12, background: isAnswerCorrect ? "#22C55E" : "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {isAnswerCorrect ? <IconCheck size={14} color="#fff" /> : <IconX size={14} color="#fff" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>{i + 1}. {q.question}</p>
                          {!isAnswerCorrect && (
                            <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Correct answer: {q.options[q.correctIndex]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: "24px 40px", background: "#F8FAFC", display: "flex", gap: 12 }}>
              <button onClick={() => { resetSession(); setTimeout(() => startSession(), 100); }} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <IconRefresh size={14} /> Retry Quiz
              </button>
              <button onClick={() => navigate(`/study/${documentId}?lang=${lang}`)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: brandBlue, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <IconBookOpen size={14} /> Back to Study
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "review") {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 450, background: "#fff", borderRadius: 20, padding: "48px 40px", border: "1px solid #E2E8F0" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <IconCheck size={36} color="#22C55E" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>You Did It! 🎉</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>You've answered all {totalQuestions} questions</p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 28 }}>Ready to see how you did?</p>
          <button onClick={() => finishSession()} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: brandBlue, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            See Your Results <IconChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", margin: "0 auto 16px", border: `3px solid ${brandBlue}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 13, color: "#94A3B8" }}>Loading question...</p>
        </div>
      </div>
    );
  }

  const selectedAnswer = state.answers[state.currentIndex];
  const isAnswered = selectedAnswer !== null && selectedAnswer !== undefined;
  const difficultyStyle = getDifficultyColor(currentQuestion.difficulty);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
          <button onClick={() => navigate(`/study/${documentId}?lang=${lang}`)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 13, padding: 8, borderRadius: 8 }}>
            <IconArrowLeft /> Exit Quiz
          </button>
          <div style={{ flex: 1, margin: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 6 }}>
              <span>Question {state.currentIndex + 1} of {totalQuestions}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconClock size={12} /> {formatTime(state.elapsedSeconds)}</span>
            </div>
            <div style={{ height: 6, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: brandBlue, borderRadius: 99, transition: "width 0.3s" }} />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, padding: "4px 12px", borderRadius: 99, background: "#F1F5F9", color: "#475569" }}>{langMeta?.flag} {langMeta?.label}</span>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px" }}>
        <motion.div key={state.currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: difficultyStyle.bg, color: difficultyStyle.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IconFlag size={10} /> {currentQuestion.difficulty.toUpperCase()}
            </span>
            {currentQuestion.topic && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: "#F1F5F9", color: "#475569", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconSparkle size={10} /> {currentQuestion.topic}
              </span>
            )}
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>{currentQuestion.question}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = state.showFeedback && i === currentQuestion.correctIndex;
              const isWrong = state.showFeedback && isSelected && i !== currentQuestion.correctIndex;

              let optionStyle: React.CSSProperties = { background: "#fff", borderColor: "#E2E8F0", cursor: "pointer" };
              if (isCorrect && state.showFeedback) optionStyle = { background: "#F0FDF4", borderColor: "#BBF7D0", cursor: "default" };
              else if (isWrong && state.showFeedback) optionStyle = { background: "#FEF2F2", borderColor: "#FECACA", cursor: "default" };
              else if (isSelected && !state.showFeedback) optionStyle = { background: "#EFF6FF", borderColor: brandBlue };
              else if (state.showFeedback) optionStyle = { background: "#FAFAFA", borderColor: "#E2E8F0", cursor: "default", opacity: 0.6 };
              else optionStyle = { background: "#fff", borderColor: "#E2E8F0", cursor: "pointer" };

              return (
                <button
                  key={i}
                  onClick={() => { if (!state.showFeedback && !isAnswered) submitAnswer(i); }}
                  disabled={state.showFeedback || isAnswered}
                  style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1.5px solid", textAlign: "left", transition: "all 0.15s", ...optionStyle }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 12, background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : isSelected ? brandBlue : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: (isCorrect || isWrong || isSelected) ? "#fff" : "#64748B" }}>{String.fromCharCode(65 + i)}</span>
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: "#334155", textDecoration: isWrong ? "line-through" : "none" }}>{option}</span>
                    {isCorrect && !isWrong && state.showFeedback && <IconCheck size={18} color="#22C55E" />}
                    {isWrong && state.showFeedback && (
                      <div style={{ textAlign: "right" }}>
                        <IconX size={18} color="#EF4444" />
                        <span style={{ fontSize: 11, color: "#22C55E", display: "block", marginTop: 2 }}>✓ {currentQuestion.options[currentQuestion.correctIndex]}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {state.showFeedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ borderRadius: 16, padding: "20px 24px", background: selectedAnswer === currentQuestion.correctIndex ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${selectedAnswer === currentQuestion.correctIndex ? "#BBF7D0" : "#FECACA"}` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: selectedAnswer === currentQuestion.correctIndex ? "#22C55E" : "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selectedAnswer === currentQuestion.correctIndex ? <IconCheck size={18} color="#fff" /> : <IconX size={18} color="#fff" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: selectedAnswer === currentQuestion.correctIndex ? "#15803D" : "#B91C1C", marginBottom: 6 }}>
                      {selectedAnswer === currentQuestion.correctIndex ? "Correct! 🎉" : "Not quite right 💡"}
                    </p>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{currentQuestion.explanation}</p>
                  </div>
                </div>
                <button onClick={nextQuestion} style={{ width: "100%", marginTop: 18, padding: "12px 0", borderRadius: 12, border: "none", background: brandBlue, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  {state.currentIndex + 1 < totalQuestions ? "Next Question →" : "See Results →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 12 }}>
            {quiz.questions.map((_, i) => (
              <div key={i} style={{ width: i === state.currentIndex ? 24 : 8, height: 4, borderRadius: 4, background: i < state.currentIndex ? "#22C55E" : i === state.currentIndex ? brandBlue : "#E2E8F0", transition: "all 0.2s" }} />
            ))}
          </div>

          {!state.showFeedback && !isAnswered && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 8 }}>Click on an option to select your answer</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}