"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Send, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const contactMethods = [
    { icon: Mail, label: "Booking Inquiries", value: "briangitongamwit@gmail.com" },
    { icon: Phone, label: "Direct Phone", value: "+25470059353" },
    { icon: MapPin, label: "Based In", value: "Limuru, Kiambu" },
];

const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#", color: "text-pink-500" },
    { icon: Twitter, label: "Twitter", href: "#", color: "text-blue-400" },
    { icon: Youtube, label: "YouTube", href: "#", color: "text-red-500" },
];

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const { error } = await (supabase
                .from('bookings') as any)
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    status: 'New',
                    event_type: 'General Inquiry'
                }]);

            if (error) throw error;

            setIsSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            console.error("Error submitting contact form:", err);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6">

                <div className="text-center mb-20">
                    <h4 className="text-neon-blue font-bold uppercase tracking-[0.3em] mb-4">Get In Touch</h4>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">CONNECT WITH <span className="text-neon-blue glow-blue">ENOX</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Methods */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                            {contactMethods.map((method, idx) => (
                                <motion.div
                                    key={method.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-6 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-neon-blue transition-colors">
                                        <method.icon className="text-neon-blue" size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{method.label}</h4>
                                        <p className="text-white text-xl font-bold">{method.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-12 border-t border-white/5">
                            <h4 className="text-white font-bold mb-6">Social Media</h4>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-14 h-14 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all group"
                                    >
                                        <social.icon className="text-gray-400 group-hover:text-white transition-colors" size={22} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-950 p-10 rounded-[2.5rem] border border-white/5"
                    >
                        {isSubmitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-20 h-20 bg-neon-blue/10 rounded-3xl flex items-center justify-center text-neon-blue mb-6">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">MESSAGE SENT!</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Thanks for reaching out. We've received your message and will get back to you as soon as possible.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-8 text-neon-blue font-bold uppercase tracking-widest text-xs hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-white mb-8">Direct Message</h3>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</label>
                                        <input
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                        />
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        className="neon-button-blue w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"} <Send size={20} />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;
