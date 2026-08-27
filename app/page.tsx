"use client";

import { useEffect, useState, useRef } from "react";

export default function LandingPage() {
    const [deviceInfo, setDeviceInfo] = useState("Desktop");
    const hasTrackedView = useRef(false);
    const telegramUsername = "modapksh"; // <--- CHANGE THIS TO YOUR TG USERNAME

    // ── 1. DETECT DEVICE & LOG PAGE VIEW ONCE ──
    useEffect(() => {
        if (hasTrackedView.current) return;
        hasTrackedView.current = true;

        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        let device = "Desktop";
        if (/iPad|iPhone|iPod/.test(ua)) device = "iOS";
        else if (/android/i.test(ua)) device = "Android";
        setDeviceInfo(device);

        trackEvent("page_view", device, ua);
    }, []);

    // ── 2. MASTER TRACKING FUNCTION ──
    const trackEvent = async (event_type: string, device = deviceInfo, ua = navigator.userAgent) => {
        try {
            await fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_type, device, user_agent: ua }),
                keepalive: true
            });
        } catch (e) {
            console.error("Tracking failed", e);
        }
    };

    // ── 3. THE 100% ACCURATE DEEP LINK ENGINE ──
    const handleJoinClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        await trackEvent("button_click");

        const fallbackUrl = "/";
        const iosUrl = `tg://resolve?domain=${telegramUsername}`;
        const androidUrl = `intent://resolve?domain=${telegramUsername}#Intent;package=org.telegram.messenger;scheme=tg;end;`;
        const webUrl = `https://t.me/${telegramUsername}`;

        if (deviceInfo === "Desktop") {
            await trackEvent("telegram_desktop_click");
            window.location.href = webUrl;
            return;
        }

        let appOpened = false;
        let timeoutId: NodeJS.Timeout;

        const handleVisibilityChange = () => {
            if (document.hidden && !appOpened) {
                appOpened = true;
                clearTimeout(timeoutId);
                trackEvent("telegram_success");
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        if (deviceInfo === "Android") window.location.href = androidUrl;
        else if (deviceInfo === "iOS") window.location.href = iosUrl;

        timeoutId = setTimeout(() => {
            if (!appOpened && !document.hidden) {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                trackEvent("telegram_failed");
                trackEvent("redirect_main");
                window.location.href = fallbackUrl;
            }
        }, 3000);
    };

    return (
        <>
            {/* INJECT CSS ANIMATIONS */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(34, 158, 217, 0.7); }
          70% { box-shadow: 0 0 0 25px rgba(34, 158, 217, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 158, 217, 0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}} />

            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060810", color: "#fff", fontFamily: "'Rajdhani', sans-serif", textAlign: "center", padding: "40px 20px", position: "relative", overflowX: "hidden" }}>

                {/* Animated Background Orbs */}
                <div style={{ position: "absolute", top: "-5%", left: "-10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}></div>
                <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(34,158,217,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}></div>

                {/* Top Scarcity Badge */}
                <div style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", color: "#ffd700", padding: "8px 20px", borderRadius: "50px", fontSize: "12px", fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px", zIndex: 10, display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", boxShadow: "0 4px 15px rgba(255,215,0,0.1)" }}>
                    <span style={{ width: "8px", height: "8px", background: "#ffd700", borderRadius: "50%", animation: "blink 1.5s infinite" }}></span>
                    ⚡ VIP SERVER: 14 ACCESS SLOTS LEFT
                </div>

                {/* Main Premium Glassmorphism Card */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "440px", width: "100%", background: "rgba(18, 22, 33, 0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "28px", padding: "40px 24px", boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)" }}>

                    {/* Floating Logo */}
                    <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: "20px", borderRadius: "100%" }}>
                        <img src="https://i.ibb.co/C3MnW05j/Logo.jpg" alt="DTBOSS Logo" style={{ width: "95px", height: "95px", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(255,106,0,0.6))", borderRadius: "100%" }} />
                    </div>

                    <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "32px", fontWeight: 900, lineHeight: 1.2, marginBottom: "12px", textTransform: "uppercase" }}>
                        ANALYZE DATA <br />
                        <span style={{ background: "linear-gradient(90deg, #ff6a00, #ffd700, #ff6a00)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>
                            PATTERNS INSTANTLY
                        </span>
                    </h1>

                    <p style={{ color: "var(--text)", fontSize: "16px", marginBottom: "25px", lineHeight: 1.6, padding: "0 10px" }}>
                        Access our advanced data sequence algorithms. Activate your private dashboard, and analyze real-time statistical patterns instantly.
                    </p>

                    {/* Clean 3-Step Process */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "15px", color: "#e8eaf0", fontWeight: 600 }}>
                        <span style={{ background: "rgba(34, 158, 217, 0.15)", color: "#229ED9", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,158,217,0.3)" }}>1️⃣</span>
                        Download the Analytics App
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "15px", color: "#e8eaf0", fontWeight: 600 }}>
                        <span style={{ background: "rgba(34, 158, 217, 0.15)", color: "#229ED9", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,158,217,0.3)" }}>2️⃣</span>
                        Login & Sync Your Data
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "15px", color: "#e8eaf0", fontWeight: 600 }}>
                        <span style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(74, 222, 128, 0.4)", boxShadow: "0 0 15px rgba(74, 222, 128, 0.2)" }}>3️⃣</span>
                        View Statistical Sequences
                    </div>

                    {/* The Magic Pulsing Button */}
                    <button onClick={handleJoinClick} style={{ width: "100%", background: "linear-gradient(135deg, #1fa2ff, #0055cc)", color: "#fff", padding: "18px 24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)", fontSize: "16px", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", animation: "pulseRing 2s infinite", transition: "transform 0.2s ease", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.2), 0 10px 30px rgba(34,158,217,0.4)" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                        <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "26px", height: "26px" }} />
                        JOIN OFFICIAL COMMUNITY
                    </button>

                    {/* ⭐ Beautiful Reviews Section */}
                    <div style={{ marginTop: "30px", width: "100%", background: "rgba(0,0,0,0.4)", borderRadius: "20px", padding: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ fontSize: "11px", color: "var(--gold)", marginBottom: "16px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <span style={{ width: "6px", height: "6px", background: "var(--gold)", borderRadius: "50%", display: "inline-block" }}></span>
                            Recent Active Users
                        </p>

                        {/* Review 1 */}
                        <div style={{ display: "flex", gap: "12px", textAlign: "left", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "14px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #ff6a00, #ff9f43)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>R</div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>Rahul S. <span style={{ fontSize: "10px" }}>✔️</span></span>
                                    <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>Just now</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>"Got the data sequence tool. The analytical accuracy over the last 4 days has been insane! Highly recommend."</p>                            </div>
                        </div>

                        {/* Review 2 */}
                        <div style={{ display: "flex", gap: "12px", textAlign: "left" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #229ED9, #0055cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>A</div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>Amit K. <span style={{ fontSize: "10px" }}>✔️</span></span>
                                    <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>10 mins ago</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>"100% legit utility. The sequence analyzer works perfectly and runs flawlessly on my phone."</p>
                            </div>
                        </div>
                    </div>

                    {/* Secure Footer */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "25px", paddingTop: "5px", width: "100%" }}>
                        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                            {"⭐⭐⭐⭐⭐".split("").map((star, i) => <span key={i} style={{ fontSize: "16px", filter: "drop-shadow(0 0 5px rgba(255,215,0,0.5))" }}>{star}</span>)}
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, fontWeight: 600, letterSpacing: "0.5px" }}>100% SECURE & VERIFIED ALGORITHMS</p>
                    </div>

                </div>

                {/* Live Members Bottom Sticky */}
                <div style={{ position: "fixed", bottom: "30px", zIndex: 50, display: "flex", alignItems: "center", gap: "10px", background: "rgba(10, 15, 25, 0.8)", padding: "12px 24px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(15px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                    <span style={{ width: "12px", height: "12px", background: "#4ade80", borderRadius: "50%", animation: "blink 2s infinite", boxShadow: "0 0 12px #4ade80" }}></span>
                    <span style={{ fontSize: "14px", color: "#e8eaf0", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.5px" }}>7,452 VIP Members Active</span>
                </div>

            </div>
        </>
    );
}