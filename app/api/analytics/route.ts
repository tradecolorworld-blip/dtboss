export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Analytics } from "@/models/Analytics";

export async function GET() {
    try {
        await connectToDatabase();

        // Run all counts in parallel for maximum speed
        const [
            pageViews, clicks, successes, fails, redirects,
            ios, android, desktop
        ] = await Promise.all([
            Analytics.countDocuments({ event_type: "page_view" }),
            Analytics.countDocuments({ event_type: "button_click" }),
            Analytics.countDocuments({ event_type: "telegram_success" }),
            Analytics.countDocuments({ event_type: "telegram_failed" }),
            Analytics.countDocuments({ event_type: "redirect_main" }),

            // Device breakdown based on page views
            Analytics.countDocuments({ event_type: "page_view", device: "iOS" }),
            Analytics.countDocuments({ event_type: "page_view", device: "Android" }),
            Analytics.countDocuments({ event_type: "page_view", device: "Desktop" })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                funnel: { pageViews, clicks, successes, fails, redirects },
                devices: { ios, android, desktop }
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}