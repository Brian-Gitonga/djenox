"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Mail,
    MessageSquare,
    Archive,
    Trash2,
    CheckCircle2,
    Clock,
    User,
    Calendar,
    MapPin,
    ExternalLink,
    MoreVertical,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Booking = Database['public']['Tables']['bookings']['Row'];

export default function AdminBookings() {
    const [bookingsList, setBookingsList] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (data) setBookingsList(data);
        } catch (error: any) {
            console.error("Error fetching bookings:", error);
            showToast('error', "Failed to load inquiries.");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const { error } = await (supabase
                .from('bookings') as any)
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setBookingsList(bookingsList.map(b => b.id === id ? { ...b, status: newStatus } : b));
            if (selectedBooking && selectedBooking.id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
            showToast('success', `Status updated to ${newStatus}`);
        } catch (error: any) {
            console.error("Error updating status:", error);
            showToast('error', "Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            setIsUpdating(true);
            try {
                const { error } = await supabase
                    .from('bookings')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setBookingsList(bookingsList.filter(b => b.id !== id));
                setSelectedBooking(null);
                showToast('success', "Inquiry deleted successfully.");
            } catch (error: any) {
                console.error("Error deleting inquiry:", error);
                showToast('error', "Failed to delete inquiry.");
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const filteredBookings = bookingsList.filter(b => {
        const matchesFilter = activeFilter === "All" || b.status === activeFilter;
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.event_type && b.event_type.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">BOOKINGS & INQUIRIES</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and respond to event booking requests and general messages.</p>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={cn(
                            "fixed top-24 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[300px] border backdrop-blur-md",
                            toast.type === 'success' ? "bg-emerald-500/90 border-emerald-400 text-white" : "bg-red-500/90 border-red-400 text-white"
                        )}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs / Filters */}
            <div className="flex flex-col md:row justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-white/5">
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 overflow-x-auto no-scrollbar">
                    {["All", "New", "Responded", "Archived"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                activeFilter === filter
                                    ? "bg-neon-red text-white shadow-[0_0_15px_rgba(255,0,60,0.3)]"
                                    : "text-gray-500 hover:text-white"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-neon-red transition-colors"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {isLoading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-4 border-neon-red border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Inquiries...</p>
                        </div>
                    ) : filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className="p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Sender Info */}
                                <div className="flex items-start gap-4 flex-grow min-w-0">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border",
                                        booking.status === "New" ? "bg-neon-red/10 border-neon-red/30 text-neon-red" : "bg-white/5 border-white/10 text-gray-500"
                                    )}>
                                        {booking.status === "New" ? <Mail size={24} /> : <MessageSquare size={24} />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-white group-hover:text-neon-red transition-colors truncate">
                                                {booking.name}
                                            </h3>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                                                booking.status === "New" ? "bg-neon-red/20 border-neon-red/40 text-neon-red" :
                                                    booking.status === "Responded" ? "bg-neon-blue/20 border-neon-blue/40 text-neon-blue" :
                                                        "bg-gray-800 border-gray-700 text-gray-500"
                                            )}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{booking.event_type || 'General Inquiry'} • {booking.id.slice(0, 8)}</p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="flex items-center gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest flex-shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-neon-blue">
                                        <MapPin size={14} />
                                        {(booking.location || 'Unknown').split(',')[0]}
                                    </div>
                                    <ChevronRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {!isLoading && filteredBookings.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No inquiries found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBooking(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-neon-red uppercase tracking-[0.3em] mb-1">Inquiry Details</p>
                                    <h2 className="text-xl font-bold text-white">{selectedBooking.id}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all underline decoration-neon-red underline-offset-4"
                                >
                                    CLOSE
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Client Name</p>
                                        <p className="text-white font-bold">{selectedBooking.name}</p>
                                        <p className="text-xs text-neon-blue">{selectedBooking.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Event Type</p>
                                        <p className="text-white font-bold">{selectedBooking.event_type || 'General'}</p>
                                        <p className="text-xs text-gray-400">{selectedBooking.location || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Message</p>
                                    <div className="bg-black/30 p-6 rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed max-h-40 overflow-y-auto">
                                        {selectedBooking.message}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => {
                                            handleStatusUpdate(selectedBooking.id, "Responded");
                                            window.location.href = `mailto:${selectedBooking.email}?subject=RE: ${selectedBooking.event_type || 'Inquiry'}`;
                                        }}
                                        className="flex-grow bg-neon-red hover:bg-neon-red/80 py-3 rounded-xl font-bold text-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isUpdating ? (
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <Mail size={16} />
                                        )}
                                        Reply via Email
                                    </button>
                                    {selectedBooking.status !== "Archived" ? (
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => handleStatusUpdate(selectedBooking.id, "Archived")}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-white transition-colors disabled:opacity-50"
                                        >
                                            <Archive size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => handleStatusUpdate(selectedBooking.id, "New")}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-neon-blue transition-colors disabled:opacity-50"
                                        >
                                            <Clock size={18} />
                                        </button>
                                    )}
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleDelete(selectedBooking.id)}
                                        className="bg-white/5 hover:bg-red-500/10 border border-white/10 px-6 py-3 rounded-xl text-red-500 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

