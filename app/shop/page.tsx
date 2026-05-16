"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    Sparkles,
    TrendingUp,
    Package,
    Tag,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import ShopProductCard from "@/components/ShopProductCard";

// Product categories
const categories = [
    "All",
    "Lower Thirds",
    "Titles",
    "Transitions",
    "Intros & Outros",
    "Logo Reveals",
    "Social Media",
    "Music Visualizers",
    "Lyric Videos",
    "Flyers",
];

// Sort options
const sortOptions = [
    { value: "newest", label: "Newest First", icon: <Sparkles size={14} /> },
    { value: "popular", label: "Most Popular", icon: <TrendingUp size={14} /> },
    { value: "price-low", label: "Price: Low to High", icon: <Tag size={14} /> },
    { value: "price-high", label: "Price: High to Low", icon: <Tag size={14} /> },
];

// Static product data (like mixtapes page uses static DJ Enox info)
const staticProducts = [
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
    },
];

const ShopPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [showFilters, setShowFilters] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    // Close sort dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter and sort products
    const filteredProducts = staticProducts
        .filter((p) => {
            const matchesCategory = activeCategory === "All" || p.category === activeCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            return matchesCategory && matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.downloads - a.downloads;
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                default:
                    return 0; // newest — already in order
            }
        });

    const scrollCategories = (direction: "left" | "right") => {
        if (categoriesRef.current) {
            const scrollAmount = 200;
            categoriesRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const activeSortOption = sortOptions.find((s) => s.value === sortBy);

    return (
        <div className="min-h-screen bg-[#0f0f0f] pt-16">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f2ff]/5 via-transparent to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00f2ff]/3 rounded-full blur-[120px]" />

                <div className="relative container mx-auto px-6 pt-10 pb-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <a href="/" className="hover:text-[#00f2ff] transition-colors">Home</a>
                        <span className="text-gray-600">›</span>
                        <span className="text-white font-medium">Digital Shop</span>
                    </div>

                    {/* Stats */}
                    <div className="mt-2 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Package size={16} className="text-[#00f2ff]" />
                            <span className="text-sm text-gray-300">
                                <span className="font-semibold text-white">{staticProducts.length}</span> Products
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-[#bc13fe]" />
                            <span className="text-sm text-gray-300">
                                <span className="font-semibold text-white">
                                    {staticProducts.filter((p) => p.is_free).length}
                                </span>{" "}
                                Free Items
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Controls Section */}
            <div className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/5">
                {/* Search Bar */}
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="flex flex-grow max-w-2xl items-center bg-[#1a1a1a] border border-[#303030] rounded-xl px-4 py-2.5 focus-within:border-[#00f2ff]/50 focus-within:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all">
                            <Search size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search templates, lower thirds, transitions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-gray-500 hover:text-white transition-colors ml-2"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showFilters
                                    ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>

                        {/* Sort dropdown */}
                        <div ref={sortRef} className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                            >
                                {activeSortOption?.icon}
                                <span className="hidden sm:inline">{activeSortOption?.label}</span>
                                <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-52 bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setShowSortDropdown(false);
                                            }}
                                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${sortBy === option.value
                                                    ? "bg-[#00f2ff]/10 text-[#00f2ff]"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Scrollbar */}
                <div className="relative container mx-auto px-6">
                    <div className="relative">
                        {/* Scroll Left Button */}
                        <button
                            onClick={() => scrollCategories("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-[#0f0f0f]/90 backdrop-blur-sm rounded-full border border-white/10 text-gray-400 hover:text-white transition-colors hidden sm:flex"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div
                            ref={categoriesRef}
                            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 scroll-smooth px-0 sm:px-6"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                                            ? "bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Scroll Right Button */}
                        <button
                            onClick={() => scrollCategories("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-[#0f0f0f]/90 backdrop-blur-sm rounded-full border border-white/10 text-gray-400 hover:text-white transition-colors hidden sm:flex"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Expandable Filters Panel */}
                {showFilters && (
                    <div className="container mx-auto px-6 pb-4 border-t border-white/5 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Price Range */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                                    Price Range
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 flex-1">
                                        <span className="text-gray-500 text-sm mr-1">KSh</span>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="bg-transparent text-white text-sm w-full focus:outline-none"
                                            min={0}
                                        />
                                    </div>
                                    <span className="text-gray-500 text-sm">—</span>
                                    <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 flex-1">
                                        <span className="text-gray-500 text-sm mr-1">KSh</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="bg-transparent text-white text-sm w-full focus:outline-none"
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Software Filter */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                                    Software
                                </label>
                                <div className="flex items-center gap-2">
                                    {["All", "Premiere Pro", "After Effects", "Photoshop"].map((sw) => (
                                        <button
                                            key={sw}
                                            className="px-3 py-2 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            {sw}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                                    Minimum Rating
                                </label>
                                <div className="flex items-center gap-2">
                                    {[3, 4, 4.5].map((r) => (
                                        <button
                                            key={r}
                                            className="px-3 py-2 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
                                        >
                                            {r}+ ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Free Only Toggle */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                                    Quick Filters
                                </label>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-2 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all">
                                        Free Only
                                    </button>
                                    <button className="px-3 py-2 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all">
                                        On Sale
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-6 py-8 max-w-[1920px]">
                {/* Results count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-400">
                        Showing{" "}
                        <span className="text-white font-medium">{filteredProducts.length}</span>{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}
                        {activeCategory !== "All" && (
                            <span>
                                {" "}in <span className="text-[#00f2ff]">{activeCategory}</span>
                            </span>
                        )}
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-8">
                    {filteredProducts.map((product) => (
                        <ShopProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            slug={product.slug}
                            thumbnail_url={product.thumbnail_url}
                            category={product.category}
                            price={product.price}
                            original_price={product.original_price}
                            is_new={product.is_new}
                            is_free={product.is_free}
                            rating={product.rating}
                            downloads={product.downloads}
                            software={product.software}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Package size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            Try adjusting your search or filters. New products are added regularly!
                        </p>
                        <button
                            onClick={() => {
                                setActiveCategory("All");
                                setSearchQuery("");
                                setPriceRange([0, 100]);
                            }}
                            className="mt-6 px-6 py-2.5 bg-[#00f2ff] text-black rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ShopPage;
