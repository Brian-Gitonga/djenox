"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    Calendar,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Clock,
    X,
    ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import ImageUpload from "@/components/admin/ImageUpload";

type Event = Database['public']['Tables']['events']['Row'];

const categories = ["All", "Afrobeat", "Amapiano", "Hip-Hop", "Dancehall", "R&B", "Live Mix", "Trending", "Newest"];

export default function AdminEvents() {
    const [eventsList, setEventsList] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        location: "",
        status: "Upcoming",
        image_url: "",
        ticket_link: "",
        total_tickets: 1000,
        sold_tickets: 0,
    });

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });
            if (data) setEventsList(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpenModal = (event: Event | null = null) => {
        if (event) {
            setCurrentEvent(event);
            setFormData({
                name: event.name,
                date: event.date || "",
                location: event.location || "",
                status: event.status || "Upcoming",
                image_url: event.image_url || "",
                ticket_link: event.ticket_link || "",
                total_tickets: event.total_tickets || 1000,
                sold_tickets: event.sold_tickets || 0,
            });
        } else {
            setCurrentEvent(null);
            setFormData({
                name: "",
                date: "",
                location: "",
                status: "Upcoming",
                image_url: "",
                ticket_link: "",
                total_tickets: 1000,
                sold_tickets: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentEvent) {
                const { error } = await (supabase.from('events') as any)
                    .update({
                        name: formData.name,
                        date: formData.date || null,
                        location: formData.location || null,
                        status: formData.status || null,
                        ticket_link: formData.ticket_link || null,
                        total_tickets: formData.total_tickets,
                        sold_tickets: formData.sold_tickets,
                        image_url: formData.image_url || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentEvent.id);
                if (error) throw error;
                showMessage('success', `"${formData.name}" updated successfully!`);
            } else {
                const { error } = await (supabase.from('events') as any)
                    .insert([{
                        ...formData,
                        date: formData.date || null,
                        location: formData.location || null,
                        image_url: formData.image_url || null,
                        ticket_link: formData.ticket_link || null,
                    }]);
                if (error) throw error;
                showMessage('success', `"${formData.name}" created successfully!`);
            }
            fetchEvents();
            handleCloseModal();
        } catch (error) {
            showMessage('error', 'Error saving event. Please try again.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const { error } = await supabase.from('events').delete().eq('id', id);
                if (error) throw error;
                showMessage('success', 'Event deleted successfully.');
                fetchEvents();
            } catch (error) {
                showMessage('error', 'Error deleting event.');
            }
        }
    };

    const filteredEvents = eventsList.filter(ev =>
        ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ev.location && ev.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            {/* Toast Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl flex items-center gap-2 border text-sm font-bold shadow-2xl",
                            message.type === 'success'
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 backdrop-blur-md"
                                : "bg-red-500/10 border-red-500/20 text-red-400 backdrop-blur-md"
                        )}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">EVENTS MANAGEMENT</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage tour dates, festivals, and club performances.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-neon-blue hover:bg-neon-blue/80 px-6 py-3 rounded-xl text-sm font-bold text-black flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Create Event
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:row gap-4">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search events by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="bg-zinc-950 border border-white/5 px-4 py-3 rounded-xl text-sm text-gray-400 flex items-center gap-2 hover:bg-white/5 transition-colors">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="bg-zinc-950 border border-white/5 px-4 py-3 rounded-xl text-sm text-gray-400 flex items-center gap-2 hover:bg-white/5 transition-colors">
                        Sort: Newest
                    </button>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Event Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date & Location</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Attendance</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-6 font-medium">
                                            <div className="flex items-center gap-4">
                                                {event.image_url ? (
                                                    <img src={event.image_url} alt={event.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon size={18} className="text-gray-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-neon-blue transition-colors">{event.name}</p>
                                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1 truncate max-w-[200px]">{event.ticket_link || "No ticket link"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar size={14} className="text-neon-purple" /> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <MapPin size={12} /> {event.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                                event.status === "Sold Out" ? "bg-red-500/10 border-red-500/30 text-red-500" :
                                                    event.status === "Selling Fast" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                                                        "bg-neon-blue/10 border-neon-blue/30 text-neon-blue"
                                            )}>
                                                {event.status === "Sold Out" ? <AlertCircle size={10} /> :
                                                    event.status === "Selling Fast" ? <Clock size={10} /> :
                                                        <CheckCircle2 size={10} />}
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="w-32 bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        event.status === "Sold Out" ? "bg-red-500" : "bg-neon-blue"
                                                    )}
                                                    style={{ width: `${((event.sold_tickets || 0) / (event.total_tickets || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-bold">{event.sold_tickets}/{event.total_tickets} TICKETS</p>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(event)}
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <a
                                                    href={event.ticket_link || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-500 hover:text-neon-blue hover:bg-neon-blue/5 rounded-lg transition-all"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Info */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing {filteredEvents.length} of {eventsList.length} events</p>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-xl font-bold text-white">
                                    {currentEvent ? "EDIT EVENT" : "CREATE NEW EVENT"}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Event Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        placeholder="e.g. Summer Beach Party"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                            placeholder="e.g. Ibiza, Spain"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 py-4 border-y border-white/5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block text-center">Event Image</label>
                                    <ImageUpload
                                        value={formData.image_url}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        onRemove={() => setFormData({ ...formData, image_url: "" })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ticket Link</label>
                                    <input
                                        type="text"
                                        value={formData.ticket_link}
                                        onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        placeholder="https://tickets.com/..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                                        >
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Selling Fast">Selling Fast</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sold</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.sold_tickets}
                                            onChange={(e) => setFormData({ ...formData, sold_tickets: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.total_tickets}
                                            onChange={(e) => setFormData({ ...formData, total_tickets: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-grow bg-white/5 hover:bg-white/10 py-3.5 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-grow bg-neon-blue hover:bg-neon-blue/80 py-3.5 rounded-xl font-bold text-black uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50"
                                    >
                                        {isSaving ? "SAVING..." : currentEvent ? "SAVE CHANGES" : "CREATE EVENT"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
