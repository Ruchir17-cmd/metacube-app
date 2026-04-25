import { useState } from "react";
import mqtt from "mqtt";

const BLUE = "#1a73e8";

const ROLES = [
  { id: "soc",     title: "SOC Analyst",                badge: "High Demand", color: "#e8f5e9", badgeColor: "#2e7d32" },
  { id: "pentest", title: "Penetration Tester",         badge: "Technical",   color: "#e3f2fd", badgeColor: "#1565c0" },
  { id: "cloud",   title: "Cloud Security Engineer",    badge: "Hot Role",    color: "#fff3e0", badgeColor: "#e65100" },
  { id: "red",     title: "Red Team Analyst",           badge: "Advanced",    color: "#fce4ec", badgeColor: "#880e4f" },
  { id: "malware", title: "Malware Analyst",            badge: "Research",    color: "#f3e5f5", badgeColor: "#6a1b9a" },
  { id: "grc",     title: "GRC Consultant",             badge: "Strategic",   color: "#e0f2f1", badgeColor: "#00695c" },
];

const TIMES  = ["9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }

// ── MQTT PUBLISH ──────────────────────────────────────────────
// Broker: mqtt-dashboard.com | Port: 8884 (WSS) | Topic: vapt | QoS: 0
function publishToMQTT(payload) {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt", {
      clientId: "metacube_" + Math.random().toString(16).slice(2, 10),
      clean: true,
      reconnectPeriod: 0,        // no auto-reconnect — fire and forget
      connectTimeout: 8000,
    });

    client.on("connect", () => {
      client.publish(
        "vapt",                  // topic
        JSON.stringify(payload), // message
        { qos: 0, retain: false },
        (err) => {
          client.end();
          if (err) reject(err);
          else resolve();
        }
      );
    });

    client.on("error", (err) => {
      client.end();
      reject(err);
    });
  });
}
// ─────────────────────────────────────────────────────────────

export default function SchedulerPage({ email = "user@example.com" }) {
  const [step,      setStep]      = useState(1);
  const [role,      setRole]      = useState(null);
  const [exp,       setExp]       = useState("");
  const [name,      setName]      = useState("");
  const [college,   setCollege]   = useState("");
  const [phone,     setPhone]     = useState("");
  const [errors,    setErrors]    = useState({});
  const [mqttState, setMqttState] = useState("idle"); // idle | sending | sent | error

  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate,  setSelDate]  = useState(null);
  const [selTime,  setSelTime]  = useState(null);

  const stepLabels   = ["Role", "Details", "Schedule", "Review"];
  const selectedRole = ROLES.find(r => r.id === role);

  function validateDetails() {
    const e = {};
    if (!name.trim())                                  e.name  = "Full name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) e.phone = "Enter a valid 10-digit number";
    if (!exp)                                          e.exp   = "Please select your experience level";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelDate(null); setSelTime(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelDate(null); setSelTime(null);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay    = getFirstDay(calYear, calMonth);
  const todayStr    = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  function isDisabled(d) {
    const dt  = new Date(calYear, calMonth, d);
    const day = dt.getDay();
    return dt < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || day === 0 || day === 6;
  }

  // ── CONFIRM: publish then advance to done screen ──
  async function handleConfirm() {
    setMqttState("sending");
    const payload = {
      email,
      name,
      phone,
      role:      selectedRole?.title,
      exp,
      date:      `${MONTHS[calMonth]} ${selDate}, ${calYear}`,
      time:      selTime,
      timestamp: new Date().toISOString(),
    };
    try {
      await publishToMQTT(payload);
      setMqttState("sent");
      setStep(5);
    } catch (err) {
      console.error("MQTT error:", err);
      setMqttState("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Google Sans', Roboto, sans-serif" }}>

      {step < 5 && (
        <>
          {/* TOP BAR */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#1a73e8,#0f4c9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff" }}>M</div>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#202124" }}>Metacube</span>
              <span style={{ fontSize: 13, color: "#dadce0", margin: "0 8px" }}>|</span>
              <span style={{ fontSize: 13, color: "#5f6368" }}>Interview Scheduler</span>
            </div>
            <div style={{ fontSize: 13, color: "#5f6368", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {email[0].toUpperCase()}
              </div>
              {email}
            </div>
          </div>

          {/* PROGRESS */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 32px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", padding: "16px 0" }}>
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const done   = step > n;
                const active = step === n;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#34a853" : active ? BLUE : "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 }}>
                        {done
                          ? <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                          : <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#fff" : "#9aa0a6" }}>{n}</span>
                        }
                      </div>
                      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#202124" : done ? "#34a853" : "#9aa0a6", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && <div style={{ flex: 1, height: 2, background: done ? "#34a853" : "#e8eaed", margin: "0 12px", transition: "background 0.3s" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ══ STEP 1 — ROLE ══ */}
      {step === 1 && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, color: "#202124", marginBottom: 6 }}>Choose your role</h1>
          <p style={{ fontSize: 15, color: "#5f6368", marginBottom: 32 }}>Select the position you'd like to interview for</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 36 }}>
            {ROLES.map(r => (
              <div key={r.id} onClick={() => setRole(r.id)} style={{ background: "#fff", border: `2px solid ${role === r.id ? BLUE : "#e8eaed"}`, borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all 0.2s", boxShadow: role === r.id ? `0 0 0 4px rgba(26,115,232,0.1)` : "none", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { if (role !== r.id) e.currentTarget.style.borderColor = "#c5d9fc"; }}
                onMouseLeave={e => { if (role !== r.id) e.currentTarget.style.borderColor = "#e8eaed"; }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: r.color, borderRadius: "0 14px 0 60px", opacity: 0.6 }} />
                {role === r.id && (
                  <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1.5 5.5l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 600, color: "#202124", marginBottom: 8 }}>{r.title}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: r.badgeColor, background: r.color, padding: "3px 10px", borderRadius: 100, letterSpacing: 0.3 }}>{r.badge}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => role && setStep(2)} style={{ background: role ? BLUE : "#e8eaed", color: role ? "#fff" : "#bdc1c6", border: "none", borderRadius: 20, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: role ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.2s" }}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══ STEP 2 — DETAILS ══ */}
      {step === 2 && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, color: "#202124", marginBottom: 6 }}>Your details</h1>
          <p style={{ fontSize: 15, color: "#5f6368", marginBottom: 32 }}>Tell us a little about yourself</p>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8eaed", padding: "28px", marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e8f0fe", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
              <span style={{ fontSize: 13, color: "#1a56c4", fontWeight: 500 }}>{selectedRole?.title}</span>
            </div>
            {[
              { label: "Full Name",           key: "name",    value: name,    set: setName,    placeholder: "e.g. Ruchir Agarwal",       type: "text"  },
              { label: "Email",               key: "email",   value: email,   set: () => {},   placeholder: "",                           type: "email", disabled: true },
              { label: "Phone Number",        key: "phone",   value: phone,   set: setPhone,   placeholder: "10-digit mobile number",     type: "tel"   },
              { label: "College/University",  key: "college", value: college, set: setCollege, placeholder: "e.g. IIT Delhi (optional)",  type: "text"  },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#3c4043", display: "block", marginBottom: 6 }}>{field.label}</label>
                <input type={field.type} value={field.value} onChange={e => { field.set(e.target.value); setErrors(ev => ({ ...ev, [field.key]: "" })); }} placeholder={field.placeholder} disabled={field.disabled}
                  style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${errors[field.key] ? "#d93025" : "#dadce0"}`, borderRadius: 8, fontSize: 14, color: field.disabled ? "#80868b" : "#202124", background: field.disabled ? "#f8f9fa" : "#fff", fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }}
                  onFocus={e => { if (!field.disabled) e.target.style.borderColor = BLUE; }}
                  onBlur={e => { if (!field.disabled) e.target.style.borderColor = errors[field.key] ? "#d93025" : "#dadce0"; }} />
                {errors[field.key] && <p style={{ fontSize: 12, color: "#d93025", marginTop: 4 }}>{errors[field.key]}</p>}
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#3c4043", display: "block", marginBottom: 8 }}>Experience Level</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Fresher", "Intern (<1yr)", "Junior (1-2yr)"].map(e => (
                  <label key={e} style={{ flex: 1, border: `1.5px solid ${exp === e ? BLUE : "#dadce0"}`, borderRadius: 8, padding: "10px 8px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, background: exp === e ? "#e8f0fe" : "#fff", color: exp === e ? "#1a56c4" : "#3c4043", transition: "all 0.15s", fontWeight: exp === e ? 500 : 400 }}>
                    <input type="radio" name="exp" value={e} checked={exp === e} onChange={() => { setExp(e); setErrors(ev => ({ ...ev, exp: "" })); }} style={{ accentColor: BLUE }} />{e}
                  </label>
                ))}
              </div>
              {errors.exp && <p style={{ fontSize: 12, color: "#d93025", marginTop: 6 }}>{errors.exp}</p>}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: BLUE, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "12px 0" }}>← Back</button>
            <button onClick={() => { if (validateDetails()) setStep(3); }} style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 20, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1765cc"}
              onMouseLeave={e => e.currentTarget.style.background = BLUE}>Continue →</button>
          </div>
        </div>
      )}

      {/* ══ STEP 3 — CALENDAR ══ */}
      {step === 3 && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, color: "#202124", marginBottom: 6 }}>Pick a date & time</h1>
          <p style={{ fontSize: 15, color: "#5f6368", marginBottom: 32 }}>All slots are 45-minute video interviews (IST)</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8eaed", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#5f6368", fontSize: 18 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"} onMouseLeave={e => e.currentTarget.style.background = "none"}>‹</button>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>{MONTHS[calMonth]} {calYear}</span>
                <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#5f6368", fontSize: 18 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"} onMouseLeave={e => e.currentTarget.style.background = "none"}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#9aa0a6", padding: "4px 0" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const d = i + 1;
                  const disabled = isDisabled(d);
                  const selected = selDate === d;
                  const isToday  = `${calYear}-${calMonth}-${d}` === todayStr;
                  return (
                    <div key={d} onClick={() => !disabled && (setSelDate(d), setSelTime(null))} style={{ textAlign: "center", padding: "7px 0", borderRadius: 8, fontSize: 13, cursor: disabled ? "default" : "pointer", background: selected ? BLUE : "transparent", color: disabled ? "#dadce0" : selected ? "#fff" : isToday ? BLUE : "#202124", fontWeight: selected || isToday ? 600 : 400, border: isToday && !selected ? `1.5px solid ${BLUE}` : "1.5px solid transparent", transition: "all 0.15s" }}
                      onMouseEnter={e => { if (!disabled && !selected) e.currentTarget.style.background = "#f1f3f4"; }}
                      onMouseLeave={e => { if (!disabled && !selected) e.currentTarget.style.background = "transparent"; }}>{d}</div>
                  );
                })}
              </div>
              <p style={{ fontSize: 12, color: "#9aa0a6", marginTop: 16, textAlign: "center" }}>Weekends unavailable · IST timezone</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8eaed", padding: "24px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#202124", marginBottom: 16 }}>
                {selDate ? `${MONTHS[calMonth]} ${selDate}, ${calYear}` : "Select a date first"}
              </p>
              {selDate ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setSelTime(t)} style={{ padding: "12px 16px", border: `1.5px solid ${selTime === t ? BLUE : "#e8eaed"}`, borderRadius: 10, background: selTime === t ? "#e8f0fe" : "#fff", color: selTime === t ? "#1a56c4" : "#202124", fontSize: 14, fontWeight: selTime === t ? 600 : 400, cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}
                      onMouseEnter={e => { if (selTime !== t) { e.currentTarget.style.borderColor = "#c5d9fc"; e.currentTarget.style.background = "#f8fbff"; } }}
                      onMouseLeave={e => { if (selTime !== t) { e.currentTarget.style.borderColor = "#e8eaed"; e.currentTarget.style.background = "#fff"; } }}>
                      <span>{t}</span>
                      {selTime === t && <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8l4 4 6-6" stroke={BLUE} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TIMES.map(t => <div key={t} style={{ height: 44, borderRadius: 10, background: "#f8f9fa", border: "1.5px solid #e8eaed" }} />)}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: BLUE, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "12px 0" }}>← Back</button>
            <button onClick={() => selDate && selTime && setStep(4)} style={{ background: selDate && selTime ? BLUE : "#e8eaed", color: selDate && selTime ? "#fff" : "#bdc1c6", border: "none", borderRadius: 20, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: selDate && selTime ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.2s" }}>Review →</button>
          </div>
        </div>
      )}

      {/* ══ STEP 4 — REVIEW ══ */}
      {step === 4 && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, color: "#202124", marginBottom: 6 }}>Review & confirm</h1>
          <p style={{ fontSize: 15, color: "#5f6368", marginBottom: 32 }}>Double-check your details before confirming</p>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8eaed", overflow: "hidden", marginBottom: 20 }}>
            <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%)", padding: "24px 28px" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Interview Booking</p>
              <p style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{selectedRole?.title}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Metacube Cybersecurity Program 2025</p>
            </div>
            <div style={{ padding: "24px 28px" }}>
              {[
                { icon: "👤", label: "Candidate", value: name },
                { icon: "📧", label: "Email",     value: email },
                { icon: "📱", label: "Phone",     value: phone },
                { icon: "🎓", label: "Experience",value: exp },
                { icon: "📅", label: "Date",      value: `${MONTHS[calMonth]} ${selDate}, ${calYear}` },
                { icon: "⏰", label: "Time",      value: `${selTime} IST · 45 minutes` },
                { icon: "💻", label: "Format",    value: "Video Interview (Link sent via email)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: i < 6 ? "1px solid #f1f3f4" : "none" }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, color: "#80868b", marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff9e6", border: "1px solid #fce4a0", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <p style={{ fontSize: 13, color: "#7a5a00", lineHeight: 1.55 }}>
              A calendar invite and video link will be sent to <strong>{email}</strong> within 24 hours.
            </p>
          </div>

          {/* MQTT error notice */}
          {mqttState === "error" && (
            <div style={{ background: "#fce8e6", border: "1px solid #f5c6c2", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <p style={{ fontSize: 13, color: "#c5221f", lineHeight: 1.55 }}>
                Could not reach the notification server. Please check your connection and try again.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: BLUE, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "12px 0" }}>← Back</button>
            <button
              onClick={handleConfirm}
              disabled={mqttState === "sending"}
              style={{ background: mqttState === "sending" ? "#5fa85f" : "#34a853", color: "#fff", border: "none", borderRadius: 20, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: mqttState === "sending" ? "default" : "pointer", fontFamily: "inherit", transition: "background 0.2s", display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => { if (mqttState !== "sending") e.currentTarget.style.background = "#2d9248"; }}
              onMouseLeave={e => { if (mqttState !== "sending") e.currentTarget.style.background = "#34a853"; }}>
              {mqttState === "sending" ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                    <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Sending...
                </>
              ) : "✓ Confirm Interview"}
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 5 — DONE ══ */}
      {step === 5 && (
        <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
          <div style={{ marginBottom: 32, position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#e6f4ea", display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both" }}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path d="M8 20l9 9 15-15" stroke="#34a853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ strokeDasharray: 50, strokeDashoffset: 0, animation: "drawCheck 0.5s 0.3s ease both" }}/>
              </svg>
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: ["#1a73e8","#34a853","#fbbc04","#ea4335","#9c27b0","#00bcd4","#ff5722","#4caf50"][i], top: "50%", left: "50%", animation: `confetti${i} 0.8s 0.4s ease both` }} />
            ))}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "#202124", marginBottom: 10, animation: "fadeUp 0.5s 0.3s ease both", animationFillMode: "both" }}>You're all set!</h1>
          <p style={{ fontSize: 16, color: "#5f6368", maxWidth: 400, lineHeight: 1.7, marginBottom: 8, animation: "fadeUp 0.5s 0.4s ease both", animationFillMode: "both" }}>
            Your interview for <strong style={{ color: "#202124" }}>{selectedRole?.title}</strong> has been confirmed.
          </p>
          <p style={{ fontSize: 14, color: "#5f6368", marginBottom: 36, animation: "fadeUp 0.5s 0.45s ease both", animationFillMode: "both" }}>{MONTHS[calMonth]} {selDate} · {selTime} IST</p>

          {/* MQTT confirmation badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e6f4ea", border: "1px solid #ceead6", borderRadius: 100, padding: "6px 16px", marginBottom: 32, animation: "fadeUp 0.5s 0.5s ease both", animationFillMode: "both" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34a853" }} />
            <span style={{ fontSize: 13, color: "#137333", fontWeight: 500 }}>Booking signal sent to Metacube server</span>
          </div>

          <div style={{ background: "#f8f9fa", border: "1px solid #e8eaed", borderRadius: 16, padding: "20px 28px", maxWidth: 400, width: "100%", marginBottom: 36, animation: "fadeUp 0.5s 0.5s ease both", animationFillMode: "both" }}>
            {[
              { emoji: "📧", text: `Confirmation sent to ${email}` },
              { emoji: "📅", text: "Calendar invite with video link follows within 24h" },
              { emoji: "📋", text: "Prepare: resume, ID proof, and basic security concepts" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 2 ? 14 : 0 }}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <span style={{ fontSize: 13, color: "#5f6368", lineHeight: 1.55, textAlign: "left" }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#9aa0a6", animation: "fadeUp 0.5s 0.6s ease both", animationFillMode: "both" }}>
            Questions? Email us at <span style={{ color: BLUE }}>careers@metacube.com</span>
          </p>

          <style>{`
            @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes drawCheck { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            ${[...Array(8)].map((_, i) => {
              const angle = (i / 8) * 360;
              const r = 60;
              const x = Math.cos(angle * Math.PI / 180) * r;
              const y = Math.sin(angle * Math.PI / 180) * r;
              return `@keyframes confetti${i} { from { transform: translate(0,0) scale(0); opacity: 1; } to { transform: translate(${x}px,${y}px) scale(1); opacity: 0; } }`;
            }).join("")}
          `}</style>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Roboto:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}