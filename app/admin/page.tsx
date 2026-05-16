"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Music,
    Users,
    Image as ImageIcon,
    Plus,
    ArrowUpRight,
    Clock,
    ArrowRight,
    Settings,
    TrendingUp,
    Loader2,
    Disc3,
    MapPin,
    Mail
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalEvents: number;
    activeMixes: number;
    totalBookings: number;
    portfolioItems: number;
}

interface RecentItem {
    id: string;
    type: "event" | "mixtape" | "portfolio" | "booking";
    title: string;
    subtitle: string;
    time: string;
    status: string;
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminOverview() {
    const [stats, setStats] = useState<DashboardStats>({
        totalEvents: 0,
        activeMixes: 0,
        totalBookings: 0,
        portfolioItems: 0,
    });
    const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [upcomingEvent, setUpcomingEvent] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch counts in parallel
                const [eventsRes, mixtapesRes, bookingsRes, portfolioRes] = await Promise.all([
                    (supabase.from("events") as any).select("id", { count: "exact", head: true }),
                    (supabase.from("mixtapes") as any).select("id", { count: "exact", head: true }),
                    (supabase.from("bookings") as any).select("id", { count: "exact", head: true }),
                    (supabase.from("portfolio") as any).select("id", { count: "exact", head: true }),
                ]);

                setStats({
                    totalEvents: eventsRes.count || 0,
                    activeMixes: mixtapesRes.count || 0,
                    totalBookings: bookingsRes.count || 0,
                    portfolioItems: portfolioRes.count || 0,
                });

                // Fetch recent items from each table
                const [recentEvents, recentMixes, recentPortfolio, recentBookings] = await Promise.all([
                    (supabase.from("events") as any)
                        .select("id, name, location, created_at, status")
                        .order("created_at", { ascending: false })
                        .limit(3),
                    (supabase.from("mixtapes") as any)
                        .select("id, title, category, created_at, status")
                        .order("created_at", { ascending: false })
                        .limit(3),
                    (supabase.from("portfolio") as any)
                        .select("id, title, venue, created_at")
                        .order("created_at", { ascending: false })
                        .limit(3),
                    (supabase.from("bookings") as any)
                        .select("id, name, event_type, created_at, status")
                        .order("created_at", { ascending: false })
                        .limit(3),
                ]);

                // Combine & sort all recent items
                const combined: RecentItem[] = [];

                (recentEvents.data || []).forEach((e: any) => {
                    combined.push({
                        id: e.id,
                        type: "event",
                        title: e.name,
                        subtitle: e.location || "No location",
                        time: e.created_at,
                        status: e.status || "active",
                    });
                });

                (recentMixes.data || []).forEach((m: any) => {
                    combined.push({
                        id: m.id,
                        type: "mixtape",
                        title: m.title,
                        subtitle: m.category || "Uncategorized",
                        time: m.created_at,
                        status: m.status || "Public",
                    });
                });

                (recentPortfolio.data || []).forEach((p: any) => {
                    combined.push({
                        id: p.id,
                        type: "portfolio",
                        title: p.title,
                        subtitle: p.venue || "No venue",
                        time: p.created_at,
                        status: "published",
                    });
                });

                (recentBookings.data || []).forEach((b: any) => {
                    combined.push({
                        id: b.id,
                        type: "booking",
                        title: b.name,
                        subtitle: b.event_type || "General inquiry",
                        time: b.created_at,
                        status: b.status || "pending",
                    });
                });

                combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                setRecentActivity(combined.slice(0, 8));

                // Fetch next upcoming event
                const { data: nextEvent } = await (supabase.from("events") as any)
                    .select("*")
                    .gte("date", new Date().toISOString().split("T")[0])
                    .order("date", { ascending: true })
                    .limit(1)
                    .single();

                if (nextEvent) setUpcomingEvent(nextEvent);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-neon-blue", bg: "bg-neon-blue/10", href: "/admin/events" },
        { label: "Active Mixes", value: stats.activeMixes, icon: Music, color: "text-neon-purple", bg: "bg-neon-purple/10", href: "/admin/mixtapes" },
        { label: "Inquiries", value: stats.totalBookings, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10", href: "/admin/bookings" },
        { label: "Portfolio", value: stats.portfolioItems, icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/admin/portfolio" },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "event": return Calendar;
            case "mixtape": return Disc3;
            case "portfolio": return ImageIcon;
            case "booking": return Mail;
            default: return Clock;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "event": return "text-neon-blue bg-neon-blue/10";
            case "mixtape": return "text-neon-purple bg-neon-purple/10";
            case "portfolio": return "text-emerald-500 bg-emerald-500/10";
            case "booking": return "text-amber-500 bg-amber-500/10";
            default: return "text-gray-500 bg-white/5";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
            case "confirmed":
            case "published":
            case "public":
            case "active":
            case "success": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
            case "cancelled":
            case "rejected": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
            default: return "bg-neon-blue shadow-[0_0_8px_rgba(0,242,255,0.5)]";
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "event": return "Event";
            case "mixtape": return "Mixtape";
            case "portfolio": return "Portfolio";
            case "booking": return "Booking";
            default: return type;
        }
    };

    const getTypeLink = (type: string) => {
        switch (type) {
            case "event": return "/admin/events";
            case "mixtape": return "/admin/mixtapes";
            case "portfolio": return "/admin/portfolio";
            case "booking": return "/admin/bookings";
            default: return "/admin";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
                    <p className="text-gray-500 text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white">DASHBOARD OVERVIEW</h1>
                    <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening across your platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/events"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all"
                    >
                        <Plus size={16} /> New Event
                    </Link>
                    <Link
                        href="/admin/mixtapes"
                        className="bg-neon-blue hover:bg-neon-blue/80 px-4 py-2 rounded-xl text-sm font-bold text-black flex items-center gap-2 transition-all"
                    >
                        <Plus size={16} /> Upload Mix
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Link key={stat.label} href={stat.href}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-zinc-950 p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <ArrowUpRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Clock size={18} className="text-neon-purple" /> RECENT ACTIVITY
                            </h3>
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                {recentActivity.length} items
                            </span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {recentActivity.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Clock size={32} className="text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm font-medium">No activity yet</p>
                                    <p className="text-gray-700 text-xs mt-1">Start adding events, mixtapes, or portfolio items.</p>
                                </div>
                            ) : (
                                recentActivity.map((activity) => {
                                    const Icon = getTypeIcon(activity.type);
                                    const colorClass = getTypeColor(activity.type);
                                    const [iconColor, iconBg] = colorClass.split(" ");

                                    return (
                                        <Link key={`${activity.type}-${activity.id}`} href={getTypeLink(activity.type)}>
                                            <div className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
                                                        <Icon className={iconColor} size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                                                {activity.title}
                                                            </h4>
                                                            <span className="text-[9px] font-bold text-gray-600 bg-white/5 px-1.5 py-0.5 rounded uppercase">
                                                                {getTypeLabel(activity.type)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">{activity.subtitle}</p>
                                                            <span className="text-gray-800">•</span>
                                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest">{timeAgo(activity.time)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(activity.status))} />
                                                    <ArrowUpRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Next Upcoming Event Card */}
                    {upcomingEvent ? (
                        <div className="bg-neon-blue/5 border border-neon-blue/20 p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                <Calendar size={100} className="text-neon-blue" />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                                <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">Next Event</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{upcomingEvent.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                <Calendar size={14} />
                                {new Date(upcomingEvent.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            {upcomingEvent.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <MapPin size={14} />
                                    {upcomingEvent.location}
                                </div>
                            )}
                            <Link href="/admin/events" className="text-xs font-bold text-neon-blue uppercase tracking-[0.2em] flex items-center gap-2">
                                Manage Events <ArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-neon-blue/5 border border-neon-blue/20 p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                <Calendar size={100} className="text-neon-blue" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4">No Upcoming Events</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                You don&apos;t have any upcoming events scheduled. Create one to get started!
                            </p>
                            <Link href="/admin/events" className="text-xs font-bold text-neon-blue uppercase tracking-[0.2em] flex items-center gap-2">
                                Add Event <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}

                    {/* Quick Link */}
                    <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Link</h3>
                        <p className="text-sm text-gray-500 mb-6">Need to update your professional bio or social links?</p>
                        <Link
                            href="/admin/settings"
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <Settings size={14} /> Account Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
