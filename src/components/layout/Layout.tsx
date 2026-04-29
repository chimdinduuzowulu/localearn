import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const IconGrid = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconBooks = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconUser = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconGraduationCap = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconLogOut = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = ({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  const navItems = [
    { path: "/index", icon: IconGrid, label: "Dashboard" },
    { path: "/courses", icon: IconBooks, label: "My Courses" },
    { path: "/profile", icon: IconUser, label: "Profile" },
    { path: "/teacher", icon: IconGraduationCap, label: "Teacher Portal" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const initials = user
    ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#F8FAFC",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Mobile header */}
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
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: "6px",
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#0EA5E9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>
                L
              </span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
              Localearn
            </span>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "6px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#64748B",
            }}
          >
            <IconLogOut size={18} />
          </button>
        </header>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <>
            <motion.aside
              initial={{ x: -270 }}
              animate={{ x: 0 }}
              exit={{ x: -270 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{
                position: isMobile ? "fixed" : "relative",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 40,
                width: 252,
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
                  padding: "24px 20px 20px",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#0EA5E9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}
                    >
                      L
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: "#0F172A",
                        lineHeight: 1.2,
                      }}
                    >
                      Localearn
                    </p>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                      by Wootlab
                    </p>
                  </div>
                </div>
              </div>

              {/* User pill */}
              {user && (
                <div
                  style={{
                    margin: "16px 16px 4px",
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "#0EA5E9",
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
                      <p
                        style={{
                          fontSize: 11,
                          color: "#64748B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: 1,
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav */}
              <nav
                style={{
                  flex: 1,
                  padding: "12px 12px 0",
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
                    padding: "8px 8px 6px",
                  }}
                >
                  Menu
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
                        background: active ? "#0EA5E9" : "transparent",
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
                      <Icon size={17} className={active ? "" : ""} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div
                style={{ padding: "16px 12px", borderTop: "1px solid #F1F5F9" }}
              >
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

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, paddingTop: isMobile ? 56 : 0 }}>
        <div style={{ padding: "32px 36px", maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
