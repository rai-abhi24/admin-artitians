"use client";

import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/lib/services/auth";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { UserProvider, useUser } from "@/contexts/user-context";

function Shell({ children }: { children: ReactNode }) {
    const { user } = useUser();

    const routeMap: Record<string, string> = {
        dashboard: "/dashboard",
        enquiry_management: "/enquiries",
    };

    const router = useRouter()
    const [currentPage, setCurrentPage] = useState("dashboard");

    // Function to determine current page from pathname
    const getCurrentPageFromPath = (pathname: string) => {
        if (pathname.startsWith("/dashboard")) return "dashboard";
        if (pathname.startsWith("/enquiries")) return "enquiry_management";
        return "dashboard";
    };

    useEffect(() => {
        const pathname = window.location.pathname;
        const page = getCurrentPageFromPath(pathname);
        setCurrentPage(page);

        // Listen for route changes
        const handleRouteChange = () => {
            const newPathname = window.location.pathname;
            const newPage = getCurrentPageFromPath(newPathname);
            setCurrentPage(newPage);
        };

        // Listen for popstate (back/forward button)
        window.addEventListener('popstate', handleRouteChange);
        
        // Listen for pushstate/replacestate (programmatic navigation)
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        
        window.history.pushState = function(...args) {
            originalPushState.apply(window.history, args);
            setTimeout(handleRouteChange, 0);
        };
        
        window.history.replaceState = function(...args) {
            originalReplaceState.apply(window.history, args);
            setTimeout(handleRouteChange, 0);
        };

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
        const target = routeMap[page];
        if (target) {
            router.push(target);
        }
    };

    // Function to get page title for navbar
    const getPageTitle = (page: string) => {
        const titles: Record<string, string> = {
            dashboard: "Dashboard",
            enquiry_management: "All Enquiries",
            users: "Users",
        };
        return titles[page] || "Dashboard";
    };

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
                <AppSidebar
                    userRole={(user?.role as UserRole) || "admin"}
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
                <div className="flex flex-col flex-1">
                    <header className="flex items-center justify-between p-4 border-b bg-background" data-testid="app-header">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger data-testid="button-sidebar-toggle" />
                            <div className="text-lg font-bold text-black" data-testid="text-breadcrumb">
                                {getPageTitle(currentPage)}
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-6 bg-background" data-testid="app-main">
                        {children}
                    </main>
                </div>
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