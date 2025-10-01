"use client";

import { LayoutDashboard, LogOut, User2, UserPlus2 } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserRole } from "@/types/user";

interface AppSidebarProps {
    userRole: UserRole;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const AppSidebar = ({ userRole, currentPage, onNavigate, onLogout }: AppSidebarProps) => {
    const menuItems = [
        // {
        //     id: "dashboard",
        //     title: "Dashboard",
        //     icon: LayoutDashboard,
        //     roles: ["admin", "employee"],
        //     hasSubItems: false
        // },
        {
            id: "enquiry_management",
            title: "Enquiries Management",
            icon: User2,
            roles: ["admin", "employee"],
            hasSubItems: false
        },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <Sidebar data-testid="app-sidebar">
            <SidebarHeader className="p-3 pb-1 bg-white border-b">
                <div>
                    <Image src="/dark-logo.webp" alt="Artitians" className="mx-auto" width={175} height={100} priority />
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {filteredMenuItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => onNavigate(item.id)}
                                        isActive={currentPage === item.id}
                                        data-testid={`sidebar-menu-${item.id}`}
                                        className="py-6 cursor-pointer text-[15px] hover:bg-gray-200"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-[15px] font-medium">{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3 bg-white">
                <div className="space-y-2">
                    {/* Logout */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onLogout}
                        className="w-full mx-auto py-6 text-sm cursor-pointer"
                        data-testid="sidebar-logout"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;