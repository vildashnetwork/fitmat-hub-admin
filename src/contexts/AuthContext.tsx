import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const currentAdmin = localStorage.getItem("currentAdmin");
    if (currentAdmin) {
      setAdmin(JSON.parse(currentAdmin));
    } else {
      // Initialize with default admin if no admins exist
      const admins = localStorage.getItem("admins");
      if (!admins) {
        const defaultAdmin: Admin = {
          id: "1",
          email: "admin@fitmat.com",
          name: "Admin User",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("admins", JSON.stringify([defaultAdmin]));
        localStorage.setItem("adminPasswords", JSON.stringify({ "admin@fitmat.com": "admin123" }));
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");
    const passwords = JSON.parse(localStorage.getItem("adminPasswords") || "{}");

    if (passwords[email] === password) {
      const admin = admins.find((a: Admin) => a.email === email);
      if (admin) {
        setAdmin(admin);
        localStorage.setItem("currentAdmin", JSON.stringify(admin));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("currentAdmin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
