import { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../services/api";

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user when the app is refreshed
  useEffect(() => {
    let cancelled = false;

    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      // No token means no authenticated user.
      // Do not make an API request.
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");

        if (cancelled) return;

        setCurrentUser(response.data.user);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to restore user:", error);

        setCurrentUser(null);
        localStorage.removeItem("token");
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

  // Login existing user
const login = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await api.post(
    "/api/auth/login",
    {
      email,
      password,
    },
    {
      timeout: 15000,
    }
  );

  const { token, user } = response.data;

  if (!token || !user) {
    throw new Error("Invalid login response.");
  }

  localStorage.setItem("token", token);
  setCurrentUser(user);

  return user;
};

  // Register User
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    const user: User = response.data.user;

    return user;
  };

  // Logout
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
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};