import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const B = "#0EA5E9";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errs, setErrs] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [lockSecs, setLockSecs] = useState(0);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (lockSecs <= 0) return;
    const id = setInterval(() => setLockSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [lockSecs]);

  const validate = () => {
    const e: typeof errs = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    // Check local lock
    try {
      const raw = localStorage.getItem("ll_login_lock");
      if (raw) {
        const lock = JSON.parse(raw);
        if (lock.lockedUntil > Date.now()) {
          const s = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
          setLockSecs(s);
          return;
        }
      }
    } catch {}

    const ok = await login(email, password);
    if (ok) navigate("/index");
  };

  const inp = (focus: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: 14,
    color: "#0F172A",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
    border: `1.5px solid ${focus ? B : "#E2E8F0"}`,
    transition: "border-color 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "45%",
          background: "#0F172A",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          display: "none",
        }}
        className="lg-panel"
      >
        <style>{`.lg-panel { display: none } @media(min-width:960px){ .lg-panel { display:flex; flex-direction:column; justify-content:space-between; padding:48px 52px; } }`}</style>
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${B}50, transparent 70%)`,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: B,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
              L
            </span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
            Localearn
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: B,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Education Without Borders
          </p>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Learn in the
            <br />
            <span style={{ color: B }}>language</span>
            <br />
            you think in.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#94A3B8",
              lineHeight: 1.7,
              maxWidth: 340,
            }}
          >
            AI-powered curriculum translation that meets every student where
            they are — in their mother tongue.
          </p>
        </div>

        <div
          style={{ position: "relative", zIndex: 1, display: "flex", gap: 32 }}
        >
          {[
            ["85%", "Cost saved"],
            ["3 min", "Doc processing"],
            ["3+", "Languages"],
          ].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                {n}
              </p>
              <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#F8FAFC",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 36,
            }}
            className="mobile-logo"
          >
            <style>{`.mobile-logo { display:flex } @media(min-width:960px){ .mobile-logo { display:none } }`}</style>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: B,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
                L
              </span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>
              Localearn
            </span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {lockSecs > 0 && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                marginBottom: 20,
              }}
            >
              <p style={{ fontSize: 13, color: "#B91C1C", fontWeight: 500 }}>
                Too many attempts. Try again in {lockSecs}s.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrs((p) => ({ ...p, email: "" }));
                }}
                style={{
                  ...inp(false),
                  borderColor: errs.email ? "#EF4444" : "#E2E8F0",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = errs.email ? "#EF4444" : B)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errs.email
                    ? "#EF4444"
                    : "#E2E8F0")
                }
              />
              {errs.email && (
                <p style={{ fontSize: 12, color: "#EF4444", marginTop: 5 }}>
                  {errs.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <Link
                  to="/reset"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: B,
                    textDecoration: "none",
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrs((p) => ({ ...p, password: "" }));
                  }}
                  style={{
                    ...inp(false),
                    paddingRight: 44,
                    borderColor: errs.password ? "#EF4444" : "#E2E8F0",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = errs.password ? "#EF4444" : B)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = errs.password
                      ? "#EF4444"
                      : "#E2E8F0")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    padding: 2,
                  }}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errs.password && (
                <p style={{ fontSize: 12, color: "#EF4444", marginTop: 5 }}>
                  {errs.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || lockSecs > 0}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 10,
                border: "none",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                cursor: isLoading || lockSecs > 0 ? "not-allowed" : "pointer",
                background: isLoading || lockSecs > 0 ? "#CBD5E1" : B,
                transition: "background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />{" "}
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#64748B",
              marginTop: 24,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ fontWeight: 700, color: B, textDecoration: "none" }}
            >
              Create one free
            </Link>
          </p>

          <div
            style={{
              marginTop: 36,
              paddingTop: 28,
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                textAlign: "center",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Sign in as
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { r: "Student", d: "Access your courses" },
                { r: "Teacher", d: "Manage curriculum" },
              ].map((x) => (
                <div
                  key={x.r}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "12px 14px",
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  <p
                    style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}
                  >
                    {x.r}
                  </p>
                  <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                    {x.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
