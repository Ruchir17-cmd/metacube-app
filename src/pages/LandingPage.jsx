import mqtt from "mqtt";

const BLUE = "#0A66C2";
const DARK = "#09111f";

function sendTrigger() {
  try {
    const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt", {
      clientId: "metacube_" + Math.random().toString(16).slice(2, 10),
      clean: true,
      reconnectPeriod: 0,
      connectTimeout: 4000,
    });

    client.on("connect", () => {
      client.publish("vapt", JSON.stringify({ trigger: true }), { qos: 0 }, () => {
        client.end();
      });
    });

    client.on("error", () => {
      client.end();
    });
  } catch {}
}

export default function LandingPage({ onNext }) {
  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, sans-serif", background: "#fff", color: "#202124", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", background: DARK,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "80px 24px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(10,102,194,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0A66C2, #004182)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff" }}>V</div>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>Vigil</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(10,102,194,0.14)", border: "1px solid rgba(10,102,194,0.35)", borderRadius: 100, padding: "6px 18px", fontSize: 12, letterSpacing: 1.5, color: "#70B5F9", textTransform: "uppercase", marginBottom: 28, position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.1s ease both", animationFillMode: "both" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#70B5F9", display: "inline-block" }} />
          Cybersecurity Internship &amp; Fresher Program 2026
        </div>

        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 760, marginBottom: 20, background: "linear-gradient(135deg, #fff 0%, #cce4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.2s ease both", animationFillMode: "both" }}>
          Build Your Career in Cybersecurity with Vigil
        </h1>

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 520, lineHeight: 1.75, marginBottom: 20, position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.3s ease both", animationFillMode: "both" }}>
          Join an elite cohort of security professionals. From threat intelligence to penetration testing — shape the future of digital defence.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 48, position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.35s ease both", animationFillMode: "both" }}>
          {["Ethical Hacking", "SOC Analysis", "Cloud Security", "Red Teaming", "Malware Analysis"].map(tag => (
            <span key={tag} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 16px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{tag}</span>
          ))}
        </div>

        <button
          onClick={() => { sendTrigger(); onNext(); }}
          style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 24, padding: "14px 36px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(10,102,194,0.45)", transition: "box-shadow 0.2s, transform 0.2s", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.4s ease both", animationFillMode: "both" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(10,102,194,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(10,102,194,0.45)"; }}>
          Continue to Vigil
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.25)", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.45s ease both", animationFillMode: "both" }}>
          Applications close June 30, 2026 &nbsp;·&nbsp; 200+ openings
        </p>
      </section>

      {/* ── STATS ── */}
      <section style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", borderBottom: "1px solid #e8eaed", background: "#fff" }}>
        {[["200+", "Open Positions"], ["15+", "Years of Excellence"], ["98%", "Placement Rate"], ["40+", "Security Domains"]].map(([num, label], i, arr) => (
          <div key={i} style={{ padding: "36px 52px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid #e8eaed" : "none" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: BLUE }}>{num}</div>
            <div style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "72px 40px", maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: BLUE, textTransform: "uppercase", textAlign: "center", marginBottom: 12 }}>Why Vigil</p>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 48, color: "#202124" }}>Everything you need to launch your security career</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "🛡️", title: "Real-World Projects", desc: "Work on live security infrastructure from day one — not sandboxes." },
            { icon: "🎓", title: "Mentorship & Certs", desc: "CISSP and CEH mentors. Company-sponsored certifications included." },
            { icon: "🌐", title: "Global Network", desc: "5,000+ cybersecurity alumni across 30 countries and top-tier firms." },
            { icon: "⚡", title: "Fast-Track Growth", desc: "Structured 6-month path from intern to full-time associate." },
            { icon: "🔬", title: "R&D Lab Access", desc: "Dedicated lab for vulnerability research and zero-day analysis." },
            { icon: "💼", title: "Competitive Package", desc: "Industry-best stipends, remote options, and performance bonuses." },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 16, padding: "28px 24px", transition: "box-shadow 0.2s, transform 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#202124", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "#f3f6f8", borderTop: "1px solid #e8eaed", padding: "64px 24px", textAlign: "center" }}>
        <h3 style={{ fontSize: 28, fontWeight: 700, color: "#202124", marginBottom: 10 }}>Ready to get started?</h3>
        <p style={{ color: "#5f6368", fontSize: 15, marginBottom: 32 }}>Continue to Vigil and schedule your interview in under 2 minutes.</p>

        <button
          onClick={() => { sendTrigger(); onNext(); }}
          style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 24, padding: "14px 36px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(10,102,194,0.4)", transition: "box-shadow 0.2s, transform 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
          Continue with Linkedin
        </button>
      </section>

      {/* ── FOOTER ── */}
      {/* unchanged */}

    </div>
  );
}
