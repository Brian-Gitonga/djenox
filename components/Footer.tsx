import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="md:col-span-1">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                        DJ <span className="text-neon-blue glow-blue">ENOX</span>
                    </Link>
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                        International DJ & Producer bringing the vibe to the world's most exclusive stages. From tech-house to afro-fusion, the energy never stops.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        {["Home", "Mixtapes", "Shop", "Events", "About", "Bookings"].map((link) => (
                            <li key={link}>
                                <Link
                                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                                    className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-white font-bold mb-6">Contact</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center space-x-3 text-gray-400 text-sm">
                            <Mail size={16} className="text-neon-blue" />
                            <span>briangitongamwit@gmail.com</span>
                        </li>
                        <li className="flex items-center space-x-3 text-gray-400 text-sm">
                            <Phone size={16} className="text-neon-blue" />
                            <span>+25470059353</span>
                        </li>
                        <li className="flex items-center space-x-3 text-gray-400 text-sm">
                            <MapPin size={16} className="text-neon-blue" />
                            <span>Limuru, Kiambu</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold mb-6">Join the Movement</h4>
                    <p className="text-gray-400 text-sm mb-4">Get tour updates and exclusive mixtape drops.</p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-l-md text-sm text-white focus:outline-none focus:border-neon-blue w-full"
                        />
                        <button className="neon-button-blue px-4 py-2 rounded-r-md text-sm font-bold">
                            Join
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center text-gray-500 text-xs text-center md:text-left">
                <p>© {new Date().getFullYear()} DJ Enox. All Rights Reserved.</p>
                <div className="mt-4 md:mt-0 space-x-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
