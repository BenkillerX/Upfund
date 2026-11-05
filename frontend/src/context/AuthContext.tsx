import { createContext } from "react";

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
}

export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);