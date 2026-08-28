"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DEFAULT_APP_FORM = {
  name: "", version: "v1.0.0", size: "5MB", icon: "", category: "Games", badge: "", desc: "",
  specs: "Android + IOS, Paid Version, 100% Secure", dl: "", webDl: "", rank: 0, top: false, release_date: new Date().toISOString().split("T")[0],
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newAdminPass, setNewAdminPass] = useState(""); // 🔒 For changing password
  
  const [tab, setTab] = useState<"apps" | "settings" | "gallery" | "analytics">("apps");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [apps, setApps] = useState<any[]>([]);
  const [appForm, setAppForm] = useState(DEFAULT_APP_FORM);
  const [editId, setEditId] = useState<string | null>(null);

  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const [analytics, setAnalytics] = useState({ funnel: { pageViews: 0, clicks: 0, successes: 0, fails: 0, redirects: 0 }, devices: { ios: 0, android: 0, desktop: 0 } });

  const [settings, setSettings] = useState<any>({ tg: "", wa: "", yt: "", ig: "", metaTitle: "", metaDesc: "", metaKeys: "", notifMsg: "", featTitle: "", featMeta: "", featSize: "", featIcon: "", featDl: "", annEnabled: "0", annTitle: "", annBody: "", annBtnText: "Join Telegram" });

  // 🔒 SECURE LOGIN CHECK (NO HARDCODED PASSWORDS)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", adminPass: password })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert("Invalid Admin Password!");
      }
    } catch (err) {
      alert("Server error connecting to database.");
    }
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const t = Date.now();
      const [resApps, resSettings, resScreenshots, resAnalytics] = await Promise.all([
        fetch(`/api/apps?t=${t}`, { cache: "no-store" }).then(r => r.json()),
        fetch(`/api/settings?t=${t}`, { cache: "no-store" }).then(r => r.json()),
        fetch(`/api/screenshots?t=${t}`, { cache: "no-store" }).then(r => r.json()),
        fetch(`/api/analytics?t=${t}`, { cache: "no-store" }).then(r => r.json()),
      ]);
      if (resApps.success) setApps(resApps.apps);
      if (resSettings.success && resSettings.settings) setSettings(resSettings.settings);
      if (resScreenshots.success) setScreenshots(resScreenshots.screenshots);
      if (resAnalytics.success) setAnalytics(resAnalytics.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmitApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const payload = editId ? { ...appForm, id: editId, adminPass: password } : { ...appForm, adminPass: password };
      const res = await fetch("/api/apps", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { setStatusMsg(editId ? "✅ App updated!" : "✅ App added!"); handleCancelEdit(); fetchData(); } else alert("Error: " + data.error);
    } catch (err: any) { alert("Error: " + err.message); }
    setLoading(false); setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleEditClick = (app: any) => { setEditId(app._id); setAppForm({ name: app.name, version: app.version, size: app.size, icon: app.icon, category: app.category, badge: app.badge, desc: app.desc, specs: Array.isArray(app.specs) ? app.specs.join(", ") : (app.specs || ""), dl: app.dl || "", webDl: app.webDl || "", rank: app.rank || 0, top: app.top, release_date: app.release_date, }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleCancelEdit = () => { setEditId(null); setAppForm(DEFAULT_APP_FORM); };
  const handleDeleteApp = async (id: string) => { if (!confirm("Delete this app?")) return; const res = await fetch(`/api/apps?id=${id}&adminPass=${password}`, { method: "DELETE" }); const data = await res.json(); if (data.success) fetchData(); };

  const handleAddScreenshot = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { const res = await fetch("/api/screenshots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: screenshotUrl, adminPass: password }) }); const data = await res.json(); if (data.success) { setScreenshotUrl(""); fetchData(); } else alert("Error"); } catch (err: any) {} setLoading(false); };
  const handleDeleteScreenshot = async (id: string) => { if (!confirm("Delete image?")) return; const res = await fetch(`/api/screenshots?id=${id}&adminPass=${password}`, { method: "DELETE" }); const data = await res.json(); if (data.success) fetchData(); };

  // 🔒 SAVE SETTINGS AND HANDLE PASSWORD CHANGE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ ...settings, adminPass: password, newAdminPass }) 
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Settings saved successfully!");
        if (newAdminPass) {
          setPassword(newAdminPass); // Update local auth state so we don't get locked out
          setNewAdminPass("");       // Clear the box
          alert("🔐 Admin password has been successfully changed!");
        }
      } else {
        alert("Error saving settings");
      }
    } catch (err: any) { alert("Error: " + err.message); }
    setLoading(false);
  };

  if (!isAuthenticated) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "#fff", padding: "20px" }}>
      <form onSubmit={handleLogin} style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "30px", borderRadius: "14px", width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "20px", color: "var(--accent)", marginBottom: "15px" }}>ADMIN LOGIN</h2>
        <input type="password" placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", outline: "none", marginBottom: "15px", fontSize: "14px" }} />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, var(--accent), var(--a2))", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif", cursor: "pointer" }}>{loading ? "VERIFYING..." : "UNLOCK DASHBOARD"}</button>
      </form>
    </div>
  );

  const { funnel, devices } = analytics;
  const clickRate = funnel.pageViews > 0 ? ((funnel.clicks / funnel.pageViews) * 100).toFixed(1) : "0";
  const successRate = funnel.clicks > 0 ? ((funnel.successes / funnel.clicks) * 100).toFixed(1) : "0";
  const failRate = funnel.clicks > 0 ? ((funnel.fails / funnel.clicks) * 100).toFixed(1) : "0";
  const sortedApps = [...apps].sort((a, b) => (a.rank || 0) - (b.rank || 0));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "15px", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px" }}>DT<span style={{ color: "var(--gold)" }}>BOSS</span> ADMIN</h1>
        <div><Link href="/" style={{ color: "var(--accent)", marginRight: "20px", textDecoration: "none", fontSize: "14px" }}>← View Website</Link><button onClick={() => setIsAuthenticated(false)} style={{ background: "rgba(255,50,50,0.2)", border: "1px solid rgba(255,50,50,0.4)", color: "#ff6b6b", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" }}>Logout</button></div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
        <button onClick={() => setTab("analytics")} style={tabStyle(tab === "analytics")}>📊 ANALYTICS</button>
        <button onClick={() => setTab("apps")} style={tabStyle(tab === "apps")}>📱 APPS MANAGER ({apps.length})</button>
        <button onClick={() => setTab("gallery")} style={tabStyle(tab === "gallery")}>🖼 GALLERY ({screenshots.length})</button>
        <button onClick={() => setTab("settings")} style={tabStyle(tab === "settings")}>⚙️ SITE & SEO SETTINGS</button>
      </div>

      {/* Analytics, Apps, Gallery tabs stay exactly the same */}
      {tab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon)" }}>LANDING PAGE PERFORMANCE</h3><button onClick={fetchData} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>🔄 Refresh Data</button></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}><div style={statBoxStyle}><div style={statTitleStyle}>TOTAL PAGE VIEWS</div><div style={{ ...statValueStyle, color: "#fff" }}>{funnel.pageViews}</div></div><div style={statBoxStyle}><div style={statTitleStyle}>BUTTON CLICKS (CTR: {clickRate}%)</div><div style={{ ...statValueStyle, color: "var(--neon)" }}>{funnel.clicks}</div></div><div style={statBoxStyle}><div style={statTitleStyle}>TG OPEN SUCCESS ({successRate}%)</div><div style={{ ...statValueStyle, color: "#4ade80" }}>{funnel.successes}</div></div><div style={statBoxStyle}><div style={statTitleStyle}>TG FAIL / REDIRECTS ({failRate}%)</div><div style={{ ...statValueStyle, color: "#ff6b6b" }}>{funnel.fails}</div></div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}><div style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "24px", borderRadius: "14px" }}><h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "var(--gold)", marginBottom: "15px" }}>DEVICE BREAKDOWN (Views)</h3><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "5px" }}><span style={{ color: "var(--muted)" }}>🤖 Android</span><span style={{ fontWeight: "bold" }}>{devices.android}</span></div><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "5px" }}><span style={{ color: "var(--muted)" }}>🍏 iOS</span><span style={{ fontWeight: "bold" }}>{devices.ios}</span></div><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>💻 Desktop</span><span style={{ fontWeight: "bold" }}>{devices.desktop}</span></div></div><div style={{ background: "rgba(34,158,217,0.05)", border: "1px solid rgba(34,158,217,0.2)", padding: "24px", borderRadius: "14px" }}><h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#229ED9", marginBottom: "10px" }}>HOW IT WORKS</h3><p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}><strong>TG Open Success:</strong> The user clicked the button and their phone successfully switched to the Telegram App.<br /><br /><strong>TG Fail / Redirects:</strong> The user clicked, but Telegram did not open. These users were automatically redirected to your main DTBOSS Hub to save the traffic.</p></div></div>
        </div>
      )}

      {tab === "apps" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "24px", borderRadius: "14px", alignSelf: "start" }}><h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", color: editId ? "var(--neon)" : "var(--accent)", marginBottom: "18px", display: "flex", justifyContent: "space-between" }}>{editId ? "✏️ EDIT MOD APK" : "➕ ADD NEW MOD APK"}{editId && <span onClick={handleCancelEdit} style={{ cursor: "pointer", color: "var(--muted)", fontSize: "12px", fontFamily: "'Rajdhani', sans-serif" }}>Cancel Edit</span>}</h3>{statusMsg && <div style={{ color: "#4ade80", marginBottom: "12px", fontSize: "13px" }}>{statusMsg}</div>}
            <form onSubmit={handleSubmitApp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div><label style={labelStyle}>App Name</label><input required type="text" value={appForm.name} onChange={(e) => setAppForm({ ...appForm, name: e.target.value })} style={inputStyle} /></div>
              <div style={{ display: "flex", gap: "10px" }}><div style={{ flex: 1 }}><label style={labelStyle}>Version</label><input type="text" value={appForm.version} onChange={(e) => setAppForm({ ...appForm, version: e.target.value })} style={inputStyle} /></div><div style={{ flex: 1 }}><label style={labelStyle}>Size</label><input type="text" value={appForm.size} onChange={(e) => setAppForm({ ...appForm, size: e.target.value })} style={inputStyle} /></div></div>
              <div><label style={labelStyle}>Icon Image URL</label><input required type="text" value={appForm.icon} onChange={(e) => setAppForm({ ...appForm, icon: e.target.value })} style={inputStyle} /></div>
              <div style={{ display: "flex", gap: "10px" }}><div style={{ flex: 1 }}><label style={labelStyle}>Android APK Link (Required)</label><input required type="text" value={appForm.dl} onChange={(e) => setAppForm({ ...appForm, dl: e.target.value })} style={inputStyle} /></div><div style={{ flex: 1 }}><label style={labelStyle}>Web / iOS Link (Optional)</label><input type="text" value={appForm.webDl} onChange={(e) => setAppForm({ ...appForm, webDl: e.target.value })} style={inputStyle} /></div></div>
              <div style={{ display: "flex", gap: "10px" }}><div style={{ flex: 1 }}><label style={labelStyle}>Badge</label><select value={appForm.badge} onChange={(e) => setAppForm({ ...appForm, badge: e.target.value })} style={inputStyle}><option value="">None</option><option value="hot">🔥 HOT</option><option value="new">⚡ NEW</option></select></div><div style={{ flex: 1 }}><label style={labelStyle}>Category</label><select value={appForm.category} onChange={(e) => setAppForm({ ...appForm, category: e.target.value })} style={inputStyle}><option value="Games">Games</option><option value="Tools">Tools</option><option value="Multimedia">Multimedia</option><option value="Utilities">Utilities</option></select></div><div style={{ flex: 1 }}><label style={labelStyle}>Ranking Order (0 = First)</label><input type="number" value={appForm.rank} onChange={(e) => setAppForm({ ...appForm, rank: Number(e.target.value) })} style={inputStyle} /></div></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0" }}><input type="checkbox" id="topCheck" checked={appForm.top} onChange={(e) => setAppForm({ ...appForm, top: e.target.checked })} style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} /><label htmlFor="topCheck" style={{ fontSize: "13px", color: "var(--gold)", fontWeight: "bold" }}>⭐ Mark as Top / Trending App</label></div>
              <div><label style={labelStyle}>Specs (comma separated)</label><input type="text" value={appForm.specs} onChange={(e) => setAppForm({ ...appForm, specs: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Short Description</label><textarea rows={2} value={appForm.desc} onChange={(e) => setAppForm({ ...appForm, desc: e.target.value })} style={{ ...inputStyle, resize: "none" }}></textarea></div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}><button type="submit" disabled={loading} style={{ ...btnStyle, flex: 1, background: editId ? "linear-gradient(135deg, var(--neon2), var(--neon))" : "linear-gradient(135deg, var(--accent), var(--a2))", marginTop: 0 }}>{loading ? "SAVING..." : (editId ? "💾 SAVE CHANGES" : "➕ ADD APP TO HUB")}</button>{editId && <button type="button" onClick={handleCancelEdit} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold" }}>CANCEL</button>}</div>
            </form>
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "24px", borderRadius: "14px", overflowY: "auto", maxHeight: "780px" }}><h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", marginBottom: "18px" }}>ALL PUBLISHED APPS</h3><div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{sortedApps.map((app) => (<div key={app._id} style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", borderRadius: "10px" }}><img src={app.icon} alt="" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} /><div style={{ flex: 1 }}><div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{app.name} <span style={{ color: "var(--muted)", fontSize: "11px", marginLeft: "6px" }}>[Rank: {app.rank || 0}]</span>{app.top && <span style={{ color: "var(--gold)", fontSize: "11px", marginLeft: "6px" }}>[TOP]</span>} {app.badge && <span style={{ color: "var(--accent)", fontSize: "11px", marginLeft: "6px" }}>[{app.badge.toUpperCase()}]</span>}</div><div style={{ fontSize: "12px", color: "var(--muted)" }}>{app.version} · {app.size} · {app.category}</div></div><div><button onClick={() => handleEditClick(app)} style={{ background: "rgba(0, 245, 255, 0.15)", border: "1px solid rgba(0, 245, 255, 0.3)", color: "var(--neon)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", marginRight: "8px" }}>Edit</button><button onClick={() => handleDeleteApp(app._id)} style={{ background: "rgba(255,50,50,0.15)", border: "1px solid rgba(255,50,50,0.3)", color: "#ff6b6b", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button></div></div>))}</div></div>
        </div>
      )}

      {tab === "gallery" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "800px" }}>
          <form onSubmit={handleAddScreenshot} style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "24px", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "flex-end" }}><div style={{ flex: 1 }}><label style={labelStyle}>Add New Screenshot URL (e.g., https://i.ibb.co/...)</label><input required type="text" placeholder="Paste Image Link Here" value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} style={inputStyle} /></div><button type="submit" disabled={loading} style={{ ...btnStyle, padding: "10px 20px", marginTop: "0" }}>+ ADD</button></form>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" }}>{screenshots.map((s) => (<div key={s._id} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg3)", aspectRatio: "9/16" }}><img src={s.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><button onClick={() => handleDeleteScreenshot(s._id)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(255,0,0,0.8)", border: "none", color: "#fff", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>✕</button></div>))}</div>
        </div>
      )}

      {tab === "settings" && (
        <form onSubmit={handleSaveSettings} style={{ background: "var(--bg2)", border: "1px solid var(--border)", padding: "30px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
          
          {/* 🔐 NEW ADMIN SECURITY BOX */}
          <div>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "#ff6b6b", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>🔐 ADMIN SECURITY</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Change Admin Password (Leave blank to keep current)</label>
                <input type="text" placeholder="Enter new password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          <div><h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon)", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>🔍 SEO & META TAGS</h3><div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}><div><label style={labelStyle}>Meta Title</label><input type="text" value={settings.metaTitle} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Meta Description</label><textarea rows={2} value={settings.metaDesc} onChange={(e) => setSettings({ ...settings, metaDesc: e.target.value })} style={{ ...inputStyle, resize: "none" }}></textarea></div><div><label style={labelStyle}>Meta Keywords</label><input type="text" value={settings.metaKeys} onChange={(e) => setSettings({ ...settings, metaKeys: e.target.value })} style={inputStyle} /></div></div></div>
          <div><h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "#25D366", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>💬 SOCIAL MEDIA LINKS</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}><div><label style={labelStyle}>Telegram Link</label><input type="text" value={settings.tg} onChange={(e) => setSettings({ ...settings, tg: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>WhatsApp Link</label><input type="text" value={settings.wa} onChange={(e) => setSettings({ ...settings, wa: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>YouTube Link</label><input type="text" value={settings.yt} onChange={(e) => setSettings({ ...settings, yt: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Instagram Link</label><input type="text" value={settings.ig} onChange={(e) => setSettings({ ...settings, ig: e.target.value })} style={inputStyle} /></div></div></div>
          <div><h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--accent)", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>🔔 GLOBAL ANNOUNCEMENTS</h3><div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}><div><label style={labelStyle}>Top Scrolling Notification Bar Text</label><input type="text" value={settings.notifMsg} onChange={(e) => setSettings({ ...settings, notifMsg: e.target.value })} style={inputStyle} /></div></div><div style={{ marginTop: "15px", padding: "15px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}><div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}><label style={{ fontSize: "14px", color: "var(--gold)", fontWeight: "bold" }}>Popup Announcement Enabled?</label><select value={settings.annEnabled} onChange={(e) => setSettings({ ...settings, annEnabled: e.target.value })} style={{ ...inputStyle, width: "100px", marginTop: "0", padding: "6px" }}><option value="1">YES</option><option value="0">NO</option></select></div><div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}><div><label style={labelStyle}>Popup Title</label><input type="text" value={settings.annTitle} onChange={(e) => setSettings({ ...settings, annTitle: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Popup Message</label><input type="text" value={settings.annBody} onChange={(e) => setSettings({ ...settings, annBody: e.target.value })} style={inputStyle} /></div></div></div></div>
          <div><h3 style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--gold)", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>⭐ APP OF THE WEEK</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}><div><label style={labelStyle}>Featured App Title</label><input type="text" value={settings.featTitle} onChange={(e) => setSettings({ ...settings, featTitle: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Featured App Size</label><input type="text" value={settings.featSize} onChange={(e) => setSettings({ ...settings, featSize: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Icon URL</label><input type="text" value={settings.featIcon} onChange={(e) => setSettings({ ...settings, featIcon: e.target.value })} style={inputStyle} /></div><div><label style={labelStyle}>Download Link</label><input type="text" value={settings.featDl} onChange={(e) => setSettings({ ...settings, featDl: e.target.value })} style={inputStyle} /></div></div><div style={{ marginTop: "12px" }}><label style={labelStyle}>Featured Specs (e.g. v1.2 · Paid Version)</label><input type="text" value={settings.featMeta} onChange={(e) => setSettings({ ...settings, featMeta: e.target.value })} style={inputStyle} /></div></div>
          
          <button type="submit" disabled={loading} style={{ ...btnStyle, padding: "16px", fontSize: "14px", marginTop: "10px" }}>{loading ? "SAVING SETTINGS..." : "SAVE ALL SETTINGS"}</button>
        </form>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: "12px", color: "var(--muted)", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", marginTop: "4px" };
const tabStyle = (isActive: boolean): React.CSSProperties => ({ padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--border)", background: isActive ? "var(--accent)" : "var(--bg2)", color: "#fff", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "12px", flexGrow: 1 });
const btnStyle: React.CSSProperties = { background: "linear-gradient(135deg, var(--accent), var(--a2))", border: "none", color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif", cursor: "pointer", marginTop: "10px" };
const statBoxStyle: React.CSSProperties = { background: "var(--bg2)", border: "1px solid var(--border)", padding: "20px", borderRadius: "14px", textAlign: "center" };
const statTitleStyle: React.CSSProperties = { fontSize: "11px", color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px", fontFamily: "'Space Mono', monospace" };
const statValueStyle: React.CSSProperties = { fontSize: "32px", fontWeight: "bold", fontFamily: "'Orbitron', sans-serif" };