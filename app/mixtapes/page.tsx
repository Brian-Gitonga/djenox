"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Bell, Video, Grid, List as ListIcon, MoreHorizontal, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import MixtapeCard from "@/components/MixtapeCard";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Mixtape = Database['public']['Tables']['mixtapes']['Row'];

const categories = ["All", "Afrobeat", "Amapiano", "Hip-Hop", "Dancehall", "R&B", "Live Mix", "Trending", "Newest"];

// Helper to extract YouTube ID from URL
const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const MixtapesPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [youtubeViews, setYoutubeViews] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchMixtapes = async () => {
            try {
                const { data, error } = await (supabase
                    .from('mixtapes') as any)
                    .select('*')
                    .eq('status', 'Public')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) {
                    setMixtapes(data);

                    // Batch-fetch YouTube views for all mixtapes
                    const videoIdMap: Record<string, string> = {}; // ytId -> mixtapeId
                    for (const m of data) {
                        const ytId = getYouTubeId(m.video_url);
                        if (ytId) videoIdMap[ytId] = m.id;
                    }

                    const ytIds = Object.keys(videoIdMap);
                    if (ytIds.length > 0) {
                        try {
                            const res = await fetch(`/api/youtube-views?videoIds=${ytIds.join(",")}`);
                            const result = await res.json();
                            if (result.views) {
                                // Map ytId views back to mixtapeId
                                const viewsByMixtapeId: Record<string, number> = {};
                                for (const [ytId, count] of Object.entries(result.views)) {
                                    const mixtapeId = videoIdMap[ytId];
                                    if (mixtapeId) viewsByMixtapeId[mixtapeId] = count as number;
                                }
                                setYoutubeViews(viewsByMixtapeId);
                            }
                        } catch {
                            // Silently fail — cards will show Supabase views
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching mixtapes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMixtapes();
    }, []);

    const filteredMixtapes = mixtapes.filter(m => {
        const matchesCategory = activeCategory === "All" || m.category === activeCategory;
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-16">
            {/* YouTube Style Top Section */}
            <div className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-white/5">
                {/* Search and Actions Bar */}
                <div className="flex items-center justify-between gap-4 px-6 py-3">
                    {/* Left Spacer */}
                    <div className="flex-1 hidden lg:block"></div>

                    {/* Centered Search Bar */}
                    <div className="flex max-w-2xl w-full items-center">
                        <div className="flex flex-grow items-center bg-[#121212] border border-[#303030] rounded-l-full px-5 py-2.5 focus-within:border-[#1c62b9] transition-colors">
                            <input
                                type="text"
                                placeholder="Search mixtapes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                            />
                        </div>
                        <button className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-6 py-2.5 hover:bg-[#2a2a2a] transition-colors flex items-center justify-center">
                            <Search size={20} className="text-white" />
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex-1 flex items-center justify-end gap-4">
                        <button className="hidden lg:flex text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                            <Video size={24} />
                        </button>
                        <button className="hidden lg:flex text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                            <Bell size={24} />
                        </button>
                        <div className="hidden lg:flex relative w-8 h-8 rounded-full overflow-hidden border border-neon-blue/50 items-center justify-center cursor-pointer bg-[#0f0f0f]">
                            <Image
                                src="/assets/logo.png"
                                alt="DJ Enox Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Scrollbar */}
                <div className="relative">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-6 py-3 scroll-smooth">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                    ? "bg-white text-black"
                                    : "bg-white/5 text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-6 py-8 max-w-[1920px]">
                {/* Optional Filter Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <SlidersHorizontal size={18} />
                        <span>Filters</span>
                    </div>
                </div>

                {/* YouTube-style Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-3 animate-pulse">
                                <div className="aspect-video bg-white/5 rounded-xl" />
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-white/5" />
                                    <div className="flex-grow space-y-2">
                                        <div className="h-4 bg-white/5 rounded w-3/4" />
                                        <div className="h-3 bg-white/5 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
                        {filteredMixtapes.map((mixtape) => (
                            <MixtapeCard
                                key={mixtape.id}
                                id={mixtape.id}
                                title={mixtape.title}
                                slug={mixtape.slug}
                                thumbnail_url={mixtape.thumbnail_url || ""}
                                duration={mixtape.duration || "00:00"}
                                views={mixtape.views || 0}
                                created_at={mixtape.created_at}
                                youtubeViews={youtubeViews[mixtape.id]}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && filteredMixtapes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center text-gray-500">
                        <p className="text-lg font-medium mb-2">No mixtapes found.</p>
                        <p className="text-sm max-w-md mx-auto">
                            If you've recently uploaded a mixtape, make sure its status is set to <span className="text-neon-blue font-bold">"Public"</span> in the admin panel.
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
};

export default MixtapesPage;
