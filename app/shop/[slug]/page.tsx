"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Heart,
    Star,
    Download,
    Share2,
    CheckCircle2,
    ChevronRight,
    Play,
    Monitor,
    FileVideo,
    Layers,
    Zap,
    Shield,
    MessageCircle,
} from "lucide-react";

// Same static data for the detail page — in production this will come from DB
const allProducts = [
    {
        id: "1",
        title: "Neon Glow Lower Thirds Pack — 12 Styles",
        slug: "neon-glow-lower-thirds-pack",
        thumbnail_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        category: "Lower Thirds",
        price: 19,
        original_price: 29,
        is_new: true,
        is_free: false,
        rating: 4.8,
        downloads: 2340,
        software: "Premiere Pro",
        description: "A premium collection of 12 unique neon-styled lower third animations. Perfect for YouTube videos, podcasts, interviews, and live streams. Features smooth animations, customizable colors, and easy-to-edit text layers. Compatible with Premiere Pro 2022 and above.",
        features: [
            "12 unique lower third designs",
            "Fully customizable colors & text",
            "4K resolution (3840×2160)",
            "Smooth 60fps animations",
            "No plugins required",
            "Video tutorial included",
        ],
        file_format: ".mogrt",
        file_size: "45 MB",
        resolution: "4K (3840×2160)",
        compatibility: "Premiere Pro 2022+",
    },
    {
        id: "2",
        title: "Urban City Intro — Cinematic Opener",
        slug: "urban-city-intro",
        thumbnail_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=800",
        category: "Intros & Outros",
        price: 24,
        original_price: undefined,
        is_new: true,
        is_free: false,
        rating: 4.6,
        downloads: 1820,
        software: "Premiere Pro",
        description: "A cinematic urban city intro with glitch effects and dynamic typography. Perfect for YouTube channels, vlogs, and creative projects. Features 3D text reveal with light streaks and particle effects.",
        features: [
            "Cinematic 3D text animation",
            "Glitch and distortion effects",
            "4K resolution support",
            "Easy text customization",
            "Modern typography",
            "30-second duration",
        ],
        file_format: ".mogrt",
        file_size: "120 MB",
        resolution: "4K (3840×2160)",
        compatibility: "Premiere Pro 2022+",
    },
    {
        id: "3",
        title: "Social Media Pack — Instagram & TikTok",
        slug: "social-media-pack",
        thumbnail_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
        category: "Social Media",
        price: 15,
        original_price: 25,
        is_new: false,
        is_free: false,
        rating: 4.9,
        downloads: 5670,
        software: "Premiere Pro",
        description: "Complete social media template pack with 25+ animated stories, posts, and reels templates. Designed for Instagram, TikTok, and YouTube Shorts. Trendy designs with modern aesthetics.",
        features: [
            "25+ story & reel templates",
            "Instagram, TikTok, YouTube Shorts",
            "Vertical 9:16 format",
            "Customizable colors & fonts",
            "Drag-and-drop editing",
            "Trendy modern designs",
        ],
        file_format: ".mogrt",
        file_size: "200 MB",
        resolution: "1080×1920 (9:16)",
        compatibility: "Premiere Pro 2021+",
    },
    {
        id: "4",
        title: "Epic Logo Reveal — Particles & Light",
        slug: "epic-logo-reveal",
        thumbnail_url: "https://images.unsplash.com/photo-1614729939124-032d1e6c9945?auto=format&fit=crop&q=80&w=800",
        category: "Logo Reveals",
        price: 0,
        original_price: undefined,
        is_new: false,
        is_free: true,
        rating: 4.7,
        downloads: 12400,
        software: "After Effects",
        description: "A stunning logo reveal animation with particle effects and light rays. Free download — perfect for professional intros and brand presentations. Easy logo replacement with smart layers.",
        features: [
            "Particle & light ray effects",
            "Smart logo replacement",
            "4K resolution",
            "Customizable light colors",
            "10-second duration",
            "Video tutorial included",
        ],
        file_format: ".aep",
        file_size: "85 MB",
        resolution: "4K (3840×2160)",
        compatibility: "After Effects CC 2020+",
    },
    {
        id: "5",
        title: "Glitch Transition Pack — 20+ Effects",
        slug: "glitch-transition-pack",
        thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800",
        category: "Transitions",
        price: 12,
        original_price: 19,
        is_new: true,
        is_free: false,
        rating: 4.5,
        downloads: 3200,
        software: "Premiere Pro",
        description: "20+ professional glitch, zoom, warp, and distortion transitions. Drag and drop onto your timeline for instant cinematic cuts. Perfect for music videos, vlogs, and trailers.",
        features: [
            "20+ transition effects",
            "Glitch, zoom, warp styles",
            "Drag-and-drop workflow",
            "Sound effects included",
            "4K compatible",
            "Works with any footage",
        ],
        file_format: ".mogrt",
        file_size: "60 MB",
        resolution: "4K (3840×2160)",
        compatibility: "Premiere Pro 2021+",
    },
    {
        id: "6",
        title: "Audio Spectrum Music Visualizer",
        slug: "audio-spectrum-visualizer",
        thumbnail_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
        category: "Music Visualizers",
        price: 29,
        original_price: 39,
        is_new: false,
        is_free: false,
        rating: 4.8,
        downloads: 4100,
        software: "After Effects",
        description: "Stunning reactive audio spectrum visualizer with neon gradient colors. Automatically syncs to your audio for dynamic visual output. Perfect for DJ mixes, music channels, and podcast visuals.",
        features: [
            "Audio-reactive animation",
            "Neon gradient color scheme",
            "Customizable equalizer bars",
            "Background customization",
            "4K output resolution",
            "Easy audio linking",
        ],
        file_format: ".aep",
        file_size: "150 MB",
        resolution: "4K (3840×2160)",
        compatibility: "After Effects CC 2020+",
    },
    {
        id: "7",
        title: "Kinetic Lyric Video Template",
        slug: "kinetic-lyric-video-template",
        thumbnail_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
        category: "Lyric Videos",
        price: 22,
        original_price: undefined,
        is_new: true,
        is_free: false,
        rating: 4.4,
        downloads: 890,
        software: "After Effects",
        description: "Create professional lyric videos with kinetic typography animations. Features floating particles, bokeh lights, and smooth text transitions. Perfect for music artists and content creators.",
        features: [
            "Kinetic typography presets",
            "Particle & bokeh effects",
            "Multiple font options",
            "Customizable background",
            "Full HD & 4K support",
            "Detailed tutorial",
        ],
        file_format: ".aep",
        file_size: "95 MB",
        resolution: "4K (3840×2160)",
        compatibility: "After Effects CC 2021+",
    },
    {
        id: "8",
        title: "DJ Night Party Flyer — PSD Template",
        slug: "dj-night-party-flyer",
        thumbnail_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
        category: "Flyers",
        price: 0,
        original_price: undefined,
        is_new: false,
        is_free: true,
        rating: 4.3,
        downloads: 8700,
        software: "Photoshop",
        description: "A bold, eye-catching DJ party flyer template with neon effects and dynamic typography. Free download — easily customize text, colors, and images. Print-ready at 300 DPI.",
        features: [
            "Print-ready 300 DPI",
            "4×6 inch dimensions",
            "Organized PSD layers",
            "Customizable colors",
            "Free commercial use",
            "Font links included",
        ],
        file_format: ".psd",
        file_size: "35 MB",
        resolution: "1200×1800px (300 DPI)",
        compatibility: "Photoshop CS6+",
    },
];

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const product = allProducts.find((p) => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white p-6">
                <Package size={48} className="text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
                <Link
                    href="/shop"
                    className="bg-[#00f2ff] text-black px-6 py-2.5 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // If no products in same category, show others
    const displayRelated = relatedProducts.length > 0
        ? relatedProducts
        : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

    const formattedDownloads = product.downloads >= 1000
        ? `${(product.downloads / 1000).toFixed(1)}K`
        : product.downloads;

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-16">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[#00f2ff] transition-colors">Home</Link>
                    <ChevronRight size={14} className="text-gray-600" />
                    <Link href="/shop" className="hover:text-[#00f2ff] transition-colors">Shop</Link>
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className="text-white font-medium line-clamp-1">{product.title}</span>
                </div>

                {/* Product Detail Layout */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left — Image / Preview */}
                    <div className="flex-1 lg:max-w-[700px]">
                        {/* Main Image */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-800/50 group">
                            <Image
                                src={product.thumbnail_url}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Play preview overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <div className="bg-black/80 backdrop-blur-sm rounded-full p-5 border border-white/20 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 cursor-pointer">
                                    <Play className="text-white fill-white" size={28} />
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                {product.is_new && (
                                    <span className="bg-[#00f2ff] text-black text-xs font-bold uppercase px-2.5 py-1 rounded-lg tracking-wider">
                                        New
                                    </span>
                                )}
                                {product.is_free && (
                                    <span className="bg-green-500 text-black text-xs font-bold uppercase px-2.5 py-1 rounded-lg tracking-wider">
                                        Free
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="bg-[#ff003c] text-white text-xs font-bold uppercase px-2.5 py-1 rounded-lg tracking-wider">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">What's Included</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                        <CheckCircle2 size={16} className="text-[#00f2ff] flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
                            <div className="bg-white/5 rounded-xl overflow-hidden">
                                {[
                                    { label: "File Format", value: product.file_format, icon: <FileVideo size={16} /> },
                                    { label: "File Size", value: product.file_size, icon: <Layers size={16} /> },
                                    { label: "Resolution", value: product.resolution, icon: <Monitor size={16} /> },
                                    { label: "Compatibility", value: product.compatibility, icon: <Zap size={16} /> },
                                ].map((detail, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-between px-5 py-3.5 ${
                                            i < 3 ? "border-b border-white/5" : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 text-gray-400">
                                            {detail.icon}
                                            <span className="text-sm">{detail.label}</span>
                                        </div>
                                        <span className="text-sm text-white font-medium">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Purchase Sidebar */}
                    <div className="lg:w-[380px]">
                        <div className="sticky top-24">
                            {/* Product Info Card */}
                            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                                {/* Header */}
                                <div className="p-6">
                                    {/* Category */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-[#00f2ff] bg-[#00f2ff]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                        <span className="text-xs text-gray-500">{product.software}</span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-xl font-bold text-white leading-tight mb-4">
                                        {product.title}
                                    </h1>

                                    {/* Creator */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00f2ff]/50 bg-[#0f0f0f] flex-shrink-0">
                                            <Image
                                                src="/assets/logo.png"
                                                alt="DJ Enox"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-medium text-white">DJ ENOX</span>
                                                <CheckCircle2 size={14} className="text-[#00f2ff]" />
                                            </div>
                                            <span className="text-xs text-gray-500">Verified Creator</span>
                                        </div>
                                    </div>

                                    {/* Rating & Downloads */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= Math.floor(product.rating)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-600"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-400">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-gray-600">|</span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <Download size={14} />
                                            <span>{formattedDownloads} downloads</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className="border-t border-white/10 p-6">
                                    {/* Price */}
                                    <div className="flex items-end gap-3 mb-5">
                                        {product.is_free ? (
                                            <span className="text-3xl font-bold text-green-400">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold text-white">KSh {product.price}</span>
                                                {product.original_price && (
                                                    <span className="text-lg text-gray-500 line-through mb-0.5">KSh {product.original_price}</span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Buy / Download Button */}
                                    {product.is_free ? (
                                        <button className="w-full flex items-center justify-center gap-2 bg-[#00f2ff] text-black py-3.5 rounded-xl font-bold text-sm hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                            <Download size={18} />
                                            Download Free
                                        </button>
                                    ) : (
                                        <a 
                                            href={`https://wa.me/254750059353?text=${encodeURIComponent(`Hi DJ ENOX, I would like to order the digital product: ${product.title}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <MessageCircle size={18} />
                                            Order via WhatsApp — KSh {product.price}
                                        </a>
                                    )}

                                    {/* Secondary Actions */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => setIsLiked(!isLiked)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                                isLiked
                                                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                                            }`}
                                        >
                                            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                                            {isLiked ? "Saved" : "Wishlist"}
                                        </button>
                                        <button
                                            onClick={() => setShareOpen(!shareOpen)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <Share2 size={16} />
                                            Share
                                        </button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="mt-5 space-y-2">
                                        {[
                                            { icon: <Shield size={14} />, text: "Secure instant download" },
                                            { icon: <Zap size={14} />, text: "Lifetime access & free updates" },
                                            { icon: <Download size={14} />, text: "Commercial license included" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-gray-500 text-xs">
                                                <span className="text-[#00f2ff]">{item.icon}</span>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {displayRelated.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">You May Also Like</h3>
                            <Link
                                href="/shop"
                                className="text-sm text-[#00f2ff] hover:underline flex items-center gap-1"
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {displayRelated.map((rProduct) => (
                                <Link
                                    key={rProduct.id}
                                    href={`/shop/${rProduct.slug}`}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-800/50">
                                        <Image
                                            src={rProduct.thumbnail_url}
                                            alt={rProduct.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 left-2">
                                            {rProduct.is_free && (
                                                <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">Free</span>
                                            )}
                                            {rProduct.is_new && (
                                                <span className="bg-[#00f2ff] text-black text-[10px] font-bold px-2 py-0.5 rounded">New</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
                                            {rProduct.title}
                                        </h4>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#00f2ff]">
                                                {rProduct.is_free ? "Free" : `KSh ${rProduct.price}`}
                                            </span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                {rProduct.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Need to import Package for 404 state
const Package = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);

export default ProductDetailPage;
