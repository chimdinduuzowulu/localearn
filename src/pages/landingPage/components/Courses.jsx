import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Subject emoji map (matches videoData.ts SUBJECT_CONFIG)
const SUBJECT_EMOJI = {
  Mathematics: "📐",
  English: "📖",
  Science: "🔬",
  "Social Studies": "🌍",
  Civic: "🏛️",
  History: "📜",
  Geography: "🗺️",
  "Basic Technology": "⚙️",
  Agriculture: "🌾",
  "Home Economics": "🏠",
  "Fine Arts": "🎨",
  Music: "🎵",
  "Physical Education": "⚽",
  "Computer Science": "💻",
  "Islamic Studies": "📿",
  "Christian Religious Studies": "✝️",
};

const LANG_FLAGS = {
  english: "🇬🇧",
  hausa: "🇳🇬",
  igbo: "🇳🇬",
  yoruba: "🇳🇬",
};

// Skeleton card shown when no courses exist
const SkeletonCard = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #E2E8F0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 140,
        background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
    <div style={{ padding: "16px 18px" }}>
      <div
        style={{
          height: 14,
          width: "60%",
          background: "#F1F5F9",
          borderRadius: 6,
          marginBottom: 10,
        }}
      />
      <div
        style={{
          height: 12,
          width: "40%",
          background: "#F1F5F9",
          borderRadius: 6,
        }}
      />
    </div>
  </motion.div>
);

// Real course card
const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();
  const emoji = SUBJECT_EMOJI[course.subject] || "📚";
  const flag = LANG_FLAGS[course.language] || "🌐";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, borderColor: "#0EA5E9" }}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onClick={() => navigate("/signup")}
    >
      {/* Header band */}
      <div
        style={{
          height: 100,
          background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          position: "relative",
        }}
      >
        {emoji}
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 18,
          }}
        >
          {flag}
        </span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#0F172A",
            margin: "0 0 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {course.title}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 12,
              color: "#64748B",
              background: "#F1F5F9",
              borderRadius: 5,
              padding: "2px 8px",
            }}
          >
            {course.subject}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#64748B",
              background: "#F1F5F9",
              borderRadius: 5,
              padding: "2px 8px",
            }}
          >
            {course.gradeLevel}
          </span>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#94A3B8",
            marginTop: 8,
          }}
        >
          {course.videos?.length || 0} video
          {(course.videos?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
};

const CoursesSection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wl_courses_v2");
      const parsed = raw ? JSON.parse(raw) : [];
      setCourses(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
    } catch {
      setCourses([]);
    }
    setLoaded(true);
  }, []);

  const isEmpty = loaded && courses.length === 0;

  return (
    <section
      className="w-full bg-gray-50 py-16 px-4"
      id="courses"
      style={{ scrollMarginTop: 80 }}
    >
      <div className="md:max-w-[1200px] mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="text-[#33468a]">Courses</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEmpty
              ? "Courses are being added by our teachers. Sign up to stay informed and enrol when they're live."
              : "Explore our growing library of courses, available in your native language."}
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {!loaded ? (
            // Loading skeletons
            [0, 1, 2].map((i) => <SkeletonCard key={i} delay={i * 0.1} />)
          ) : isEmpty ? (
            // Empty skeletons (no real data yet)
            [0, 1, 2].map((i) => <SkeletonCard key={i} delay={i * 0.1} />)
          ) : (
            courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-[#33468a] text-white rounded-lg hover:bg-[#27366e] transition-colors duration-300 font-medium"
          >
            {isEmpty ? "Sign Up — It's Free" : "See All Courses"}
          </button>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default CoursesSection;
