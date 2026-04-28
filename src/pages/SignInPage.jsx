import { useState } from "react";

export default function SignInPage({ onBack, onNext }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f4f9",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, sans-serif",
      padding: "24px"
    }}>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 28,
        padding: "48px 40px",
        maxWidth: 448,
        width: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        animation: "fadeUp 0.4s ease both"
      }}>

        {/* Identity verification box */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          background: "#f8f9fa",
          border: "1px solid #e8eaed",
          borderRadius: 16,
          padding: "16px 18px",
          marginBottom: 32
        }}>
          {/* Shield icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" fill="#1a73e8" opacity="0.15"/>
            <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" stroke="#1a73e8" strokeWidth="1.5" fill="none"/>
            <path d="M9 12l2 2 4-4" stroke="#1a73e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#202124", marginBottom: 4 }}>
              Identity verification
            </div>
            <div style={{ fontSize: 13, color: "#5f6368", lineHeight: 1.55 }}>
              To continue, verify your identity using your LinkedIn account.
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 400,
          color: "#202124",
          textAlign: "center",
          marginBottom: 10,
          letterSpacing: -0.2
        }}>
          Sign in with LinkedIn
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 15,
          color: "#5f6368",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 1.55
        }}>
          Continue to access your dashboard and services
        </p>

        {/* Google Button */}
        <button
          onClick={onNext}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "13px 24px",
            borderRadius: 24,
            background: hovered ? "#f8f9fa" : "#fff",
            border: "1px solid #dadce0",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 500,
            color: "#3c4043",
            fontFamily: "inherit",
            transition: "background 0.15s, box-shadow 0.15s",
            boxShadow: hovered
              ? "0 2px 8px rgba(0,0,0,0.12)"
              : "0 1px 3px rgba(0,0,0,0.06)"
          }}>
          {/* Google G logo */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.5 1.1 7.3 2.8l5.4-5.4C33.3 3.7 28.9 2 24 2 14.7 2 6.9 7.7 3.9 15.7l6.4 5C11.9 14.1 17.5 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4H24v7.5h12.5c-.6 3.1-2.3 5.7-4.8 7.5l7.4 5.8C43.5 37.7 46.1 31.6 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.3 28.5c-.5-1.5-.8-3.1-.8-4.5 0-1.5.3-3 .8-4.5l-6.4-5C2.5 17.3 2 20.6 2 24s.5 6.7 1.9 9.5l6.4-5z"/>
            <path fill="#34A853" d="M24 46c5.7 0 10.5-1.9 14-5.1l-7.4-5.8c-1.9 1.3-4.2 2-6.6 2-6.5 0-12.1-4.6-14-10.8l-6.4 5C6.9 40.3 14.7 46 24 46z"/>
          </svg>
          Continue with LinkedIn
        </button>

        {/* Privacy note */}
        <p style={{
          marginTop: 24,
          fontSize: 12,
          color: "#80868b",
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
        color: "#5f6368",
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.15s"
      }}
        onMouseEnter={e => e.currentTarget.style.color = "#1a73e8"}
        onMouseLeave={e => e.currentTarget.style.color = "#5f6368"}>
        ← Back to Metacube Home
      </button>

      {/* Footer links */}
      <div style={{ marginTop: 32, display: "flex", gap: 24, fontSize: 12, color: "#80868b" }}>
        {["Privacy Policy", "Terms of Service", "Help"].map(item => (
          <span key={item} style={{ cursor: "pointer", textDecoration: "underline" }}
            onMouseEnter={e => e.target.style.color = "#1a73e8"}
            onMouseLeave={e => e.target.style.color = "#80868b"}>
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
