import React from "react";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { ShieldCheck, Zap, Clock, Star, Music } from "lucide-react";

const trustIndicators = [
    { icon: Clock, title: "Fast Response", desc: "Guaranteed response within 24 hours of inquiry." },
    { icon: Zap, title: "Premium Gear", desc: "Industry-standard sound and lighting equipment." },
    { icon: ShieldCheck, title: "Fully Insured", desc: "Public liability insurance for all event sizes." },
    { icon: Star, title: "5-Star Service", desc: "Over 500 successful bookings worldwide." },
];

const BookingsPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:row gap-20">

                    {/* Form Side */}
                    <div className="w-full lg:w-3/5">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">RESERVE THE <span className="text-neon-blue glow-blue">VIBE</span></h1>
                        <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-xl">
                            Ready to take your event to the next level? Fill out the form below and let's create an unforgettable experience together.
                        </p>

                        <BookingForm />
                    </div>

                    {/* Info Side */}
                    <div className="w-full lg:w-2/5 space-y-12">
                        {/* Social Proof / Trust */}
                        <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-8">
                            <h3 className="text-xl font-bold text-white mb-4">Why Book DJ Enox?</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                                {trustIndicators.map((item) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                                            <item.icon className="text-neon-blue" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial Snippet */}
                        <div className="bg-neon-purple/5 p-8 rounded-3xl border border-neon-purple/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Music size={80} className="text-neon-purple" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex text-neon-purple mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6 leading-relaxed">
                                    "DJ Enox absolutely transformed our annual corporate gala. The energy was electric from start to finish. Truly a professional at every level."
                                </p>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Sarah Jenkins</h4>
                                    <p className="text-gray-500 text-xs">Event Director, Global Tech Corp</p>
                                </div>
                            </div>
                        </div>

                        {/* Managed By */}
                        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">International Representation</p>
                            <div className="flex justify-center items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                                {/* Mock Agency Logos */}
                                <div className="text-xl font-black text-white italic">SONIC</div>
                                <div className="text-xl font-black text-white decoration-neon-blue underline">ELITE</div>
                                <div className="text-xl font-bold text-white border-2 px-2">VIBE</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingsPage;
