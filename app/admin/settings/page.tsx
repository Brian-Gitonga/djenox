"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Globe,
    Instagram,
    Twitter,
    Youtube,
    Save,
    Camera,
    Shield,
    Bell,
    CheckCircle2,
    RefreshCw,
    BarChart3,
    AlertCircle,
    Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/admin/ImageUpload";

interface SiteSetting {
    key: string;
    value: any;
    description: string;
}

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState<"profile" | "website">("profile");
    const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*');

            if (error) throw error;

            const settingsMap: Record<string, SiteSetting> = {};
            (data as any[] | null)?.forEach(s => {
                settingsMap[s.key] = s;
            });

            // Initialize defaults if missing
            if (!settingsMap['profile_info']) {
                settingsMap['profile_info'] = { key: 'profile_info', value: { name: "DJ Enox", title: "International DJ & Producer", bio: "International DJ based in Limuru, Kiambu...", avatar_url: "" }, description: "Profile details" };
            }
            if (!settingsMap['social_links']) {
                settingsMap['social_links'] = { key: 'social_links', value: { instagram: "", twitter: "", youtube: "", soundcloud: "" }, description: "Social media links" };
            }
            if (!settingsMap['stats']) {
                settingsMap['stats'] = { key: 'stats', value: { total_plays: "100k+", venues_played: "50+", global_events: "12", years_experience: "5" }, description: "Website statistics" };
            }

            setSettings(settingsMap);
        } catch (error: any) {
            console.error("Error fetching settings:", error);
            showMessage('error', "Failed to load settings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleValueChange = (settingKey: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [settingKey]: {
                ...prev[settingKey],
                value: { ...prev[settingKey].value, [field]: value }
            }
        }));
    };

    const handleSaveSetting = async (key: string) => {
        const setting = settings[key];
        if (!setting) return;

        setIsSaving(true);
        try {
            const { error } = await (supabase
                .from('site_settings') as any)
                .upsert({
                    key: setting.key,
                    value: setting.value,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            showMessage('success', `Setting "${key.replace('_', ' ')}" updated!`);
        } catch (error: any) {
            console.error("Error saving setting:", error);
            showMessage('error', "Failed to save setting.");
        } finally {
            setIsSaving(false);
        }
    };

    const profileInfo = settings['profile_info']?.value;
    const socialLinks = settings['social_links']?.value;
    const stats = settings['stats']?.value;

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">SETTINGS</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account profile and website preferences.</p>
                </div>
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                                "px-4 py-2 rounded-xl flex items-center gap-2 border text-xs font-bold",
                                message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                            )}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "w-full flex items-center gap-3 px-6 py-4 text-sm transition-all text-left border-l-2",
                                activeTab === "profile"
                                    ? "font-bold text-white bg-white/5 border-neon-blue"
                                    : "font-medium text-gray-500 hover:bg-white/[0.02] hover:text-gray-300 border-transparent"
                            )}
                        >
                            <User size={18} /> Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab("website")}
                            className={cn(
                                "w-full flex items-center gap-3 px-6 py-4 text-sm transition-all text-left border-l-2",
                                activeTab === "website"
                                    ? "font-bold text-white bg-white/5 border-neon-blue"
                                    : "font-medium text-gray-500 hover:bg-white/[0.02] hover:text-gray-300 border-transparent"
                            )}
                        >
                            <Globe size={18} /> Website Configuration
                        </button>
                    </div>

                    <div className="bg-neon-purple/5 border border-neon-purple/20 p-6 rounded-2xl">
                        <h4 className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-2">Supabase Sync</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Changes are persisted to the <code className="text-neon-purple">site_settings</code> table. Update stats to affect the landing page metrics.
                        </p>
                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="lg:col-span-2 space-y-8">
                    {isLoading ? (
                        <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-neon-blue" size={32} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching configuration...</p>
                        </div>
                    ) : activeTab === "profile" ? (
                        <>
                            {/* Profile Card */}
                            <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 p-8 md:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold text-white">Public Profile</h3>
                                    <button
                                        onClick={() => handleSaveSetting('profile_info')}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-neon-blue hover:bg-neon-blue/80 px-6 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} /> {isSaving ? "Saving..." : "Save Bio"}
                                    </button>
                                </div>
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="flex-shrink-0">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-4">Profile Avatar</label>
                                        <ImageUpload
                                            value={profileInfo.avatar_url}
                                            onChange={(url) => handleValueChange('profile_info', 'avatar_url', url)}
                                            onRemove={() => handleValueChange('profile_info', 'avatar_url', '')}
                                        />
                                    </div>

                                    <div className="flex-grow space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Artist Name</label>
                                                <input
                                                    value={profileInfo.name}
                                                    onChange={(e) => handleValueChange('profile_info', 'name', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Professional Title</label>
                                                <input
                                                    value={profileInfo.title}
                                                    onChange={(e) => handleValueChange('profile_info', 'title', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Public Biography</label>
                                            <textarea
                                                rows={4}
                                                value={profileInfo.bio}
                                                onChange={(e) => handleValueChange('profile_info', 'bio', e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Card */}
                            <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 p-8 md:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold text-white">Social Connectivity</h3>
                                    <button
                                        onClick={() => handleSaveSetting('social_links')}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-neon-purple hover:bg-neon-purple/80 px-6 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} /> {isSaving ? "Saving..." : "Save Links"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
                                            <Instagram size={20} />
                                        </div>
                                        <input
                                            placeholder="Instagram URL"
                                            value={socialLinks.instagram}
                                            onChange={(e) => handleValueChange('social_links', 'instagram', e.target.value)}
                                            className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400 border border-blue-400/20">
                                            <Twitter size={20} />
                                        </div>
                                        <input
                                            placeholder="Twitter URL"
                                            value={socialLinks.twitter}
                                            onChange={(e) => handleValueChange('social_links', 'twitter', e.target.value)}
                                            className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                            <Youtube size={20} />
                                        </div>
                                        <input
                                            placeholder="YouTube URL"
                                            value={socialLinks.youtube}
                                            onChange={(e) => handleValueChange('social_links', 'youtube', e.target.value)}
                                            className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                            <RefreshCw size={20} />
                                        </div>
                                        <input
                                            placeholder="SoundCloud URL"
                                            value={socialLinks.soundcloud}
                                            onChange={(e) => handleValueChange('social_links', 'soundcloud', e.target.value)}
                                            className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 p-8 md:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-neon-purple/20 rounded-lg text-neon-purple">
                                            <BarChart3 size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Landing Page Statistics</h3>
                                    </div>
                                    <button
                                        onClick={() => handleSaveSetting('stats')}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-neon-purple hover:bg-neon-purple/80 px-6 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} /> {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Plays</label>
                                        <input
                                            type="text"
                                            value={stats.total_plays}
                                            onChange={(e) => handleValueChange('stats', 'total_plays', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Venues Played</label>
                                        <input
                                            type="text"
                                            value={stats.venues_played}
                                            onChange={(e) => handleValueChange('stats', 'venues_played', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Events</label>
                                        <input
                                            type="text"
                                            value={stats.global_events}
                                            onChange={(e) => handleValueChange('stats', 'global_events', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Years Experience</label>
                                        <input
                                            type="text"
                                            value={stats.years_experience}
                                            onChange={(e) => handleValueChange('stats', 'years_experience', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-950/50 border border-white/5 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600 mb-4">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">SEO & Branding</h3>
                                <p className="text-gray-500 text-sm max-w-xs">Meta tags, site title, and Favicon management will be available in the next release.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
