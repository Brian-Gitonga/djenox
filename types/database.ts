export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            mixtapes: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    thumbnail_url: string | null
                    video_url: string | null
                    audio_download_url: string | null
                    video_download_url: string | null
                    duration: string | null
                    views: number | null
                    category: string | null
                    status: string | null
                    is_featured: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    thumbnail_url?: string | null
                    video_url?: string | null
                    audio_download_url?: string | null
                    video_download_url?: string | null
                    duration?: string | null
                    views?: number | null
                    category?: string | null
                    status?: string | null
                    is_featured?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    thumbnail_url?: string | null
                    video_url?: string | null
                    audio_download_url?: string | null
                    video_download_url?: string | null
                    duration?: string | null
                    views?: number | null
                    category?: string | null
                    status?: string | null
                    is_featured?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            portfolio: {
                Row: {
                    id: string
                    title: string
                    venue: string | null
                    location: string | null
                    year: number | null
                    image_url: string | null
                    category: string | null
                    crowd_size: string | null
                    description: string | null
                    is_highlight: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    venue?: string | null
                    location?: string | null
                    year?: number | null
                    image_url?: string | null
                    category?: string | null
                    crowd_size?: string | null
                    description?: string | null
                    is_highlight?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    venue?: string | null
                    location?: string | null
                    year?: number | null
                    image_url?: string | null
                    category?: string | null
                    crowd_size?: string | null
                    description?: string | null
                    is_highlight?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    name: string
                    date: string | null
                    location: string | null
                    image_url: string | null
                    status: string | null
                    ticket_link: string | null
                    total_tickets: number | null
                    sold_tickets: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    date?: string | null
                    location?: string | null
                    image_url?: string | null
                    status?: string | null
                    ticket_link?: string | null
                    total_tickets?: number | null
                    sold_tickets?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    date?: string | null
                    location?: string | null
                    image_url?: string | null
                    status?: string | null
                    ticket_link?: string | null
                    total_tickets?: number | null
                    sold_tickets?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string | null
                    event_type: string | null
                    location: string | null
                    message: string | null
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject?: string | null
                    event_type?: string | null
                    location?: string | null
                    message?: string | null
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string | null
                    event_type?: string | null
                    location?: string | null
                    message?: string | null
                    status?: string | null
                    created_at?: string
                }
            }
            site_settings: {
                Row: {
                    key: string
                    value: Json
                    description: string | null
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: Json
                    description?: string | null
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: Json
                    description?: string | null
                    updated_at?: string
                }
            }
        }
    }
}
