import { useState } from "react";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const IconUser = ({ size = 20, color = "#0EA5E9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = ({ size = 20, color = "#0EA5E9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);

const IconLockClosed = ({ size = 20, color = "#0EA5E9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconCamera = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconSave = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const IconBookOpen = ({ size = 18, color = "#0EA5E9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconCalendar = ({ size = 18, color = "#8B5CF6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconAward = ({ size = 18, color = "#F59E0B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const brandBlue = "#0EA5E9";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateUser({ fname: formData.fname, lname: formData.lname });
    setIsEditing(false);
  };

  const stats = [
    { label: "Courses Taken", value: "12", icon: IconBookOpen, color: brandBlue, bg: "#E0F2FE" },
    { label: "Certificates", value: "3", icon: IconAward, color: "#22C55E", bg: "#DCFCE7" },
    { label: "Member Since", value: "Jan 2024", icon: IconCalendar, color: "#8B5CF6", bg: "#EDE9FE" },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "32px 36px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 88, height: 88, borderRadius: 20, background: `linear-gradient(135deg, ${brandBlue}, #0284C7)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(14,165,233,0.2)" }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>
                  {user?.fname?.[0]}{user?.lname?.[0]}
                </span>
              </div>
              <button style={{ position: "absolute", bottom: -4, right: -4, width: 32, height: 32, borderRadius: 12, background: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <IconCamera size={14} />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{user?.fname} {user?.lname}</h1>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>{user?.email}</p>
              <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 99, background: "#E0F2FE", color: brandBlue }}>Student · Active Learner</span>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} style={{ padding: "10px 24px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#E2E8F0" }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  style={{ background: "#fff", padding: "20px 16px", textAlign: "center" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>{stat.value}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div style={{ borderBottom: "1px solid #E2E8F0", display: "flex", gap: 8, padding: "0 24px" }}>
            {["overview", "achievements", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "14px 20px",
                  marginBottom: -1,
                  borderBottom: activeTab === tab ? `2px solid ${brandBlue}` : "2px solid transparent",
                  background: "none",
                  color: activeTab === tab ? brandBlue : "#64748B",
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  textTransform: "capitalize"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: "32px 36px" }}>
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>About Me</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                    Passionate learner exploring new subjects in my native language. 
                    Currently focusing on Mathematics and Digital Literacy.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Recent Activity</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { action: "Completed Module 3 of Basic Mathematics", date: "2 days ago", type: "course" },
                      { action: "Scored 85% on Digital Literacy Quiz", date: "5 days ago", type: "quiz" },
                      { action: "Started Agricultural Science course", date: "1 week ago", type: "course" },
                    ].map((activity, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <IconBookOpen size={18} color={brandBlue} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>{activity.action}</p>
                          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { title: "Quick Learner", description: "Completed first course in under a week", icon: "⚡", bg: "#FEF3C7", color: "#D97706" },
                  { title: "Perfect Score", description: "Got 100% on a quiz", icon: "🎯", bg: "#DCFCE7", color: "#16A34A" },
                  { title: "Dedicated Student", description: "Logged in for 7 consecutive days", icon: "🔥", bg: "#FFEDD5", color: "#EA580C" },
                  { title: "Language Explorer", description: "Learned in multiple languages", icon: "🌍", bg: "#E0F2FE", color: brandBlue },
                ].map((achievement, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: achievement.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{achievement.title}</h4>
                      <p style={{ fontSize: 12, color: "#64748B" }}>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div style={{ maxWidth: 500 }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>First Name</label>
                        <input name="fname" value={formData.fname} onChange={handleChange} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => e.currentTarget.style.borderColor = brandBlue} onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Last Name</label>
                        <input name="lname" value={formData.lname} onChange={handleChange} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => e.currentTarget.style.borderColor = brandBlue} onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Email Address</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => e.currentTarget.style.borderColor = brandBlue} onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>New Password</label>
                      <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Leave blank to keep current" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => e.currentTarget.style.borderColor = brandBlue} onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"} />
                    </div>
                    <button onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: brandBlue, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", width: "fit-content" }}>
                      <IconSave /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconUser size={20} color={brandBlue} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 2 }}>Full Name</p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>{user?.fname} {user?.lname}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconMail size={20} color={brandBlue} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 2 }}>Email Address</p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>{user?.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconLockClosed size={20} color={brandBlue} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 2 }}>Password</p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>••••••••</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;