"use client";

import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { logout } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { ReactNode, } from "react";
import { UserProvider } from "@/contexts/user-context";

function Shell({ children }: { children: ReactNode }) {
    const router = useRouter()

    const handleLogout = async () => {
        const res = await logout();
        if (res.success) {
            router.push("/");
        } else {
            console.error("Logout failed");
        }
    };

    const style = {
        "--sidebar-width": "18rem",
    };

    return (
        <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full" data-testid="app-container">
                <AppSidebar onLogout={handleLogout} />
                <main className="flex-1 bg-background overflow-hidden" data-testid="app-main">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <Shell>{children}</Shell>
        </UserProvider>
    );
}