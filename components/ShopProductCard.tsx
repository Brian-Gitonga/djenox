"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Heart, Star, Download, CheckCircle2 } from "lucide-react";

interface ShopProductCardProps {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string;
    category: string;
    price: number;
    original_price?: number;
    is_new?: boolean;
    is_free?: boolean;
    rating: number;
    downloads: number;
    software: string;
}

const ShopProductCard = ({
    title,
    slug,
    thumbnail_url,
    price,
    original_price,
    is_new = false,
    is_free = false,
    rating,
    downloads,
    software,
}: ShopProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const formattedDownloads = downloads >= 1000
        ? `${(downloads / 1000).toFixed(1)}K`
        : downloads;

    const discount = original_price
        ? Math.round(((original_price - price) / original_price) * 100)
        : 0;

    return (
        <Link
            href={`/shop/${slug}`}
            className="group flex flex-col animate-fade-in"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-800/50">
                <Image
                    src={thumbnail_url}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Top badges row */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
                    {/* Software badge */}
                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <div className="w-4 h-4 rounded-sm bg-[#310062] flex items-center justify-center">
                            <span className="text-[8px] font-bold text-[#ea77ff]">Pr</span>
                        </div>
                        <span className="text-[10px] font-semibold text-white uppercase tracking-wider">{software}</span>
                    </div>

                    {/* Like button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                            isLiked
                                ? "bg-red-500/20 text-red-400"
                                : "bg-black/50 text-white/70 hover:text-white hover:bg-black/70"
                        }`}
                    >
                        <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Bottom badges */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    {is_new && (
                        <span className="bg-[#00f2ff] text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                            New
                        </span>
                    )}
                    {is_free && (
                        <span className="bg-green-500 text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                            Free
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="bg-[#ff003c] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Quick action buttons on hover */}
                <div className={`absolute bottom-2.5 right-2.5 flex items-center gap-1.5 transition-all duration-300 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="p-2 bg-[#00f2ff] rounded-lg text-black hover:bg-[#00d4e0] transition-colors shadow-lg shadow-[#00f2ff]/20"
                    >
                        <ShoppingCart size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                        <Eye size={14} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-3 flex gap-3">
                {/* Creator Avatar */}
                <div className="relative flex-shrink-0 w-9 h-9">
                    <div className="relative w-full h-full rounded-full overflow-hidden border border-neon-blue/50 flex items-center justify-center shadow-lg bg-[#0f0f0f]">
                        <Image
                            src="/assets/logo.png"
                            alt="DJ Enox"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-[#00f2ff] transition-colors duration-200">
                        {title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-xs text-gray-400 font-medium">DJ ENOX</span>
                        <CheckCircle2 size={12} className="text-[#00f2ff]" />
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Price */}
                            {is_free ? (
                                <span className="text-sm font-bold text-green-400">Free</span>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-[#00f2ff]">KSh {price}</span>
                                    {original_price && (
                                        <span className="text-xs text-gray-500 line-through">KSh {original_price}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="flex items-center gap-0.5">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                {rating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                                <Download size={10} />
                                {formattedDownloads}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ShopProductCard;
