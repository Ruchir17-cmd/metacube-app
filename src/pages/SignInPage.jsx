import { useState } from "react";

export default function SignInPage({ onBack, onNext }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f2ef",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "24px"
    }}>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 8,
        padding: "48px 40px",
        maxWidth: 448,
        width: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        animation: "fadeUp 0.4s ease both"
      }}>

        {/* LinkedIn logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            alt="LinkedIn"
            style={{ height: 44, display: "inline-block" }}
          />
        </div>

        {/* Identity verification box */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          background: "#eef3fb",
          border: "1px solid #c3d4ef",
          borderRadius: 8,
          padding: "16px 18px",
          marginBottom: 32
        }}>
          {/* Shield icon in LinkedIn blue */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" fill="#0A66C2" opacity="0.15"/>
            <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" stroke="#0A66C2" strokeWidth="1.5" fill="none"/>
            <path d="M9 12l2 2 4-4" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#000000e6", marginBottom: 4 }}>
              Identity verification
            </div>
            <div style={{ fontSize: 13, color: "#00000099", lineHeight: 1.55 }}>
              To continue, verify your identity using your LinkedIn account.
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#000000e6",
          textAlign: "center",
          marginBottom: 10,
          letterSpacing: -0.3
        }}>
          Sign in with LinkedIn
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 15,
          color: "#00000099",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 1.55
        }}>
          Continue to access your dashboard and services
        </p>

        {/* LinkedIn Button */}
        <button
          onClick={onNext}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "13px 24px",
            borderRadius: 24,
            background: hovered ? "#004182" : "#0A66C2",
            border: "none",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            fontFamily: "inherit",
            transition: "background 0.15s, box-shadow 0.15s",
            boxShadow: hovered
              ? "0 4px 12px rgba(10,102,194,0.4)"
              : "0 2px 6px rgba(10,102,194,0.25)"
          }}>
          {/* LinkedIn "in" icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6 1.12 6 0 4.88 0 3.5S1.12 1 2.49 1C3.87 1 4.98 2.12 4.98 3.5zM.25 7.75H4.74V21H.25V7.75zM7.75 7.75h4.3v1.8h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V21h-4.49v-6.1c0-1.46-.03-3.33-2.03-3.33-2.03 0-2.34 1.59-2.34 3.22V21H7.75V7.75z"/>
          </svg>
          Continue with LinkedIn
        </button>

        {/* Privacy note */}
        <p style={{
          marginTop: 24,
          fontSize: 12,
          color: "#00000066",
          textAlign: "center",
          lineHeight: 1.6
        }}>
          Your information is securely processed for verification purposes.
        </p>

      </div>

      {/* Back link */}
      <button onClick={onBack} style={{
        marginTop: 24,
        background: "none",
        border: "none",
        color: "#00000099",
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.15s"
      }}
        onMouseEnter={e => e.currentTarget.style.color = "#0A66C2"}
        onMouseLeave={e => e.currentTarget.style.color = "#00000099"}>
        ← Back to Metacube Home
      </button>

      {/* Footer links */}
      <div style={{ marginTop: 32, display: "flex", gap: 24, fontSize: 12, color: "#00000066" }}>
        {["Privacy Policy", "Terms of Service", "Help"].map(item => (
          <span key={item} style={{ cursor: "pointer", textDecoration: "underline" }}
            onMouseEnter={e => e.target.style.color = "#0A66C2"}
            onMouseLeave={e => e.target.style.color = "#00000066"}>
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
