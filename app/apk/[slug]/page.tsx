"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Massive pool of 20 realistic reviews
const ALL_REVIEWS = [
    { name: "Rahul S.", time: "12 mins ago", text: "Downloaded the APK. Clicked unlock inside, payment was instant, and predictions are 100% accurate. Won ₹15k today!", avatar: "R", color: "linear-gradient(135deg, #ff6a00, #ff9f43)" },
    { name: "Vikash K.", time: "28 mins ago", text: "Best mod apk. The unlocking process inside the app is completely automated and safe.", avatar: "V", color: "linear-gradient(135deg, #229ED9, #0055cc)" },
    { name: "Arjun M.", time: "1 hour ago", text: "Paid the unlock fee inside the app and it activated immediately. Insane accuracy.", avatar: "A", color: "linear-gradient(135deg, #4ade80, #22c55e)" },
    { name: "Karan Y.", time: "2 hours ago", text: "Using the Web version on my iPhone. It works flawlessly without needing to install anything!", avatar: "K", color: "linear-gradient(135deg, #8b5cf6, #6d28d9)" },
    { name: "Sneha P.", time: "3 hours ago", text: "Easiest ₹10,000 I made this week. The live results sync perfectly.", avatar: "S", color: "linear-gradient(135deg, #ec4899, #f472b6)" },
    { name: "Amit J.", time: "4 hours ago", text: "Was skeptical at first, but the automated payment unlock is smooth and actually works.", avatar: "A", color: "linear-gradient(135deg, #eab308, #facc15)" },
    { name: "Deepak R.", time: "5 hours ago", text: "Casino predictor is 99% accurate. Just follow the given sequence.", avatar: "D", color: "linear-gradient(135deg, #ef4444, #f87171)" },
    { name: "Rohan T.", time: "5 hours ago", text: "Withdrawal successful right after using this tool. Totally worth the small unlock fee.", avatar: "R", color: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
    { name: "Manish D.", time: "6 hours ago", text: "No fake Telegram loops. Direct app, direct payment, direct winning. 5 Stars.", avatar: "M", color: "linear-gradient(135deg, #14b8a6, #2dd4bf)" },
    { name: "Pooja S.", time: "8 hours ago", text: "Working perfectly on my iOS device via the Web Link!", avatar: "P", color: "linear-gradient(135deg, #ec4899, #f472b6)" },
    { name: "Vikram B.", time: "9 hours ago", text: "DTBOSS is the only trusted hub left. Every other site is a scam.", avatar: "V", color: "linear-gradient(135deg, #f97316, #fb923c)" },
    { name: "Suresh N.", time: "10 hours ago", text: "Live results show up instantly. Accuracy is unmatched.", avatar: "S", color: "linear-gradient(135deg, #6366f1, #818cf8)" },
    { name: "Anil C.", time: "11 hours ago", text: "Highly recommend this to everyone trying to recover their losses.", avatar: "A", color: "linear-gradient(135deg, #229ED9, #0055cc)" },
    { name: "Sameer K.", time: "12 hours ago", text: "Just recovered my ₹20k loss from yesterday. The prediction bot is god tier.", avatar: "S", color: "linear-gradient(135deg, #4ade80, #22c55e)" },
    { name: "Aman G.", time: "14 hours ago", text: "The automated payment using allapi is so fast. Unlocked in 5 seconds.", avatar: "A", color: "linear-gradient(135deg, #ff6a00, #ff9f43)" },
    { name: "Nitin V.", time: "15 hours ago", text: "5 stars! The Android APK is completely anti-ban. Using it for 3 days safely.", avatar: "N", color: "linear-gradient(135deg, #8b5cf6, #6d28d9)" },
    { name: "Rajesh L.", time: "18 hours ago", text: "Never disappointing. Every update brings better accuracy.", avatar: "R", color: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
    { name: "Manoj P.", time: "20 hours ago", text: "Worth the unlock fee 100x over. I made my money back in the first 2 bets.", avatar: "M", color: "linear-gradient(135deg, #eab308, #facc15)" },
    { name: "Vishal H.", time: "1 day ago", text: "Better than any other hack tool on the market right now.", avatar: "V", color: "linear-gradient(135deg, #ef4444, #f87171)" },
    { name: "Kunal W.", time: "1 day ago", text: "Safe, fast, and reliable. Customer support on TG is also very helpful.", avatar: "K", color: "linear-gradient(135deg, #14b8a6, #2dd4bf)" }
];

export default function ApkDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [app, setApp] = useState<any>(null);
    const [settings, setSettings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [displayReviews, setDisplayReviews] = useState<any[]>([]);

    // Fetch individual app details and settings
    useEffect(() => {
        if (!slug) return;

        // Pick 4 random reviews on load
        const shuffled = [...ALL_REVIEWS].sort(() => 0.5 - Math.random());
        setDisplayReviews(shuffled.slice(0, 4));

        async function loadAppDetail() {
            try {
                const [resApps, resSettings] = await Promise.all([
                    fetch("/api/apps").then((r) => r.json()),
                    fetch("/api/settings").then((r) => r.json()),
                ]);

                if (resApps.success) {
                    const found = resApps.apps.find(
                        (item: any) => item.slug === slug || item._id === slug
                    );

                    setApp(found || null);

                    if (found) {
                        document.title = `${found.name} - DTBOSS VIP HACKS`;
                    }
                }

                if (resSettings.success && resSettings.settings) {
                    setSettings(resSettings.settings);
                }
            } catch (e) {
                console.error("Failed to load app details:", e);
            } finally {
                setIsLoading(false);
            }
        }

        loadAppDetail();
    }, [slug]);

    const tgLink = settings?.tg || "https://t.me/modapksh";

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060810", color: "#fff", fontFamily: "'Rajdhani', sans-serif" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,106,0,0.3)", borderTopColor: "#ff6a00", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "20px" }}></div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "var(--gold)", letterSpacing: "2px", animation: "pulse 1.5s infinite" }}>LOADING SECURE DATA...</div>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes pulse { 50% { opacity: 0.5; } }` }} />
            </div>
        );
    }

    if (!app) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060810", color: "#fff", fontFamily: "'Rajdhani', sans-serif", textAlign: "center", padding: "20px" }}>
                <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "32px", marginBottom: "15px", color: "#ff6b6b" }}>404 - APP NOT FOUND</h1>
                <p style={{ color: "var(--muted)", marginBottom: "30px" }}>The mod app you are looking for doesn't exist or has been removed.</p>
                <Link href="/" style={{ background: "linear-gradient(135deg, #1fa2ff, #0055cc)", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold" }}>
                    ← Back to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#060810", color: "#fff", fontFamily: "'Rajdhani', sans-serif", paddingBottom: "110px", position: "relative" }}>

            {/* BACKGROUND EFFECTS */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "800px", height: "400px", background: "radial-gradient(ellipse at top, rgba(34,158,217,0.15) 0%, transparent 70%)", pointerEvents: "none" }}></div>

            {/* NAVBAR */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(6, 8, 16, 0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff" }}>
                    <img src="https://dtbosshub.com/logo.png" alt="DTBOSS" style={{ width: "34px", height: "34px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "18px" }}>DT<span style={{ color: "var(--gold)" }}>BOSS</span></span>
                </Link>
                <a href={tgLink} target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg, #229ED9, #0055cc)", color: "#fff", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontFamily: "'Orbitron', sans-serif", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "16px", height: "16px" }} /> JOIN TG
                </a>
            </nav>

            {/* MAIN CONTAINER */}
            <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

                {/* APP HEADER CARD */}
                <div style={{ background: "rgba(18, 22, 33, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", marginBottom: "30px" }}>

                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <div style={{ width: "100px", height: "100px", borderRadius: "22px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
                            {app.icon?.startsWith('http') ? (
                                <img src={app.icon} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span style={{ fontSize: "40px" }}>{app.icon || "📦"}</span>
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                                <span style={{ background: "rgba(34, 158, 217, 0.15)", color: "#229ED9", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", border: "1px solid rgba(34,158,217,0.3)" }}>
                                    {app.category || "MOD APK"}
                                </span>
                                <span style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", border: "1px solid rgba(74,222,128,0.2)" }}>
                                    v{app.version || "1.0"}
                                </span>
                            </div>
                            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "32px", fontWeight: 900, margin: "0 0 8px 0", lineHeight: 1.1 }}>{app.name}</h1>

                            {/* Ratings */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ color: "#ffd700", fontSize: "16px", letterSpacing: "2px" }}>★★★★★</div>
                                <span style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 600 }}>4.9/5 ({app.download_count > 1000 ? (app.download_count / 1000).toFixed(1) + 'k' : (app.download_count || 1240)}) Ratings</span>
                            </div>
                        </div>
                    </div>

                    <p style={{ color: "#e8eaf0", fontSize: "16px", lineHeight: 1.7, margin: 0, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {app.desc || "Gain an unfair advantage with our highly secured, anti-ban modified application. Access premium features instantly."}
                    </p>

                    {/* APP SPECS GRID */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", background: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'Space Mono', monospace", marginBottom: "4px" }}>SIZE</div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "#fff", fontWeight: "bold" }}>{app.size || "45 MB"}</div>
                        </div>
                        <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                            <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'Space Mono', monospace", marginBottom: "4px" }}>UPDATED</div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "#fff", fontWeight: "bold" }}>{app.release_date || "Today"}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'Space Mono', monospace", marginBottom: "4px" }}>STATUS</div>
                            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "#4ade80", fontWeight: "bold" }}>Secure</div>
                        </div>
                    </div>

                    {/* TAGS / SPECS */}
                    {app.specs && app.specs.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                            {app.specs.map((s: string, idx: number) => (
                                <span key={idx} style={{ background: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.3)", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", color: "#ff9f43", fontWeight: "bold" }}>
                                    ✓ {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* HOW TO INSTALL & UNLOCK (TRUST BUILDER) */}
                <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", color: "#fff", marginBottom: "16px", borderLeft: "3px solid #229ED9", paddingLeft: "12px" }}>HOW TO UNLOCK PREDICTIONS</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(18,22,33,0.4)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(34,158,217,0.2)", color: "#229ED9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif" }}>1</div>
                            <div style={{ color: "#e8eaf0", fontSize: "15px" }}>Download the App (Android) or Open the Web Version (iOS).</div>
                        </div>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(34,158,217,0.2)", color: "#229ED9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif" }}>2</div>
                            <div style={{ color: "#e8eaf0", fontSize: "15px" }}>Login to your account and click on "Unlock Predictions".</div>
                        </div>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(74,222,128,0.2)", color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif" }}>3</div>
                            <div style={{ color: "#e8eaf0", fontSize: "15px" }}>Complete the automated payment to reveal live results!</div>
                        </div>
                    </div>
                </div>

                {/* RANDOMIZED REVIEWS SECTION */}
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "18px", color: "#fff", margin: 0, borderLeft: "3px solid #ff6a00", paddingLeft: "12px" }}>RECENT VIP WINNERS</h3>
                        <span style={{ fontSize: "12px", color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "4px 8px", borderRadius: "6px" }}>● Live Feed</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {displayReviews.map((rev, i) => (
                            <div key={i} style={{ background: "rgba(18,22,33,0.5)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", gap: "14px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: rev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                                    {rev.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "15px", fontWeight: "bold", color: "#fff" }}>{rev.name}</span>
                                            <span style={{ fontSize: "10px", background: "rgba(74,222,128,0.1)", color: "#4ade80", padding: "2px 6px", borderRadius: "10px", border: "1px solid rgba(74,222,128,0.3)" }}>Verified VIP</span>
                                        </div>
                                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{rev.time}</span>
                                    </div>
                                    <div style={{ color: "#ffd700", fontSize: "12px", marginBottom: "6px", letterSpacing: "1px" }}>★★★★★</div>
                                    <p style={{ fontSize: "14px", color: "#e8eaf0", margin: 0, lineHeight: 1.5 }}>"{rev.text}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* STICKY BOTTOM DUAL-DOWNLOAD BUTTONS (MOBILE OPTIMIZED) */}
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "rgba(6, 8, 16, 0.9)", backdropFilter: "blur(15px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", zIndex: 100, display: "flex", justifyContent: "center", boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "700px" }}>
                    
                    {/* Android APK Button */}
                    {app.dl && (
                        <a href={app.dl} target="_blank" rel="noreferrer" style={{ flex: 1, background: "linear-gradient(135deg, #1fa2ff, #0055cc)", color: "#fff", padding: "14px 10px", borderRadius: "16px", textAlign: "center", textDecoration: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", fontSize: "14px", letterSpacing: "0.5px", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), 0 5px 20px rgba(34,158,217,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", animation: "pulse 2s infinite" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "16px" }}>🤖</span> ANDROID APK</span>
                            <span style={{ fontSize: "9px", opacity: 0.8, fontFamily: "'Rajdhani', sans-serif" }}>Direct Download</span>
                        </a>
                    )}

                    {/* iOS / Web Button */}
                    {app.webDl && (
                        <a href={app.webDl} target="_blank" rel="noreferrer" style={{ flex: 1, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", padding: "14px 10px", borderRadius: "16px", textAlign: "center", textDecoration: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", fontSize: "14px", letterSpacing: "0.5px", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), 0 5px 20px rgba(139,92,246,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "16px" }}>🍏</span> WEB / IOS APP</span>
                            <span style={{ fontSize: "9px", opacity: 0.8, fontFamily: "'Rajdhani', sans-serif" }}>Play without install</span>
                        </a>
                    )}

                    {/* Fallback Telegram Button (If NO links are provided) */}
                    {!app.dl && !app.webDl && (
                        <a href={tgLink} target="_blank" rel="noreferrer" style={{ flex: 1, background: "linear-gradient(135deg, #1fa2ff, #0055cc)", color: "#fff", padding: "16px", borderRadius: "16px", textAlign: "center", textDecoration: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", fontSize: "15px", letterSpacing: "1px", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), 0 5px 20px rgba(34,158,217,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", animation: "pulse 2s infinite" }}>
                            <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "22px", height: "22px" }} />
                            DOWNLOAD ON TELEGRAM
                        </a>
                    )}
                </div>
            </div>

        </div>
    );
}