"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music, Radio, Award, Globe } from "lucide-react";

const highlights = [
    { icon: Globe, title: "Global Reach", label: "Performances in over 25 countries across Europe, Asia, and Africa." },
    { icon: Award, title: "Industry Recognition", label: "Nominated for 'Best Afrobeat DJ' at the 2025 Urban Music Awards." },
    { icon: Radio, title: "Radio Resident", label: "Monthly residency on GLOBAL NIGHTS FM, reaching 2M+ listeners." },
    { icon: Music, title: "Music Producer", label: "Collaborated with multi-platinum artists on chart-topping fusions." },
];

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6">

                {/* Main Bio Section */}
                <div className="flex flex-col lg:row items-center gap-20 mb-32">
                    {/* Portrait Side */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-[3/4] max-w-md mx-auto"
                        >
                            <div className="absolute -inset-4 border-2 border-neon-purple rounded-[2.5rem] -rotate-3 z-0" />
                            <div className="absolute -inset-4 bg-neon-purple/5 rounded-[2.5rem] rotate-3 z-0" />
                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src="https://images.unsplash.com/photo-1549413637-299f1fa02c6d?auto=format&fit=crop&q=80&w=800"
                                    alt="DJ Enox Professional Portrait"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute bottom-10 -right-10 bg-black p-6 rounded-2xl border border-white/10 shadow-2xl z-20 hidden md:block">
                                <div className="text-3xl font-black text-neon-blue">10+</div>
                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Years Active</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full lg:w-1/2">
                        <h4 className="text-neon-blue font-bold uppercase tracking-[0.3em] mb-4">The Artist</h4>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">CRAFTING BEYOND <span className="text-neon-purple glow-purple">BOUNDARIES</span></h1>

                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                            <p>
                                DJ Enox is not just a selector; he is a sound architect. Based in Limuru, Kiambu but operating globally, his style is a high-octane blend of deep tech-house, futuristic afro-beats, and raw urban rhythms.
                            </p>
                            <p>
                                With over a decade behind the decks, Enox has mastered the art of reading a room. Whether it's a 50,000-person festival stage or an intimate VIP lounge in Ibiza, the energy remains uncompromising.
                            </p>
                            <p>
                                His philosophy is simple: <span className="text-white italic">"Music is the only universal language that doesn't need a translation."</span> Through his sets and original productions, he continues to push the limits of what a modern DJ can achieve.
                            </p>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-full text-sm font-bold text-white tracking-widest">TECH-HOUSE</div>
                            <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-full text-sm font-bold text-white tracking-widest">AFROBEAT</div>
                            <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-full text-sm font-bold text-white tracking-widest">AMAPIANO</div>
                        </div>
                    </div>
                </div>

                {/* Career Highlights Grid */}
                <section className="bg-zinc-950 rounded-[3rem] p-12 md:p-20 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        {highlights.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center md:text-left"
                            >
                                <item.icon className="text-neon-blue mb-6 mx-auto md:mx-0" size={32} />
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutPage;
