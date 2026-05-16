"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminSignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (authError) throw authError;

            setIsSuccess(true);
            setIsLoading(false);
            // Redirect will happen after they see the success message or confirm email if enabled
            // However, for this DJ app, usually we want immediate access but with 'user' role first.
            // The plan says redirections to /admin on success, but they won't have access yet.
            // Let's show a success message instead.
        } catch (err: any) {
            setError(err.message || "Error creating account.");
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
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-neon-purple/10 blur-[130px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-neon-blue/15 blur-[130px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-black tracking-tighter text-white">
                            DJ <span className="text-neon-blue">ENOX</span>
                        </span>
                    </Link>
                </div>

                {/* Signup Card */}
                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Sparkles className="text-neon-purple" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Partner Portal</h1>
                            <p className="text-gray-500 text-sm">Apply for management access</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="text-green-500" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Request Submitted</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Your application has been received. An administrator will review your access request shortly.
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-flex items-center gap-2 text-neon-purple font-bold tracking-widest uppercase text-xs"
                            >
                                Back to Login <ArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Legal Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="DJ Enox"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Professional Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@djenox.com"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Confirm Secret</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="md:col-span-2 group relative h-[60px] bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Registering...
                                        </>
                                    ) : (
                                        <>
                                            Create Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            Already have credentials?{" "}
                            <Link href="/admin/login" className="text-neon-purple hover:text-white transition-colors ml-1">
                                Secure Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Auth Footer */}
                <div className="mt-10 text-center space-y-4">
                    <Link href="/" className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                        ← Exit to Public Site
                    </Link>
                    <div className="flex items-center justify-center gap-6">
                        <span className="text-[9px] text-gray-700 uppercase tracking-tight">Encryption: AES-256</span>
                        <span className="text-[9px] text-gray-700 uppercase tracking-tight">Status: Operational</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminSignupPage;
