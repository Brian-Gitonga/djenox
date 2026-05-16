"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Play,
    Headphones,
    BarChart2,
    Calendar,
    CloudUpload,
    Link as LinkIcon,
    X,
    Star,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import ImageUpload from "@/components/admin/ImageUpload";

type Mixtape = Database['public']['Tables']['mixtapes']['Row'];

const categories = ["All", "Afrobeat", "Amapiano", "Hip-Hop", "Dancehall", "R&B", "Live Mix", "Trending", "Newest"];

export default function AdminMixtapes() {
    const [mixtapesList, setMixtapesList] = useState<Mixtape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMixtape, setCurrentMixtape] = useState<Mixtape | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        thumbnail_url: "",
        duration: "",
        status: "Draft",
        is_featured: false,
        category: "Afrobeat",
        description: "",
        video_url: "",
        audio_download_url: "",
        video_download_url: "",
    });

    const fetchMixtapes = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('mixtapes')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setMixtapesList(data);
        } catch (error) {
            console.error("Error fetching mixtapes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMixtapes();
    }, []);

    const handleOpenModal = (mixtape: Mixtape | null = null) => {
        if (mixtape) {
            setCurrentMixtape(mixtape);
            setFormData({
                title: mixtape.title,
                slug: mixtape.slug,
                thumbnail_url: mixtape.thumbnail_url || "",
                duration: mixtape.duration || "",
                status: mixtape.status || "Draft",
                is_featured: mixtape.is_featured || false,
                category: mixtape.category || "Afrobeat",
                description: mixtape.description || "",
                video_url: mixtape.video_url || "",
                audio_download_url: mixtape.audio_download_url || "",
                video_download_url: mixtape.video_download_url || "",
            });
        } else {
            setCurrentMixtape(null);
            setFormData({
                title: "",
                slug: "",
                thumbnail_url: "",
                duration: "",
                status: "Draft",
                is_featured: false,
                category: "Afrobeat",
                description: "",
                video_url: "",
                audio_download_url: "",
                video_download_url: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMixtape(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const payload = {
            title: formData.title,
            slug: slug,
            description: formData.description || null,
            thumbnail_url: formData.thumbnail_url || null,
            video_url: formData.video_url || null,
            audio_download_url: formData.audio_download_url || null,
            video_download_url: formData.video_download_url || null,
            duration: formData.duration || null,
            category: formData.category || null,
            status: formData.status || 'Draft',
            is_featured: formData.is_featured,
        };

        try {
            if (currentMixtape) {
                const { error } = await (supabase.from('mixtapes') as any)
                    .update({
                        ...payload,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentMixtape.id);
                if (error) throw error;
                showMessage('success', `"${formData.title}" updated successfully!`);
            } else {
                const { error } = await (supabase.from('mixtapes') as any)
                    .insert([payload]);
                if (error) throw error;
                showMessage('success', `"${formData.title}" created successfully!`);
            }
            fetchMixtapes();
            handleCloseModal();
        } catch (error: any) {
            console.error('Mixtape save error:', error?.message || error);
            showMessage('error', `Error: ${error?.message || 'Failed to save mixtape'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this mixtape?")) {
            try {
                const { error } = await supabase.from('mixtapes').delete().eq('id', id);
                if (error) throw error;
                showMessage('success', 'Mixtape deleted successfully.');
                fetchMixtapes();
            } catch (error) {
                showMessage('error', 'Error deleting mixtape.');
            }
        }
    };

    const filteredMixtapes = mixtapesList.filter(mx =>
        mx.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex flex-col md:row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">MIXTAPES MANAGEMENT</h1>
                    <p className="text-gray-500 text-sm mt-1">Upload, edit, and analyze your music performances.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-neon-blue hover:bg-neon-blue/80 px-6 py-3 rounded-xl text-sm font-bold text-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                >
                    <CloudUpload size={18} /> Upload New Mix
                </button>
            </div>

            {/* Stats Quick Look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                        <Headphones size={24} />
                    </div>
                    <div>
                        <p className="text-xl font-black text-white">495K</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Listens</p>
                    </div>
                </div>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <p className="text-xl font-black text-white">12.5%</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Engagement Rate</p>
                    </div>
                </div>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-red/10 flex items-center justify-center text-neon-red">
                        <Play size={24} />
                    </div>
                    <div>
                        <p className="text-xl font-black text-white">{mixtapesList.filter(m => m.status === "Public").length}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Published Mixes</p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredMixtapes.map((mix) => (
                        <motion.div
                            key={mix.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all flex h-40"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-48 h-full flex-shrink-0 bg-zinc-900 overflow-hidden">
                                <Image
                                    src={mix.thumbnail_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"}
                                    alt={mix.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950 opacity-60 group-hover:opacity-20 transition-opacity" />
                                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-widest">
                                    {mix.duration}
                                </div>
                                {mix.is_featured && (
                                    <div className="absolute top-2 left-2 bg-neon-purple text-white p-1 rounded-full shadow-lg">
                                        <Star size={10} fill="currentColor" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-grow p-6 flex flex-col justify-between min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white group-hover:text-neon-blue transition-colors truncate text-sm">
                                            {mix.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full border",
                                                mix.status === "Public" ? "border-neon-blue/30 text-neon-blue bg-neon-blue/5" : "border-gray-700 text-gray-600 bg-gray-800/10"
                                            )}>
                                                {mix.status}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={10} /> {new Date(mix.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-gray-600 hover:text-white transition-colors flex-shrink-0">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs font-black text-gray-300">{mix.views || 0}</p>
                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Views</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                                                <div className="w-2/3 h-full bg-neon-purple/50" />
                                            </div>
                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Engagement</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(mix)}
                                            className="p-2 bg-white/5 hover:bg-neon-blue/10 hover:text-neon-blue border border-white/5 rounded-lg text-gray-500 transition-all"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(mix.id)}
                                            className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/5 rounded-lg text-gray-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload/Edit Modal */}
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
                                    {currentMixtape ? "EDIT MIXTAPE" : "UPLOAD NEW MIX"}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mixtape Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Slug (URL)</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                            placeholder="auto-generated if empty"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 py-4 border-y border-white/5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block text-center">Thumbnail Image</label>
                                    <ImageUpload
                                        value={formData.thumbnail_url}
                                        onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                                        onRemove={() => setFormData({ ...formData, thumbnail_url: "" })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video URL (YouTube)</label>
                                    <input
                                        type="text"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Audio Download Link</label>
                                        <input
                                            type="text"
                                            value={formData.audio_download_url}
                                            onChange={(e) => setFormData({ ...formData, audio_download_url: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                            placeholder="Direct link to MP3"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Download Link</label>
                                        <input
                                            type="text"
                                            value={formData.video_download_url}
                                            onChange={(e) => setFormData({ ...formData, video_download_url: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                            placeholder="Direct link to MP4"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none text-sm"
                                        >
                                            {categories.filter(c => c !== "All").map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm h-24 resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-6 py-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-4 h-4 rounded border-white/10 bg-black/40 text-neon-blue focus:ring-neon-blue"
                                        />
                                        <label htmlFor="is_featured" className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                            Feature on Landing Page
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status:</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-grow bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-white uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-grow bg-neon-blue hover:bg-neon-blue/80 py-3 rounded-xl font-bold text-black uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50"
                                    >
                                        {isSaving ? "SAVING..." : currentMixtape ? "SAVE CHANGES" : "UPLOAD MIX"}
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
