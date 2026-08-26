"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Home() {
  // ── APP & DB STATE ──
  const [apps, setApps] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [screenshots, setScreenshots] = useState<any[]>([]);

  // ── UI STATE ──
  const [isLoading, setIsLoading] = useState(true);
  const [showNotif, setShowNotif] = useState(true);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── FETCH DATA FROM MONGODB ──
  useEffect(() => {
    async function loadData() {
      try {
        const [resApps, resSettings, resScreenshots] = await Promise.all([
          fetch("/api/apps").then((r) => r.json()),
          fetch("/api/settings").then((r) => r.json()),
          fetch("/api/screenshots").then((r) => r.json()),
        ]);

        if (resApps.success) setApps(resApps.apps);
        if (resScreenshots.success) setScreenshots(resScreenshots.screenshots);

        if (resSettings.success && resSettings.settings) {
          const s = resSettings.settings;
          setSettings(s);

          // Dynamically update SEO Meta Tags
          if (s.metaTitle) document.title = s.metaTitle;
          if (s.metaDesc) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute("content", s.metaDesc);
          }
        }
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setTimeout(() => setIsLoading(false), 1600);
      }
    }

    loadData();

    const annTimer = setTimeout(() => setShowAnnounce(true), 3500);
    return () => clearTimeout(annTimer);
  }, []);

  // ── SCROLL REVEAL ──
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("on");
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory, searchQuery, apps]);

  // ── CANVAS BG ──
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
    let P: any[] = [];
    let animId: number;

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < 80; i++) {
      P.push({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        r: Math.random() * 1.5 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.4 + 0.1, c: Math.random() > 0.5 ? "255,106,0" : "0,245,255",
      });
    }

    const draw = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      P.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(${p.c},${p.a})`; cx.fill();
      });
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            cx.beginPath(); cx.moveTo(P[i].x, P[i].y); cx.lineTo(P[j].x, P[j].y);
            cx.strokeStyle = `rgba(255,106,0,${(1 - d / 100) * 0.07})`; cx.lineWidth = 1; cx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  // ── FILTERING LOGIC ──
  const categories = ["All", ...Array.from(new Set(apps.map(a => a.category).filter(Boolean)))];
  const filteredApps = apps.filter(app => {
    const matchCat = activeCategory === "All" || app.category === activeCategory;
    const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.desc && app.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });
  const topApps = apps.filter(app => app.top).slice(0, 6);

  // Fallback Telegram Link with new handle
  const tgLink = settings?.tg || "https://t.me/modapksh";

  return (
    <>
      <div id="ld" className={!isLoading ? "hide" : ""}>
        <div className="ll">DTBOSS</div>
        <div className="lb"><div className="lf"></div></div>
        <div className="lt">LOADING BOSS MODE...</div>
      </div>
      <canvas id="bgC" ref={canvasRef}></canvas>

      {showNotif && settings?.notifMsg && (
        <div id="nBar">
          <span>🔔</span>
          <div className="nt"><span className="nt-in" id="tickTxt">{settings.notifMsg}</span></div>
          <span className="nx" onClick={() => setShowNotif(false)}>✕</span>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className={!showNotif || !settings?.notifMsg ? "no-banner" : ""}>
        <Link href="/" className="nl">
          <img src="https://i.ibb.co/C3MnW05j/Logo.jpg" alt="DTBOSS" style={{ width: "34px", height: "34px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span className="nl-t">DT<span style={{ color: "var(--gold)" }}>BOSS</span></span>
        </Link>
        <div className="nav-lks">
          <a href="#apps">Apps</a>
          <a href="#tops">Top Rated</a>
          <a href="#slid">Gallery</a>
          <a href={tgLink} target="_blank" rel="noreferrer">Telegram</a>
        </div>
        <div className="ns">
          <span className="si">🔍</span>
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <a href={tgLink} target="_blank" rel="noreferrer" className="ntg">
          <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "16px", height: "16px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          JOIN TG
        </a>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section id="hero">
          <div className="h-ring"></div>
          <div className="h-badge">● LIVE · DTBOSS APK HUB 2026</div>
          <h1 className="ht">DOWNLOAD<br /><span className="grd">PREMIUM APPS</span><br />FOR FREE</h1>
          <p className="h-sub">The #1 destination for the latest Android apps. Fast downloads. Zero cost. Always updated.</p>
          <div className="h-cta">
            <a href={tgLink} target="_blank" rel="noreferrer" className="btg">
              <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "18px", height: "18px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
              Join Telegram Channel
            </a>
            <a href="#apps" className="bbr">Browse All Apps →</a>
          </div>
          <div className="h-stats">
            <div className="stat"><div className="sn">{apps.length}</div><div className="sl">Apps Listed</div></div>
            <div className="stat"><div className="sn">100K+</div><div className="sl">Downloads</div></div>
            <div className="stat"><div className="sn">{settings?.members || "50K+"}</div><div className="sl">Community</div></div>
            <div className="stat"><div className="sn">99%</div><div className="sl">Uptime</div></div>
          </div>
        </section>

        {/* ── FEATURED BANNER ── */}
        <div id="featured">
          <div className="fb rv">
            <div className="fb-left">
              <div className="fb-icon">
                <img src={settings?.featIcon || "https://i.ibb.co/C3MnW05j/Logo.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }} />
              </div>
              <div>
                <div className="fb-tag">⭐ APP OF THE WEEK</div>
                <div className="fb-name">{settings?.featTitle || "Loading..."}</div>
                <div className="fb-meta">{settings?.featMeta || "Loading..."}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>SIZE</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: "var(--accent)" }}>{settings?.featSize || "0MB"}</div>
              </div>
              <a href={settings?.featDl || tgLink} target="_blank" rel="noreferrer" className="bdl">⬇ DOWNLOAD NOW</a>
            </div>
          </div>
        </div>

        {/* ── LATEST APPS ── */}
        <section id="apps">
          <div className="sh rv"><h2>LATEST APPS</h2><div className="sdiv"></div><p className="sub">Fresh drops. Always updated. Always free.</p></div>
          <div className="cat-f">
            {categories.map(cat => (
              <button key={cat as string} className={`cb ${activeCategory === cat ? 'on' : ''}`} onClick={() => setActiveCategory(cat as string)}>{cat as string}</button>
            ))}
          </div>
          {filteredApps.length > 0 ? (
            <div className="ag">
              {filteredApps.map((app, i) => (
                <div key={app._id} className="ac rv" style={{ animationDelay: `${i * 0.07}s` }}>
                  {app.badge === 'new' && <div className="bn bn-new">NEW</div>}
                  {app.badge === 'hot' && <div className="bn bn-hot">🔥 HOT</div>}
                  <div className="act">
                    <div className="ai">
                      {app.icon?.startsWith('http') ? <img src={app.icon} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "13px" }} /> : <span>{app.icon || "📦"}</span>}
                    </div>
                    <div className="ain">
                      <Link href={`/apk/${app.slug || app._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h3>{app.name}</h3>
                      </Link>
                      <div className="av">{app.version}</div>
                    </div>
                  </div>
                  <div className="ad">{app.desc}</div>
                  <div className="am"><span>📦 {app.size}</span><span>🗓 {app.release_date}</span></div>
                  <div className="asp">
                    {app.specs && app.specs.map((s: string, idx: number) => <span key={idx} className="st">{s}</span>)}
                  </div>

                  {/* Link to dedicated App page */}
                  <Link href={`/apk/${app.slug || app._id}`} className="adb" style={{ textDecoration: 'none' }}>
                    ⬇ VIEW & DOWNLOAD
                  </Link>
                  {app.download_count > 0 && <div className="dlc">⬇ {app.download_count} downloads</div>}
                </div>
              ))}
            </div>
          ) : (
            <div id="noRes" style={{ display: "block", textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", letterSpacing: "1px" }}>NO APPS FOUND</p>
              <p style={{ fontSize: "12px", marginTop: "8px", color: "var(--muted)" }}>Try a different search or category</p>
            </div>
          )}
        </section>

        {/* ── TOP RATED ── */}
        <div id="tops" style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="sh rv"><h2>TOP RATED APPS</h2><div className="sdiv"></div><p className="sub">Community favourites with most downloads</p></div>
          <div className="tl">
            {topApps.map((app, i) => (
              <div key={app._id} className="ti rv">
                <div className={`tr ${i === 0 ? 'gld' : ''}`}>#{i + 1}</div>
                <div className="tii">
                  {app.icon?.startsWith('http') ? <img src={app.icon} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{app.icon || "📦"}</span>}
                </div>
                <div className="tin">
                  <Link href={`/apk/${app.slug || app._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h4>{app.name}</h4>
                  </Link>
                  <span>{app.version} · {app.size}</span>
                </div>
                <Link href={`/apk/${app.slug || app._id}`} className="tdb" style={{ textDecoration: "none" }}>
                  ⬇ GET
                </Link>
              </div>
            ))}
            {topApps.length === 0 && <p style={{ color: "var(--muted)", textAlign: "center" }}>No top apps currently available.</p>}
          </div>
        </div>

        {/* ── TELEGRAM CTA ── */}
        <div id="tgcta">
          <div className="tgi rv">
            <img src="https://dtbosshub.com/icons/telegram.png" alt="Telegram" style={{ width: "80px", height: "80px", objectFit: "contain", margin: "0 auto 20px", display: "block" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            <h2>JOIN THE DTBOSS CHANNEL</h2>
            <p>Get instant notifications for every new app drop. Exclusive content, early access, and community support — all in one place.</p>
            <a href={tgLink} target="_blank" rel="noreferrer" className="btgb">
              <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} /> Open Telegram Channel
            </a>
            <div className="tgm"><span className="dot"></span><span>{settings?.members || "50,000+"}</span> members active</div>
          </div>
        </div>

        {/* ── SLIDER ── */}
        <div id="slid">
          <div className="sli"><div className="sh rv"><h2>APP GALLERY</h2><div className="sdiv"></div><p className="sub">See what's inside before you download</p></div></div>
          <div className="slw">
            <div className="slt" id="slTk">
              {screenshots.length > 0 ? (
                [...screenshots, ...screenshots].map((s, i) => (
                  <div key={i} className="si">
                    <img src={s.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--muted)", width: "100vw", textAlign: "center" }}>NO SCREENSHOTS ADDED</div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer>
          <div className="ft">
            <div className="ftt">
              <div className="fb2">
                <Link href="/" className="nl">
                  <img src="https://i.ibb.co/C3MnW05j/Logo.jpg" alt="DTBOSS" style={{ width: "34px", height: "34px", objectFit: "contain" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span className="nl-t">DT<span style={{ color: "var(--gold)" }}>BOSS</span></span>
                </Link>
                <p>Your #1 source for premium Android apps. Safe, fast and always free. Join our community today.</p>
                <div className="fts">
                  <a href={tgLink} target="_blank" rel="noreferrer" className="fs">
                    <img src="https://dtbosshub.com/icons/telegram.png" alt="TG" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                  </a>
                  {settings?.yt && (
                    <a href={settings.yt} target="_blank" rel="noreferrer" className="fs">
                      <img src="https://dtbosshub.com/icons/youtube.png" alt="YT" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                    </a>
                  )}
                  {settings?.wa && (
                    <a href={settings.wa} target="_blank" rel="noreferrer" className="fs">
                      <img src="https://dtbosshub.com/icons/whatsapp.png" alt="WA" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                    </a>
                  )}
                  {settings?.ig && settings.ig !== "#" && (
                    <a href={settings.ig} target="_blank" rel="noreferrer" className="fs">
                      <img src="https://dtbosshub.com/icons/instagram.png" alt="IG" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                    </a>
                  )}
                </div>
              </div>
              <div className="fc"><h4>Navigation</h4><a href="#apps">All Apps</a><a href="#tops">Top Rated</a><a href="#tgcta">Telegram</a><a href="#slid">Gallery</a></div>
              <div className="fc"><h4>Categories</h4><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('Tools'); }}>Tools</a><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('Games'); }}>Games</a><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('Multimedia'); }}>Multimedia</a></div>
              <div className="fc"><h4>Info</h4><Link href="/about">About Us</Link><Link href="/privacy">Privacy Policy</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/dmca">DMCA</Link></div>
            </div>
            <div className="fb3"><p>© 2026 DTBOSS MOD APK HUB · All rights reserved.</p><span>BUILT FOR THE BOSS IN YOU</span></div>
          </div>
        </footer>
      </main>

      {/* ── FLOATING SOCIALS ── */}
      <div id="sf">
        <a href={tgLink} target="_blank" rel="noreferrer" className="sfb sf-tg">
          <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
          <span className="sft">Telegram</span>
        </a>
        {settings?.yt && (
          <a href={settings.yt} target="_blank" rel="noreferrer" className="sfb sf-yt">
            <img src="https://dtbosshub.com/icons/youtube.png" alt="" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
            <span className="sft">YouTube</span>
          </a>
        )}
        {settings?.wa && (
          <a href={settings.wa} target="_blank" rel="noreferrer" className="sfb sf-wa">
            <img src="https://dtbosshub.com/icons/whatsapp.png" alt="" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
            <span className="sft">WhatsApp</span>
          </a>
        )}
      </div>

      {/* ── ANNOUNCEMENT POPUP ── */}
      {showAnnounce && settings?.annEnabled === "1" && (
        <div id="annPop" className="show" onClick={() => setShowAnnounce(false)}>
          <div className="anb" onClick={(e) => e.stopPropagation()}>
            <button className="anx" onClick={() => setShowAnnounce(false)}>✕</button>
            <div className="ani">{settings?.annIcon || "📢"}</div>
            <div className="ant">{settings?.annTitle || "NEW DROP ALERT!"}</div>
            <div className="anbd">{settings?.annBody || "Fresh apps just dropped."}</div>
            <a href={tgLink} target="_blank" rel="noreferrer" className="anct">
              <img src="https://dtbosshub.com/icons/telegram.png" alt="" style={{ width: "16px", height: "16px", objectFit: "contain" }} /> {settings?.annBtnText || "Join Telegram"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}