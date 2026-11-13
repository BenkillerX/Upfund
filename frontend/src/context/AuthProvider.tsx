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

    console.log("Stored token:", token ? "Found" : "Missing");

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Current user API response:", response.data);

      if (cancelled) return;

      const user = response.data.user;

      if (!user) {
        throw new Error("User data was not returned.");
      }

      setCurrentUser(user);

    } catch (error) {
      if (cancelled) return;

      console.error("Failed to restore user:", error);

      setCurrentUser(null);

      // Temporarily preserve token for debugging.
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
const login = async ( email: string, password: string ): Promise<User> => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  const { token, user } = response.data;

  if (!token || !user) {
    throw new Error("Invalid login response.");
  }

  localStorage.setItem("token", token);

  setCurrentUser(user);

  return user;
};

  // Register User
 const register = async ( username: string, email: string, password: string, referralCode?: string ) => {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
    referralCode,
  });
  const { token, user } = response.data;
  if (!token || !user) {
    throw new Error("Invalid registration response.");
  }

  localStorage.setItem("token", token);

  setCurrentUser(user);

    return user;
  };
  //Update account details
const updateBankAccount = async (bankAccount: { accountName: string; accountNumber: string; bankName: string; }) => {
  const response = await api.patch(
    "/api/auth/bank-account",
    bankAccount
  );

  setCurrentUser((prev) =>
    prev
      ? { ...prev, bankAccount: response.data.bankAccount }
      : prev
  );

  return response.data;
};
const updateProfile = async (profile: { username: string; phoneNumber: string; }) => {
  const response = await api.patch(
    "/api/auth/profile",
    profile
  );

  setCurrentUser(response.data.user);

  return response.data;
};
const changePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch("/api/auth/change-password", passwords);
  return response.data;
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
        updateBankAccount,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};