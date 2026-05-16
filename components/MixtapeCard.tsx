"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, MoreVertical, CheckCircle2 } from "lucide-react";

interface MixtapeCardProps {
    id: string;
    title: string;
    thumbnail_url: string;
    duration: string;
    views: number;
    created_at: string;
    slug: string;
    youtubeViews?: number;
}

const MixtapeCard = ({ title, thumbnail_url, duration, views, created_at, slug, youtubeViews }: MixtapeCardProps) => {
    const safeViews = youtubeViews !== undefined ? youtubeViews : (views || 0);
    const formattedViews = safeViews >= 1000000
        ? `${(safeViews / 1000000).toFixed(1)}M`
        : safeViews >= 1000 ? `${(safeViews / 1000).toFixed(1)}K` : safeViews;
    const uploadedAt = created_at ? new Date(created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Just now';
    return (
        <Link href={`/mixtapes/${slug}`} className="group flex flex-col gap-3 animate-fade-in">
            {/* Thumbnail Container */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800/50">
                <Image
                    src={thumbnail_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-200 group-hover:scale-105 group-hover:brightness-95"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-black/90 rounded-full p-4 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                        <Play className="text-white fill-current" size={28} />
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-0.5 rounded text-xs font-semibold text-white tracking-wide">
                    {duration}
                </div>
            </div>

            {/* Info Container */}
            <div className="flex gap-3">
                {/* Channel Avatar */}
                <div className="relative flex-shrink-0 w-9 h-9">
                    <div className="relative w-full h-full rounded-full overflow-hidden border border-neon-blue/50 flex items-center justify-center shadow-lg bg-[#0f0f0f]">
                        <Image
                            src="/assets/logo.png"
                            alt="DJ Enox Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Text Metadata */}
                <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                            {title}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5"
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>

                    <div className="mt-1.5 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 font-medium hover:text-gray-300 transition-colors">
                                DJ Enox
                            </span>
                            <CheckCircle2 size={12} className="text-gray-400" />
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <span>{formattedViews} views</span>
                            <span className="mx-1.5">•</span>
                            <span>{uploadedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MixtapeCard;
