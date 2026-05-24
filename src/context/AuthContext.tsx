import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "student" | "teacher";

export interface User {
  fname: string;
  lname: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  preferredLanguage?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    fname: string;
    lname: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  updateUser: (
    data: Partial<Pick<User, "fname" | "lname" | "avatar" | "preferredLanguage">>
  ) => void;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SESSION_KEY = "wl_session_v2";
const USERS_KEY = "wl_users_v2";
const LOCK_KEY = "ll_login_lock";

interface LoginLock {
  attempts: number;
  lockedUntil: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// ─── useRequireAuth hook ──────────────────────────────────────────────────────

export function useRequireAuth(role?: UserRole): User | null {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (role && user.role !== role) {
      navigate("/index", { replace: true });
    }
  }, [user, isLoading, role, navigate]);

  return user;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const persistSession = (u: User) => {
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  // ── Login ──────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);

      // Check brute-force lock
      try {
        const lockRaw = localStorage.getItem(LOCK_KEY);
        if (lockRaw) {
          const lock: LoginLock = JSON.parse(lockRaw);
          if (lock.lockedUntil > Date.now()) {
            const secs = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
            toast.error(`Too many attempts. Try again in ${secs}s.`);
            setIsLoading(false);
            return false;
          }
        }
      } catch {
        /* ignore */
      }

      await new Promise((r) => setTimeout(r, 600));

      const users: StoredUser[] = JSON.parse(
        localStorage.getItem(USERS_KEY) ?? "[]"
      );
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!match) {
        try {
          const lockRaw = localStorage.getItem(LOCK_KEY);
          const lock: LoginLock = lockRaw
            ? JSON.parse(lockRaw)
            : { attempts: 0, lockedUntil: 0 };
          lock.attempts += 1;
          if (lock.attempts >= 5) lock.lockedUntil = Date.now() + 30_000;
          localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
        } catch {
          /* ignore */
        }
        toast.error("Incorrect email or password");
        setIsLoading(false);
        return false;
      }

      localStorage.removeItem(LOCK_KEY);
      const { password: _pw, ...safe } = match;
      persistSession(safe);
      toast.success(`Welcome back, ${safe.fname}! 👋`);
      setIsLoading(false);
      return true;
    },
    []
  );

  // ── Signup ─────────────────────────────────────────────────────────────────

  const signup = useCallback(
    async (data: {
      fname: string;
      lname: string;
      email: string;
      password: string;
      role: UserRole;
    }): Promise<boolean> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 600));

      const users: StoredUser[] = JSON.parse(
        localStorage.getItem(USERS_KEY) ?? "[]"
      );

      if (
        users.some(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        )
      ) {
        toast.error("An account with this email already exists");
        setIsLoading(false);
        return false;
      }

      const newUser: StoredUser = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const { password: _pw, ...safe } = newUser;
      persistSession(safe);
      toast.success("Welcome to Wootlab Academy 🎉");
      setIsLoading(false);
      return true;
    },
    []
  );

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    toast.info("You've been logged out");
    navigate("/login");
  }, [navigate]);

  // ── Update profile ─────────────────────────────────────────────────────────

  const updateUser = useCallback(
    (
      data: Partial<
        Pick<User, "fname" | "lname" | "avatar" | "preferredLanguage">
      >
    ) => {
      if (!user) return;
      const updated = { ...user, ...data };
      persistSession(updated);

      const users: StoredUser[] = JSON.parse(
        localStorage.getItem(USERS_KEY) ?? "[]"
      );
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      toast.success("Profile updated");
    },
    [user]
  );

  // ── Update password ────────────────────────────────────────────────────────

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      if (!user) return false;
      const users: StoredUser[] = JSON.parse(
        localStorage.getItem(USERS_KEY) ?? "[]"
      );
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1 || users[idx].password !== currentPassword) {
        toast.error("Current password is incorrect");
        return false;
      }
      users[idx].password = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      toast.success("Password updated successfully");
      return true;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
