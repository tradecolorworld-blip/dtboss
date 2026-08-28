export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Analytics } from "@/models/Analytics";

const META_PIXEL_ID = "1258097689637106";
const META_ACCESS_TOKEN = "EAAO5FkfBpkgBSWZBpeCZBGNHp8X2W8CKC52dP72pNFPeoPNCppXFyE6xSqEgiu5xtKtgzDeA50z7vuwGy3QuxODFVF2EuCbAzq51Ej28Pf8a5ZAu7ysZAxxgXQITjp7QMPJpxPBehks7wyyuIssc4lWwVtDrsY3OmMuP9ErQF8Rmj6FnKOZCNe370wDw7vqInUQZDZD";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { event_type, device, user_agent } = body;

        // 1. Log to MongoDB
        await Analytics.create({
            event_type,
            device,
            user_agent,
        });

        // 2. Extract Client IP and Meta Cookies
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "0.0.0.0";
        const clientIp = ip.split(',')[0].trim();
        const cookieHeader = req.headers.get("cookie") || "";
        
        const fbpMatch = cookieHeader.match(/_fbp=([^;]+)/);
        const fbcMatch = cookieHeader.match(/_fbc=([^;]+)/);
        const fbp = fbpMatch ? fbpMatch[1] : undefined;
        const fbc = fbcMatch ? fbcMatch[1] : undefined;

        // 3. Map events to Meta standard events
        let metaEventName: string | null = null;
        if (event_type === "page_view") metaEventName = "PageView";
        if (event_type === "lead_click" || event_type === "telegram_success") metaEventName = "Lead";

        if (metaEventName) {
            const metaPayload = {
                data: [
                    {
                        event_name: metaEventName,
                        event_time: Math.floor(Date.now() / 1000),
                        action_source: "website",
                        event_source_url: req.headers.get("referer") || "https://dtboss.sbs/landing",
                        user_data: {
                            client_user_agent: user_agent,
                            client_ip_address: clientIp,
                            ...(fbp && { fbp }),
                            ...(fbc && { fbc }),
                        }
                    }
                ],
            };

            const fbUrl = `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

            fetch(fbUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(metaPayload)
            }).catch(err => console.error("Meta CAPI Error:", err));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}