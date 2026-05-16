"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Calendar, MapPin, Music } from "lucide-react";

const eventTypes = ["Wedding", "Club Performance", "Corporate Event", "Private Party", "Festival", "International Tour"];

const BookingForm = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-neon-blue" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Request Received!</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                    Thank you for reaching out. DJ Enox's team will review your request and get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full text-white font-bold transition-all"
                >
                    Send Another Request
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Full Name</label>
                    <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Email Address</label>
                    <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Phone Number</label>
                    <input
                        required
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Event Type</label>
                    <select
                        required
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                    >
                        <option value="" disabled selected>Select Event Type</option>
                        {eventTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Event Date</label>
                    <div className="relative">
                        <input
                            required
                            type="date"
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Event Location</label>
                    <input
                        required
                        type="text"
                        placeholder="City, Country"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Additional Message</label>
                <textarea
                    rows={4}
                    placeholder="Tell us more about your event..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                />
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="neon-button-blue w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="animate-spin" size={20} /> Processing...
                    </>
                ) : (
                    <>
                        <Send size={20} /> Request Booking
                    </>
                )}
            </button>

            <p className="text-center text-gray-500 text-xs">
                * High demand dates may require 50% deposit to secure the slot.
            </p>
        </form>
    );
};

export default BookingForm;
