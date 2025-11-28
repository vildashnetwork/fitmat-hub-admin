import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // Prevent redirect before check

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    const decode = async (): Promise<boolean> => {
      if (!token) return false;

      try {
        const response = await axios.get("https://faap.onrender.com/api/admin/decode/token/admin", { headers: { Authorization: `Bearer ${token}` } });
        if (response) {
          return true;
        } else {
          localStorage.removeItem("authtoken");
          return false;
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("authtoken");
        return false;
      }
    }

    (async () => {
      const valid = await decode();
      if (token && valid) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    })();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authtoken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authtoken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
