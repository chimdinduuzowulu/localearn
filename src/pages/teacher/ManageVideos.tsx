import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getCourseById,
  updateCourse,
  getAllEnrollments,
  isYouTubeUrl,
  extractYouTubeId,
  getYouTubeThumbnail,
  SUBJECT_CONFIG,
  Course,
  VideoEntry,
} from "../../utils/videoData";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  fontSize: 14,
  color: "#0F172A",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

interface VideoForm {
  title: string;
  url: string;
  duration: string;
}

const emptyForm: VideoForm = { title: "", url: "", duration: "" };

const ManageVideos: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [urlWarning, setUrlWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const found = getCourseById(courseId);
    if (!found) {
      toast.error("Course not found.");
      navigate("/teacher");
      return;
    }
    setCourse(found);

    const enrollments = getAllEnrollments();
    const count = enrollments.filter((e) => e.courseId === courseId).length;
    setStudentCount(count);
  }, [courseId, navigate]);

  if (!user || user.role !== "teacher") {
    navigate("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "url" && value.trim()) {
      if (!isYouTubeUrl(value) && value.startsWith("http")) {
        setUrlWarning(
          "Non-YouTube URL detected — it will still be saved, but embedding may not work on all devices."
        );
      } else {
        setUrlWarning(null);
      }
    } else if (name === "url") {
      setUrlWarning(null);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    if (!form.title.trim()) {
      toast.error("Video title is required.");
      return;
    }
    if (!form.url.trim()) {
      toast.error("Video URL is required.");
      return;
    }

    setSubmitting(true);

    const newVideo: VideoEntry = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      url: form.url.trim(),
      duration: form.duration.trim() || undefined,
      order: course.videos.length,
    };

    const updatedVideos = [...course.videos, newVideo];
    const updatedCourse = { ...course, videos: updatedVideos };
    updateCourse(updatedCourse);
    setCourse(updatedCourse);

    toast.success(`Video "${newVideo.title}" added!`);
    setForm(emptyForm);
    setUrlWarning(null);
    setSubmitting(false);
    setShowAddForm(false);
  };

  const handleDeleteVideo = (videoId: string, title: string) => {
    if (!course) return;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(videoId);
    const updatedVideos = course.videos
      .filter((v) => v.id !== videoId)
      .map((v, i) => ({ ...v, order: i }));
    const updatedCourse = { ...course, videos: updatedVideos };
    updateCourse(updatedCourse);
    setCourse(updatedCourse);
    setDeletingId(null);
    toast.success("Video removed.");
  };

  const getBorderColor = (field: string) =>
    focusedField === field ? "#0EA5E9" : "#E2E8F0";

  if (!course) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            border: "3px solid #E2E8F0",
            borderTopColor: "#0EA5E9",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const subjectCfg = SUBJECT_CONFIG[course.subject] || {
    emoji: "📚",
    color: "#64748B",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ width: "99%", padding: "0 12px" }}
    >
      {/* Back + course header */}
      <div style={{ marginBottom: 24 }}>
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
            marginBottom: 14,
          }}
        >
          ← Back to Teacher Portal
        </button>

        {/* Course info bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${subjectCfg.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {subjectCfg.emoji}
            </div>
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                {course.title}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 4,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  {course.subject}
                </span>
                <span style={{ color: "#CBD5E1" }}>·</span>
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  {course.gradeLevel}
                </span>
                <span style={{ color: "#CBD5E1" }}>·</span>
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  {course.language}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0EA5E9",
                  margin: 0,
                }}
              >
                {course.videos.length}
              </p>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                Videos
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#10B981",
                  margin: 0,
                }}
              >
                {studentCount}
              </p>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                Students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add video toggle */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: showAddForm ? 16 : 0,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            Course Videos
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddForm((v) => !v)}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "none",
              background: showAddForm ? "#F1F5F9" : "#0EA5E9",
              color: showAddForm ? "#64748B" : "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {showAddForm ? "✕ Cancel" : "+ Add Video"}
          </motion.button>
        </div>

        {/* Add video inline form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 14,
                  border: "1.5px solid #0EA5E9",
                  padding: "22px 22px",
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0EA5E9",
                    marginBottom: 16,
                    margin: "0 0 16px",
                  }}
                >
                  ADD NEW VIDEO
                </p>
                <form onSubmit={handleAddVideo}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        Video Title <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("title")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. Introduction to Fractions"
                        style={{
                          ...inputStyle,
                          borderColor: getBorderColor("title"),
                        }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration (optional)</label>
                      <input
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("duration")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. 12:30"
                        style={{
                          ...inputStyle,
                          borderColor: getBorderColor("duration"),
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>
                      Video URL <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("url")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={{
                        ...inputStyle,
                        borderColor: urlWarning
                          ? "#F59E0B"
                          : getBorderColor("url"),
                      }}
                    />
                    {urlWarning && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#B45309",
                          marginTop: 5,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 5,
                        }}
                      >
                        ⚠️ {urlWarning}
                      </p>
                    )}
                    {form.url && isYouTubeUrl(form.url) && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#059669",
                          marginTop: 5,
                        }}
                      >
                        ✓ Valid YouTube URL detected
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "9px 24px",
                        borderRadius: 10,
                        border: "none",
                        background: submitting ? "#94A3B8" : "#0EA5E9",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: submitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {submitting ? "Adding…" : "Add Video"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video list */}
      {course.videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "60px 22px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 6,
            }}
          >
            No videos yet
          </h3>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
            Add your first video above to get this course ready for students.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "#0EA5E9",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            + Add First Video
          </button>
        </motion.div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
          }}
        >
          {course.videos
            .sort((a, b) => a.order - b.order)
            .map((video, index) => {
              const ytId = extractYouTubeId(video.url);
              const thumb = ytId ? getYouTubeThumbnail(ytId) : null;
              const isYT = isYouTubeUrl(video.url);

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderBottom:
                      index < course.videos.length - 1
                        ? "1px solid #F1F5F9"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background =
                      "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background =
                      "transparent")
                  }
                >
                  {/* Number */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#EFF6FF",
                      color: "#0EA5E9",
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={video.title}
                      style={{
                        width: 72,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 8,
                        flexShrink: 0,
                        border: "1px solid #E2E8F0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 72,
                        height: 48,
                        borderRadius: 8,
                        background: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      🎥
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0F172A",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {video.title}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 3,
                      }}
                    >
                      {video.duration && (
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>
                          ⏱ {video.duration}
                        </span>
                      )}
                      {isYT ? (
                        <span
                          style={{
                            fontSize: 11,
                            background: "#FEF3C7",
                            color: "#B45309",
                            borderRadius: 4,
                            padding: "1px 6px",
                            fontWeight: 600,
                          }}
                        >
                          YouTube
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            background: "#F1F5F9",
                            color: "#64748B",
                            borderRadius: 4,
                            padding: "1px 6px",
                          }}
                        >
                          External
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Link + Delete */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#0EA5E9",
                        textDecoration: "none",
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "1px solid #BAE6FD",
                        background: "#F0F9FF",
                      }}
                    >
                      Preview ↗
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(video.id, video.title)}
                      disabled={deletingId === video.id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "1px solid #FCA5A5",
                        background: "#FFF5F5",
                        color: "#EF4444",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {deletingId === video.id ? "…" : "Delete"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </div>
      )}

      {course.videos.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "1.5px solid #0EA5E9",
              background: "transparent",
              color: "#0EA5E9",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            + Add Another Video
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default ManageVideos;
