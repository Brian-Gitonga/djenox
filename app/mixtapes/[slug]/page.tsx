"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Play, Pause, SkipForward, SkipBack,
    ThumbsUp, ThumbsDown, Share2, Download, MessageSquare,
    List, MoreHorizontal, UserPlus, Bell, CheckCircle2,
    AlertCircle, Loader2, X, Copy, ExternalLink, Music, Video,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Mixtape = Database['public']['Tables']['mixtapes']['Row'];

// ——— Share Dropdown Component ———
const ShareDropdown = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = pageUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const socials = [
        {
            name: "Copy Link",
            icon: <Copy size={18} />,
            action: handleCopy,
            highlight: copied,
        },
        {
            name: "WhatsApp",
            icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            name: "X (Twitter)",
            icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: "Facebook",
            icon: (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
    ];

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-56 bg-[#282828] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="p-2">
                <p className="text-xs text-gray-400 px-3 pt-2 pb-1 font-medium uppercase tracking-wider">Share to</p>
                {socials.map((social) => {
                    const content = (
                        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                            <span className="text-gray-300">{social.icon}</span>
                            <span>{social.highlight ? "Copied!" : social.name}</span>
                        </div>
                    );
                    if (social.action) {
                        return (
                            <button key={social.name} onClick={social.action} className="w-full text-left">
                                {content}
                            </button>
                        );
                    }
                    return (
                        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                            {content}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

// ——— Download Modal Component ———
const DownloadModal = ({
    isOpen,
    onClose,
    videoUrl,
    audioDownloadUrl,
    videoDownloadUrl,
    title,
}: {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string | null;
    audioDownloadUrl: string | null;
    videoDownloadUrl: string | null;
    title: string;
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sources = [
        {
            icon: <ExternalLink size={22} className="text-red-400" />,
            label: "Watch on YouTube",
            description: "Open the original video on YouTube",
            href: videoUrl || "#",
            color: "from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40",
        },
        {
            icon: <Music size={22} className="text-green-400" />,
            label: "Download Audio (MP3)",
            description: audioDownloadUrl ? "Direct high-quality audio download" : "Convert & download as audio file",
            href: audioDownloadUrl || (videoUrl ? `https://www.y2mate.com/youtube/${videoUrl.split("v=")[1]?.split("&")[0] || ""}` : "#"),
            color: "from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40",
        },
        {
            icon: <Video size={22} className="text-blue-400" />,
            label: "Download Video (MP4)",
            description: videoDownloadUrl ? "Direct high-quality video download" : "Convert & download as video file",
            href: videoDownloadUrl || (videoUrl ? `https://www.y2mate.com/youtube/${videoUrl.split("v=")[1]?.split("&")[0] || ""}` : "#"),
            color: "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Download Sources</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Sources */}
                <div className="p-5 space-y-3">
                    {sources.map((source) => (
                        <a
                            key={source.label}
                            href={source.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r transition-all duration-200",
                                source.color
                            )}
                        >
                            <div className="flex-shrink-0 p-2 bg-white/5 rounded-lg">
                                {source.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{source.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{source.description}</p>
                            </div>
                            <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
                        </a>
                    ))}
                </div>

                {/* Footer note */}
                <div className="px-5 pb-5">
                    <p className="text-[10px] text-gray-500 leading-relaxed text-center">
                        Downloads are processed through third-party services. We do not host any files.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ——— View Count Formatter ———
const formatViewCount = (count: number): string => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
};

// ——— Main Page ———
const MixtapePlayerPage = () => {
    const { slug } = useParams();
    const router = useRouter();
    const [mixtape, setMixtape] = useState<Mixtape | null>(null);
    const [suggestedMixtapes, setSuggestedMixtapes] = useState<Mixtape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Feature states
    const [shareOpen, setShareOpen] = useState(false);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [youtubeViews, setYoutubeViews] = useState<number | null>(null);
    const [youtubeLikes, setYoutubeLikes] = useState<number | null>(null);
    const [viewsLoading, setViewsLoading] = useState(false);
    const [sidebarViews, setSidebarViews] = useState<Record<string, number>>({});

    // Helper to extract YouTube ID
    const getYouTubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);

            try {
                // 1. Fetch current mixtape
                const { data: currentData, error: currentError } = await (supabase
                    .from('mixtapes') as any)
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (currentError) throw currentError;
                if (!currentData) {
                    setError("Mixtape not found.");
                    return;
                }
                setMixtape(currentData);

                // 2. Fetch YouTube views
                const ytId = getYouTubeId(currentData.video_url);
                if (ytId) {
                    setViewsLoading(true);
                    try {
                        const res = await fetch(`/api/youtube-views?videoId=${ytId}`);
                        const data = await res.json();
                        if (data.viewCount > 0) {
                            setYoutubeViews(data.viewCount);
                        }
                        if (data.likeCount > 0) {
                            setYoutubeLikes(data.likeCount);
                        }
                    } catch {
                        // Silently fail — will show Supabase views or 0
                    } finally {
                        setViewsLoading(false);
                    }
                }

                // 3. Fetch suggestions (excluding current)
                const { data: suggestionData } = await (supabase
                    .from('mixtapes') as any)
                    .select('*')
                    .eq('status', 'Public')
                    .neq('slug', slug)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (suggestionData) {
                    setSuggestedMixtapes(suggestionData);

                    // Batch-fetch YouTube views for sidebar suggestions
                    const videoIdMap: Record<string, string> = {};
                    for (const m of suggestionData) {
                        const sYtId = getYouTubeId(m.video_url);
                        if (sYtId) videoIdMap[sYtId] = m.id;
                    }
                    const sidebarYtIds = Object.keys(videoIdMap);
                    if (sidebarYtIds.length > 0) {
                        try {
                            const sRes = await fetch(`/api/youtube-views?videoIds=${sidebarYtIds.join(",")}`);
                            const sResult = await sRes.json();
                            if (sResult.views) {
                                const viewsById: Record<string, number> = {};
                                for (const [sYtId, count] of Object.entries(sResult.views)) {
                                    const mId = videoIdMap[sYtId];
                                    if (mId) viewsById[mId] = count as number;
                                }
                                setSidebarViews(viewsById);
                            }
                        } catch { /* silently fail */ }
                    }
                }

            } catch (err: any) {
                console.error("Error fetching mixtape data:", err);
                setError(err.message || "An error occurred while loading the mixtape.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleSubscribeClick = () => {
        window.open("https://www.youtube.com/@djenox", "_blank", "noopener,noreferrer");
    };

    // Determine the display view and like counts: prefer YouTube API, fallback to Supabase (views only)
    const displayViews = youtubeViews ?? mixtape?.views ?? 0;
    const displayLikes = youtubeLikes ?? 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white p-6">
                <Loader2 className="w-12 h-12 text-neon-blue animate-spin mb-4" />
                <p className="text-gray-400">Loading your mix...</p>
            </div>
        );
    }

    if (error || !mixtape) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-gray-400 mb-6">{error || "Something went wrong."}</p>
                <Link
                    href="/mixtapes"
                    className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                    Back to Mixtapes
                </Link>
            </div>
        );
    }

    const videoId = getYouTubeId(mixtape.video_url);
    const uploadedAt = new Date(mixtape.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-16">
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col xl:flex-row gap-6 px-6 py-6">

                    {/* Main Video Section */}
                    <div className="flex-1 xl:max-w-[1280px]">
                        {/* Video Player */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                            {videoId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                    title={mixtape.title}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <Image
                                        src={mixtape.thumbnail_url || "/assets/placeholder.jpg"}
                                        alt={mixtape.title}
                                        fill
                                        className="object-cover opacity-40 blur-sm"
                                    />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <AlertCircle size={48} className="text-white/50 mb-4" />
                                        <p className="text-white font-medium">Video URL is invalid or missing.</p>
                                        <p className="text-gray-400 text-sm mt-2">Cannot load YouTube player.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info Section */}
                        <div className="mt-3">
                            <h1 className="text-xl font-semibold text-white mb-3">
                                {mixtape.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neon-blue/50 flex-shrink-0 bg-[#0f0f0f]">
                                        <Image
                                            src="/assets/logo.png"
                                            alt="DJ Enox Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <h4 className="text-white font-medium text-sm">DJ Enox</h4>
                                            <CheckCircle2 size={14} className="text-gray-400 flex-shrink-0" />
                                        </div>
                                        <p className="text-xs text-gray-400">Official Channel</p>
                                    </div>
                                    <button
                                        onClick={handleSubscribeClick}
                                        className="ml-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Subscribe
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Like/Dislike */}
                                    <div className="flex items-center bg-white/10 rounded-full overflow-hidden">
                                        <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 transition-colors border-r border-white/10">
                                            <ThumbsUp size={18} className="text-white" />
                                            <span className="text-sm font-medium text-white">{formatViewCount(displayLikes)}</span>
                                        </button>
                                        <button className="px-3 py-2 hover:bg-white/5 transition-colors">
                                            <ThumbsDown size={18} className="text-white" />
                                        </button>
                                    </div>

                                    {/* Share Button */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShareOpen(!shareOpen)}
                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                        >
                                            <Share2 size={18} className="text-white" />
                                            <span className="text-white">Share</span>
                                        </button>
                                        <ShareDropdown
                                            isOpen={shareOpen}
                                            onClose={() => setShareOpen(false)}
                                            title={mixtape.title}
                                        />
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={() => setDownloadOpen(true)}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <Download size={18} className="text-white" />
                                        <span className="text-white">Download</span>
                                    </button>

                                    <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                                        <MoreHorizontal size={18} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Description / Stats */}
                            <div className="mt-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => setShowFullDescription(!showFullDescription)}>
                                <div className="flex items-center gap-3 text-xs font-medium text-white mb-1">
                                    <span className="flex items-center gap-1">
                                        {viewsLoading ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Eye size={12} className="text-gray-400" />
                                        )}
                                        {formatViewCount(displayViews)} views
                                    </span>
                                    <span>{uploadedAt}</span>
                                    <span className="px-2 py-0.5 bg-white/10 rounded uppercase tracking-wider">{mixtape.category}</span>
                                </div>
                                <div className={cn(
                                    "text-sm text-white leading-relaxed whitespace-pre-wrap",
                                    !showFullDescription && "line-clamp-2"
                                )}>
                                    {mixtape.description || "No description provided."}
                                </div>
                                <button className="mt-2 text-sm font-medium text-neon-blue">
                                    {showFullDescription ? "Show less" : "...more"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Suggestions */}
                    <div className="xl:w-[400px] 2xl:w-[450px]">
                        <h3 className="text-white font-semibold mb-4 text-sm px-2">Next for you</h3>
                        <div className="flex flex-col gap-2">
                            {suggestedMixtapes.map((mix) => (
                                <Link
                                    key={mix.id}
                                    href={`/mixtapes/${mix.slug}`}
                                    className="flex gap-2 p-2 rounded-lg transition-colors group hover:bg-white/5"
                                >
                                    <div className="relative w-40 sm:w-44 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                                        <Image
                                            src={mix.thumbnail_url || "/assets/placeholder.jpg"}
                                            alt={mix.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/90 px-1 py-0.5 rounded text-[10px] font-bold text-white">
                                            {mix.duration || "0:00"}
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-white line-clamp-2 leading-tight mb-1 group-hover:text-neon-blue transition-colors">
                                            {mix.title}
                                        </h4>
                                        <div className="text-[10px] text-gray-400 flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1">
                                                <span>DJ Enox</span>
                                                <CheckCircle2 size={10} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <span>{formatViewCount(sidebarViews[mix.id] !== undefined ? sidebarViews[mix.id] : (mix.views || 0))} views</span>
                                                <span className="mx-1">•</span>
                                                <span>{new Date(mix.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {suggestedMixtapes.length === 0 && !isLoading && (
                                <p className="text-gray-500 text-sm italic px-2">No other mixes available yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Download Modal */}
            <DownloadModal
                isOpen={downloadOpen}
                onClose={() => setDownloadOpen(false)}
                videoUrl={mixtape.video_url}
                audioDownloadUrl={mixtape.audio_download_url}
                videoDownloadUrl={mixtape.video_download_url}
                title={mixtape.title}
            />
        </div>
    );
};

export default MixtapePlayerPage;
