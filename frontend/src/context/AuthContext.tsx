import { createContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  balance: number;

  bankAccount: {
    accountName: string | null;
    accountNumber: string | null;
    bankName: string | null;
  };
  phoneNumber: string | null;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<User>;

  updateBankAccount: (bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => Promise<{
    message: string;
    bankAccount: User["bankAccount"];
  }>;
  updateProfile: (profile: {
  username: string;
  phoneNumber: string;
}) => Promise<{ message: string; user: User }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);