import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const videoIds = searchParams.get("videoIds"); // comma-separated for batch

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is not set. Returning 0 views.");
        // Return appropriate fallback for single or batch
        if (videoIds) {
            return NextResponse.json({ views: {}, likes: {} });
        }
        return NextResponse.json({ viewCount: 0, likeCount: 0 });
    }

    // ——— Batch mode: multiple video IDs ———
    if (videoIds) {
        const ids = videoIds.split(",").filter(Boolean).slice(0, 50); // cap at 50
        if (ids.length === 0) {
            return NextResponse.json({ views: {}, likes: {} });
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.join(",")}&key=${apiKey}`,
                { next: { revalidate: 3600 } }
            );

            if (!response.ok) {
                console.error("YouTube API error:", response.status, await response.text());
                return NextResponse.json({ views: {}, likes: {} });
            }

            const data = await response.json();
            const views: Record<string, number> = {};
            const likes: Record<string, number> = {};

            for (const item of data.items || []) {
                views[item.id] = parseInt(item.statistics?.viewCount || "0", 10);
                likes[item.id] = parseInt(item.statistics?.likeCount || "0", 10);
            }

            return NextResponse.json({ views, likes });
        } catch (error) {
            console.error("Error fetching YouTube views batch:", error);
            return NextResponse.json({ views: {}, likes: {} });
        }
    }

    // ——— Single mode: one video ID ———
    if (!videoId) {
        return NextResponse.json({ viewCount: 0, likeCount: 0 }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`,
            { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            console.error("YouTube API error:", response.status, await response.text());
            return NextResponse.json({ viewCount: 0, likeCount: 0 });
        }

        const data = await response.json();
        const viewCount = data.items?.[0]?.statistics?.viewCount;
        const likeCount = data.items?.[0]?.statistics?.likeCount;

        return NextResponse.json({
            viewCount: viewCount ? parseInt(viewCount, 10) : 0,
            likeCount: likeCount ? parseInt(likeCount, 10) : 0,
        });
    } catch (error) {
        console.error("Error fetching YouTube views:", error);
        return NextResponse.json({ viewCount: 0, likeCount: 0 });
    }
}
