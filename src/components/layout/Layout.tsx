import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import wootlabLogo from "../../pages/landingPage/assets/wootlab-logo.png";

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const IconGrid = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconBooks = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconVideo = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconUser = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconGrad = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconPlus = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconLogOut = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconBell = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  path: string;
  icon: React.FC<{ size?: number }>;
  label: string;
}

const STUDENT_NAV: NavItem[] = [
  { path: "/index", icon: IconGrid, label: "Dashboard" },
  { path: "/courses", icon: IconBooks, label: "My Courses" },
  { path: "/videos", icon: IconVideo, label: "Video Tutorials" },
  { path: "/profile", icon: IconUser, label: "Profile" },
];

const TEACHER_NAV: NavItem[] = [
  { path: "/teacher", icon: IconGrad, label: "Teacher Portal" },
  { path: "/teacher/create-course", icon: IconPlus, label: "Create Course" },
  { path: "/profile", icon: IconUser, label: "Profile" },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navItems = user?.role === "teacher" ? TEACHER_NAV : STUDENT_NAV;
  const isActive = (path: string) => location.pathname === path;

  const initials = user
    ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase()
    : "??";

  const roleBadge =
    user?.role === "teacher"
      ? { label: "Teacher", bg: "#FEF3C7", color: "#D97706" }
      : { label: "Student", bg: "#E0F2FE", color: "#0EA5E9" };

  const B = "#0EA5E9";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#F8FAFC",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Mobile header ──────────────────────────────────────────────────── */}
      {isMobile && (
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: 6,
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isSidebarOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>

          <img src={wootlabLogo} alt="Wootlab Academy" style={{ height: 32 }} />

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: B,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {initials}
          </div>
        </header>
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <>
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{
                position: isMobile ? "fixed" : "relative",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 40,
                width: 248,
                minHeight: "100vh",
                background: "#fff",
                borderRight: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              {/* Logo */}
              <div
                style={{
                  padding: "20px 18px 16px",
                  borderBottom: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img
                  src={wootlabLogo}
                  alt="Wootlab Academy"
                  style={{ height: 38, objectFit: "contain" }}
                />
              </div>

              {/* User pill */}
              {user && (
                <div
                  style={{
                    margin: "14px 14px 4px",
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: B,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#0F172A",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.fname} {user.lname}
                      </p>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: roleBadge.bg,
                          color: roleBadge.color,
                          display: "inline-block",
                          marginTop: 2,
                        }}
                      >
                        {roleBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav */}
              <nav
                style={{
                  flex: 1,
                  padding: "12px 10px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#94A3B8",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "6px 8px",
                  }}
                >
                  {user?.role === "teacher" ? "Teaching" : "Learning"}
                </p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        textDecoration: "none",
                        fontWeight: active ? 600 : 500,
                        fontSize: 14,
                        transition: "all 0.15s ease",
                        background: active ? B : "transparent",
                        color: active ? "#fff" : "#475569",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.background =
                            "#F1F5F9";
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                      }}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Header bar (desktop) with bell */}
              {!isMobile && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderTop: "1px solid #F1F5F9",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>
                    {user?.email}
                  </span>
                  <button
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#64748B",
                    }}
                    title="Notifications"
                  >
                    <IconBell size={16} />
                  </button>
                </div>
              )}

              {/* Logout */}
              <div style={{ padding: "14px 10px" }}>
                <button
                  onClick={logout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    width: "100%",
                    borderRadius: 10,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#64748B",
                    textAlign: "left",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#FFF1F2";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#EF4444";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#64748B";
                  }}
                >
                  <IconLogOut size={17} />
                  <span>Log out</span>
                </button>
              </div>
            </motion.aside>

            {/* Mobile overlay */}
            {isMobile && (
              <div
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  zIndex: 30,
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 60 : 0 }}>
        <div style={{ width: "99%", padding: "28px 12px" }}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
