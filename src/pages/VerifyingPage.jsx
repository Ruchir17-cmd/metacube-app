import { useState, useEffect } from "react";

export default function VerifyingPage({ onDone }) {
  const [dotCount, setDotCount] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    "Verifying credentials",
    "Checking security",
    "Setting up your session",
    "Almost there",
  ];

  useEffect(() => {
    // Animate dots
    const dotTimer = setInterval(() => {
      setDotCount(d => (d + 1) % 4);
    }, 400);

    // Cycle through phases
    const phaseTimer = setInterval(() => {
      setPhase(p => (p + 1) % phases.length);
    }, 1800);

    // Auto-proceed after ~6 seconds
    const doneTimer = setTimeout(() => {
      onDone();
    }, 6000);

    return () => {
      clearInterval(dotTimer);
      clearInterval(phaseTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, sans-serif",
    }}>

      {/* ── ADD YOUR LOGO HERE ── */}
      {/* <img src="/your-logo.png" alt="Metacube" style={{ height: 40, marginBottom: 48 }} /> */}

      {/* Metacube wordmark placeholder */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 56
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #1a73e8, #0f4c9e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 20, color: "#fff"
        }}>M</div>
        <span style={{ fontSize: 20, fontWeight: 600, color: "#202124" }}>Metacube</span>
      </div>

      {/* Google-style 4-dot spinner */}
      <div style={{ position: "relative", width: 64, height: 64, marginBottom: 40 }}>
        {[
          { color: "#4285F4", delay: "0s" },
          { color: "#EA4335", delay: "0.15s" },
          { color: "#FBBC05", delay: "0.3s" },
          { color: "#34A853", delay: "0.45s" },
        ].map((dot, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 14, height: 14,
            borderRadius: "50%",
            background: dot.color,
            animation: `orbit 1.4s ${dot.delay} ease-in-out infinite`,
            top: "50%", left: "50%",
            transformOrigin: "-18px -18px",
            marginTop: -7, marginLeft: -7,
          }} />
        ))}
      </div>

      {/* Verifying text */}
      <p style={{
        fontSize: 18,
        color: "#202124",
        fontWeight: 400,
        letterSpacing: 0.1,
        minWidth: 240,
        textAlign: "center",
        marginBottom: 12,
        transition: "opacity 0.3s"
      }}>
        {phases[phase]}{dots}
      </p>

      {/* Subtext */}
      <p style={{
        fontSize: 13,
        color: "#80868b",
        textAlign: "center"
      }}>
        Please keep this window open
      </p>

      {/* Progress bar */}
      <div style={{
        marginTop: 40,
        width: 280,
        height: 3,
        background: "#e8eaed",
        borderRadius: 4,
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #4285F4, #1a73e8)",
          borderRadius: 4,
          animation: "progress 6s linear forwards"
        }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes orbit {
          0%   { transform: rotate(0deg)   translateX(28px) rotate(0deg);   opacity: 1; }
          50%  { transform: rotate(180deg) translateX(28px) rotate(-180deg); opacity: 0.4; }
          100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); opacity: 1; }
        }

        @keyframes progress {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 60%; }
          80%  { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}