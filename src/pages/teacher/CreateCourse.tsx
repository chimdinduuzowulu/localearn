import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getAllCourses,
  saveCourses,
  SUBJECTS,
  GRADE_LEVELS,
  SUBJECT_CONFIG,
  Course,
} from "../../utils/videoData";

const LANGUAGES = [
  { value: "english", label: "English", flag: "🇬🇧" },
  { value: "hausa", label: "Hausa", flag: "🇳🇬" },
  { value: "igbo", label: "Igbo", flag: "🇳🇬" },
  { value: "yoruba", label: "Yoruba", flag: "🇳🇬" },
] as const;

type Language = "english" | "hausa" | "igbo" | "yoruba";

interface FormState {
  title: string;
  subject: string;
  gradeLevel: string;
  language: Language;
  description: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  fontSize: 14,
  color: "#0F172A",
  outline: "none",
  background: "#fff",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const CreateCourse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    title: "",
    subject: SUBJECTS[0],
    gradeLevel: GRADE_LEVELS[0],
    language: "english",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (!user || user.role !== "teacher") {
    navigate("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please add a short description.");
      return;
    }

    setSubmitting(true);

    const newCourse: Course = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      subject: form.subject,
      gradeLevel: form.gradeLevel,
      language: form.language,
      description: form.description.trim(),
      createdBy: user.email,
      createdAt: new Date().toISOString(),
      videos: [],
    };

    const courses = getAllCourses();
    saveCourses([...courses, newCourse]);

    toast.success(`Course "${newCourse.title}" created! Now add some videos.`);
    navigate(`/teacher/manage-videos/${newCourse.id}`);
  };

  const selectedSubjectConfig = SUBJECT_CONFIG[form.subject] || {
    emoji: "📚",
    color: "#64748B",
  };

  const getBorderColor = (field: string) =>
    focusedField === field ? "#0EA5E9" : "#E2E8F0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ width: "99%", padding: "0 12px" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => navigate("/teacher")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#64748B",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: 12,
          }}
        >
          ← Back to Teacher Portal
        </button>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0F172A",
            margin: 0,
          }}
        >
          Create New Course
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>
          Fill in the details below. You'll add videos on the next screen.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Main form card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "28px 28px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="title" style={labelStyle}>
                Course Title <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Basic Mathematics in Hausa"
                maxLength={120}
                style={{
                  ...inputStyle,
                  borderColor: getBorderColor("title"),
                }}
              />
            </div>

            {/* Subject + Grade row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <label htmlFor="subject" style={labelStyle}>
                  Subject <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle,
                    borderColor: getBorderColor("subject"),
                  }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {SUBJECT_CONFIG[s]?.emoji || "📚"} {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="gradeLevel" style={labelStyle}>
                  Grade Level <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={form.gradeLevel}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("gradeLevel")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle,
                    borderColor: getBorderColor("gradeLevel"),
                  }}
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Language of Instruction{" "}
                <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, language: lang.value }))
                    }
                    style={{
                      padding: "8px 18px",
                      borderRadius: 10,
                      border:
                        form.language === lang.value
                          ? "2px solid #0EA5E9"
                          : "1.5px solid #E2E8F0",
                      background:
                        form.language === lang.value ? "#EFF6FF" : "#fff",
                      color:
                        form.language === lang.value ? "#0EA5E9" : "#64748B",
                      fontWeight: form.language === lang.value ? 700 : 500,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s",
                    }}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              <label htmlFor="description" style={labelStyle}>
                Description <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                rows={4}
                placeholder="What will students learn in this course? Who is it for?"
                maxLength={600}
                style={{
                  ...inputStyle,
                  borderColor: getBorderColor("description"),
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: "#94A3B8",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {form.description.length}/600
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => navigate("/teacher")}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "1.5px solid #E2E8F0",
                  background: "transparent",
                  color: "#64748B",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: submitting ? "#94A3B8" : "#0EA5E9",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitting ? (
                  <>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Creating…
                  </>
                ) : (
                  "Create Course & Add Videos →"
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Preview sidebar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "24px 22px",
            position: "sticky",
            top: 24,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94A3B8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Preview
          </p>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 12,
              padding: "18px 16px",
              border: "1px solid #E2E8F0",
            }}
          >
            {/* Subject badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: `${selectedSubjectConfig.color}18`,
                color: selectedSubjectConfig.color,
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              <span>{selectedSubjectConfig.emoji}</span>
              {form.subject}
            </div>

            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 6px",
                minHeight: 24,
              }}
            >
              {form.title || (
                <span style={{ color: "#CBD5E1" }}>Course title…</span>
              )}
            </h3>

            <p
              style={{
                fontSize: 13,
                color: "#64748B",
                lineHeight: 1.5,
                minHeight: 40,
                margin: "0 0 14px",
              }}
            >
              {form.description || (
                <span style={{ color: "#CBD5E1" }}>Description…</span>
              )}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12,
                color: "#64748B",
              }}
            >
              <span
                style={{
                  background: "#EFF6FF",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                {LANGUAGES.find((l) => l.value === form.language)?.flag}{" "}
                {form.language}
              </span>
              <span
                style={{
                  background: "#F0FDF4",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                {form.gradeLevel}
              </span>
              <span
                style={{
                  background: "#FFF7ED",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                0 videos
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              color: "#94A3B8",
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            After creating the course you'll be taken to the video management
            page to add content.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default CreateCourse;
