"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { motion } from "framer-motion";
import { Play, Trophy, MapPin, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

type Mixtape = Database['public']['Tables']['mixtapes']['Row'];
type Portfolio = Database['public']['Tables']['portfolio']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

const iconMap: Record<string, any> = {
  "Play": Play,
  "Trophy": Trophy,
  "MapPin": MapPin,
  "Users": Users,
};

const defaultStats = [
  { label: "Events Played", value: "50+", icon: Play },
  { label: "Years Experience", value: "3+", icon: Trophy },
  { label: "Cities Covered", value: "25", icon: MapPin },
  { label: "Happy Clients", value: "100k+", icon: Users },
];

export default function Home() {
  const [stats, setStats] = useState(defaultStats);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [portfolioHighlights, setPortfolioHighlights] = useState<any[]>([]);
  const [featuredMixtape, setFeaturedMixtape] = useState<Mixtape | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // 1. Fetch Stats from site_settings
        const { data: settingsData } = await (supabase
          .from('site_settings') as any)
          .select('value')
          .eq('key', 'landing_page_stats')
          .single();

        if (settingsData && Array.isArray(settingsData.value)) {
          const mappedStats = (settingsData.value as any[]).map((s, idx) => ({
            ...s,
            icon: defaultStats[idx]?.icon || Play
          }));
          setStats(mappedStats);
        }

        // 2. Fetch Featured Mixtape
        const { data: mixtapeData } = await (supabase
          .from('mixtapes') as any)
          .select('*')
          .eq('is_featured', true)
          .eq('status', 'Public')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (mixtapeData) setFeaturedMixtape(mixtapeData);

        // 3. Fetch Portfolio Highlights (Limit 4)
        const { data: portfolioData } = await (supabase
          .from('portfolio') as any)
          .select('*')
          .eq('is_highlight', true)
          .order('year', { ascending: false })
          .limit(4);

        if (portfolioData) setPortfolioHighlights(portfolioData);

        // 4. Fetch Upcoming Events (Limit 3)
        const { data: eventsData } = await (supabase
          .from('events') as any)
          .select('*')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);

        if (eventsData) setUpcomingEvents(eventsData);

      } catch (error) {
        console.error("Error fetching landing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neon-blue/20 blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-neon-purple/20 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-red/10 blur-[150px]"
          />

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Floating Geometric Shapes */}
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[15%] right-[15%] w-4 h-4 border border-neon-blue/30 rotate-45"
          />
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] left-[10%] w-6 h-6 border border-neon-purple/30 rounded-full"
          />
          <motion.div
            animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[20%] w-2 h-2 bg-neon-blue/40 rounded-full"
          />
          <motion.div
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[35%] right-[25%] w-3 h-3 bg-neon-purple/30 rounded-full"
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mb-8"
          />

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-2"
          >
            <span className="text-white">DJ</span>
            <span className="text-neon-blue glow-blue ml-4">ENOX</span>
          </motion.h1>

          {/* Subtitle with animated underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <p className="text-lg md:text-xl font-medium text-gray-400 uppercase tracking-[0.3em]">
              A DJ, Editor & Web developer
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-px w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-4"
            />
          </motion.div>

          {/* Genre Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {["Afrobeat", "Amapiano", "Dancehall", "Bongo"].map((genre, idx) => (
              <motion.span
                key={genre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                className="px-4 py-1.5 border border-white/10 rounded-full text-xs font-medium text-gray-300 uppercase tracking-widest hover:border-neon-blue/50 hover:text-neon-blue transition-colors cursor-default"
              >
                {genre}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/bookings"
              className="group relative px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-neon-blue transition-transform group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-black">Book Now</span>
            </Link>
            <Link
              href="/mixtapes"
              className="group px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm border border-white/20 text-white hover:border-neon-purple/50 hover:text-neon-purple transition-all"
            >
              Listen to Mixes
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">Scroll</span>
            <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1 h-1.5 bg-neon-blue rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-neon-blue font-bold text-xs uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-neon-purple font-bold uppercase tracking-[0.3em] mb-4">Stage Presence</h4>
              <h2 className="text-4xl md:text-5xl font-black text-white">PAST PERFORMANCES</h2>
            </div>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 text-white font-bold hover:text-neon-purple transition-colors group"
            >
              View Full Portfolio
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(portfolioHighlights.length > 0 ? portfolioHighlights : []).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              >
                <NextImage
                  src={item.image_url || "/assets/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  {item.category}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-neon-blue text-xs font-bold uppercase tracking-widest mb-2">
                    {item.venue} • {item.year}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-neon-purple transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mixtape */}
      {featuredMixtape && (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 backdrop-blur-md p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 group">
              
              <div className="w-full lg:w-5/12 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-square w-full max-w-sm mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/5"
                >
                  <NextImage
                    src={featuredMixtape.thumbnail_url || "/assets/bongo.png"}
                    alt={featuredMixtape.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Play className="text-white fill-current ml-1" size={24} />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="w-full lg:w-7/12 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neon-blue text-[10px] font-bold uppercase tracking-widest mb-6">
                  <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                  Featured Release
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                  {featuredMixtape.title}
                </h2>
                
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                  {featuredMixtape.description || "Experience the raw energy of urban nightlife with my latest Afrobeat & Amapiano fusion. Let the rhythm take control of your soul."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                  <Link
                    href={`/mixtapes/${featuredMixtape.slug}`}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={18} className="fill-current" /> Listen Now
                  </Link>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-widest flex items-center gap-2">
                    <span>{featuredMixtape.duration || "1:20:00"}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{featuredMixtape.category || "Mixed Genre"}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}


      {/* Upcoming Events Preview */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-neon-blue font-bold uppercase tracking-[0.3em] mb-2 text-xs">On the Road</h4>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">UPCOMING EVENTS</h2>
            </div>
            <Link
              href="/events"
              className="text-sm text-gray-400 hover:text-white border-b border-gray-700 hover:border-white transition-all pb-1 font-medium"
            >
              View All Dates
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {(upcomingEvents.length > 0 ? upcomingEvents : []).map((event, idx) => {
              const eventDate = new Date(event.date);
              const day = eventDate.getDate().toString().padStart(2, '0');
              const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900 transition-colors"
                >
                  {/* Date Block */}
                  <div className="flex-shrink-0 text-center sm:text-left sm:pr-6 sm:border-r border-white/10 min-w-[100px]">
                    <div className="text-neon-blue text-sm font-bold tracking-widest">{month}</div>
                    <div className="text-3xl font-black text-white">{day}</div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">{event.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 text-sm">
                      <MapPin size={14} className="text-gray-500" /> {event.location}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 mt-4 sm:mt-0">
                    <Link
                      href={event.ticket_link || "/events"}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Tickets
                    </Link>
                  </div>
                </motion.div>
              );
            })}

            {upcomingEvents.length === 0 && (
              <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No upcoming events scheduled at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

