import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../lib/auth/auth-api";
import type { User } from "../types/auth";
import {setAuthToken} from "../lib/auth/http.ts";

interface UserContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("auth");
        if (!raw) return;

        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
        setAuthToken(parsed.token);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginRequest(email, password);
        setUser(data.user);
        setToken(data.token);
        setAuthToken(data.token);
        localStorage.setItem("auth", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAuthToken(null);
        localStorage.removeItem("auth");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("UserContext missing");
    return ctx;
}
