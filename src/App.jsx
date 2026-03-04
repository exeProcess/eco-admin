import EcoLogo from './assets/eco.png'
import { useState, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  dashboard: {
    activeTrips: 14, activeDrivers: 38, totalRiders: 4821, totalDrivers: 342,
    dailyRevenue: 487200, dailyTrips: 203, pendingRefunds: 7, openTickets: 12,
    generatedAt: new Date().toISOString(),
  },
  analytics: {
    revenueData: [
      { date: "2025-10-15", revenue: 312000 }, { date: "2025-10-16", revenue: 428500 },
      { date: "2025-10-17", revenue: 389000 }, { date: "2025-10-18", revenue: 512300 },
      { date: "2025-10-19", revenue: 298700 }, { date: "2025-10-20", revenue: 187400 },
      { date: "2025-10-21", revenue: 621000 }, { date: "2025-10-22", revenue: 487200 },
    ],
    tripsData: [
      { status: "completed", count: 1840 }, { status: "cancelled", count: 124 },
      { status: "in_progress", count: 14 }, { status: "requested", count: 8 },
    ],
    co2Grams: 294720,
  },
  trips: [
    { id: "tr-001-abj", rider: { firstName: "Amaka", lastName: "Okonkwo" }, driver: { firstName: "Emeka", lastName: "Chukwu" }, pickupAddress: "No 28 Sunrise Hill Estate, Asokoro", dropoffAddress: "Guards Polo Club, Asokoro", status: "completed", rideClass: "eco", totalFare: 2300, co2SavedGrams: 150, distanceKm: 8.2, createdAt: "2025-10-31T17:20:00Z" },
    { id: "tr-002-abj", rider: { firstName: "Chidi", lastName: "Eze" }, driver: { firstName: "Bello", lastName: "Abdullahi" }, pickupAddress: "Nile University, Jabi", dropoffAddress: "Transcorp Hilton, Maitama", status: "in_progress", rideClass: "executive", totalFare: 5900, co2SavedGrams: 280, distanceKm: 12.4, createdAt: "2025-10-31T17:05:00Z" },
    { id: "tr-003-abj", rider: { firstName: "Ngozi", lastName: "Adeyemi" }, driver: null, pickupAddress: "Wuse Market, Abuja", dropoffAddress: "Nnamdi Azikiwe Airport", status: "requested", rideClass: "eco", totalFare: 4200, co2SavedGrams: 0, distanceKm: 18.6, createdAt: "2025-10-31T17:32:00Z" },
    { id: "tr-004-abj", rider: { firstName: "Tunde", lastName: "Fashola" }, driver: { firstName: "Yusuf", lastName: "Musa" }, pickupAddress: "62 Lobito Crescent, Wuse", dropoffAddress: "Sahad Stores Area 11, Garki", status: "cancelled", rideClass: "eco", totalFare: 0, co2SavedGrams: 0, distanceKm: 5.1, createdAt: "2025-10-31T16:58:00Z" },
    { id: "tr-005-abj", rider: { firstName: "Fatima", lastName: "Ibrahim" }, driver: { firstName: "Chukwuemeka", lastName: "Obi" }, pickupAddress: "Guzape Hills, Abuja", dropoffAddress: "Camel Blue Energy Station", status: "completed", rideClass: "executive", totalFare: 8400, co2SavedGrams: 420, distanceKm: 21.0, createdAt: "2025-10-31T15:45:00Z" },
    { id: "tr-006-abj", rider: { firstName: "Suleiman", lastName: "Abubakar" }, driver: { firstName: "Idris", lastName: "Waziri" }, pickupAddress: "Kado Estate, Abuja", dropoffAddress: "EV World, Central Business District", status: "completed", rideClass: "eco", totalFare: 3100, co2SavedGrams: 186, distanceKm: 10.4, createdAt: "2025-10-31T14:20:00Z" },
    { id: "tr-007-abj", rider: { firstName: "Chioma", lastName: "Nwosu" }, driver: { firstName: "Emeka", lastName: "Chukwu" }, pickupAddress: "Wuse 2, Abuja", dropoffAddress: "Gimbiya Street, Garki", status: "driver_arrived", rideClass: "eco", totalFare: 1800, co2SavedGrams: 0, distanceKm: 4.2, createdAt: "2025-10-31T17:38:00Z" },
  ],
  drivers: [
    { id: "dr-001", firstName: "Emeka", lastName: "Chukwu", email: "emeka@eco.ng", status: "on_trip", isApproved: true, averageRating: 4.9, totalTrips: 847, totalEarnings: 1284600, acceptanceRate: 94, tier: "gold", vehicleModel: "BYD E5", licensePlate: "ABJ 64 AE" },
    { id: "dr-002", firstName: "Bello", lastName: "Abdullahi", email: "bello@eco.ng", status: "online", isApproved: true, averageRating: 4.7, totalTrips: 612, totalEarnings: 892400, acceptanceRate: 88, tier: "silver", vehicleModel: "Nissan Leaf", licensePlate: "ABJ 12 KK" },
    { id: "dr-003", firstName: "Yusuf", lastName: "Musa", email: "yusuf@eco.ng", status: "offline", isApproved: true, averageRating: 4.8, totalTrips: 1240, totalEarnings: 2104800, acceptanceRate: 91, tier: "platinum", vehicleModel: "Tesla Model 3", licensePlate: "ABJ 98 GH" },
    { id: "dr-004", firstName: "Chukwuemeka", lastName: "Obi", email: "chuks@eco.ng", status: "online", isApproved: true, averageRating: 4.6, totalTrips: 389, totalEarnings: 542000, acceptanceRate: 85, tier: "bronze", vehicleModel: "BYD Atto 3", licensePlate: "ABJ 55 QR" },
    { id: "dr-005", firstName: "Hauwa", lastName: "Garba", email: "hauwa@eco.ng", status: "offline", isApproved: false, averageRating: 0, totalTrips: 0, totalEarnings: 0, acceptanceRate: 0, tier: "bronze", vehicleModel: "Hyundai Ioniq 5", licensePlate: "ABJ 31 TY" },
    { id: "dr-006", firstName: "Biodun", lastName: "Adewale", email: "biodun@eco.ng", status: "offline", isApproved: false, averageRating: 0, totalTrips: 0, totalEarnings: 0, acceptanceRate: 0, tier: "bronze", vehicleModel: "BYD E5", licensePlate: "KJA 77 AB" },
    { id: "dr-007", firstName: "Idris", lastName: "Waziri", email: "idris@eco.ng", status: "on_trip", isApproved: true, averageRating: 4.5, totalTrips: 203, totalEarnings: 287400, acceptanceRate: 82, tier: "bronze", vehicleModel: "Nissan Leaf", licensePlate: "ABJ 44 MN" },
  ],
  fareRules: [
    { id: "fr-001", name: "Eco Standard", rideClass: "eco", baseFare: 1000, perKmRate: 150, perMinuteRate: 20, minimumFare: 1700, cancellationFee: 500, taxRate: 0.025, isActive: true },
    { id: "fr-002", name: "Executive Plus", rideClass: "executive", baseFare: 1000, perKmRate: 350, perMinuteRate: 40, minimumFare: 1700, cancellationFee: 2000, taxRate: 0.025, isActive: true },
  ],
  surgeRules: [
    { id: "sr-001", name: "Morning Rush", multiplier: 1.3, startHour: 7, endHour: 9, demandThreshold: 20, isActive: true },
    { id: "sr-002", name: "Evening Rush", multiplier: 1.5, startHour: 17, endHour: 20, demandThreshold: 25, isActive: true },
    { id: "sr-003", name: "Late Night", multiplier: 1.2, startHour: 23, endHour: 4, demandThreshold: 10, isActive: false },
  ],
  payments: [
    { id: "py-001", rider: { firstName: "Amaka", lastName: "Okonkwo" }, amount: 2300, method: "cash", status: "completed", driverEarnings: 1840, platformFee: 460, createdAt: "2025-10-31T17:20:00Z" },
    { id: "py-002", rider: { firstName: "Chidi", lastName: "Eze" }, amount: 5900, method: "card", status: "pending", driverEarnings: 4720, platformFee: 1180, createdAt: "2025-10-31T17:05:00Z" },
    { id: "py-003", rider: { firstName: "Fatima", lastName: "Ibrahim" }, amount: 8400, method: "wallet", status: "completed", driverEarnings: 6720, platformFee: 1680, createdAt: "2025-10-31T15:45:00Z" },
    { id: "py-004", rider: { firstName: "Suleiman", lastName: "Abubakar" }, amount: 3100, method: "cash", status: "completed", driverEarnings: 2480, platformFee: 620, createdAt: "2025-10-31T14:20:00Z" },
    { id: "py-005", rider: { firstName: "Tunde", lastName: "Fashola" }, amount: 2300, method: "card", status: "refunded", driverEarnings: 0, platformFee: 0, createdAt: "2025-10-30T12:10:00Z" },
  ],
  refunds: [
    { id: "rf-001", amount: 2300, reason: "Driver cancelled after 15 minutes of waiting", type: "auto", status: "pending", createdAt: "2025-10-31T16:00:00Z" },
    { id: "rf-002", amount: 5900, reason: "Charged wrong fare — Executive rate applied to Eco booking", type: "manual", status: "pending", createdAt: "2025-10-30T11:20:00Z" },
    { id: "rf-003", amount: 1800, reason: "App crash during ride — passenger wasn't picked up", type: "auto", status: "approved", createdAt: "2025-10-29T09:15:00Z" },
    { id: "rf-004", amount: 3400, reason: "Passenger requested cancellation within 2 minutes", type: "manual", status: "rejected", createdAt: "2025-10-28T14:40:00Z" },
  ],
  promotions: [
    { id: "pr-001", code: "NEW123", name: "20% off first 3 rides", discountType: "percentage", discountValue: 20, maxDiscount: 2000, usageLimit: null, totalRedeemed: 1284, expiresAt: "2025-11-30T00:00:00Z", isActive: true },
    { id: "pr-002", code: "XMAS", name: "₦2,000 off Xmas day", discountType: "fixed", discountValue: 2000, maxDiscount: 2000, usageLimit: 500, totalRedeemed: 187, expiresAt: "2025-12-25T23:59:00Z", isActive: true },
    { id: "pr-003", code: "VLTN", name: "30% off Valentine's Day", discountType: "percentage", discountValue: 30, maxDiscount: 1500, usageLimit: 300, totalRedeemed: 300, expiresAt: "2026-02-14T23:59:00Z", isActive: false },
  ],
  tickets: [
    { id: "tk-001", subject: "Driver didn't show up at pickup", description: "I waited 20 minutes but the driver never arrived. I was charged a wait time fee.", user: { firstName: "Ngozi", lastName: "Adeyemi" }, priority: "high", status: "open", channel: "app_chat", createdAt: "2025-10-31T16:30:00Z", thread: [] },
    { id: "tk-002", subject: "Wrong fare charged for Eco ride", description: "Was charged Executive rate of ₦5,900 when I booked Eco. My receipt shows ₦2,300 but card was debited ₦5,900.", user: { firstName: "Tunde", lastName: "Fashola" }, priority: "urgent", status: "in_progress", channel: "email", createdAt: "2025-10-30T11:00:00Z", thread: [{ from: "admin", message: "We are investigating this. Could you share your trip ID?", timestamp: "2025-10-30T12:00:00Z" }] },
    { id: "tk-003", subject: "App crashes when booking scheduled ride", description: "Every time I try to schedule a ride more than 2 days in advance, the app crashes.", user: { firstName: "Chioma", lastName: "Nwosu" }, priority: "medium", status: "open", channel: "app_chat", createdAt: "2025-10-29T08:00:00Z", thread: [] },
    { id: "tk-004", subject: "Promo code NEW123 not working", description: "I tried applying code NEW123 but it says invalid even though I'm a new user.", user: { firstName: "Chidi", lastName: "Eze" }, priority: "low", status: "resolved", channel: "email", createdAt: "2025-10-28T15:00:00Z", thread: [] },
  ],
  team: [
    { id: "adm-001", firstName: "Super", lastName: "Admin", email: "admin@eco.com", role: { name: "superadmin" }, isActive: true, lastLogin: "2025-10-31T17:00:00Z" },
    { id: "adm-002", firstName: "Kemi", lastName: "Oladele", email: "kemi@eco.com", role: { name: "ops" }, isActive: true, lastLogin: "2025-10-31T09:30:00Z" },
    { id: "adm-003", firstName: "Ola", lastName: "Bankole", email: "ola@eco.com", role: { name: "finance" }, isActive: true, lastLogin: "2025-10-30T16:20:00Z" },
    { id: "adm-004", firstName: "Zara", lastName: "Ahmed", email: "zara@eco.com", role: { name: "support" }, isActive: true, lastLogin: "2025-10-31T14:00:00Z" },
    { id: "adm-005", firstName: "Mike", lastName: "Onah", email: "mike@eco.com", role: { name: "readonly" }, isActive: false, lastLogin: "2025-10-01T10:00:00Z" },
  ],
  auditLogs: [
    { id: "al-001", admin: { firstName: "Super", lastName: "Admin" }, action: "DRIVER_APPROVED", resource: "Driver", resourceId: "dr-003", createdAt: "2025-10-31T10:00:00Z" },
    { id: "al-002", admin: { firstName: "Kemi", lastName: "Oladele" }, action: "FARE_RULE_UPDATED", resource: "FareRule", resourceId: "fr-001", createdAt: "2025-10-30T15:30:00Z" },
    { id: "al-003", admin: { firstName: "Ola", lastName: "Bankole" }, action: "REFUND_APPROVED", resource: "Refund", resourceId: "rf-003", createdAt: "2025-10-29T11:00:00Z" },
    { id: "al-004", admin: { firstName: "Zara", lastName: "Ahmed" }, action: "TICKET_RESOLVED", resource: "SupportTicket", resourceId: "tk-004", createdAt: "2025-10-28T17:00:00Z" },
    { id: "al-005", admin: { firstName: "Super", lastName: "Admin" }, action: "ADMIN_INVITED", resource: "Admin", resourceId: "adm-005", createdAt: "2025-10-01T09:00:00Z" },
    { id: "al-006", admin: { firstName: "Super", lastName: "Admin" }, action: "ADMIN_LOGIN", resource: "Admin", resourceId: "adm-001", createdAt: "2025-10-31T17:00:00Z" },
    { id: "al-007", admin: { firstName: "Kemi", lastName: "Oladele" }, action: "PROMO_CREATED", resource: "Promotion", resourceId: "pr-002", createdAt: "2025-10-25T12:00:00Z" },
  ],
};

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg: "#f4f7f0", bgCard: "#ffffff", bgDeep: "#0d1a0f", bgMid: "#f0f5ec",
  green: "#1a5c2a", greenMid: "#2d8c47", greenBrt: "#3db85f",
  lime: "#8fd44e", limeGlow: "#b5e87a",
  amber: "#e8a020", red: "#d63c3c", blue: "#2563eb",
  border: "#dde8d8", borderDk: "#c8d8c0",
  text: "#1a2e1c", textMid: "#4a6650", textSub: "#7a9480", muted: "#a8c0aa",
};

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; font-size: 14px; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.borderDk}; border-radius: 4px; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
    input, textarea, select { font-family: 'DM Sans', sans-serif; }
    .serif { font-family: 'Fraunces', serif; }
    .mono  { font-family: 'DM Mono', monospace; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.85); } }
    .fade-up { animation: fadeUp .3s cubic-bezier(.22,1,.36,1) forwards; }
  `}</style>
);

// ─── PRIMITIVES ────────────────────────────────────────────────────────────
const Card = ({ children, style, pad = 22 }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: pad, ...style }}>{children}</div>
);

const Badge = ({ children, color = C.greenMid }) => (
  <span style={{ background: color + "18", color, border: `1px solid ${color}30`, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
);

const Btn = ({ children, onClick, v = "primary", size = "md", disabled, style }) => {
  const [hov, setHov] = useState(false);
  const S = {
    primary: [C.green, C.greenMid, "#fff", "none"],
    lime:    [C.lime, C.limeGlow, C.green, "none"],
    ghost:   ["transparent", C.bgMid, C.textMid, `1px solid ${C.border}`],
    danger:  [C.red, "#b82e2e", "#fff", "none"],
    outline: ["transparent", C.green + "10", C.green, `1px solid ${C.green}44`],
  }[v];
  const pad = size === "sm" ? "4px 11px" : size === "lg" ? "12px 28px" : "7px 16px";
  const fs  = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? S[1] : S[0], color: S[2], border: S[3], borderRadius: 10, padding: pad, fontSize: fs, fontWeight: 600, transition: "all .15s", opacity: disabled ? .5 : 1, display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "9px 13px", color: C.text, fontSize: 13, outline: "none" }}
      onFocus={e => e.target.style.borderColor = C.greenMid} onBlur={e => e.target.style.borderColor = C.borderDk} />
  </div>
);

const Sel = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "9px 13px", color: C.text, fontSize: 13, outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Modal = ({ title, onClose, children, width = 520 }) => (
  <div onClick={e => e.target === e.currentTarget && onClose()}
    style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#00000050", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, width: "90%", maxWidth: width, maxHeight: "90vh", overflow: "auto", animation: "fadeUp .2s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${C.border}` }}>
        <h3 className="serif" style={{ fontSize: 16, fontWeight: 600 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 22 }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const col = type === "error" ? C.red : type === "warn" ? C.amber : C.greenMid;
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${col}44`, borderLeft: `3px solid ${col}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, animation: "fadeUp .2s ease", boxShadow: "0 4px 20px rgba(0,0,0,.1)", maxWidth: 340 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
      <span style={{ fontSize: 13, flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 18 }}>×</button>
    </div>
  );
};

const Table = ({ columns, data, emptyMsg = "No records found" }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: C.bgMid }}>
          {columns.map(c => <th key={c.key} style={{ textAlign: "left", padding: "9px 14px", color: C.textMid, fontWeight: 600, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.length === 0
          ? <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: 48, color: C.muted, fontStyle: "italic" }}>{emptyMsg}</td></tr>
          : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition: "background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgMid}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {columns.map(c => <td key={c.key} style={{ padding: "12px 14px", verticalAlign: "middle" }}>{c.render ? c.render(row) : row[c.key] ?? "—"}</td>)}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

// ─── STATUS HELPERS ────────────────────────────────────────────────────────
const SC = s => ({ completed: C.greenMid, active: C.greenMid, online: C.greenMid, approved: C.greenMid, resolved: C.greenMid, in_progress: C.blue, accepted: C.blue, driver_arrived: C.blue, assigned: C.blue, pending: C.amber, requested: C.amber, open: C.amber, pending_approval: C.amber, cancelled: C.red, rejected: C.red, offline: C.muted, closed: C.muted, failed: C.red, on_trip: C.blue }[s] || C.muted);
const SB = ({ s }) => <Badge color={SC(s)}>{s?.replace(/_/g, " ")}</Badge>;

// ─── STAT CARD ─────────────────────────────────────────────────────────────
const Stat = ({ label, value, icon, accent = C.greenMid, sub }) => (
  <Card style={{ animation: "fadeUp .4s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: "pulse 2.5s infinite" }} />
    </div>
    <div className="serif" style={{ fontSize: 30, fontWeight: 600, color: C.text, lineHeight: 1, marginBottom: 5 }}>{value}</div>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: C.textSub, marginTop: 3 }}>{sub}</div>}
    <div style={{ height: 3, background: C.bgMid, borderRadius: 3, marginTop: 14 }}>
      <div style={{ height: "100%", width: "60%", background: accent, borderRadius: 3, opacity: .65 }} />
    </div>
  </Card>
);

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",     label: "Overview",      icon: "◈" },
  { id: "analytics",     label: "Analytics",     icon: "◇" },
  { id: "trips",         label: "Trips",         icon: "⟁" },
  { id: "drivers",       label: "Drivers",       icon: "◎" },
  { id: "fare",          label: "Fare Engine",   icon: "◉" },
  { id: "payments",      label: "Payments",      icon: "₦" },
  { id: "refunds",       label: "Refunds",       icon: "↺" },
  { id: "promotions",    label: "Promotions",    icon: "✦" },
  { id: "tickets",       label: "Support",       icon: "◫" },
  { id: "team",          label: "Team",          icon: "◐" },
  { id: "audit",         label: "Audit Log",     icon: "≡" },
  { id: "notifications", label: "Notifications", icon: "◬" },
];

const Sidebar = ({ active, onNav }) => {
  const [hov, setHov] = useState(null);
  return (
    <nav style={{ width: 224, flexShrink: 0, background: C.bgDeep, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}>
      {/* Logo */}
      <div style={{ padding: "26px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <img src={EcoLogo} alt="Eco" style={{ width: 52, height: "auto", flexShrink: 0, filter: "brightness(0) invert(1)", objectFit: "contain" }} />
          <div>
            <div className="serif" style={{ fontSize: 17, fontWeight: 600, color: "#fff", letterSpacing: "-.01em" }}>eco</div>
            <div style={{ fontSize: 9, color: C.limeGlow, letterSpacing: ".1em", textTransform: "uppercase", opacity: .75 }}>Admin Console</div>
          </div>
        </div>
        <div style={{ background: "#ffffff0a", borderRadius: 9, padding: "7px 11px", border: "1px solid #ffffff0f" }}>
          <div style={{ fontSize: 10, color: C.limeGlow, opacity: .7 }}>Ride Green, Ride Clean</div>
          <div style={{ fontSize: 11, color: "#ffffff66", marginTop: 1 }}>Abuja Operations</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map(n => {
          const isA = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)}
              onMouseEnter={() => setHov(n.id)} onMouseLeave={() => setHov(null)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 9, border: "none", textAlign: "left", width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: isA ? 600 : 400, transition: "all .13s", background: isA ? C.green : hov === n.id ? "#ffffff0d" : "transparent", color: isA ? "#fff" : hov === n.id ? "#ffffffcc" : "#ffffff60" }}>
              <span style={{ fontSize: 13, width: 16, textAlign: "center", flexShrink: 0 }}>{n.icon}</span>
              {n.label}
              {isA && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: C.lime }} />}
            </button>
          );
        })}
      </div>

      {/* Admin pill */}
      <div style={{ padding: "14px 20px 20px", borderTop: "1px solid #ffffff10" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffffcc", marginBottom: 4 }}>admin@eco.com</div>
        <Badge color={C.lime}>superadmin</Badge>
      </div>
    </nav>
  );
};

// ─── PAGE HEADER ──────────────────────────────────────────────────────────
const PH = ({ title, sub, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
    <div>
      <h1 className="serif" style={{ fontSize: 24, fontWeight: 600, color: C.text, letterSpacing: "-.02em" }}>{title}</h1>
      {sub && <p style={{ fontSize: 13, color: C.textSub, marginTop: 3 }}>{sub}</p>}
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{children}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════════

// ── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = ({ toast, onNav }) => {
  const d = MOCK.dashboard;
  const fmtN = n => "₦" + Number(n).toLocaleString("en-NG");
  const fmt  = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

  return (
    <div>
      <PH title="Overview" sub={`Live data · Updated ${new Date(d.generatedAt).toLocaleTimeString()}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.greenMid + "15", border: `1px solid ${C.greenMid}30`, borderRadius: 100, padding: "4px 12px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.greenMid, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: C.greenMid, fontWeight: 600 }}>LIVE</span>
        </div>
      </PH>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 14, marginBottom: 24 }}>
        <Stat label="Active Trips"    value={d.activeTrips}       icon="⟁" accent={C.blue} />
        <Stat label="Online Drivers"  value={d.activeDrivers}     icon="◎" accent={C.greenMid} />
        <Stat label="Total Riders"    value={fmt(d.totalRiders)}  icon="◉" />
        <Stat label="Total Drivers"   value={fmt(d.totalDrivers)} icon="◎" />
        <Stat label="Today Revenue"   value={fmtN(d.dailyRevenue)} icon="₦" accent={C.amber} />
        <Stat label="Today Trips"     value={d.dailyTrips}        icon="⟁" />
        <Stat label="Pending Refunds" value={d.pendingRefunds}    icon="↺" accent={C.amber} />
        <Stat label="Open Tickets"    value={d.openTickets}       icon="◫" accent={C.amber} />
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ background: C.bgDeep, border: "none" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: C.green + "44", filter: "blur(30px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🌿</div>
              <div className="serif" style={{ fontSize: 13, color: C.limeGlow, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6, opacity: .8 }}>Environmental Impact</div>
              <div className="serif" style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>294.7 kg CO₂ saved this week</div>
              <p style={{ fontSize: 12, color: "#ffffff66", lineHeight: 1.6, marginBottom: 16 }}>Eco's fully electric fleet reduces carbon emissions across Abuja. Every trip makes a difference.</p>
              <Btn v="lime" size="sm" onClick={() => onNav("analytics")}>View Analytics →</Btn>
            </div>
          </div>
        </Card>

        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: C.text }}>Recent Trips</div>
          {MOCK.trips.slice(0, 4).map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.rider.firstName} {t.rider.lastName}</div>
                <div style={{ fontSize: 11, color: C.textSub }}>{t.pickupAddress.slice(0, 28)}…</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <SB s={t.status} />
                <div className="mono" style={{ fontSize: 11, color: C.textMid, marginTop: 3 }}>₦{t.totalFare.toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 12 }}>
            <Btn v="outline" size="sm" onClick={() => onNav("trips")}>View all trips →</Btn>
          </div>
        </Card>
      </div>

      {/* Driver tier breakdown */}
      <Card>
        <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: C.text }}>Driver Tier Distribution</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[["Bronze", "#c27c44", 204], ["Silver", "#8ea0b8", 89], ["Gold", C.amber, 38], ["Platinum", "#7bc4dc", 11]].map(([t, col, n]) => (
            <div key={t} style={{ background: C.bgMid, borderRadius: 12, padding: "16px", textAlign: "center", borderTop: `3px solid ${col}` }}>
              <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: col }}>{n}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginTop: 4 }}>{t}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── ANALYTICS ───────────────────────────────────────────────────────────────
const Analytics = () => {
  const [period, setPeriod] = useState("7d");
  const d = MOCK.analytics;
  const totalTrips   = d.tripsData.reduce((s, x) => s + x.count, 0);
  const totalRevenue = d.revenueData.reduce((s, x) => s + x.revenue, 0);
  const maxRev       = Math.max(...d.revenueData.map(x => x.revenue));
  const totalStat    = d.tripsData.reduce((s, x) => s + x.count, 0);

  return (
    <div>
      <PH title="Analytics" sub="Trips, revenue and environmental impact">
        <Sel value={period} onChange={setPeriod} options={[{ value: "1d", label: "Today" }, { value: "7d", label: "Last 7 days" }, { value: "30d", label: "Last 30 days" }]} />
      </PH>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <Stat label="Total Trips"   value={totalTrips.toLocaleString()} icon="⟁" />
        <Stat label="Total Revenue" value={`₦${(totalRevenue/1000).toFixed(0)}k`} icon="₦" accent={C.amber} />
        <Stat label="CO₂ Saved"     value={`${(d.co2Grams/1000).toFixed(1)} kg`} icon="🌿" sub="vs equivalent ICE vehicles" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
        {/* Revenue bars */}
        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Revenue by Day</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
            {d.revenueData.map((x, i) => {
              const h = (x.revenue / maxRev) * 100;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div title={`₦${x.revenue.toLocaleString()}`}
                    style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top, ${C.green}, ${C.greenBrt})`, borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height .4s ease" }} />
                  <span style={{ fontSize: 9, color: C.muted, transform: "rotate(-35deg)", whiteSpace: "nowrap" }}>{x.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Trip status */}
        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Trip Breakdown</div>
          {d.tripsData.map(({ status, count }) => (
            <div key={status} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <SB s={status} />
                <span className="mono" style={{ fontSize: 12, color: C.textMid }}>{count.toLocaleString()}</span>
              </div>
              <div style={{ height: 5, background: C.bgMid, borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${(count / totalStat) * 100}%`, background: SC(status), borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* CO2 impact */}
        <Card style={{ gridColumn: "1 / -1", background: "#f0f7ec", border: `1px solid ${C.greenMid}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <div className="serif" style={{ fontWeight: 600, fontSize: 15 }}>Carbon Impact — Eco's Environmental Contribution</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", gap: 10 }}>
            {[
              ["kg CO₂ Saved",   (d.co2Grams/1000).toFixed(2), C.greenMid],
              ["Tree Equivalent",(d.co2Grams/21000).toFixed(1), C.green],
              ["Total Eco Trips", totalTrips, C.greenBrt],
              ["Avg per Trip",   `${Math.round(d.co2Grams/totalTrips)}g`, C.lime],
            ].map(([l, v, col]) => (
              <div key={l}>
                <div className="serif" style={{ fontSize: 32, fontWeight: 600, color: col }}>{v}</div>
                <div style={{ fontSize: 11, color: C.textMid, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── TRIPS ────────────────────────────────────────────────────────────────────
const Trips = ({ toast }) => {
  const [filter, setFilter] = useState("");
  const rows = filter ? MOCK.trips.filter(t => t.status === filter) : MOCK.trips;

  const cols = [
    { key: "id",     label: "Trip ID",   render: r => <span className="mono" style={{ fontSize: 11, color: C.textSub }}>{r.id}</span> },
    { key: "rider",  label: "Rider",     render: r => `${r.rider.firstName} ${r.rider.lastName}` },
    { key: "driver", label: "Driver",    render: r => r.driver ? `${r.driver.firstName} ${r.driver.lastName}` : <span style={{ color: C.muted, fontStyle: "italic" }}>Unassigned</span> },
    { key: "pickup", label: "Pickup",    render: r => <span style={{ fontSize: 12 }}>{r.pickupAddress.slice(0, 30)}…</span> },
    { key: "class",  label: "Class",     render: r => <Badge color={r.rideClass === "executive" ? C.amber : C.greenMid}>{r.rideClass}</Badge> },
    { key: "status", label: "Status",    render: r => <SB s={r.status} /> },
    { key: "fare",   label: "Fare",      render: r => <span className="mono" style={{ fontWeight: 600 }}>₦{r.totalFare.toLocaleString()}</span> },
    { key: "co2",    label: "CO₂",       render: r => <span style={{ color: C.greenMid, fontSize: 12 }}>🌿 {r.co2SavedGrams}g</span> },
    { key: "dist",   label: "Dist",      render: r => <span className="mono">{r.distanceKm.toFixed(1)}km</span> },
    { key: "date",   label: "Date",      render: r => new Date(r.createdAt).toLocaleDateString("en-NG") },
  ];

  return (
    <div>
      <PH title="Trips" sub="All ride requests across the platform">
        <Sel value={filter} onChange={setFilter} options={[
          { value: "", label: "All status" }, { value: "requested", label: "Requested" },
          { value: "accepted", label: "Accepted" }, { value: "driver_arrived", label: "Driver Arrived" },
          { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ]} />
      </PH>
      <Card pad={0}>
        <Table columns={cols} data={rows} />
      </Card>
    </div>
  );
};

// ── DRIVERS ──────────────────────────────────────────────────────────────────
const Drivers = ({ toast }) => {
  const [filter, setFilter] = useState("");
  const [appFilter, setAppFilter] = useState("");
  const [rows, setRows] = useState(MOCK.drivers);

  const filtered = rows
    .filter(d => filter ? d.status === filter : true)
    .filter(d => appFilter === "pending" ? !d.isApproved : appFilter === "approved" ? d.isApproved : true);

  const approve = id => {
    setRows(r => r.map(d => d.id === id ? { ...d, isApproved: true } : d));
    toast("Driver approved successfully!", "success");
  };

  const TC = t => ({ bronze: "#c27c44", silver: "#8ea0b8", gold: C.amber, platinum: "#7bc4dc" })[t] || C.muted;

  const cols = [
    { key: "name",     label: "Driver",      render: r => <div><div style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</div><div style={{ fontSize: 11, color: C.textSub }}>{r.email}</div></div> },
    { key: "vehicle",  label: "Vehicle",     render: r => <div><div style={{ fontSize: 12 }}>{r.vehicleModel}</div><div className="mono" style={{ fontSize: 11, color: C.textSub }}>{r.licensePlate}</div></div> },
    { key: "status",   label: "Status",      render: r => <SB s={r.status} /> },
    { key: "approved", label: "Approval",    render: r => r.isApproved ? <Badge color={C.greenMid}>Approved</Badge> : <Badge color={C.amber}>Pending</Badge> },
    { key: "rating",   label: "Rating",      render: r => r.averageRating > 0 ? <span style={{ color: C.amber }}>★ {r.averageRating.toFixed(1)}</span> : <span style={{ color: C.muted }}>—</span> },
    { key: "trips",    label: "Trips",       render: r => <span className="mono">{r.totalTrips}</span> },
    { key: "tier",     label: "Tier",        render: r => <Badge color={TC(r.tier)}>{r.tier}</Badge> },
    { key: "earnings", label: "Earnings",    render: r => <span className="mono">₦{r.totalEarnings.toLocaleString()}</span> },
    { key: "accept",   label: "Accept Rate", render: r => r.acceptanceRate > 0 ? <span className="mono">{r.acceptanceRate}%</span> : <span style={{ color: C.muted }}>—</span> },
    { key: "actions",  label: "",            render: r => !r.isApproved ? <Btn size="sm" v="lime" onClick={() => approve(r.id)}>Approve</Btn> : null },
  ];

  return (
    <div>
      <PH title="Drivers" sub="Manage driver accounts and approvals">
        <Sel value={filter} onChange={setFilter} options={[
          { value: "", label: "All status" }, { value: "online", label: "Online" },
          { value: "offline", label: "Offline" }, { value: "on_trip", label: "On Trip" },
        ]} />
        <Sel value={appFilter} onChange={setAppFilter} options={[
          { value: "", label: "All" }, { value: "pending", label: "Pending Approval" }, { value: "approved", label: "Approved" },
        ]} />
      </PH>
      <Card pad={0}>
        <Table columns={cols} data={filtered} />
      </Card>
    </div>
  );
};

// ── FARE ENGINE ──────────────────────────────────────────────────────────────
const FareEngine = ({ toast }) => {
  const [fareRules, setFareRules] = useState(MOCK.fareRules);
  const [surgeRules, setSurgeRules] = useState(MOCK.surgeRules);
  const [editFare, setEditFare] = useState(null);
  const [editSurge, setEditSurge] = useState(null);
  const [ff, setFf] = useState({});
  const [sf, setSf] = useState({});

  const saveFare = () => {
    if (editFare === "new") setFareRules(r => [...r, { ...ff, id: "fr-new-" + Date.now(), isActive: true }]);
    else setFareRules(r => r.map(x => x.id === editFare ? { ...x, ...ff } : x));
    toast("Fare rule saved!", "success"); setEditFare(null);
  };
  const saveSurge = () => {
    if (editSurge === "new") setSurgeRules(r => [...r, { ...sf, id: "sr-new-" + Date.now(), isActive: true }]);
    else setSurgeRules(r => r.map(x => x.id === editSurge ? { ...x, ...sf } : x));
    toast("Surge rule saved!", "success"); setEditSurge(null);
  };

  const CC = c => ({ eco: C.greenMid, standard: C.blue, executive: C.amber })[c] || C.muted;

  return (
    <div>
      <PH title="Fare Engine" sub="Pricing rules and surge multipliers">
        <Btn v="primary" onClick={() => { setFf({ rideClass: "eco" }); setEditFare("new"); }}>+ Fare Rule</Btn>
        <Btn v="outline" onClick={() => { setSf({}); setEditSurge("new"); }}>+ Surge Rule</Btn>
      </PH>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Fare Rules</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
            {fareRules.map(r => (
              <div key={r.id} style={{ background: C.bgMid, borderRadius: 14, padding: 18, border: `1px solid ${C.border}`, borderTop: `3px solid ${CC(r.rideClass)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, textTransform: "capitalize", marginBottom: 4 }}>{r.rideClass} — {r.name}</div>
                    <SB s={r.isActive ? "active" : "offline"} />
                  </div>
                  <Btn v="ghost" size="sm" onClick={() => { setFf(r); setEditFare(r.id); }}>Edit</Btn>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["Start fare", `₦${r.baseFare}`], ["Per km", `₦${r.perKmRate}`], ["Per min", `₦${r.perMinuteRate}`], ["Min fare", `₦${r.minimumFare}`], ["Cancel fee", `₦${r.cancellationFee}`], ["Tax", `${(r.taxRate * 100).toFixed(1)}%`]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: C.textSub, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2 }}>{k}</div>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 13 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Surge Pricing Rules</div>
          <Table
            columns={[
              { key: "name",    label: "Name",       render: r => <strong>{r.name}</strong> },
              { key: "mult",    label: "Multiplier", render: r => <span className="mono" style={{ color: C.amber, fontWeight: 700 }}>×{r.multiplier}</span> },
              { key: "hours",   label: "Hours",      render: r => <span className="mono">{r.startHour}:00 – {r.endHour}:00</span> },
              { key: "demand",  label: "Min Demand", render: r => <span className="mono">{r.demandThreshold} trips</span> },
              { key: "status",  label: "Status",     render: r => <SB s={r.isActive ? "active" : "offline"} /> },
              { key: "actions", label: "",           render: r => <Btn v="ghost" size="sm" onClick={() => { setSf(r); setEditSurge(r.id); }}>Edit</Btn> },
            ]}
            data={surgeRules}
          />
        </Card>
      </div>

      {editFare && (
        <Modal title={editFare === "new" ? "Add Fare Rule" : "Edit Fare Rule"} onClose={() => setEditFare(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Name" value={ff.name || ""} onChange={v => setFf(p => ({ ...p, name: v }))} placeholder="Eco Standard" />
            <Sel label="Ride Class" value={ff.rideClass || "eco"} onChange={v => setFf(p => ({ ...p, rideClass: v }))}
              options={[{ value: "eco", label: "Eco" }, { value: "executive", label: "Executive" }]} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["baseFare","Start Fare (₦)"],["perKmRate","Per km (₦)"],["perMinuteRate","Per min (₦)"],["minimumFare","Minimum (₦)"],["cancellationFee","Cancel Fee (₦)"],["taxRate","Tax (e.g. 0.025)"]].map(([k, l]) => (
                <Input key={k} label={l} type="number" value={ff[k] || ""} onChange={v => setFf(p => ({ ...p, [k]: v }))} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="ghost" onClick={() => setEditFare(null)}>Cancel</Btn>
              <Btn onClick={saveFare}>Save Rule</Btn>
            </div>
          </div>
        </Modal>
      )}

      {editSurge && (
        <Modal title={editSurge === "new" ? "Add Surge Rule" : "Edit Surge Rule"} onClose={() => setEditSurge(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Name" value={sf.name || ""} onChange={v => setSf(p => ({ ...p, name: v }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Multiplier" type="number" value={sf.multiplier || ""} onChange={v => setSf(p => ({ ...p, multiplier: v }))} />
              <Input label="Min Demand" type="number" value={sf.demandThreshold || ""} onChange={v => setSf(p => ({ ...p, demandThreshold: v }))} />
              <Input label="Start Hour (0–23)" type="number" value={sf.startHour ?? ""} onChange={v => setSf(p => ({ ...p, startHour: v }))} />
              <Input label="End Hour (0–23)" type="number" value={sf.endHour ?? ""} onChange={v => setSf(p => ({ ...p, endHour: v }))} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="ghost" onClick={() => setEditSurge(null)}>Cancel</Btn>
              <Btn onClick={saveSurge}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PAYMENTS ─────────────────────────────────────────────────────────────────
const Payments = () => {
  const [filter, setFilter] = useState("");
  const rows = filter ? MOCK.payments.filter(p => p.status === filter) : MOCK.payments;
  const totalRev = rows.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const totalDriverPay = rows.filter(p => p.status === "completed").reduce((s, p) => s + p.driverEarnings, 0);

  const cols = [
    { key: "id",      label: "ID",             render: r => <span className="mono" style={{ fontSize: 11 }}>{r.id}</span> },
    { key: "rider",   label: "Rider",          render: r => `${r.rider.firstName} ${r.rider.lastName}` },
    { key: "amount",  label: "Total",          render: r => <span className="mono" style={{ fontWeight: 700 }}>₦{r.amount.toLocaleString()}</span> },
    { key: "method",  label: "Method",         render: r => <Badge color={r.method === "card" ? C.blue : r.method === "wallet" ? C.greenMid : "#4a3728"}>{r.method}</Badge> },
    { key: "status",  label: "Status",         render: r => <SB s={r.status} /> },
    { key: "driver",  label: "Driver Payout",  render: r => <span className="mono">₦{r.driverEarnings.toLocaleString()}</span> },
    { key: "fee",     label: "Platform (20%)", render: r => <span className="mono">₦{r.platformFee.toLocaleString()}</span> },
    { key: "date",    label: "Date",           render: r => new Date(r.createdAt).toLocaleDateString("en-NG") },
  ];

  return (
    <div>
      <PH title="Payments" sub="80% driver payout · 20% platform fee">
        <Sel value={filter} onChange={setFilter} options={[
          { value: "", label: "All" }, { value: "pending", label: "Pending" },
          { value: "completed", label: "Completed" }, { value: "refunded", label: "Refunded" }, { value: "failed", label: "Failed" },
        ]} />
      </PH>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <Stat label="Total Revenue"    value={`₦${(totalRev/1000).toFixed(1)}k`}         icon="₦" accent={C.amber} />
        <Stat label="Driver Payouts"   value={`₦${(totalDriverPay/1000).toFixed(1)}k`}   icon="◎" />
        <Stat label="Platform Earned"  value={`₦${((totalRev-totalDriverPay)/1000).toFixed(1)}k`} icon="▣" accent={C.green} />
      </div>
      <Card pad={0}>
        <Table columns={cols} data={rows} />
      </Card>
    </div>
  );
};

// ── REFUNDS ───────────────────────────────────────────────────────────────────
const Refunds = ({ toast }) => {
  const [filter, setFilter] = useState("pending");
  const [rows, setRows] = useState(MOCK.refunds);
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState("");

  const filtered = filter ? rows.filter(r => r.status === filter) : rows;

  const handle = () => {
    setRows(r => r.map(x => x.id === modal.row.id ? { ...x, status: modal.type === "approve" ? "approved" : "rejected" } : x));
    toast(`Refund ${modal.type === "approve" ? "approved" : "rejected"}`, "success");
    setModal(null); setNotes("");
  };

  const cols = [
    { key: "id",     label: "ID",      render: r => <span className="mono" style={{ fontSize: 11 }}>{r.id}</span> },
    { key: "amount", label: "Amount",  render: r => <span className="mono" style={{ fontWeight: 700, color: C.amber }}>₦{r.amount.toLocaleString()}</span> },
    { key: "reason", label: "Reason",  render: r => <span style={{ fontSize: 12 }}>{r.reason.slice(0, 52)}…</span> },
    { key: "type",   label: "Type",    render: r => <Badge color={r.type === "auto" ? C.blue : C.amber}>{r.type}</Badge> },
    { key: "status", label: "Status",  render: r => <SB s={r.status} /> },
    { key: "date",   label: "Date",    render: r => new Date(r.createdAt).toLocaleDateString("en-NG") },
    { key: "act",    label: "",        render: r => r.status === "pending" ? (
      <div style={{ display: "flex", gap: 6 }}>
        <Btn size="sm" v="lime" onClick={() => { setModal({ type: "approve", row: r }); setNotes(""); }}>Approve</Btn>
        <Btn size="sm" v="danger" onClick={() => { setModal({ type: "reject", row: r }); setNotes(""); }}>Reject</Btn>
      </div>
    ) : null },
  ];

  return (
    <div>
      <PH title="Refunds & Disputes" sub="Review and resolve customer refund requests">
        <Sel value={filter} onChange={setFilter} options={[
          { value: "", label: "All" }, { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" },
        ]} />
      </PH>
      <Card pad={0}><Table columns={cols} data={filtered} /></Card>
      {modal && (
        <Modal title={`${modal.type === "approve" ? "Approve" : "Reject"} Refund — ₦${modal.row.amount.toLocaleString()}`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: C.bgMid, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.textMid }}><strong>Reason:</strong> {modal.row.reason}</div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes for this decision…"
                style={{ width: "100%", minHeight: 90, background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "10px 13px", color: C.text, fontSize: 13, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn v={modal.type === "approve" ? "primary" : "danger"} onClick={handle}>
                {modal.type === "approve" ? "Approve Refund" : "Reject Refund"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PROMOTIONS ────────────────────────────────────────────────────────────────
const Promotions = ({ toast }) => {
  const [rows, setRows] = useState(MOCK.promotions);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const save = () => {
    if (modal === "new") setRows(r => [...r, { ...form, id: "pr-" + Date.now(), totalRedeemed: 0, isActive: true }]);
    else setRows(r => r.map(x => x.id === modal ? { ...x, ...form } : x));
    toast("Promotion saved!", "success"); setModal(null);
  };

  const cols = [
    { key: "code",    label: "Code",      render: r => <span className="mono" style={{ color: C.greenMid, fontWeight: 700 }}>{r.code}</span> },
    { key: "name",    label: "Name",      render: r => <strong>{r.name}</strong> },
    { key: "disc",    label: "Discount",  render: r => <span className="mono" style={{ fontWeight: 600 }}>{r.discountType === "percentage" ? `${r.discountValue}%` : `₦${r.discountValue}`}</span> },
    { key: "maxD",    label: "Max Off",   render: r => `₦${(r.maxDiscount || 0).toLocaleString()}` },
    { key: "used",    label: "Redeemed",  render: r => <span className="mono">{r.totalRedeemed} / {r.usageLimit || "∞"}</span> },
    { key: "expires", label: "Expires",   render: r => r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-NG") : "Never" },
    { key: "status",  label: "Status",    render: r => <SB s={r.isActive ? "active" : "offline"} /> },
    { key: "actions", label: "",          render: r => <Btn size="sm" v="ghost" onClick={() => { setForm(r); setModal(r.id); }}>Edit</Btn> },
  ];

  return (
    <div>
      <PH title="Promotions" sub="Discount codes and special offers">
        <Btn v="primary" onClick={() => { setForm({ discountType: "percentage", isActive: true }); setModal("new"); }}>+ New Promo</Btn>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} /></Card>
      {modal && (
        <Modal title={modal === "new" ? "Create Promotion" : "Edit Promotion"} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Code" value={form.code || ""} onChange={v => setForm(p => ({ ...p, code: v.toUpperCase() }))} placeholder="NEW123" />
              <Input label="Name" value={form.name || ""} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="20% off first 3 rides" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="Type" value={form.discountType || "percentage"} onChange={v => setForm(p => ({ ...p, discountType: v }))}
                options={[{ value: "percentage", label: "Percentage (%)" }, { value: "fixed", label: "Fixed (₦)" }]} />
              <Input label="Value" type="number" value={form.discountValue || ""} onChange={v => setForm(p => ({ ...p, discountValue: v }))} />
              <Input label="Max Discount (₦)" type="number" value={form.maxDiscount || ""} onChange={v => setForm(p => ({ ...p, maxDiscount: v }))} />
              <Input label="Usage Limit" type="number" value={form.usageLimit || ""} onChange={v => setForm(p => ({ ...p, usageLimit: v }))} placeholder="Leave blank = unlimited" />
              <Input label="Starts At" type="date" value={form.startsAt?.slice(0, 10) || ""} onChange={v => setForm(p => ({ ...p, startsAt: v }))} />
              <Input label="Expires At" type="date" value={form.expiresAt?.slice(0, 10) || ""} onChange={v => setForm(p => ({ ...p, expiresAt: v }))} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save Promotion</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── SUPPORT TICKETS ──────────────────────────────────────────────────────────
const Tickets = ({ toast }) => {
  const [filter, setFilter] = useState("open");
  const [rows, setRows] = useState(MOCK.tickets);
  const [sel, setSel] = useState(null);
  const [reply, setReply] = useState("");
  const [res, setRes] = useState("");

  const filtered = filter ? rows.filter(r => r.status === filter) : rows;
  const PC = p => ({ low: C.muted, medium: C.blue, high: C.amber, urgent: C.red })[p];

  const sendReply = () => {
    if (!reply.trim()) return;
    setRows(r => r.map(t => t.id === sel.id ? { ...t, thread: [...t.thread, { from: "admin", message: reply, timestamp: new Date().toISOString() }] } : t));
    setSel(s => ({ ...s, thread: [...s.thread, { from: "admin", message: reply, timestamp: new Date().toISOString() }] }));
    toast("Reply sent", "success"); setReply("");
  };

  const resolve = () => {
    if (!res.trim()) return;
    setRows(r => r.map(t => t.id === sel.id ? { ...t, status: "resolved" } : t));
    toast("Ticket resolved", "success"); setSel(null); setRes("");
  };

  const cols = [
    { key: "sub",      label: "Subject",  render: r => <div><div style={{ fontWeight: 600 }}>{r.subject}</div><div style={{ fontSize: 11, color: C.textSub }}>{r.user.firstName} {r.user.lastName} · {r.channel}</div></div> },
    { key: "priority", label: "Priority", render: r => <Badge color={PC(r.priority)}>{r.priority}</Badge> },
    { key: "status",   label: "Status",   render: r => <SB s={r.status} /> },
    { key: "date",     label: "Date",     render: r => new Date(r.createdAt).toLocaleDateString("en-NG") },
    { key: "act",      label: "",         render: r => <Btn size="sm" v="ghost" onClick={() => setSel(r)}>Open →</Btn> },
  ];

  return (
    <div>
      <PH title="Support Tickets" sub="Customer and driver support requests">
        <Sel value={filter} onChange={setFilter} options={[
          { value: "", label: "All" }, { value: "open", label: "Open" },
          { value: "in_progress", label: "In Progress" }, { value: "resolved", label: "Resolved" },
        ]} />
      </PH>
      <Card pad={0}><Table columns={cols} data={filtered} /></Card>
      {sel && (
        <Modal title={sel.subject} onClose={() => setSel(null)} width={600}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SB s={sel.status} /><Badge color={PC(sel.priority)}>{sel.priority}</Badge><Badge color={C.muted}>{sel.channel}</Badge>
            </div>
            <div style={{ background: C.bgMid, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>{sel.description}</div>
            {sel.thread.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                {sel.thread.map((m, i) => (
                  <div key={i} style={{ background: m.from === "admin" ? "#f0f7ec" : C.bgMid, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 13px", fontSize: 13 }}>
                    <div style={{ fontSize: 10, color: C.textSub, marginBottom: 3 }}>{m.from === "admin" ? "Eco Support" : "Customer"} · {new Date(m.timestamp).toLocaleString()}</div>
                    {m.message}
                  </div>
                ))}
              </div>
            )}
            {sel.status !== "resolved" && sel.status !== "closed" && <>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Reply</label>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply…"
                  style={{ width: "100%", minHeight: 80, background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "10px 13px", color: C.text, fontSize: 13, resize: "vertical" }} />
              </div>
              <Btn v="outline" onClick={sendReply}>Send Reply</Btn>
              <hr style={{ border: "none", borderTop: `1px solid ${C.border}` }} />
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Resolution</label>
                <textarea value={res} onChange={e => setRes(e.target.value)} placeholder="Describe how this was resolved…"
                  style={{ width: "100%", minHeight: 80, background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "10px 13px", color: C.text, fontSize: 13, resize: "vertical" }} />
              </div>
              <Btn v="primary" onClick={resolve}>Mark as Resolved</Btn>
            </>}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── ADMIN TEAM ────────────────────────────────────────────────────────────────
const Team = ({ toast }) => {
  const [rows, setRows] = useState(MOCK.team);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const RC = r => ({ superadmin: C.green, ops: C.blue, finance: C.amber, support: C.greenMid, readonly: C.muted })[r] || C.muted;

  const invite = () => {
    setRows(r => [...r, { ...form, id: "adm-" + Date.now(), role: { name: form.role || "readonly" }, isActive: true, lastLogin: null }]);
    toast("Invite sent!", "success"); setModal(false); setForm({});
  };

  const disable = id => {
    setRows(r => r.map(a => a.id === id ? { ...a, isActive: false } : a));
    toast("Admin disabled", "success");
  };

  const cols = [
    { key: "name",   label: "Admin",     render: r => <div><div style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</div><div style={{ fontSize: 11, color: C.textSub }}>{r.email}</div></div> },
    { key: "role",   label: "Role",      render: r => <Badge color={RC(r.role?.name)}>{r.role?.name}</Badge> },
    { key: "status", label: "Status",    render: r => <SB s={r.isActive ? "active" : "offline"} /> },
    { key: "login",  label: "Last Login",render: r => r.lastLogin ? new Date(r.lastLogin).toLocaleDateString("en-NG") : <span style={{ color: C.muted }}>Never</span> },
    { key: "act",    label: "",          render: r => r.isActive && r.role?.name !== "superadmin" ? <Btn size="sm" v="danger" onClick={() => disable(r.id)}>Disable</Btn> : null },
  ];

  return (
    <div>
      <PH title="Admin Team" sub="Manage admin accounts and permissions">
        <Btn v="primary" onClick={() => setModal(true)}>+ Invite Admin</Btn>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} /></Card>
      {modal && (
        <Modal title="Invite Admin" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="First Name" value={form.firstName || ""} onChange={v => setForm(p => ({ ...p, firstName: v }))} />
              <Input label="Last Name" value={form.lastName || ""} onChange={v => setForm(p => ({ ...p, lastName: v }))} />
            </div>
            <Input label="Email" type="email" value={form.email || ""} onChange={v => setForm(p => ({ ...p, email: v }))} />
            <Sel label="Role" value={form.role || ""} onChange={v => setForm(p => ({ ...p, role: v }))}
              options={[{ value: "", label: "Select role…" }, { value: "ops", label: "Operations" }, { value: "finance", label: "Finance" }, { value: "support", label: "Support" }, { value: "readonly", label: "Read Only" }]} />
            <div style={{ background: "#f0f7ec", border: `1px solid ${C.greenMid}33`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.textMid }}>
              🌿 A temporary password will be emailed to the new admin.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn v="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={invite}>Send Invite</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────
const Audit = () => {
  const AC = a => {
    if (!a) return C.muted;
    if (a.includes("APPROV") || a.includes("INVIT")) return C.greenMid;
    if (a.includes("REJECT") || a.includes("DISABL")) return C.red;
    if (a.includes("UPDATE") || a.includes("CREATE") || a.includes("LOGIN")) return C.blue;
    return C.muted;
  };

  const cols = [
    { key: "time",     label: "Time",       render: r => <span className="mono" style={{ fontSize: 11 }}>{new Date(r.createdAt).toLocaleString("en-NG")}</span> },
    { key: "admin",    label: "Admin",      render: r => `${r.admin.firstName} ${r.admin.lastName}` },
    { key: "action",   label: "Action",     render: r => <Badge color={AC(r.action)}>{r.action.replace(/_/g, " ")}</Badge> },
    { key: "resource", label: "Resource",   render: r => <span style={{ color: C.textMid }}>{r.resource}</span> },
    { key: "resId",    label: "ID",         render: r => <span className="mono" style={{ fontSize: 11, color: C.muted }}>{r.resourceId}</span> },
  ];

  return (
    <div>
      <PH title="Audit Log" sub="Complete record of all admin actions" />
      <Card pad={0}><Table columns={cols} data={MOCK.auditLogs} /></Card>
    </div>
  );
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const Notifications = ({ toast }) => {
  const [form, setForm] = useState({ targetRole: "", subject: "", body: "" });
  const [sent, setSent] = useState(null);

  const send = () => {
    if (!form.subject || !form.body) { toast("Subject and body required", "warn"); return; }
    const count = form.targetRole === "rider" ? 4821 : form.targetRole === "driver" ? 342 : 5163;
    setSent(count); toast(`Sent to ${count.toLocaleString()} users!`, "success");
    setForm({ targetRole: "", subject: "", body: "" });
  };

  return (
    <div>
      <PH title="Notifications" sub="Send bulk messages to riders and drivers" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div className="serif" style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Compose Message</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Sel label="Target Audience" value={form.targetRole} onChange={v => setForm(p => ({ ...p, targetRole: v }))}
              options={[{ value: "", label: "All Users (4,821 riders + 342 drivers)" }, { value: "rider", label: "Riders Only (4,821)" }, { value: "driver", label: "Drivers Only (342)" }]} />
            <Input label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} placeholder="Important update from Eco" />
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Message</label>
              <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                placeholder="Use code VLTN for 30% off your next ride. Offer valid Feb 14 only."
                style={{ width: "100%", minHeight: 150, background: C.bgMid, border: `1px solid ${C.borderDk}`, borderRadius: 10, padding: "10px 13px", color: C.text, fontSize: 13, resize: "vertical" }} />
            </div>
            <Btn v="primary" size="lg" onClick={send} style={{ width: "100%", justifyContent: "center" }}>Send Notification →</Btn>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ background: C.bgDeep, border: "none" }}>
            <div style={{ fontSize: 10, color: C.limeGlow, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12, opacity: .75 }}>Preview — Inbox</div>
            <div style={{ background: "#ffffff0d", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#ffffff40", marginBottom: 6 }}>TO: {form.targetRole || "All Users"} · from Eco</div>
              <div style={{ fontWeight: 600, color: "#fff", marginBottom: 6 }}>{form.subject || "Subject…"}</div>
              <div style={{ fontSize: 13, color: "#ffffff80", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{form.body || "Message body…"}</div>
            </div>
          </Card>
          {sent && (
            <Card style={{ background: "#f0f7ec", border: `1px solid ${C.greenMid}33` }}>
              <div className="serif" style={{ fontWeight: 600, fontSize: 14, color: C.greenMid, marginBottom: 6 }}>✓ Message Delivered</div>
              <div className="serif" style={{ fontSize: 40, fontWeight: 600, color: C.green }}>{sent.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: C.textMid }}>users reached</div>
            </Card>
          )}
          <Card>
            <div className="serif" style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Best Practices</div>
            {["Keep messages concise and action-oriented", "Include promo codes in ALL CAPS (e.g. XMAS, VLTN)", "State expiry dates clearly", "Avoid more than 2 bulk messages per day"].map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.textMid }}>
                <span style={{ color: C.greenMid }}>🌿</span> {g}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  const toast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
  };

  const PAGES = {
    dashboard:     <Dashboard toast={toast} onNav={setPage} />,
    analytics:     <Analytics />,
    trips:         <Trips toast={toast} />,
    drivers:       <Drivers toast={toast} />,
    fare:          <FareEngine toast={toast} />,
    payments:      <Payments />,
    refunds:       <Refunds toast={toast} />,
    promotions:    <Promotions toast={toast} />,
    tickets:       <Tickets toast={toast} />,
    team:          <Team toast={toast} />,
    audit:         <Audit />,
    notifications: <Notifications toast={toast} />,
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar active={page} onNav={setPage} />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: C.bg }}>
          <div key={page} className="fade-up">{PAGES[page]}</div>
        </main>
      </div>
      <div style={{ position: "fixed", bottom: 0, right: 0, display: "flex", flexDirection: "column", gap: 8, padding: 20, zIndex: 9999 }}>
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />)}
      </div>
    </>
  );
}