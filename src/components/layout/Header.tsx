import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

interface HeaderProps {
  toggleSideNav?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSideNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = user
    ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <button
        onClick={toggleSideNav}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#64748B",
          display: "flex",
          alignItems: "center",
          padding: 4,
        }}
      >
        <IconMenu />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }}
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "7px 9px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#64748B",
              position: "relative",
            }}
          >
            <IconBell />
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#EF4444",
              }}
            />
          </button>
          {notifOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: 280,
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                zIndex: 100,
              }}
            >
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Notifications</p>
              </div>
              <div style={{ padding: "12px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>No new notifications</p>
              </div>
            </div>
          )}
        </div>

        {/* Avatar / profile menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#0EA5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
            }}
          >
            {initials}
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: 200,
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>
                  {user?.fname} {user?.lname}
                </p>
                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: 13,
                  color: "#475569",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Your Profile
              </button>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  borderTop: "1px solid #F1F5F9",
                  textAlign: "left",
                  fontSize: 13,
                  color: "#EF4444",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <IconLogout /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
