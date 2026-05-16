"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if the current route is an admin route
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">{children}</main>
                {!isAdminRoute && <Footer />}
            </div>
        </>
    );
}
