import { createContext } from "react";

export interface User {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    balance: number;
}

export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    loading: boolean;
    register: (username: string, email: string, password: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | null>(null);