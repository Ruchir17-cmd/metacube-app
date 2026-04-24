import mqtt from "mqtt";

const BLUE = "#1a73e8";
const DARK = "#0a1628";

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
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(26,115,232,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease both" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1a73e8, #0f4c9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff" }}>M</div>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>Metacube</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(26,115,232,0.12)", border: "1px solid rgba(26,115,232,0.3)", borderRadius: 100, padding: "6px 18px", fontSize: 12, letterSpacing: 1.5, color: "#8ab4f8", textTransform: "uppercase", marginBottom: 28, position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.1s ease both", animationFillMode: "both" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8ab4f8", display: "inline-block" }} />
          Cybersecurity Internship & Fresher Program 2025
        </div>

        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 760, marginBottom: 20, background: "linear-gradient(135deg, #fff 0%, #aecbfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.2s ease both", animationFillMode: "both" }}>
          Build Your Career in Cybersecurity with Metacube
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
          style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 24, padding: "14px 36px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(26,115,232,0.4)", transition: "box-shadow 0.2s, transform 0.2s", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.4s ease both", animationFillMode: "both" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(26,115,232,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(26,115,232,0.4)"; }}>
          Schedule Your Interview
        </button>

        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.25)", position: "relative", zIndex: 1, animation: "fadeUp 0.5s 0.45s ease both", animationFillMode: "both" }}>
          Applications close June 30, 2025 &nbsp;·&nbsp; 200+ openings
        </p>
      </section>

      {/* ── STATS ── */}
      {/* (unchanged exactly as your original file) */}

      {/* ── FEATURES ── */}
      {/* (unchanged exactly as your original file) */}

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "#f8f9fa", borderTop: "1px solid #e8eaed", padding: "64px 24px", textAlign: "center" }}>
        <h3 style={{ fontSize: 28, fontWeight: 700, color: "#202124", marginBottom: 10 }}>Ready to get started?</h3>
        <p style={{ color: "#5f6368", fontSize: 15, marginBottom: 32 }}>Schedule your interview in under 2 minutes.</p>

        <button
          onClick={() => { sendTrigger(); onNext(); }}
          style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 24, padding: "14px 36px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(26,115,232,0.35)", transition: "box-shadow 0.2s, transform 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
          Schedule Your Interview
        </button>
      </section>

      {/* ── FOOTER ── */}
      {/* unchanged */}

    </div>
  );
}