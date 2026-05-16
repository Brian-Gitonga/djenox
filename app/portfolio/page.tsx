"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ExternalLink, Play, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type PortfolioItem = Database['public']['Tables']['portfolio']['Row'];

const categories = ["All", "Festival", "Club", "Private", "Corporate"];

const PortfolioPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const { data, error } = await (supabase
                    .from('portfolio') as any)
                    .select('*')
                    .order('year', { ascending: false });

                if (error) throw error;
                if (data) setPortfolioItems(data);
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    const filteredItems = activeCategory === "All"
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h4 className="text-neon-purple font-bold uppercase tracking-[0.3em] mb-4">World-Class Stages</h4>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">PERFORMANCE PORTFOLIO</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        From intimate VIP gatherings to stadium-sized festivals, every performance is crafted to create unforgettable moments.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                ? "bg-neon-purple text-white"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                onClick={() => setSelectedItem(item)}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900"
                            >
                                <Image
                                    src={item.image_url || "/assets/placeholder.jpg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-neon-purple/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                                    {item.category}
                                </div>

                                {/* Year Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-bold text-white">
                                    {item.year}
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-2 text-neon-blue text-xs font-bold uppercase tracking-widest mb-2">
                                        <MapPin size={12} /> {item.location}
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{item.venue}</p>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        View Details
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No performances in this category yet.</p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-32 text-center bg-zinc-950 rounded-[3rem] p-16 border border-white/5">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Ready to Create Your Event?</h3>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                        Every performance is unique. Let's discuss how DJ Enox can elevate your next event.
                    </p>
                    <Link
                        href="/bookings"
                        className="inline-block bg-neon-blue text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-neon-purple hover:text-white transition-all"
                    >
                        Request Booking
                    </Link>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
                        >
                            <div className="relative aspect-video">
                                <Image
                                    src={selectedItem.image_url || "/assets/placeholder.jpg"}
                                    alt={selectedItem.title}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <span className="px-4 py-1 bg-neon-purple/20 border border-neon-purple/50 rounded-full text-xs font-bold text-neon-purple uppercase tracking-widest">
                                        {selectedItem.category}
                                    </span>
                                    <span className="text-gray-500 text-sm">{selectedItem.year}</span>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">{selectedItem.title}</h2>
                                <p className="text-neon-blue font-bold mb-6">{selectedItem.venue}</p>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-gray-500" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Location</div>
                                            <div className="text-white font-medium">{selectedItem.location}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="text-gray-500" size={18} />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest">Crowd Size</div>
                                            <div className="text-white font-medium">{selectedItem.crowd_size}</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 leading-relaxed">{selectedItem.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioPage;
