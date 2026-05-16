"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { Camera, Music, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastGallery, setPastGallery] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // 1. Fetch Upcoming Events
                const { data: eventsData } = await (supabase
                    .from('events') as any)
                    .select('*')
                    .gte('date', new Date().toISOString().split('T')[0])
                    .order('date', { ascending: true });

                if (eventsData) setUpcomingEvents(eventsData);

                // 2. Fetch some past performance images from portfolio for the gallery
                const { data: portfolioData } = await (supabase
                    .from('portfolio') as any)
                    .select('image_url')
                    .limit(6);

                if (portfolioData) {
                    setPastGallery(portfolioData.map((p: any) => p.image_url).filter(Boolean) as string[]);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);
    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6">

                {/* Upcoming Events Section */}
                <section className="mb-32">
                    <div className="flex flex-col md:row justify-between items-end mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-neon-blue font-bold uppercase tracking-[0.3em] mb-4">On the Horizon</h4>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">UPCOMING SHOWS</h1>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs text-center md:text-right">
                            Catch DJ Enox live at the world's most iconic venues. New dates added weekly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-white/5 rounded-3xl animate-pulse" />
                            ))
                        ) : upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    name={event.name}
                                    date={event.date || ""}
                                    location={event.location || ""}
                                    image_url={event.image_url || ""}
                                    status={event.status || "Upcoming"}
                                    ticket_link={event.ticket_link || undefined}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-500 bg-white/5 rounded-3xl border border-white/5">
                                <p className="text-lg font-medium mb-2">No upcoming events scheduled yet.</p>
                                <p className="text-sm">Check back soon for new tour dates and festival performances.</p>
                            </div>
                        )}
                    </div>

                </section>

                {/* Past Events / Gallery Section */}
                <section>
                    <div className="text-center mb-16">
                        <h4 className="text-neon-purple font-bold uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                            <Camera size={16} /> Look Back
                        </h4>
                        <h2 className="text-4xl md:text-5xl font-black text-white">STAGE HIGHLIGHTS</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastGallery.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-900 border border-white/5"
                            >
                                <Image
                                    src={img}
                                    alt={`Performance Highlight ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity flex items-end p-8">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <Sparkles className="text-neon-purple" size={18} /> Ibiza Summer Finale
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-4 rounded-full text-white font-bold transition-all uppercase tracking-widest text-xs">
                            View More on Instagram
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default EventsPage;
