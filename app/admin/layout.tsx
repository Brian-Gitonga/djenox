"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import {
    LayoutDashboard,
    Calendar,
    Music,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Mixtapes", href: "/admin/mixtapes", icon: Music },
    { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
    { name: "Bookings", href: "/admin/bookings", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname === "/admin/login" || pathname === "/admin/signup") return;

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            // Verify role
            const { data: profile, error: profileError } = await (supabase
                .from("profiles") as any)
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (profileError || profile?.role !== "admin") {
                console.warn("AdminLayout: Unauthorized access attempt", { profile, profileError });
                await supabase.auth.signOut();
                router.push("/admin/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    // Hide admin layout for login and signup pages
    if (pathname === "/admin/login" || pathname === "/admin/signup") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-foreground flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(true)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0",
                    !sidebarOpen && "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-black tracking-tighter text-white">
                                DJ <span className="text-neon-blue">ENOX</span>
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                        {adminLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-neon-blue text-black"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <link.icon size={18} />
                                    <span>{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-black/50"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section / Bottom */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 flex-shrink-0 bg-zinc-950/50 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={cn("lg:hidden text-gray-400 hover:text-white", sidebarOpen && "hidden")}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest hidden md:block">
                            {adminLinks.find(l => l.href === pathname)?.name || "Management"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-red rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                            <div className="hidden sm:block text-right">
                                <p className="text-xs font-bold text-white leading-tight">DJ Enox</p>
                                <p className="text-[10px] text-gray-500">Administrator</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center font-bold text-xs text-neon-purple">
                                EX
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#050505]">
                    <div className="container mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
