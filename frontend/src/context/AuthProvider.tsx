import { useState } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../services/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const login = async (
        email: string,
        password: string
    ): Promise<User> => {

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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};