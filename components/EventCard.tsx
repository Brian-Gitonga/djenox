"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, ExternalLink } from "lucide-react";

interface EventCardProps {
    name: string;
    date: string;
    location: string;
    image_url: string;
    status: string;
    ticket_link?: string;
}

const EventCard = ({ name, date, location, image_url, status, ticket_link }: EventCardProps) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const isSoldOut = status === "Sold Out";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
        >
            {/* Event Header Image */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={image_url || "/assets/placeholder-event.jpg"}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSoldOut
                    ? "bg-red-500/20 border-red-500 text-red-500"
                    : "bg-neon-blue/20 border-neon-blue text-neon-blue"
                    }`}>
                    {status}
                </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
                <div className="flex items-center gap-2 text-neon-blue text-xs font-bold uppercase tracking-widest mb-3">
                    <Calendar size={14} /> {formattedDate}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-neon-blue transition-colors">
                    {name}
                </h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin size={14} className="text-gray-600" /> {location}
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
