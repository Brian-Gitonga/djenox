"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MapPin,
    Calendar,
    Users,
    ImageIcon,
    Edit2,
    Trash2,
    Search,
    Grid,
    List as ListIcon,
    Tag,
    X,
    Star,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import ImageUpload from "@/components/admin/ImageUpload";

type PortfolioItem = Database['public']['Tables']['portfolio']['Row'];

export default function AdminPortfolio() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        venue: "",
        location: "",
        year: new Date().getFullYear().toString(),
        image_url: "",
        category: "Festival",
        crowd_size: "",
        description: "",
        is_highlight: false,
    });

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPortfolio = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('portfolio')
                .select('*')
                .order('year', { ascending: false });
            if (error) throw error;
            if (data) setPortfolioList(data);
        } catch (error: any) {
            console.error("Error fetching portfolio:", error);
            showToast('error', "Failed to load portfolio items.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const handleOpenModal = (item: PortfolioItem | null = null) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                title: item.title || "",
                venue: item.venue || "",
                location: item.location || "",
                year: item.year?.toString() || new Date().getFullYear().toString(),
                image_url: item.image_url || "",
                category: item.category || "Festival",
                crowd_size: item.crowd_size || "",
                description: item.description || "",
                is_highlight: item.is_highlight || false,
            });
        } else {
            setCurrentItem(null);
            setFormData({
                title: "",
                venue: "",
                location: "",
                year: new Date().getFullYear().toString(),
                image_url: "",
                category: "Festival",
                crowd_size: "",
                description: "",
                is_highlight: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isSaving) return;
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                title: formData.title,
                venue: formData.venue,
                location: formData.location,
                year: parseInt(formData.year) || new Date().getFullYear(),
                image_url: formData.image_url,
                category: formData.category,
                crowd_size: formData.crowd_size,
                description: formData.description,
                is_highlight: formData.is_highlight,
                updated_at: new Date().toISOString()
            };

            if (currentItem) {
                const { error } = await (supabase.from('portfolio') as any)
                    .update(payload)
                    .eq('id', currentItem.id);
                if (error) throw error;
                showToast('success', "Portfolio item updated successfully!");
            } else {
                const { error } = await (supabase.from('portfolio') as any)
                    .insert([payload]);
                if (error) throw error;
                showToast('success', "Portfolio item created successfully!");
            }
            fetchPortfolio();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving portfolio item:", error);
            showToast('error', error.message || "Failed to save portfolio item.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this portfolio item?")) {
            try {
                const { error } = await supabase.from('portfolio').delete().eq('id', id);
                if (error) throw error;
                showToast('success', "Portfolio item deleted.");
                fetchPortfolio();
            } catch (error: any) {
                console.error("Error deleting item:", error);
                showToast('error', "Failed to delete item.");
            }
        }
    };

    const filteredItems = portfolioList.filter(it =>
        it.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (it.venue && it.venue.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (it.location && it.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">PORTFOLIO MANAGEMENT</h1>
                    <p className="text-gray-500 text-sm mt-1">Showcase your best performances and venue residencies.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    disabled={isSaving}
                    className="bg-neon-purple hover:bg-neon-purple/80 px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(188,19,254,0.2)] disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Plus size={18} />
                    )}
                    Add Performance
                </button>
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

            {/* Controls */}
            <div className="flex flex-col md:row justify-between gap-4 bg-zinc-950 p-4 rounded-2xl border border-white/5">
                <div className="flex-grow relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search venue, city or event..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn("p-2 rounded-md transition-all", viewMode === "grid" ? "bg-neon-purple text-white shadow-[0_0_10px_rgba(188,19,254,0.3)]" : "text-gray-500 hover:text-white")}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn("p-2 rounded-md transition-all", viewMode === "list" ? "bg-neon-purple text-white shadow-[0_0_10px_rgba(188,19,254,0.3)]" : "text-gray-500 hover:text-white")}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                    <button className="bg-white/5 border border-white/5 px-4 py-2 rounded-lg text-sm text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                        Filters
                    </button>
                </div>
            </div>

            {/* Grid Display */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={item.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="px-3 py-1 bg-neon-purple/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                                        {item.category}
                                    </div>
                                    {item.is_highlight && (
                                        <div className="p-1 bg-amber-500 rounded-full shadow-lg">
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white flex items-center gap-2 group-hover:text-neon-purple transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium truncate">{item.venue}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest truncate">
                                        <MapPin size={14} className="text-neon-blue" /> {item.location?.split(',')[0]}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest truncate">
                                        <Users size={14} className="text-neon-purple" /> {item.crowd_size}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add New Empty Slot */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="aspect-[4/3] md:aspect-auto h-full min-h-[300px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-gray-600 hover:border-neon-purple/30 hover:text-neon-purple transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full border border-gray-600 group-hover:border-neon-purple flex items-center justify-center transition-all">
                            <Plus size={24} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">Add Performance</p>
                    </button>
                </div>
            )}

            {/* Modal */}
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
                                    {currentItem ? "EDIT PERFORMANCE" : "ADD PERFORMANCE"}
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
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Event Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                        placeholder="e.g. Tomorrowland Mainstage"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Venue</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                            placeholder="e.g. Hï Ibiza"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                            placeholder="e.g. Ibiza, Spain"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Year</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                            placeholder="2025"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none"
                                        >
                                            <option value="Festival">Festival</option>
                                            <option value="Club">Club</option>
                                            <option value="Private">Private</option>
                                            <option value="Corporate">Corporate</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Crowd Size</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.crowd_size}
                                            onChange={(e) => setFormData({ ...formData, crowd_size: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                            placeholder="50,000+"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 py-4 border-y border-white/5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block text-center">Portfolio Image</label>
                                    <ImageUpload
                                        value={formData.image_url}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        onRemove={() => setFormData({ ...formData, image_url: "" })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors text-sm h-24 resize-none"
                                        placeholder="Brief details about the performance..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="is_highlight"
                                        checked={formData.is_highlight}
                                        onChange={(e) => setFormData({ ...formData, is_highlight: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/10 bg-black/40 text-neon-purple focus:ring-neon-purple"
                                    />
                                    <label htmlFor="is_highlight" className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                        Highlight on Landing Page
                                    </label>
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
                                        className="flex-grow bg-neon-purple hover:bg-neon-purple/80 py-3.5 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(188,19,254,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {currentItem ? "SAVE CHANGES" : "ADD PERFORMANCE"}
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
