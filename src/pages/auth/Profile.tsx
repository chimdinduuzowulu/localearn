import { useState } from "react";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const B = "#0EA5E9";

const IconUser = ({ size = 20, color = B }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = ({ size = 20, color = B }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
  </svg>
);

const IconLock = ({ size = 20, color = B }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconSave = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

export default function Profile() {
  const { user, updateUser, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [formData, setFormData] = useState({ fname: user?.fname ?? "", lname: user?.lname ?? "" });
  const [pwData, setPwData] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateUser({ fname: formData.fname, lname: formData.lname });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (pwData.next !== pwData.confirm) { setPwErr("New passwords don't match"); return; }
    if (pwData.next.length < 6) { setPwErr("Minimum 6 characters"); return; }
    const ok = await updatePassword(pwData.current, pwData.next);
    if (ok) { setPwData({ current: "", next: "", confirm: "" }); setPwErr(""); }
  };

  const initials = user
    ? `${user.fname?.[0] ?? ""}${user.lname?.[0] ?? ""}`.toUpperCase()
    : "??";

  const roleBadge = user?.role === "teacher"
    ? { label: "Teacher", bg: "#FEF3C7", color: "#D97706" }
    : { label: "Student · Active Learner", bg: "#E0F2FE", color: B };

  const inp = (val: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <input
      name={name}
      value={val}
      onChange={onChange}
      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s" }}
      onFocus={e => (e.currentTarget.style.borderColor = B)}
      onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
    />
  );

  return (
    <Layout>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ padding: "28px 32px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${B}, #0284C7)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(14,165,233,0.2)" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{initials}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{user?.fname} {user?.lname}</h1>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>{user?.email}</p>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: roleBadge.bg, color: roleBadge.color }}>
                {roleBadge.label}
              </span>
            </div>
            <button onClick={() => setIsEditing(!isEditing)}
              style={{ padding: "10px 22px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #E2E8F0", display: "flex", gap: 4, padding: "0 24px" }}>
            {["settings", "achievements"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "14px 18px", marginBottom: -1, borderBottom: activeTab === tab ? `2px solid ${B}` : "2px solid transparent", background: "none", color: activeTab === tab ? B : "#64748B", fontWeight: activeTab === tab ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textTransform: "capitalize" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: "28px 32px" }}>

            {activeTab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>

                {isEditing ? (
                  <>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Edit Profile</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>First Name</label>
                          {inp(formData.fname, "fname", handleChange)}
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Last Name</label>
                          {inp(formData.lname, "lname", handleChange)}
                        </div>
                      </div>
                      <button onClick={handleSave}
                        style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: B, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                        <IconSave /> Save Changes
                      </button>
                    </div>

                    <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 20 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Change Password</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Current Password</label>
                          <input type="password" value={pwData.current} onChange={e => setPwData(p => ({ ...p, current: e.target.value }))}
                            style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }}
                            onFocus={e => (e.currentTarget.style.borderColor = B)} onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>New Password</label>
                          <input type="password" value={pwData.next} onChange={e => setPwData(p => ({ ...p, next: e.target.value }))}
                            style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }}
                            onFocus={e => (e.currentTarget.style.borderColor = B)} onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Confirm New Password</label>
                          <input type="password" value={pwData.confirm} onChange={e => setPwData(p => ({ ...p, confirm: e.target.value }))}
                            style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }}
                            onFocus={e => (e.currentTarget.style.borderColor = B)} onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")} />
                        </div>
                        {pwErr && <p style={{ fontSize: 12, color: "#EF4444" }}>{pwErr}</p>}
                        <button onClick={handlePasswordChange}
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: "#0F172A", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", width: "fit-content" }}>
                          Update Password
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { icon: <IconUser />, label: "Full Name", value: `${user?.fname} ${user?.lname}` },
                      { icon: <IconMail />, label: "Email Address", value: user?.email ?? "" },
                      { icon: <IconLock />, label: "Password", value: "••••••••" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 11, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {row.icon}
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{row.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {[
                  { title: "Quick Learner", desc: "Completed first course in under a week", icon: "⚡", bg: "#FEF3C7" },
                  { title: "Perfect Score", desc: "Got 100% on a quiz", icon: "🎯", bg: "#DCFCE7" },
                  { title: "Dedicated", desc: "Logged in for 7 consecutive days", icon: "🔥", bg: "#FFEDD5" },
                  { title: "Language Explorer", desc: "Learned in multiple languages", icon: "🌍", bg: "#E0F2FE" },
                ].map((a, i) => (
                  <motion.div key={a.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      {a.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{a.title}</p>
                      <p style={{ fontSize: 12, color: "#64748B" }}>{a.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
