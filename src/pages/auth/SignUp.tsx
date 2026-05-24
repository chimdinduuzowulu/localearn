import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../context/AuthContext";
import wootlabLogo from "../landingPage/assets/wootlab-logo.png";

const B = "#0EA5E9";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function SignUp() {
  const [formData, setFormData] = useState({ fname: "", lname: "", email: "", password: "", confirmPassword: "" });
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fname.trim()) errs.fname = "First name is required";
    if (!formData.lname.trim()) errs.lname = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!agreed) errs.terms = "You must agree to the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword: _, ...userData } = formData;
    const success = await signup({ ...userData, role });
    if (success) navigate("/index");
  };

  const pwStrength =
    formData.password.length === 0 ? 0
      : formData.password.length < 6 ? 1
        : formData.password.length < 10 ? 2 : 3;
  const pwColors = ["", "#EF4444", "#F97316", "#22C55E"];
  const pwLabels = ["", "Weak", "Fair", "Strong"];

  const inpStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: 14,
    color: "#0F172A",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
    border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
    transition: "border-color 0.15s",
  });

  const ROLE_CARDS = [
    { value: "student" as UserRole, emoji: "🎓", title: "Student", desc: "Access courses and learn in your language" },
    { value: "teacher" as UserRole, emoji: "📋", title: "Teacher", desc: "Create courses and upload curriculum" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div className="lg-panel" style={{ width: "45%", background: "#0F172A", position: "relative", overflow: "hidden", flexShrink: 0, display: "none" }}>
        <style>{`.lg-panel { display: none } @media(min-width:960px){ .lg-panel { display:flex; flex-direction:column; justify-content:space-between; padding:48px 52px; } }`}</style>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${B}50, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <img src={wootlabLogo} alt="Wootlab Academy" style={{ height: 44, objectFit: "contain" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Join the Movement</p>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Your students deserve to<br /><span style={{ color: B }}>understand.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, maxWidth: 340 }}>
            Upload curriculum. Let AI translate into Hausa, Igbo, Yoruba and more.
          </p>
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {["Upload any PDF curriculum in minutes", "AI translates to mother-tongue languages", "Students learn with adaptive quizzes"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 99, background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconCheck />
              </div>
              <span style={{ color: "#CBD5E1", fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "#F8FAFC", overflowY: "auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: "100%", maxWidth: 460 }}>

          <div className="mobile-logo" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <style>{`.mobile-logo { display:flex } @media(min-width:960px){ .mobile-logo { display:none } }`}</style>
            <img src={wootlabLogo} alt="Wootlab Academy" style={{ height: 36, objectFit: "contain" }} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 6 }}>Create your account</h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>Start teaching or learning in your language today</p>
          </div>

          {/* Role selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {ROLE_CARDS.map(card => {
              const active = role === card.value;
              return (
                <button key={card.value} type="button" onClick={() => setRole(card.value)}
                  style={{
                    padding: "14px 12px",
                    borderRadius: 12,
                    border: `2px solid ${active ? B : "#E2E8F0"}`,
                    background: active ? "#EFF6FF" : "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{card.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: active ? "#0F172A" : "#64748B", marginBottom: 3 }}>{card.title}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.3 }}>{card.desc}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>First name</label>
                <input name="fname" value={formData.fname} onChange={handleChange} placeholder="Chidi"
                  style={inpStyle(!!errors.fname)}
                  onFocus={e => (e.currentTarget.style.borderColor = errors.fname ? "#EF4444" : B)}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.fname ? "#EF4444" : "#E2E8F0")} />
                {errors.fname && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.fname}</p>}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Last name</label>
                <input name="lname" value={formData.lname} onChange={handleChange} placeholder="Okafor"
                  style={inpStyle(!!errors.lname)}
                  onFocus={e => (e.currentTarget.style.borderColor = errors.lname ? "#EF4444" : B)}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.lname ? "#EF4444" : "#E2E8F0")} />
                {errors.lname && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.lname}</p>}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Email address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                style={inpStyle(!!errors.email)}
                onFocus={e => (e.currentTarget.style.borderColor = errors.email ? "#EF4444" : B)}
                onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "#E2E8F0")} />
              {errors.email && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                  style={{ ...inpStyle(!!errors.password), paddingRight: 44 }}
                  onFocus={e => (e.currentTarget.style.borderColor = errors.password ? "#EF4444" : B)}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#EF4444" : "#E2E8F0")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 4, flex: 1 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ height: 4, flex: 1, borderRadius: 99, background: i <= pwStrength ? pwColors[pwStrength] : "#E2E8F0", transition: "background 0.2s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</span>
                </div>
              )}
              {errors.password && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Confirm password</label>
              <div style={{ position: "relative" }}>
                <input name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password"
                  style={{ ...inpStyle(!!errors.confirmPassword), paddingRight: 44 }}
                  onFocus={e => (e.currentTarget.style.borderColor = errors.confirmPassword ? "#EF4444" : B)}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.confirmPassword ? "#EF4444" : "#E2E8F0")} />
                {formData.confirmPassword && formData.confirmPassword === formData.password && !errors.confirmPassword && (
                  <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "#22C55E" }}>
                    <IconCheck />
                  </div>
                )}
              </div>
              {errors.confirmPassword && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.confirmPassword}</p>}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <div onClick={() => setAgreed(!agreed)}
                style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${agreed ? B : "#CBD5E1"}`, background: agreed ? B : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", marginTop: 1, cursor: "pointer", flexShrink: 0 }}>
                {agreed && <IconCheck />}
              </div>
              <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.4 }}>
                I agree to Wootlab Academy's{" "}
                <Link to="/privacy" style={{ fontWeight: 700, color: B, textDecoration: "none" }}>Terms & Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p style={{ fontSize: 12, color: "#EF4444" }}>{errors.terms}</p>}

            <button type="submit" disabled={isLoading}
              style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", fontFamily: "inherit", fontWeight: 700, fontSize: 14, color: "#fff", cursor: isLoading ? "not-allowed" : "pointer", background: isLoading ? "#CBD5E1" : B, transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
              {isLoading ? (
                <><div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Creating account…</>
              ) : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginTop: 24 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 700, color: B, textDecoration: "none" }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
