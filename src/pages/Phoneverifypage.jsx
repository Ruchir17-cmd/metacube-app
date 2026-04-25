import { useState, useEffect } from "react";

export default function PhoneVerifyPage({ onApproved, onDenied, onOTP }) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [pulse, setPulse] = useState(false);

  const steps = [
    "Sending notification to your phone",
    "Check your phone",
    "Tap 'Yes' to approve sign in",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => setStep(2), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const pulse = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(pulse);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, sans-serif",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 448, animation: "fadeUp 0.4s ease both" }}>

        <div style={{
          border: "1px solid #e8eaed",
          borderRadius: 28,
          padding: "40px 44px 36px",
          background: "#fff",
          textAlign: "center"
        }}>

          {/* ── ADD YOUR LOGO HERE ── */}
          {/* <img src="/your-logo.png" alt="Metacube" style={{ height: 36, marginBottom: 24 }} /> */}

          {/* Animated phone illustration */}
          <div style={{ margin: "0 auto 28px", position: "relative", width: 160, height: 200 }}>
            <svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">

              {/* Pulse rings */}
              {step >= 1 && (
                <>
                  <circle cx="80" cy="100" r="72" fill="none" stroke="#e8f0fe" strokeWidth="1.5"
                    style={{ animation: "ringPulse 2s 0s ease-out infinite", opacity: 0 }} />
                  <circle cx="80" cy="100" r="60" fill="none" stroke="#c5d9fc" strokeWidth="1.5"
                    style={{ animation: "ringPulse 2s 0.4s ease-out infinite", opacity: 0 }} />
                </>
              )}

              {/* Phone body */}
              <rect x="42" y="28" width="76" height="140" rx="12" fill="#f8f9fa" stroke="#e8eaed" strokeWidth="1.5"/>

              {/* Screen */}
              <rect x="48" y="40" width="64" height="116" rx="6" fill="#fff" stroke="#e8eaed" strokeWidth="0.5"/>

              {/* Notch */}
              <rect x="66" y="36" width="28" height="6" rx="3" fill="#e8eaed"/>

              {/* Notification card on screen */}
              {step >= 1 && (
                <g style={{ animation: "slideDown 0.4s ease both" }}>
                  <rect x="52" y="52" width="56" height="52" rx="6" fill="#f8f9fa" stroke="#e8eaed" strokeWidth="0.5"/>
                  {/* M logo in notification */}
                  <rect x="56" y="57" width="14" height="14" rx="3" fill="#1a73e8"/>
                  <text x="63" y="68" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="sans-serif">M</text>
                  {/* Notification text lines */}
                  <rect x="74" y="59" width="28" height="3.5" rx="1.5" fill="#dadce0"/>
                  <rect x="74" y="65" width="20" height="3" rx="1.5" fill="#e8eaed"/>
                  {/* Divider */}
                  <line x1="52" y1="82" x2="108" y2="82" stroke="#e8eaed" strokeWidth="0.5"/>
                  {/* Yes / No buttons */}
                  <rect x="54" y="86" width="24" height="12" rx="6" fill="#1a73e8"/>
                  <text x="66" y="94.5" textAnchor="middle" fontSize="7" fontWeight="600" fill="#fff" fontFamily="sans-serif">Yes</text>
                  <rect x="82" y="86" width="24" height="12" rx="6" fill="#f1f3f4"/>
                  <text x="94" y="94.5" textAnchor="middle" fontSize="7" fill="#5f6368" fontFamily="sans-serif">No</text>
                </g>
              )}

              {/* Home bar */}
              <rect x="66" y="150" width="28" height="3" rx="1.5" fill="#dadce0"/>

              {/* Tap hand — appears at step 2 */}
              {step >= 2 && (
                <g style={{ animation: "tapHand 1.2s 0.3s ease-in-out infinite" }}>
                  <ellipse cx="78" cy="170" rx="8" ry="10" fill="#fce8e6" stroke="#f9a59a" strokeWidth="0.8"/>
                  <rect x="74" y="162" width="4" height="12" rx="2" fill="#fce8e6" stroke="#f9a59a" strokeWidth="0.8"/>
                  <rect x="79" y="160" width="4" height="14" rx="2" fill="#fce8e6" stroke="#f9a59a" strokeWidth="0.8"/>
                  <rect x="84" y="162" width="4" height="12" rx="2" fill="#fce8e6" stroke="#f9a59a" strokeWidth="0.8"/>
                </g>
              )}

              {/* Signal dots top right */}
              {step >= 1 && (
                <>
                  <circle cx="90" cy="46" r="1.5" fill={pulse ? "#1a73e8" : "#dadce0"} style={{ transition: "fill 0.3s" }}/>
                  <circle cx="95" cy="46" r="1.5" fill={pulse ? "#34a853" : "#dadce0"} style={{ transition: "fill 0.3s 0.1s" }}/>
                  <circle cx="100" cy="46" r="1.5" fill={pulse ? "#fbbc04" : "#dadce0"} style={{ transition: "fill 0.3s 0.2s" }}/>
                </>
              )}
            </svg>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "#202124", marginBottom: 8, letterSpacing: -0.2 }}>
            Check your phone
          </h1>

          <p style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.6, marginBottom: 20 }}>
            A sign-in notification was sent to your registered device via the Metacube app.
          </p>

          {/* Step indicator */}
          <div style={{
            background: "#f8f9fa",
            border: "1px solid #e8eaed",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 24,
            textAlign: "left"
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: i < steps.length - 1 ? 12 : 0,
                opacity: step >= i ? 1 : 0.35,
                transition: "opacity 0.4s"
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: step > i ? "#34a853" : step === i ? "#1a73e8" : "#e8eaed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.4s"
                }}>
                  {step > i
                    ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                    : <span style={{ width: 7, height: 7, borderRadius: "50%", background: step === i ? "#fff" : "#bdc1c6", display: "block" }} />
                  }
                </div>
                <span style={{ fontSize: 13, color: step >= i ? "#202124" : "#9aa0a6" }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Timer */}
          <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 28 }}>
            Request expires in{" "}
            <span style={{ color: timeLeft < 30 ? "#d93025" : "#202124", fontWeight: 500, transition: "color 0.3s" }}>
              {mins}:{secs}
            </span>
          </p>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={onApproved} style={{
              width: "100%", padding: "11px", borderRadius: 20,
              background: "#1a73e8", color: "#fff", border: "none",
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#1765cc"}
              onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}>
              I approved the sign in
            </button>
            <button onClick={onDenied} style={{
              width: "100%", padding: "11px", borderRadius: 20,
              background: "none", color: "#d93025",
              border: "1px solid #e8eaed",
              fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fce8e6"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              I didn't approve this
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e8eaed" }} />
              <span style={{ fontSize: 12, color: "#9aa0a6" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#e8eaed" }} />
            </div>

            <button onClick={onOTP} style={{
              width: "100%", padding: "11px", borderRadius: 20,
              background: "none", color: "#1a73e8",
              border: "1.5px solid #dadce0",
              fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#e8f0fe"; e.currentTarget.style.borderColor = "#c5d9fc"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#dadce0"; }}>
              Enter OTP instead
            </button>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, marginTop: 20, padding: "0 4px", fontSize: 13, color: "#5f6368" }}>
          {["Help", "Privacy", "Terms"].map(item => (
            <span key={item} style={{ cursor: "pointer" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ringPulse { 0% { r: 55; opacity: 0.6; } 100% { r: 85; opacity: 0; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tapHand {
          0%   { transform: translateY(0); }
          40%  { transform: translateY(-10px); }
          60%  { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}