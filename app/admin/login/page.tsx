"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminLoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user has admin role in profiles table
            const { data: profile, error: profileError } = await (supabase
                .from("profiles") as any)
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (profileError) {
                console.error("Profile Fetch Error:", profileError);
                await supabase.auth.signOut();
                throw new Error(`Profile access failed: ${profileError.message}`);
            }

            if (profile?.role !== "admin") {
                console.warn("User role is not admin:", profile?.role);
                await supabase.auth.signOut();
                throw new Error("Unauthorized: Admin access only.");
            }

            window.location.href = "/admin";
        } catch (err: any) {
            setError(err.message || "Invalid login credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-neon-blue/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-neon-purple/20 blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6"
                    >
                        <ShieldCheck className="text-neon-blue" size={32} />
                    </motion.div>
                    <Link href="/" className="block">
                        <span className="text-4xl font-black tracking-tighter text-white">
                            DJ <span className="text-neon-blue">ENOX</span>
                        </span>
                    </Link>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="h-px w-8 bg-white/10" />
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Secure Portal</p>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
                        <p className="text-gray-400 text-sm">Enter your credentials to access the management panel.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-neon-blue/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@djenox.com"
                                    required
                                    className="relative w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Secret Password</label>
                                <Link href="/admin/forgot-password" hidden className="text-[10px] font-bold text-neon-blue hover:text-white transition-colors uppercase tracking-widest">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-neon-blue/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="relative w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group w-full relative h-[60px] bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Access Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            Need portal access?{" "}
                            <Link href="/admin/signup" className="text-neon-blue hover:text-white transition-colors ml-1">
                                Request Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="mt-12 text-center">
                    <Link href="/" className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                        ← Return to Main Interface
                    </Link>
                    <p className="text-gray-700 text-[9px] mt-6 tracking-widest">© 2026 DJ ENOX | SYSTEM v4.0</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
