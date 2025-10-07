"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { me } from "@/lib/services/auth";

type User = { userId: string; email: string; role?: string } | null;

type UserContextType = {
    user: User;
    loading: boolean;
    refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        try {
            setLoading(true);
            const res = await me();
            setUser((res as any).data || null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();

    }, []);

    const value = useMemo<UserContextType>(() => ({ user, loading, refresh }), [user, loading]);
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}


