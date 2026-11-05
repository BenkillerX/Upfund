import { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../services/api";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user when the app is refreshed
useEffect(() => {
  let cancelled = false;

  const restoreUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/api/auth/me");

      if (cancelled) return;

      setCurrentUser(response.data.user);
    } catch (error) {
      if (cancelled) return;

      console.error("Failed to restore user:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          // Server confirmed the token is invalid
          localStorage.removeItem("token");
          setCurrentUser(null);
        } else {
          // Network error, timeout, or server failure
          // Keep the token for another attempt
          console.warn(
            "Unable to restore user right now. Token preserved."
          );
        }
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  restoreUser();

  return () => {
    cancelled = true;
  };
}, []);
    const login = async ( email: string, password: string ): Promise<User> => {
        const response = await api.post("/api/auth/login", {
            email,
            password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        const userResponse = await api.get("/api/auth/me");
        const user = userResponse.data.user;
        setCurrentUser(user);
        return user;
    };

    const logout = (): void => {
        setCurrentUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};