import EcoLogo from './assets/eco.png'
import { useState, useEffect, useCallback } from "react";
import api from "./api.js";

const C = {
  bg:"#f4f7f0", bgCard:"#ffffff", bgDeep:"#0d1a0f", bgMid:"#f0f5ec",
  green:"#1a5c2a", greenMid:"#2d8c47", greenBrt:"#3db85f",
  lime:"#8fd44e", limeGlow:"#b5e87a",
  amber:"#e8a020", red:"#d63c3c", blue:"#2563eb",
  border:"#dde8d8", borderDk:"#c8d8c0",
  text:"#1a2e1c", textMid:"#4a6650", textSub:"#7a9480", muted:"#a8c0aa",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;font-size:14px;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:${C.bg};}
    ::-webkit-scrollbar-thumb{background:${C.borderDk};border-radius:4px;}
    button{cursor:pointer;font-family:'DM Sans',sans-serif;}
    input,textarea,select{font-family:'DM Sans',sans-serif;}
    .serif{font-family:'Fraunces',serif;}
    .mono{font-family:'DM Mono',monospace;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
    .fade-up{animation:fadeUp .3s cubic-bezier(.22,1,.36,1) forwards;}
  `}</style>
);

const Card = ({ children, style, pad=22 }) => <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, padding:pad, ...style }}>{children}</div>;
const Badge = ({ children, color=C.greenMid }) => <span style={{ background:color+"18", color, border:`1px solid ${color}30`, borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:600, letterSpacing:".04em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{children}</span>;

const Btn = ({ children, onClick, v="primary", size="md", disabled, style }) => {
  const [hov,setHov]=useState(false);
  const S={primary:[C.green,C.greenMid,"#fff","none"],lime:[C.lime,C.limeGlow,C.green,"none"],ghost:["transparent",C.bgMid,C.textMid,`1px solid ${C.border}`],danger:[C.red,"#b82e2e","#fff","none"],outline:["transparent",C.green+"10",C.green,`1px solid ${C.green}44`]}[v];
  const pad=size==="sm"?"4px 11px":size==="lg"?"12px 28px":"7px 16px";
  const fs=size==="sm"?12:size==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:hov?S[1]:S[0], color:S[2], border:S[3], borderRadius:10, padding:pad, fontSize:fs, fontWeight:600, transition:"all .15s", opacity:disabled?.5:1, display:"inline-flex", alignItems:"center", gap:6, ...style }}>{children}</button>;
};

const Input = ({ label, value, onChange, type="text", placeholder }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:11, fontWeight:600, color:C.textMid, textTransform:"uppercase", letterSpacing:".06em" }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"9px 13px", color:C.text, fontSize:13, outline:"none" }}
      onFocus={e=>e.target.style.borderColor=C.greenMid} onBlur={e=>e.target.style.borderColor=C.borderDk} />
  </div>
);

const Sel = ({ label, value, onChange, options }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:11, fontWeight:600, color:C.textMid, textTransform:"uppercase", letterSpacing:".06em" }}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"9px 13px", color:C.text, fontSize:13, outline:"none" }}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Modal = ({ title, onClose, children, width=520 }) => (
  <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, zIndex:1000, background:"#00000050", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(3px)" }}>
    <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:20, width:"90%", maxWidth:width, maxHeight:"90vh", overflow:"auto", animation:"fadeUp .2s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:`1px solid ${C.border}` }}>
        <h3 className="serif" style={{ fontSize:16, fontWeight:600 }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:22 }}>×</button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(()=>{ const t=setTimeout(onClose,3000); return()=>clearTimeout(t); },[]);
  const col=type==="error"?C.red:type==="warn"?C.amber:C.greenMid;
  return <div style={{ background:C.bgCard, border:`1px solid ${col}44`, borderLeft:`3px solid ${col}`, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, animation:"fadeUp .2s ease", boxShadow:"0 4px 20px rgba(0,0,0,.1)", maxWidth:340 }}><div style={{ width:7, height:7, borderRadius:"50%", background:col, flexShrink:0 }}/><span style={{ fontSize:13, flex:1 }}>{msg}</span><button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:18 }}>×</button></div>;
};

const Spinner = () => <div style={{ width:20, height:20, border:`2px solid ${C.border}`, borderTopColor:C.greenMid, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>;

const Empty = ({ msg="No records found" }) => <div style={{ textAlign:"center", padding:48, color:C.muted, fontStyle:"italic" }}>{msg}</div>;

const Table = ({ columns, data, onRowClick, emptyMsg="No records found", loading }) => (
  <div style={{ overflowX:"auto" }}>
    {loading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
      <thead><tr style={{ background:C.bgMid }}>{columns.map(c=><th key={c.key} style={{ textAlign:"left", padding:"9px 14px", color:C.textMid, fontWeight:600, fontSize:11, letterSpacing:".06em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{c.label}</th>)}</tr></thead>
      <tbody>{data.length===0?<tr><td colSpan={columns.length}><Empty msg={emptyMsg}/></td></tr>:data.map((row,i)=>(
        <tr key={i} onClick={()=>onRowClick&&onRowClick(row)} style={{ borderBottom:`1px solid ${C.border}`, transition:"background .1s", cursor:onRowClick?"pointer":"default" }} onMouseEnter={e=>e.currentTarget.style.background=C.bgMid} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          {columns.map(c=><td key={c.key} style={{ padding:"12px 14px", verticalAlign:"middle" }}>{c.render?c.render(row):row[c.key]??"—"}</td>)}
        </tr>
      ))}</tbody>
    </table>}
  </div>
);

const SC = s=>({completed:C.greenMid,active:C.greenMid,online:C.greenMid,approved:C.greenMid,resolved:C.greenMid,in_progress:C.blue,accepted:C.blue,driver_arrived:C.blue,assigned:C.blue,pending:C.amber,requested:C.amber,open:C.amber,pending_approval:C.amber,cancelled:C.red,rejected:C.red,offline:C.muted,closed:C.muted,failed:C.red,on_trip:C.blue,trial:C.blue,past_due:C.red,expired:C.muted}[s]||C.muted);
const SB = ({ s }) => <Badge color={SC(s)}>{s?.replace(/_/g," ")}</Badge>;

const Stat = ({ label, value, icon, accent=C.greenMid, sub, onClick, loading }) => (
  <Card onClick={onClick} style={{ animation:"fadeUp .4s ease", cursor:onClick?"pointer":"default", transition:"transform .15s, box-shadow .15s" }}
    onMouseEnter={e=>{ if(onClick){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.1)"; }}}
    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
      <div style={{ fontSize:26 }}>{icon}</div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {onClick&&<span style={{ fontSize:10, color:C.muted }}>view →</span>}
        <div style={{ width:8, height:8, borderRadius:"50%", background:accent, animation:"pulse 2.5s infinite" }}/>
      </div>
    </div>
    {loading ? <div style={{ height:36, display:"flex", alignItems:"center" }}><Spinner/></div> :
      <div className="serif" style={{ fontSize:30, fontWeight:600, color:C.text, lineHeight:1, marginBottom:5 }}>{value??"—"}</div>}
    <div style={{ fontSize:11, fontWeight:600, color:C.textMid, textTransform:"uppercase", letterSpacing:".06em" }}>{label}</div>
    {sub&&<div style={{ fontSize:11, color:C.textSub, marginTop:3 }}>{sub}</div>}
    <div style={{ height:3, background:C.bgMid, borderRadius:3, marginTop:14 }}><div style={{ height:"100%", width:"60%", background:accent, borderRadius:3, opacity:.65 }}/></div>
  </Card>
);

const NAV = [
  { id:"dashboard",     label:"Overview",         icon:"◈" },
  { id:"analytics",     label:"Analytics",        icon:"◇" },
  { id:"trips",         label:"Trips",            icon:"⟁" },
  { id:"drivers",       label:"Drivers",          icon:"◎" },
  { id:"fare",          label:"Fare Engine",      icon:"◉" },
  { id:"finance",       label:"Finance",          icon:"₦" },
  { id:"refunds",       label:"Refunds",          icon:"↺" },
  { id:"promotions",    label:"Promotions",       icon:"✦" },
  { id:"tickets",       label:"Support",          icon:"◫" },
  { id:"co2",           label:"CO₂ Analytics",    icon:"🌿" },
  { id:"ecoplus",       label:"Eco+ Subscription",icon:"★" },
  { id:"team",          label:"Team",             icon:"◐" },
  { id:"audit",         label:"Audit Log",        icon:"≡" },
  { id:"notifications", label:"Notifications",    icon:"◬" },
];

const Sidebar = ({ active, onNav, adminInfo }) => {
  const [hov,setHov]=useState(null);
  return (
    <nav style={{ width:224, flexShrink:0, background:C.bgDeep, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflowY:"auto" }}>
      <div style={{ padding:"26px 20px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <img src={EcoLogo} alt="Eco" style={{ width:52, height:"auto", flexShrink:0, filter:"brightness(0) invert(1)", objectFit:"contain" }}/>
          <div>
            <div className="serif" style={{ fontSize:17, fontWeight:600, color:"#fff", letterSpacing:"-.01em" }}>eco</div>
            <div style={{ fontSize:9, color:C.limeGlow, letterSpacing:".1em", textTransform:"uppercase", opacity:.75 }}>Admin Console</div>
          </div>
        </div>
        <div style={{ background:"#ffffff0a", borderRadius:9, padding:"7px 11px", border:"1px solid #ffffff0f" }}>
          <div style={{ fontSize:10, color:C.limeGlow, opacity:.7 }}>Ride Green, Ride Clean</div>
          <div style={{ fontSize:11, color:"#ffffff66", marginTop:1 }}>Abuja Operations</div>
        </div>
      </div>
      <div style={{ flex:1, padding:"4px 10px", display:"flex", flexDirection:"column", gap:1 }}>
        {NAV.map(n=>{
          const isA=active===n.id;
          return <button key={n.id} onClick={()=>onNav(n.id)} onMouseEnter={()=>setHov(n.id)} onMouseLeave={()=>setHov(null)} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 12px", borderRadius:9, border:"none", textAlign:"left", width:"100%", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:isA?600:400, transition:"all .13s", background:isA?C.green:hov===n.id?"#ffffff0d":"transparent", color:isA?"#fff":hov===n.id?"#ffffffcc":"#ffffff60" }}>
            <span style={{ fontSize:13, width:16, textAlign:"center", flexShrink:0 }}>{n.icon}</span>
            {n.label}
            {isA&&<div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:C.lime }}/>}
          </button>;
        })}
      </div>
      <div style={{ padding:"14px 20px 20px", borderTop:"1px solid #ffffff10" }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#ffffffcc", marginBottom:4 }}>{adminInfo?.email||"admin@eco.ng"}</div>
        <Badge color={C.lime}>{adminInfo?.role||"superadmin"}</Badge>
      </div>
    </nav>
  );
};

const PH = ({ title, sub, children }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
    <div>
      <h1 className="serif" style={{ fontSize:24, fontWeight:600, color:C.text, letterSpacing:"-.02em" }}>{title}</h1>
      {sub&&<p style={{ fontSize:13, color:C.textSub, marginTop:3 }}>{sub}</p>}
    </div>
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>{children}</div>
  </div>
);

// ─── LOGIN ─────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [form,setForm]=useState({email:"",password:""});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const submit = async () => {
    if(!form.email||!form.password){setErr("Email and password required");return;}
    setLoading(true);setErr("");
    try {
      const res=await api.login(form);
      api.setToken(res.data.token);
      onLogin(res.data.admin);
    } catch(e){ setErr(e.message||"Invalid credentials"); }
    finally{ setLoading(false); }
  };
  return (
    <div style={{ display:"flex", height:"100vh", alignItems:"center", justifyContent:"center", background:C.bg }}>
      <div style={{ width:380 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <img src={EcoLogo} alt="Eco" style={{ width:64, marginBottom:14 }}/>
          <h1 className="serif" style={{ fontSize:26, fontWeight:600, color:C.text }}>Admin Console</h1>
          <p style={{ fontSize:13, color:C.textSub, marginTop:4 }}>Sign in to continue</p>
        </div>
        <Card>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Email" type="email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} placeholder="admin@eco.ng"/>
            <Input label="Password" type="password" value={form.password} onChange={v=>setForm(p=>({...p,password:v}))} placeholder="••••••••"/>
            {err&&<div style={{ background:C.red+"15", border:`1px solid ${C.red}30`, borderRadius:8, padding:"8px 12px", fontSize:13, color:C.red }}>{err}</div>}
            <Btn v="primary" size="lg" onClick={submit} disabled={loading} style={{ width:"100%", justifyContent:"center" }}>{loading?"Signing in…":"Sign In →"}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
const Dashboard = ({ toast, onNav }) => {
  const [d,setD]=useState(null);
  const [dLoading,setDLoading]=useState(true);
  const [activeModal,setActiveModal]=useState(null);
  const [modalData,setModalData]=useState([]);
  const [modalLoading,setModalLoading]=useState(false);
  const [riderSearch,setRiderSearch]=useState("");
  const [riders,setRiders]=useState([]);
  const [dateFilter,setDateFilter]=useState("");
  const [recentTrips,setRecentTrips]=useState([]);

  useEffect(()=>{
    api.dashboard().then(r=>setD(r.data||r)).catch(()=>setD({})).finally(()=>setDLoading(false));
    api.trips({limit:5,status:"completed,in_progress,requested,cancelled"})
      .then(r=>setRecentTrips(r.data||[]))
      .catch(()=>setRecentTrips([]));
  },[]);

  const fmtN = n=>"₦"+Number(n||0).toLocaleString("en-NG");
  const fmt  = n=>n>=1000?(n/1000).toFixed(1)+"k":n;
  const co2Kg = ((d?.lifetimeCo2Grams||0)/1000);

  const openActiveTrips = async () => {
    setActiveModal("activeTrips"); setModalLoading(true);
    try { const r=await api.activeTrips(); setModalData(r.data||[]); }
    catch { setModalData([]); }
    setModalLoading(false);
  };
  const openOnlineDrivers = async () => {
    setActiveModal("onlineDrivers"); setModalLoading(true);
    try { const r=await api.onlineDrivers(); setModalData(r.data||[]); }
    catch { setModalData([]); }
    setModalLoading(false);
  };
  const openRiders = async () => {
    setActiveModal("riders"); setModalLoading(true);
    try { const r=await api.riders({limit:100}); setRiders(r.data||[]); }
    catch { setRiders([]); }
    setModalLoading(false);
  };
  const openRevenue = async (date) => {
    setActiveModal("revenue"); setModalLoading(true);
    try { const r=await api.payments({date:date||"today",limit:50}); setModalData(r.data||[]); }
    catch { setModalData([]); }
    setModalLoading(false);
  };
  const openTodayTrips = async (date) => {
    setActiveModal("todayTrips"); setModalLoading(true);
    try { const r=await api.trips({date:date||"today",limit:50}); setModalData(r.data||[]); }
    catch { setModalData([]); }
    setModalLoading(false);
  };

  const filteredRiders = riderSearch
    ? riders.filter(r=>`${r.user?.firstName} ${r.user?.lastName} ${r.user?.email}`.toLowerCase().includes(riderSearch.toLowerCase()))
    : riders;

  const updatedAt = d?.generatedAt ? new Date(d.generatedAt).toLocaleTimeString() : "—";

  return (
    <div>
      <PH title="Overview" sub={`Live data · Updated ${updatedAt}`}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:C.greenMid+"15", border:`1px solid ${C.greenMid}30`, borderRadius:100, padding:"4px 12px" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.greenMid, animation:"pulse 2s infinite" }}/>
          <span style={{ fontSize:11, color:C.greenMid, fontWeight:600 }}>LIVE</span>
        </div>
      </PH>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:14, marginBottom:24 }}>
        <Stat label="Active Trips"    value={d?.activeTrips}        icon="⟁" accent={C.blue}    loading={dLoading} onClick={openActiveTrips} />
        <Stat label="Online Drivers"  value={d?.activeDrivers}      icon="◎" accent={C.greenMid} loading={dLoading} onClick={openOnlineDrivers} />
        <Stat label="Total Riders"    value={fmt(d?.totalRiders)}   icon="◉" loading={dLoading}  onClick={openRiders} />
        <Stat label="Total Drivers"   value={fmt(d?.totalDrivers)}  icon="◎" loading={dLoading}  onClick={()=>onNav("drivers")} />
        <Stat label="Today Revenue"   value={fmtN(d?.dailyRevenue)} icon="₦" accent={C.amber}   loading={dLoading} onClick={()=>openRevenue("")} />
        <Stat label="Today Trips"     value={d?.dailyTrips}         icon="⟁" loading={dLoading}  onClick={()=>openTodayTrips("")} />
        <Stat label="Pending Refunds" value={d?.pendingRefunds}     icon="↺" accent={C.amber}   loading={dLoading} onClick={()=>onNav("refunds")} />
        <Stat label="Open Tickets"    value={d?.openTickets}        icon="◫" accent={C.amber}   loading={dLoading} onClick={()=>onNav("tickets")} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card style={{ background:C.bgDeep, border:"none" }}>
          <div style={{ position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-20, top:-20, width:140, height:140, borderRadius:"50%", background:C.green+"44", filter:"blur(30px)" }}/>
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🌿</div>
              <div className="serif" style={{ fontSize:13, color:C.limeGlow, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, opacity:.8 }}>Environmental Impact</div>
              <div className="serif" style={{ fontSize:26, fontWeight:600, color:"#fff", lineHeight:1.1, marginBottom:8 }}>{co2Kg.toFixed(1)} kg CO₂ saved lifetime</div>
              <p style={{ fontSize:12, color:"#ffffff66", lineHeight:1.6, marginBottom:16 }}>Eco's fully electric fleet reduces carbon emissions across Abuja. Every trip makes a difference.</p>
              <Btn v="lime" size="sm" onClick={()=>onNav("co2")}>View CO₂ Analytics →</Btn>
            </div>
          </div>
        </Card>
        <Card>
          <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:16, color:C.text }}>Recent Trips</div>
          {recentTrips.length===0 ? <Empty msg="No recent trips"/> :
            recentTrips.slice(0,4).map((t,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500 }}>{t.rider?.user?.firstName} {t.rider?.user?.lastName}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{(t.pickupAddress||"").slice(0,28)}{t.pickupAddress?.length>28?"…":""}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <SB s={t.status}/>
                  <div className="mono" style={{ fontSize:11, color:C.textMid, marginTop:3 }}>₦{(t.totalFare||0).toLocaleString()}</div>
                </div>
              </div>
            ))
          }
          <div style={{ paddingTop:12 }}><Btn v="outline" size="sm" onClick={()=>onNav("trips")}>View all trips →</Btn></div>
        </Card>
      </div>

      {/* Active Trips Modal */}
      {activeModal==="activeTrips"&&(
        <Modal title={`Active Trips (${modalData.length})`} onClose={()=>setActiveModal(null)} width={720}>
          {modalLoading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
            modalData.length===0 ? <Empty msg="No active trips right now"/> :
            modalData.map((t,i)=>(
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"14px 0", borderBottom:i<modalData.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontWeight:600, marginBottom:3 }}>Rider: {t.rider?.user?.firstName} {t.rider?.user?.lastName}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>Driver: {t.driver?.user?.firstName} {t.driver?.user?.lastName||"Unassigned"}</div>
                  <div style={{ fontSize:12, color:C.textSub, marginTop:4 }}>📍 {t.pickupAddress}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>🏁 {t.dropoffAddress}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <SB s={t.status}/> <span className="mono" style={{ fontWeight:700 }}> ₦{(t.totalFare||0).toLocaleString()}</span>
                  <div style={{ fontSize:11, color:C.textMid, marginTop:4 }}>{t.distanceKm?.toFixed(1)} km</div>
                  <div style={{ fontSize:11, color:C.muted }}>{new Date(t.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          }
        </Modal>
      )}

      {/* Online Drivers Modal */}
      {activeModal==="onlineDrivers"&&(
        <Modal title={`Online Drivers (${modalData.length})`} onClose={()=>setActiveModal(null)} width={600}>
          {modalLoading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
            modalData.length===0 ? <Empty msg="No drivers online"/> :
            modalData.map((dr,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<modalData.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontWeight:600 }}>{dr.user?.firstName} {dr.user?.lastName}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{dr.user?.email} · {dr.user?.phone}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{dr.vehicles?.[0]?.model} · {dr.vehicles?.[0]?.licensePlate}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <SB s={dr.status}/>
                  <div style={{ fontSize:12, color:C.amber, marginTop:4 }}>★ {Number(dr.averageRating||0).toFixed(1)}</div>
                  <div style={{ fontSize:11, color:C.textMid }}>{dr.totalTrips||0} trips</div>
                </div>
              </div>
            ))
          }
        </Modal>
      )}

      {/* Riders Modal */}
      {activeModal==="riders"&&(
        <Modal title="All Riders" onClose={()=>setActiveModal(null)} width={680}>
          <div style={{ marginBottom:14 }}>
            <Input value={riderSearch} onChange={setRiderSearch} placeholder="Search by name, email…"/>
          </div>
          {modalLoading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
            filteredRiders.length===0 ? <Empty msg="No riders found"/> :
            filteredRiders.map((r,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<filteredRiders.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontWeight:600 }}>{r.user?.firstName} {r.user?.lastName}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{r.user?.email} · {r.user?.phone}</div>
                  <div style={{ fontSize:12, color:C.greenMid }}>🌿 {((r.totalCo2SavedGrams||0)/1000).toFixed(2)} kg CO₂ saved</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <SB s={r.user?.isActive?"active":"offline"}/>
                  <div style={{ fontSize:12, color:C.textMid, marginTop:4 }}>{r.totalTrips||0} rides</div>
                  {!r.user?.isActive&&<Btn size="sm" v="outline" style={{ marginTop:6 }} onClick={async()=>{
                    try{await api.unblockUser(r.id);setRiders(p=>p.map(x=>x.id===r.id?{...x,user:{...x.user,isActive:true}}:x));}catch{}
                  }}>Unblock</Btn>}
                  {r.user?.isActive&&<Btn size="sm" v="danger" style={{ marginTop:6 }} onClick={async()=>{
                    try{await api.blockUser(r.id,"Admin action");setRiders(p=>p.map(x=>x.id===r.id?{...x,user:{...x.user,isActive:false}}:x));}catch{}
                  }}>Block</Btn>}
                </div>
              </div>
            ))
          }
        </Modal>
      )}

      {/* Revenue Modal */}
      {activeModal==="revenue"&&(
        <Modal title="Revenue Records" onClose={()=>setActiveModal(null)} width={680}>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            {["today","yesterday","7d","30d"].map(v=>(
              <Btn key={v} v={dateFilter===v?"primary":"ghost"} size="sm" onClick={()=>{setDateFilter(v);openRevenue(v);}}>
                {v==="today"?"Today":v==="yesterday"?"Yesterday":v==="7d"?"7 Days":"30 Days"}
              </Btn>
            ))}
            <input type="date" onChange={e=>{setDateFilter(e.target.value);openRevenue(e.target.value);}} style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:8, padding:"4px 10px", fontSize:12, color:C.text }}/>
          </div>
          {modalLoading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
            modalData.length===0 ? <Empty msg="No revenue records"/> :
            modalData.map((p,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<modalData.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontWeight:600 }}>{p.rider?.user?.firstName} {p.rider?.user?.lastName}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{new Date(p.createdAt).toLocaleString("en-NG")}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span className="mono" style={{ fontWeight:700 }}>₦{(p.amount||0).toLocaleString()}</span>
                  <div style={{ marginTop:2 }}><Badge color={p.method==="card"?C.blue:p.method==="wallet"?C.greenMid:"#4a3728"}>{p.method}</Badge> <SB s={p.status}/></div>
                </div>
              </div>
            ))
          }
        </Modal>
      )}

      {/* Today Trips Modal */}
      {activeModal==="todayTrips"&&(
        <Modal title="Trip Records" onClose={()=>setActiveModal(null)} width={720}>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            {["today","yesterday","7d","30d"].map(v=>(
              <Btn key={v} v={dateFilter===v?"primary":"ghost"} size="sm" onClick={()=>{setDateFilter(v);openTodayTrips(v);}}>
                {v==="today"?"Today":v==="yesterday"?"Yesterday":v==="7d"?"7 Days":"30 Days"}
              </Btn>
            ))}
            <input type="date" onChange={e=>{setDateFilter(e.target.value);openTodayTrips(e.target.value);}} style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:8, padding:"4px 10px", fontSize:12, color:C.text }}/>
          </div>
          {modalLoading ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner/></div> :
            modalData.length===0 ? <Empty msg="No trips found"/> :
            modalData.map((t,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:i<modalData.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontWeight:600 }}>{t.rider?.user?.firstName} {t.rider?.user?.lastName}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{(t.pickupAddress||"").slice(0,40)}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{new Date(t.createdAt).toLocaleString("en-NG")}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <SB s={t.status}/>
                  <div className="mono" style={{ fontSize:12, marginTop:4 }}>₦{(t.totalFare||0).toLocaleString()}</div>
                </div>
              </div>
            ))
          }
        </Modal>
      )}
    </div>
  );
};

// ─── ANALYTICS ─────────────────────────────────────────────────────────────
const Analytics = () => {
  const [period,setPeriod]=useState("7d");
  const [d,setD]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    setLoading(true);
    api.analytics(period).then(r=>setD(r.data||r)).catch(()=>setD(null)).finally(()=>setLoading(false));
  },[period]);

  const revenueData = d?.revenueData||[];
  const tripsData   = d?.tripsData||[];
  const totalTrips   = tripsData.reduce((s,x)=>s+Number(x.count||0),0);
  const totalRevenue = revenueData.reduce((s,x)=>s+Number(x.revenue||0),0);
  const maxRev       = Math.max(...revenueData.map(x=>Number(x.revenue||0)),1);
  const co2Grams     = d?.lifetimeCo2Grams||0;

  return (
    <div>
      <PH title="Analytics" sub="Trips, revenue and environmental impact">
        <Sel value={period} onChange={setPeriod} options={[{value:"1d",label:"Today"},{value:"7d",label:"Last 7 days"},{value:"30d",label:"Last 30 days"}]}/>
      </PH>

      {loading ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner/></div> : <>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:20 }}>
          <Stat label="Total Trips"   value={totalTrips.toLocaleString()} icon="⟁"/>
          <Stat label="Total Revenue" value={`₦${(totalRevenue/1000).toFixed(0)}k`} icon="₦" accent={C.amber}/>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
          <Card>
            <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:20 }}>Revenue by Day</div>
            {revenueData.length===0 ? <Empty msg="No revenue data"/> :
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:160 }}>
                {revenueData.map((x,i)=>{
                  const h=(Number(x.revenue||0)/maxRev)*100;
                  return (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div title={`₦${Number(x.revenue).toLocaleString()}`} style={{ width:"100%", height:`${h}%`, background:`linear-gradient(to top,${C.green},${C.greenBrt})`, borderRadius:"4px 4px 0 0", minHeight:4, transition:"height .4s ease" }}/>
                      <span style={{ fontSize:9, color:C.muted, transform:"rotate(-35deg)", whiteSpace:"nowrap" }}>{x.date?.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            }
          </Card>
          <Card>
            <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:20 }}>Trip Breakdown</div>
            {tripsData.length===0 ? <Empty msg="No data"/> :
              tripsData.map(({status,count})=>(
                <div key={status} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}><SB s={status}/><span className="mono" style={{ fontSize:12, color:C.textMid }}>{Number(count||0).toLocaleString()}</span></div>
                  <div style={{ height:5, background:C.bgMid, borderRadius:4 }}><div style={{ height:"100%", width:`${totalTrips?(Number(count)/totalTrips)*100:0}%`, background:SC(status), borderRadius:4 }}/></div>
                </div>
              ))
            }
          </Card>
          <Card style={{ gridColumn:"1 / -1", background:"#f0f7ec", border:`1px solid ${C.greenMid}33` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <span style={{ fontSize:20 }}>🌿</span>
              <div className="serif" style={{ fontWeight:600, fontSize:15 }}>Carbon Impact — Lifetime Environmental Contribution</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", textAlign:"center", gap:10 }}>
              {[
                ["kg CO₂ Saved",(co2Grams/1000).toFixed(2),C.greenMid],
                ["Tree Equivalent",(co2Grams/21000).toFixed(1),C.green],
                ["Total Eco Trips",totalTrips,C.greenBrt],
                ["Avg per Trip",`${Math.round(co2Grams/Math.max(totalTrips,1))}g`,C.lime],
              ].map(([l,v,col])=>(
                <div key={l}>
                  <div className="serif" style={{ fontSize:32, fontWeight:600, color:col }}>{v}</div>
                  <div style={{ fontSize:11, color:C.textMid, textTransform:"uppercase", letterSpacing:".06em", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </>}
    </div>
  );
};

// ─── TRIPS ─────────────────────────────────────────────────────────────────
const Trips = ({ toast }) => {
  const [statusFilter,setStatusFilter]=useState("");
  const [dateFilter,setDateFilter]=useState("");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    setLoading(true);
    api.trips({status:statusFilter,date:dateFilter})
      .then(r=>setRows(r.data||[]))
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[statusFilter,dateFilter]);

  const cols = [
    { key:"id",     label:"Trip ID",   render:r=><span className="mono" style={{ fontSize:11, color:C.textSub }}>{r.id}</span> },
    { key:"rider",  label:"Rider",     render:r=>`${r.rider?.user?.firstName||""} ${r.rider?.user?.lastName||""}` },
    { key:"driver", label:"Driver",    render:r=>r.driver?`${r.driver.user?.firstName||""} ${r.driver.user?.lastName||""}`:<span style={{ color:C.muted, fontStyle:"italic" }}>Unassigned</span> },
    { key:"pickup", label:"Pickup",    render:r=><span style={{ fontSize:12 }}>{(r.pickupAddress||"").slice(0,30)}</span> },
    { key:"class",  label:"Class",     render:r=><Badge color={r.rideClass==="executive"?C.amber:C.greenMid}>{r.rideClass}</Badge> },
    { key:"status", label:"Status",    render:r=><SB s={r.status}/> },
    { key:"fare",   label:"Fare",      render:r=><span className="mono" style={{ fontWeight:600 }}>₦{(r.totalFare||0).toLocaleString()}</span> },
    { key:"co2",    label:"CO₂",       render:r=><span style={{ color:C.greenMid, fontSize:12 }}>🌿 {r.co2SavedGrams||0}g</span> },
    { key:"dist",   label:"Dist",      render:r=><span className="mono">{(r.distanceKm||0).toFixed(1)}km</span> },
    { key:"date",   label:"Date",      render:r=>new Date(r.createdAt).toLocaleDateString("en-NG") },
  ];

  return (
    <div>
      <PH title="Trips" sub="All ride requests across the platform">
        <Sel value={statusFilter} onChange={setStatusFilter} options={[
          {value:"",label:"All status"},{value:"requested",label:"Requested"},{value:"accepted",label:"Accepted"},
          {value:"driver_arrived",label:"Driver Arrived"},{value:"in_progress",label:"In Progress"},
          {value:"completed",label:"Completed"},{value:"cancelled",label:"Cancelled"},
        ]}/>
        <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
          style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"9px 13px", color:C.text, fontSize:13, outline:"none" }}/>
        {dateFilter&&<Btn v="ghost" size="sm" onClick={()=>setDateFilter("")}>Clear Date</Btn>}
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No trips found"/></Card>
    </div>
  );
};

// ─── DRIVERS ───────────────────────────────────────────────────────────────
const Drivers = ({ toast }) => {
  const [statusFilter,setStatusFilter]=useState("");
  const [appFilter,setAppFilter]=useState("");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    setLoading(true);
    api.drivers({status:statusFilter,isApproved:appFilter==="approved"?"true":appFilter==="pending"?"false":undefined})
      .then(r=>setRows(r.data||[]))
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[statusFilter,appFilter]);

  const approve = async (id) => {
    try {
      await api.approveDriver(id);
      setRows(r=>r.map(d=>d.id===id?{...d,isApproved:true}:d));
      toast("Driver approved successfully!","success");
    } catch { toast("Approval failed","error"); }
  };

  const TC = t=>({bronze:"#c27c44",silver:"#8ea0b8",gold:C.amber,platinum:"#7bc4dc"})[t]||C.muted;

  const cols = [
    { key:"name",     label:"Driver",      render:r=><div><div style={{ fontWeight:600 }}>{r.user?.firstName} {r.user?.lastName}</div><div style={{ fontSize:11, color:C.textSub }}>{r.user?.email}</div></div> },
    { key:"vehicle",  label:"Vehicle",     render:r=><div><div style={{ fontSize:12 }}>{r.vehicles?.[0]?.model||"—"}</div><div className="mono" style={{ fontSize:11, color:C.textSub }}>{r.vehicles?.[0]?.licensePlate||""}</div></div> },
    { key:"status",   label:"Status",      render:r=><SB s={r.status}/> },
    { key:"approved", label:"Approval",    render:r=>r.isApproved?<Badge color={C.greenMid}>Approved</Badge>:<Badge color={C.amber}>Pending</Badge> },
    { key:"rating",   label:"Rating",      render:r=>r.averageRating>0?<span style={{ color:C.amber }}>★ {Number(r.averageRating).toFixed(1)}</span>:<span style={{ color:C.muted }}>—</span> },
    { key:"trips",    label:"Trips",       render:r=><span className="mono">{r.totalTrips||0}</span> },
    { key:"tier",     label:"Tier",        render:r=><Badge color={TC(r.reward?.tier||"bronze")}>{r.reward?.tier||"bronze"}</Badge> },
    { key:"earnings", label:"Earnings",    render:r=><span className="mono">₦{(r.totalEarnings||0).toLocaleString()}</span> },
    { key:"actions",  label:"",            render:r=>!r.isApproved?<Btn size="sm" v="lime" onClick={e=>{e.stopPropagation();approve(r.id);}}>Approve</Btn>:null },
  ];

  return (
    <div>
      <PH title="Drivers" sub="Click any row to view full driver profile">
        <Sel value={statusFilter} onChange={setStatusFilter} options={[{value:"",label:"All status"},{value:"online",label:"Online"},{value:"offline",label:"Offline"},{value:"on_trip",label:"On Trip"}]}/>
        <Sel value={appFilter} onChange={setAppFilter} options={[{value:"",label:"All"},{value:"pending",label:"Pending Approval"},{value:"approved",label:"Approved"}]}/>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} onRowClick={setSelected} emptyMsg="No drivers found"/></Card>

      {selected&&(
        <Modal title={`${selected.user?.firstName} ${selected.user?.lastName} — Driver Profile`} onClose={()=>setSelected(null)} width={640}>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Email", selected.user?.email],
                ["Phone", selected.user?.phone],
                ["Status", <SB s={selected.status}/>],
                ["Approval", selected.isApproved?<Badge color={C.greenMid}>Approved</Badge>:<Badge color={C.amber}>Pending</Badge>],
                ["Rating", selected.averageRating>0?`★ ${Number(selected.averageRating).toFixed(1)}`:"—"],
                ["Total Trips", selected.totalTrips||0],
                ["Total Earnings", `₦${(selected.totalEarnings||0).toLocaleString()}`],
                ["Acceptance Rate", selected.acceptanceRate?`${selected.acceptanceRate}%`:"—"],
                ["Tier", <Badge color={({bronze:"#c27c44",silver:"#8ea0b8",gold:C.amber,platinum:"#7bc4dc"})[selected.reward?.tier||"bronze"]}>{selected.reward?.tier||"bronze"}</Badge>],
              ].map(([k,v])=>(
                <div key={k} style={{ background:C.bgMid, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{v||"—"}</div>
                </div>
              ))}
            </div>
            {selected.vehicles?.length>0&&(
              <div>
                <div className="serif" style={{ fontWeight:600, fontSize:14, marginBottom:10 }}>Vehicle</div>
                {selected.vehicles.map((v,i)=>(
                  <div key={i} style={{ background:C.bgMid, borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:600 }}>{v.model}</span>
                    <span className="mono" style={{ color:C.textMid }}>{v.licensePlate}</span>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="serif" style={{ fontWeight:600, fontSize:14, marginBottom:10 }}>Licence</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:C.bgMid, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>Licence Number</div>
                  <div className="mono" style={{ fontSize:13 }}>{selected.licenseNumber||"—"}</div>
                </div>
                <div style={{ background:C.bgMid, borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:".06em", marginBottom:3 }}>Expiry</div>
                  <div style={{ fontSize:13 }}>{selected.licenseExpiry||"—"}</div>
                </div>
              </div>
            </div>
            {!selected.isApproved&&(
              <Btn v="lime" onClick={()=>{approve(selected.id);setSelected(null);}}>✓ Approve Driver</Btn>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── FARE ENGINE ──────────────────────────────────────────────────────────
const FareEngine = ({ toast }) => {
  const [fareRules,setFareRules]=useState([]);
  const [surgeRules,setSurgeRules]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editFare,setEditFare]=useState(null);
  const [editSurge,setEditSurge]=useState(null);
  const [ff,setFf]=useState({});
  const [sf,setSf]=useState({});

  useEffect(()=>{
    Promise.all([
      api.fareRules().then(r=>setFareRules(r.data?.rules||r.rules||r.data||[])),
      api.surgeRules().then(r=>setSurgeRules(r.data?.rules||r.rules||r.data||[])),
    ]).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const saveFare = async () => {
    try {
      const r=await api.saveFareRule(ff);
      const saved=r.data||r;
      if(editFare==="new") setFareRules(p=>[...p,saved]);
      else setFareRules(p=>p.map(x=>x.id===editFare?saved:x));
      toast("Fare rule saved!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setEditFare(null);
  };
  const saveSurge = async () => {
    try {
      const r=await api.saveSurgeRule(sf);
      const saved=r.data||r;
      if(editSurge==="new") setSurgeRules(p=>[...p,saved]);
      else setSurgeRules(p=>p.map(x=>x.id===editSurge?saved:x));
      toast("Surge rule saved!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setEditSurge(null);
  };

  const CC=c=>({eco:C.greenMid,standard:C.blue,executive:C.amber})[c]||C.muted;

  if(loading) return <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner/></div>;

  return (
    <div>
      <PH title="Fare Engine" sub="Pricing rules and surge multipliers">
        <Btn v="primary" onClick={()=>{setFf({rideClass:"eco"});setEditFare("new");}}>+ Fare Rule</Btn>
        <Btn v="outline" onClick={()=>{setSf({});setEditSurge("new");}}>+ Surge Rule</Btn>
      </PH>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <Card>
          <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:18 }}>Fare Rules</div>
          {fareRules.length===0 ? <Empty msg="No fare rules configured"/> :
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
            {fareRules.map(r=>(
              <div key={r.id} style={{ background:C.bgMid, borderRadius:14, padding:18, border:`1px solid ${C.border}`, borderTop:`3px solid ${CC(r.rideClass)}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:700, textTransform:"capitalize", marginBottom:4 }}>{r.rideClass} — {r.name}</div>
                    <SB s={r.isActive?"active":"offline"}/>
                  </div>
                  <Btn v="ghost" size="sm" onClick={()=>{setFf(r);setEditFare(r.id);}}>Edit</Btn>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[["Start fare",`₦${r.baseFare}`],["Per km",`₦${r.perKmRate}`],["Per min",`₦${r.perMinuteRate}`],["Wait/min",`₦${r.waitTimePerMinuteRate||0}`],["Surge ×",`×${r.surgeMultiplier||1}`],["Min fare",`₦${r.minimumFare}`],["Cancel fee",`₦${r.cancellationFee}`],["Tax",`${((r.taxRate||0)*100).toFixed(1)}%`]].map(([k,v])=>(
                    <div key={k}>
                      <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{k}</div>
                      <div className="mono" style={{ fontWeight:600, fontSize:13 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>}
        </Card>
        <Card>
          <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:18 }}>Surge Pricing Rules</div>
          <Table columns={[
            { key:"name",    label:"Name",       render:r=><strong>{r.name}</strong> },
            { key:"mult",    label:"Multiplier", render:r=><span className="mono" style={{ color:C.amber, fontWeight:700 }}>×{r.multiplier}</span> },
            { key:"hours",   label:"Hours",      render:r=><span className="mono">{r.startHour}:00 – {r.endHour}:00</span> },
            { key:"demand",  label:"Min Demand", render:r=><span className="mono">{r.demandThreshold} trips</span> },
            { key:"status",  label:"Status",     render:r=><SB s={r.isActive?"active":"offline"}/> },
            { key:"actions", label:"",           render:r=><Btn v="ghost" size="sm" onClick={()=>{setSf(r);setEditSurge(r.id);}}>Edit</Btn> },
          ]} data={surgeRules} emptyMsg="No surge rules configured"/>
        </Card>
      </div>

      {editFare&&(
        <Modal title={editFare==="new"?"Add Fare Rule":"Edit Fare Rule"} onClose={()=>setEditFare(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Name" value={ff.name||""} onChange={v=>setFf(p=>({...p,name:v}))} placeholder="Eco Standard"/>
            <Sel label="Ride Class" value={ff.rideClass||"eco"} onChange={v=>setFf(p=>({...p,rideClass:v}))} options={[{value:"eco",label:"Eco"},{value:"executive",label:"Executive"}]}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["baseFare","Start Fare (₦)"],["perKmRate","Per km (₦)"],["perMinuteRate","Per min (₦)"],["waitTimePerMinuteRate","Wait Time/min (₦)"],["surgeMultiplier","Default Surge Multiplier"],["minimumFare","Minimum (₦)"],["cancellationFee","Cancel Fee (₦)"],["taxRate","Tax (e.g. 0.025)"]].map(([k,l])=>(
                <Input key={k} label={l} type="number" value={ff[k]||""} onChange={v=>setFf(p=>({...p,[k]:v}))}/>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setEditFare(null)}>Cancel</Btn>
              <Btn onClick={saveFare}>Save Rule</Btn>
            </div>
          </div>
        </Modal>
      )}

      {editSurge&&(
        <Modal title={editSurge==="new"?"Add Surge Rule":"Edit Surge Rule"} onClose={()=>setEditSurge(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Name" value={sf.name||""} onChange={v=>setSf(p=>({...p,name:v}))}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Multiplier" type="number" value={sf.multiplier||""} onChange={v=>setSf(p=>({...p,multiplier:v}))}/>
              <Input label="Min Demand" type="number" value={sf.demandThreshold||""} onChange={v=>setSf(p=>({...p,demandThreshold:v}))}/>
              <Input label="Start Hour (0–23)" type="number" value={sf.startHour??""} onChange={v=>setSf(p=>({...p,startHour:v}))}/>
              <Input label="End Hour (0–23)" type="number" value={sf.endHour??""} onChange={v=>setSf(p=>({...p,endHour:v}))}/>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setEditSurge(null)}>Cancel</Btn>
              <Btn onClick={saveSurge}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── FINANCE ──────────────────────────────────────────────────────────────
const Finance = () => {
  const [statusFilter,setStatusFilter]=useState("");
  const [dateFilter,setDateFilter]=useState("today");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [customDate,setCustomDate]=useState("");

  useEffect(()=>{
    setLoading(true);
    api.payments({status:statusFilter,date:dateFilter})
      .then(r=>setRows(r.data||[]))
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[statusFilter,dateFilter]);

  const QUICK = [{label:"Today",value:"today"},{label:"Yesterday",value:"yesterday"},{label:"7 Days",value:"7d"},{label:"30 Days",value:"30d"}];

  const cols = [
    { key:"id",     label:"ID",             render:r=><span className="mono" style={{ fontSize:11 }}>{r.id}</span> },
    { key:"rider",  label:"Rider",          render:r=>`${r.rider?.user?.firstName||""} ${r.rider?.user?.lastName||""}` },
    { key:"amount", label:"Total",          render:r=><span className="mono" style={{ fontWeight:700 }}>₦{(r.amount||0).toLocaleString()}</span> },
    { key:"method", label:"Method",         render:r=><Badge color={r.method==="card"?C.blue:r.method==="wallet"?C.greenMid:"#4a3728"}>{r.method||"—"}</Badge> },
    { key:"status", label:"Status",         render:r=><SB s={r.status}/> },
    { key:"driver", label:"Driver Payout",  render:r=><span className="mono">₦{(r.driverEarnings||0).toLocaleString()}</span> },
    { key:"fee",    label:"Platform (20%)", render:r=><span className="mono">₦{(r.platformFee||0).toLocaleString()}</span> },
    { key:"date",   label:"Date",           render:r=>new Date(r.createdAt).toLocaleDateString("en-NG") },
  ];

  return (
    <div>
      <PH title="Finance" sub="Payment records — defaults to today">
        <Sel value={statusFilter} onChange={setStatusFilter} options={[{value:"",label:"All"},{value:"pending",label:"Pending"},{value:"completed",label:"Completed"},{value:"refunded",label:"Refunded"},{value:"failed",label:"Failed"}]}/>
      </PH>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {QUICK.map(q=>(
          <Btn key={q.value} v={dateFilter===q.value?"primary":"ghost"} size="sm" onClick={()=>{setDateFilter(q.value);setCustomDate("");}}>
            {q.label}
          </Btn>
        ))}
        <input type="date" value={customDate} onChange={e=>{setCustomDate(e.target.value);setDateFilter(e.target.value);}}
          style={{ background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:8, padding:"5px 10px", fontSize:12, color:C.text }}/>
        {dateFilter&&<Btn v="ghost" size="sm" onClick={()=>{setDateFilter("");setCustomDate("");}}>Clear</Btn>}
      </div>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No payment records found"/></Card>
    </div>
  );
};

// ─── REFUNDS ──────────────────────────────────────────────────────────────
const Refunds = ({ toast }) => {
  const [filter,setFilter]=useState("pending");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const [notes,setNotes]=useState("");

  useEffect(()=>{
    setLoading(true);
    api.refunds({status:filter})
      .then(r=>setRows(r.data||[]))
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[filter]);

  const handle = async () => {
    try {
      if(modal.type==="approve") await api.approveRefund(modal.row.id,notes);
      else await api.rejectRefund(modal.row.id,notes);
      setRows(r=>r.map(x=>x.id===modal.row.id?{...x,status:modal.type==="approve"?"approved":"rejected"}:x));
      toast(`Refund ${modal.type==="approve"?"approved":"rejected"}!`,"success");
    } catch(e) { toast(e.message||"Action failed","error"); }
    setModal(null);setNotes("");
  };

  const cols = [
    { key:"id",     label:"ID",     render:r=><span className="mono" style={{ fontSize:11 }}>{r.id}</span> },
    { key:"amount", label:"Amount", render:r=><span className="mono" style={{ fontWeight:700, color:C.amber }}>₦{(r.amount||0).toLocaleString()}</span> },
    { key:"reason", label:"Reason", render:r=><span style={{ fontSize:12 }}>{(r.reason||"").slice(0,52)}{r.reason?.length>52?"…":""}</span> },
    { key:"type",   label:"Type",   render:r=><Badge color={r.type==="auto"?C.blue:C.amber}>{r.type}</Badge> },
    { key:"status", label:"Status", render:r=><SB s={r.status}/> },
    { key:"date",   label:"Date",   render:r=>new Date(r.createdAt).toLocaleDateString("en-NG") },
    { key:"act",    label:"",       render:r=>r.status==="pending"?(
      <div style={{ display:"flex", gap:6 }}>
        <Btn size="sm" v="lime" onClick={()=>{setModal({type:"approve",row:r});setNotes("");}}>Approve</Btn>
        <Btn size="sm" v="danger" onClick={()=>{setModal({type:"reject",row:r});setNotes("");}}>Reject</Btn>
      </div>
    ):null },
  ];

  return (
    <div>
      <PH title="Refunds & Disputes" sub="Review and resolve customer refund requests">
        <Sel value={filter} onChange={setFilter} options={[{value:"",label:"All"},{value:"pending",label:"Pending"},{value:"approved",label:"Approved"},{value:"rejected",label:"Rejected"}]}/>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No refund requests"/></Card>
      {modal&&(
        <Modal title={`${modal.type==="approve"?"Approve":"Reject"} Refund — ₦${modal.row.amount?.toLocaleString()}`} onClose={()=>setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:C.bgMid, borderRadius:10, padding:"12px 14px", fontSize:13, color:C.textMid }}><strong>Reason:</strong> {modal.row.reason}</div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>Admin Notes</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add notes for this decision…" style={{ width:"100%", minHeight:90, background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, resize:"vertical" }}/>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
              <Btn v={modal.type==="approve"?"primary":"danger"} onClick={handle}>
                {modal.type==="approve"?"Approve Refund":"Reject Refund"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PROMOTIONS ────────────────────────────────────────────────────────────
const Promotions = ({ toast }) => {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});

  useEffect(()=>{
    api.promotions().then(r=>setRows(r.data?.promotions||r.data||[])).catch(()=>setRows([])).finally(()=>setLoading(false));
  },[]);

  const save = async () => {
    try {
      if(modal==="new"){ const r=await api.createPromo(form); setRows(p=>[...p,r.data||r]); }
      else { const r=await api.updatePromo(modal,form); setRows(p=>p.map(x=>x.id===modal?r.data||r:x)); }
      toast("Promotion saved!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setModal(null);
  };

  const cols = [
    { key:"code",    label:"Code",     render:r=><span className="mono" style={{ color:C.greenMid, fontWeight:700 }}>{r.code}</span> },
    { key:"name",    label:"Name",     render:r=><strong>{r.name}</strong> },
    { key:"disc",    label:"Discount", render:r=><span className="mono" style={{ fontWeight:600 }}>{r.discountType==="percentage"?`${r.discountValue}%`:`₦${r.discountValue}`}</span> },
    { key:"maxD",    label:"Max Off",  render:r=>`₦${(r.maxDiscount||0).toLocaleString()}` },
    { key:"used",    label:"Redeemed", render:r=><span className="mono">{r.totalRedeemed||0} / {r.usageLimit||"∞"}</span> },
    { key:"expires", label:"Expires",  render:r=>r.expiresAt?new Date(r.expiresAt).toLocaleDateString("en-NG"):"Never" },
    { key:"status",  label:"Status",   render:r=><SB s={r.isActive?"active":"offline"}/> },
    { key:"actions", label:"",         render:r=><Btn size="sm" v="ghost" onClick={()=>{setForm(r);setModal(r.id);}}>Edit</Btn> },
  ];

  return (
    <div>
      <PH title="Promotions" sub="Discount codes and special offers">
        <Btn v="primary" onClick={()=>{setForm({discountType:"percentage",isActive:true});setModal("new");}}>+ New Promo</Btn>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No promotions created yet"/></Card>
      {modal&&(
        <Modal title={modal==="new"?"Create Promotion":"Edit Promotion"} onClose={()=>setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Code" value={form.code||""} onChange={v=>setForm(p=>({...p,code:v.toUpperCase()}))} placeholder="NEW123"/>
              <Input label="Name" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="20% off first 3 rides"/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Sel label="Type" value={form.discountType||"percentage"} onChange={v=>setForm(p=>({...p,discountType:v}))} options={[{value:"percentage",label:"Percentage (%)"},{value:"fixed",label:"Fixed (₦)"}]}/>
              <Input label="Value" type="number" value={form.discountValue||""} onChange={v=>setForm(p=>({...p,discountValue:v}))}/>
              <Input label="Max Discount (₦)" type="number" value={form.maxDiscount||""} onChange={v=>setForm(p=>({...p,maxDiscount:v}))}/>
              <Input label="Usage Limit" type="number" value={form.usageLimit||""} onChange={v=>setForm(p=>({...p,usageLimit:v}))} placeholder="Leave blank = unlimited"/>
              <Input label="Starts At" type="date" value={form.startsAt?.slice(0,10)||""} onChange={v=>setForm(p=>({...p,startsAt:v}))}/>
              <Input label="Expires At" type="date" value={form.expiresAt?.slice(0,10)||""} onChange={v=>setForm(p=>({...p,expiresAt:v}))}/>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save Promotion</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── SUPPORT TICKETS ──────────────────────────────────────────────────────
const Tickets = ({ toast }) => {
  const [filter,setFilter]=useState("open");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [reply,setReply]=useState("");
  const [res,setRes]=useState("");

  useEffect(()=>{
    setLoading(true);
    api.tickets({status:filter}).then(r=>setRows(r.data||[])).catch(()=>setRows([])).finally(()=>setLoading(false));
  },[filter]);

  const filtered=filter?rows.filter(r=>r.status===filter):rows;
  const PC=p=>({low:C.muted,medium:C.blue,high:C.amber,urgent:C.red})[p];

  const sendReply = async () => {
    if(!reply.trim())return;
    try{ await api.replyTicket(sel.id,reply); }catch{}
    const msg={from:"admin",message:reply,timestamp:new Date().toISOString()};
    setRows(r=>r.map(t=>t.id===sel.id?{...t,thread:[...(t.thread||[]),msg]}:t));
    setSel(s=>({...s,thread:[...(s.thread||[]),msg]}));
    toast("Reply sent","success");setReply("");
  };

  const resolve = async () => {
    if(!res.trim())return;
    try{ await api.resolveTicket(sel.id,res); }catch{}
    setRows(r=>r.map(t=>t.id===sel.id?{...t,status:"resolved"}:t));
    toast("Ticket resolved","success");setSel(null);setRes("");
  };

  const cols = [
    { key:"sub",      label:"Subject",  render:r=><div><div style={{ fontWeight:600 }}>{r.subject}</div><div style={{ fontSize:11, color:C.textSub }}>{r.user?.firstName} {r.user?.lastName} · {r.channel}</div></div> },
    { key:"priority", label:"Priority", render:r=><Badge color={PC(r.priority)}>{r.priority}</Badge> },
    { key:"status",   label:"Status",   render:r=><SB s={r.status}/> },
    { key:"date",     label:"Date",     render:r=>new Date(r.createdAt).toLocaleDateString("en-NG") },
    { key:"act",      label:"",         render:r=><Btn size="sm" v="ghost" onClick={()=>setSel(r)}>Open →</Btn> },
  ];

  return (
    <div>
      <PH title="Support Tickets" sub="Customer and driver support requests">
        <Sel value={filter} onChange={setFilter} options={[{value:"",label:"All"},{value:"open",label:"Open"},{value:"in_progress",label:"In Progress"},{value:"resolved",label:"Resolved"}]}/>
      </PH>
      <Card pad={0}><Table columns={cols} data={filtered} loading={loading} emptyMsg="No tickets found"/></Card>
      {sel&&(
        <Modal title={sel.subject} onClose={()=>setSel(null)} width={600}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <SB s={sel.status}/><Badge color={PC(sel.priority)}>{sel.priority}</Badge><Badge color={C.muted}>{sel.channel}</Badge>
            </div>
            <div style={{ background:C.bgMid, borderRadius:10, padding:"12px 14px", fontSize:13, color:C.textMid }}>{sel.description}</div>
            {sel.thread?.length>0&&(
              <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:180, overflowY:"auto" }}>
                {sel.thread.map((m,i)=>(
                  <div key={i} style={{ background:m.from==="admin"?"#f0f7ec":C.bgMid, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 13px", fontSize:13 }}>
                    <div style={{ fontSize:10, color:C.textSub, marginBottom:3 }}>{m.from==="admin"?"Eco Support":"Customer"} · {new Date(m.timestamp).toLocaleString()}</div>
                    {m.message}
                  </div>
                ))}
              </div>
            )}
            {sel.status!=="resolved"&&sel.status!=="closed"&&<>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>Reply</label>
                <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your reply…" style={{ width:"100%", minHeight:80, background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, resize:"vertical" }}/>
              </div>
              <Btn v="outline" onClick={sendReply}>Send Reply</Btn>
              <hr style={{ border:"none", borderTop:`1px solid ${C.border}` }}/>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>Resolution</label>
                <textarea value={res} onChange={e=>setRes(e.target.value)} placeholder="Describe how this was resolved…" style={{ width:"100%", minHeight:80, background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, resize:"vertical" }}/>
              </div>
              <Btn v="primary" onClick={resolve}>Mark as Resolved</Btn>
            </>}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── CO2 ANALYTICS ────────────────────────────────────────────────────────
const Co2Analytics = ({ toast }) => {
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [editConfig,setEditConfig]=useState(false);
  const [cfg,setCfg]=useState({});

  useEffect(()=>{
    api.co2Analytics().then(r=>setData(r.data||r)).catch(()=>setData({})).finally(()=>setLoading(false));
  },[]);

  const saveConfig = async () => {
    try {
      await api.saveCo2Config(cfg);
      const r=await api.co2Analytics(); setData(r.data||data);
      toast("CO₂ config saved!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setEditConfig(false);
  };

  const cfg_ = data?.config||{};

  if(loading) return <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner/></div>;

  return (
    <div>
      <PH title="CO₂ Emission Analytics" sub="Configure emission parameters and view lifetime carbon impact">
        <Btn v="outline" onClick={()=>{setCfg(cfg_);setEditConfig(true);}}>⚙ Configure Parameters</Btn>
      </PH>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <Stat label="kg CO₂ Saved" value={(data?.totalCo2SavedKg||0).toFixed(1)} icon="🌿" accent={C.greenMid}/>
        <Stat label="Tree Equivalent" value={(data?.treeEquivalent||0).toFixed(0)} icon="🌳" accent={C.green}/>
        <Stat label="Total Eco Trips" value={(data?.totalEcoTrips||0).toLocaleString()} icon="⟁" accent={C.greenBrt}/>
        <Stat label="Avg CO₂/Trip" value={`${data?.avgCo2GramsPerTrip||0}g`} icon="📊" accent={C.lime}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <Card style={{ background:"#f0f7ec", border:`1px solid ${C.greenMid}33` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <span style={{ fontSize:24 }}>🌿</span>
            <div className="serif" style={{ fontWeight:600, fontSize:16 }}>Lifetime Carbon Impact</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              ["Total CO₂ Saved",`${(data?.totalCo2SavedKg||0).toFixed(2)} kg`,C.greenMid,"Compared to equivalent ICE vehicle trips"],
              ["Tree Equivalent",`${(data?.treeEquivalent||0).toFixed(1)} trees`,C.green,"Annual carbon absorption equivalent"],
              ["Total Eco Trips",(data?.totalEcoTrips||0).toLocaleString(),C.greenBrt,"Completed rides on the platform"],
              ["Avg CO₂ per Trip",`${data?.avgCo2GramsPerTrip||0}g`,C.lime,"Average savings per completed trip"],
            ].map(([l,v,col,desc])=>(
              <div key={l} style={{ background:"#fff", borderRadius:12, padding:16, borderLeft:`3px solid ${col}` }}>
                <div className="serif" style={{ fontSize:26, fontWeight:600, color:col, marginBottom:4 }}>{v}</div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{l}</div>
                <div style={{ fontSize:11, color:C.textSub, marginTop:3 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:18 }}>Calculation Parameters</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              ["ICE Baseline",`${cfg_.iceEmissionGramsPerKm||120} g/km`,"Baseline emissions of an average petrol car"],
              ["EV Emissions",`${cfg_.evEmissionGramsPerKm||0} g/km`,"Grid-adjusted EV emissions"],
              ["Tree Absorption",`${cfg_.gramsPerTreePerYear||21000} g/year`,"CO₂ absorbed per tree annually"],
            ].map(([k,v,desc])=>(
              <div key={k} style={{ background:C.bgMid, borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{k}</span>
                  <span className="mono" style={{ fontSize:12, color:C.greenMid, fontWeight:700 }}>{v}</span>
                </div>
                <div style={{ fontSize:11, color:C.textSub }}>{desc}</div>
              </div>
            ))}
          </div>
          <Btn v="outline" size="sm" style={{ marginTop:14, width:"100%", justifyContent:"center" }} onClick={()=>{setCfg(cfg_);setEditConfig(true);}}>Edit Parameters</Btn>
        </Card>
      </div>

      {editConfig&&(
        <Modal title="Configure CO₂ Parameters" onClose={()=>setEditConfig(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"#f0f7ec", border:`1px solid ${C.greenMid}33`, borderRadius:10, padding:"10px 14px", fontSize:12, color:C.textMid }}>
              🌿 These values determine how CO₂ savings are calculated for each completed trip.
            </div>
            <Input label="ICE Baseline Emissions (g/km)" type="number" value={cfg.iceEmissionGramsPerKm||""} onChange={v=>setCfg(p=>({...p,iceEmissionGramsPerKm:v}))} placeholder="120"/>
            <Input label="EV Grid Emissions (g/km)" type="number" value={cfg.evEmissionGramsPerKm||""} onChange={v=>setCfg(p=>({...p,evEmissionGramsPerKm:v}))} placeholder="0"/>
            <Input label="Tree CO₂ Absorption (g/year)" type="number" value={cfg.gramsPerTreePerYear||""} onChange={v=>setCfg(p=>({...p,gramsPerTreePerYear:v}))} placeholder="21000"/>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setEditConfig(false)}>Cancel</Btn>
              <Btn onClick={saveConfig}>Save Configuration</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ECO+ SUBSCRIPTION ─────────────────────────────────────────────────────
const EcoPlus = ({ toast }) => {
  const [tab,setTab]=useState("overview");
  const [overview,setOverview]=useState(null);
  const [plans,setPlans]=useState([]);
  const [subs,setSubs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [subFilter,setSubFilter]=useState("");
  const [editPlan,setEditPlan]=useState(null);
  const [pf,setPf]=useState({});

  useEffect(()=>{
    Promise.all([
      api.ecoPlusOverview().then(r=>setOverview(r.data||{})),
      api.ecoPlusPlans().then(r=>setPlans(r.data?.plans||r.data||[])),
    ]).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    api.ecoPlusSubs({status:subFilter}).then(r=>setSubs(r.data||[])).catch(()=>setSubs([]));
  },[subFilter]);

  const savePlan = async () => {
    try {
      const r=await api.saveEcoPlusPlan(pf);
      const saved=r.data||r;
      if(editPlan==="new") setPlans(p=>[...p,saved]);
      else setPlans(p=>p.map(x=>x.id===editPlan?saved:x));
      toast("Plan saved!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setEditPlan(null);
  };

  const cancelSub = async (id) => {
    try{ await api.cancelSub(id); }catch{}
    setSubs(p=>p.map(s=>s.id===id?{...s,status:"cancelled"}:s));
    toast("Subscription cancelled","success");
  };

  const fmtN = (kobo)=>`₦${((kobo||0)/100).toLocaleString("en-NG")}`;
  const TABS=[{id:"overview",label:"Overview"},{id:"subscribers",label:"Subscribers"},{id:"plans",label:"Plans"}];

  if(loading) return <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner/></div>;

  return (
    <div>
      <PH title="Eco+ Subscription" sub="Manage subscription plans, revenue and subscribers">
        {tab==="plans"&&<Btn v="primary" onClick={()=>{setPf({benefits:[]});setEditPlan("new");}}>+ New Plan</Btn>}
      </PH>

      <div style={{ display:"flex", gap:4, marginBottom:20, background:C.bgMid, borderRadius:12, padding:4, width:"fit-content" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"7px 18px", borderRadius:9, border:"none", fontSize:13, fontWeight:600, transition:"all .15s", background:tab===t.id?C.bgCard:"transparent", color:tab===t.id?C.text:C.textMid, boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,.08)":"none" }}>{t.label}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
            <Stat label="Active Subscribers" value={(overview?.totalActive||0).toLocaleString()} icon="★" accent={C.greenMid}/>
            <Stat label="Cancelled" value={(overview?.cancelled||0).toLocaleString()} icon="↺" accent={C.red}/>
            <Stat label="Total Revenue" value={`₦${((overview?.totalRevenueNaira||0)/1000).toFixed(0)}k`} icon="₦" accent={C.amber}/>
            <Stat label="MRR" value={`₦${((overview?.mrrNaira||0)/1000).toFixed(0)}k`} icon="↗" accent={C.blue}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[["New Today",(overview?.newSubscribers?.today||0)],["This Week",(overview?.newSubscribers?.thisWeek||0)],["This Month",(overview?.newSubscribers?.thisMonth||0)]].map(([l,v])=>(
              <Card key={l}>
                <div style={{ fontSize:11, color:C.textMid, textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>New Subscribers — {l}</div>
                <div className="serif" style={{ fontSize:36, fontWeight:600, color:C.greenMid }}>{v}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==="subscribers"&&(
        <div>
          <div style={{ marginBottom:14 }}>
            <Sel value={subFilter} onChange={setSubFilter} options={[{value:"",label:"All Status"},{value:"active",label:"Active"},{value:"cancelled",label:"Cancelled"},{value:"expired",label:"Expired"},{value:"past_due",label:"Past Due"}]}/>
          </div>
          <Card pad={0}>
            <Table columns={[
              { key:"rider",   label:"Rider",      render:r=><div><div style={{ fontWeight:600 }}>{r.rider?.user?.firstName} {r.rider?.user?.lastName}</div><div style={{ fontSize:11, color:C.textSub }}>{r.rider?.user?.email}</div></div> },
              { key:"plan",    label:"Plan",       render:r=><Badge color={C.greenMid}>{r.plan?.name}</Badge> },
              { key:"status",  label:"Status",     render:r=><SB s={r.status}/> },
              { key:"starts",  label:"Started",    render:r=>new Date(r.startsAt).toLocaleDateString("en-NG") },
              { key:"next",    label:"Next Billing",render:r=>r.nextBillingAt?new Date(r.nextBillingAt).toLocaleDateString("en-NG"):<span style={{ color:C.muted }}>—</span> },
              { key:"billed",  label:"Total Billed",render:r=><span className="mono">₦{((r.totalBilled||0)/100).toLocaleString()}</span> },
              { key:"act",     label:"",           render:r=>r.status==="active"?<Btn size="sm" v="danger" onClick={()=>cancelSub(r.id)}>Cancel</Btn>:null },
            ]} data={subs} emptyMsg="No subscribers found"/>
          </Card>
        </div>
      )}

      {tab==="plans"&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {plans.length===0 ? <Empty msg="No plans created yet"/> :
            plans.map(p=>(
              <Card key={p.id} style={{ borderTop:`3px solid ${C.greenMid}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{p.description}</div>
                  </div>
                  <Btn v="ghost" size="sm" onClick={()=>{setPf(p);setEditPlan(p.id);}}>Edit</Btn>
                </div>
                <div className="serif" style={{ fontSize:28, fontWeight:600, color:C.green, marginBottom:8 }}>
                  {fmtN(p.priceKobo)} <span style={{ fontSize:13, fontWeight:400, color:C.textMid }}>/{p.intervalDays===30?"mo":"yr"}</span>
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                  <Badge color={C.greenMid}>{p.discountPct}% off rides</Badge>
                  {p.priorityRides&&<Badge color={C.blue}>Priority</Badge>}
                  <SB s={p.isActive?"active":"offline"}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {(p.benefits||[]).map((b,i)=><div key={i} style={{ fontSize:12, color:C.textMid }}>🌿 {b}</div>)}
                </div>
              </Card>
            ))
          }
        </div>
      )}

      {editPlan&&(
        <Modal title={editPlan==="new"?"Create Plan":"Edit Plan"} onClose={()=>setEditPlan(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Plan Name" value={pf.name||""} onChange={v=>setPf(p=>({...p,name:v}))} placeholder="Eco+ Monthly"/>
            <Input label="Description" value={pf.description||""} onChange={v=>setPf(p=>({...p,description:v}))}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Price (Kobo)" type="number" value={pf.priceKobo||""} onChange={v=>setPf(p=>({...p,priceKobo:v}))} placeholder="500000 = ₦5,000"/>
              <Input label="Interval (days)" type="number" value={pf.intervalDays||""} onChange={v=>setPf(p=>({...p,intervalDays:v}))} placeholder="30"/>
              <Input label="Ride Discount %" type="number" value={pf.discountPct||""} onChange={v=>setPf(p=>({...p,discountPct:v}))}/>
            </div>
            <Sel label="Priority Rides" value={pf.priorityRides?"yes":"no"} onChange={v=>setPf(p=>({...p,priorityRides:v==="yes"}))} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]}/>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>Benefits (one per line)</label>
              <textarea value={(pf.benefits||[]).join("\n")} onChange={e=>setPf(p=>({...p,benefits:e.target.value.split("\n")}))}
                style={{ width:"100%", minHeight:80, background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, resize:"vertical" }}/>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setEditPlan(null)}>Cancel</Btn>
              <Btn onClick={savePlan}>Save Plan</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN TEAM ────────────────────────────────────────────────────────────
const Team = ({ toast }) => {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);
  const [permModal,setPermModal]=useState(null);
  const [form,setForm]=useState({});
  const [perms,setPerms]=useState([]);

  useEffect(()=>{
    api.team().then(r=>setRows(r.data||[])).catch(()=>setRows([])).finally(()=>setLoading(false));
  },[]);

  const RC=r=>({superadmin:C.green,ops:C.blue,finance:C.amber,support:C.greenMid,readonly:C.muted})[r]||C.muted;

  const invite = async () => {
    try {
      await api.inviteAdmin(form);
      const r=await api.team(); setRows(r.data||rows);
      toast("Invite sent!","success");
    } catch(e) { toast(e.message||"Invite failed","error"); }
    setModal(false);setForm({});
  };

  const disable = async (id) => {
    try{ await api.disableAdmin(id); }catch{}
    setRows(r=>r.map(a=>a.id===id?{...a,isActive:false}:a));
    toast("Admin disabled","success");
  };

  const openPerms = (admin) => { setPermModal(admin); setPerms(admin.role?.permissions||[]); };

  const savePerms = async () => {
    try{
      await api.updatePerms(permModal.role?.id,perms);
      toast("Permissions updated!","success");
    } catch(e) { toast(e.message||"Save failed","error"); }
    setPermModal(null);
  };

  const RESOURCES=["riders","drivers","trips","fare","payments","refunds","tickets","promotions","co2","ecoplus","admin","audit","notifications"];
  const ACTIONS=["read","write","approve","manage"];
  const hasPerm=(res,action)=>perms.some(p=>p.resource===res&&p.action===action);
  const togglePerm=(res,action)=>{
    if(hasPerm(res,action)) setPerms(p=>p.filter(x=>!(x.resource===res&&x.action===action)));
    else setPerms(p=>[...p,{resource:res,action:action}]);
  };

  const cols = [
    { key:"name",   label:"Admin",      render:r=><div><div style={{ fontWeight:600 }}>{r.firstName} {r.lastName}</div><div style={{ fontSize:11, color:C.textSub }}>{r.email}</div></div> },
    { key:"role",   label:"Role",       render:r=><Badge color={RC(r.role?.name)}>{r.role?.name}</Badge> },
    { key:"status", label:"Status",     render:r=><SB s={r.isActive?"active":"offline"}/> },
    { key:"login",  label:"Last Login", render:r=>r.lastLogin?new Date(r.lastLogin).toLocaleDateString("en-NG"):<span style={{ color:C.muted }}>Never</span> },
    { key:"act",    label:"",           render:r=>(
      <div style={{ display:"flex", gap:6 }}>
        {r.role?.name!=="superadmin"&&<Btn size="sm" v="ghost" onClick={()=>openPerms(r)}>Permissions</Btn>}
        {r.isActive&&r.role?.name!=="superadmin"&&<Btn size="sm" v="danger" onClick={()=>disable(r.id)}>Disable</Btn>}
      </div>
    )},
  ];

  return (
    <div>
      <PH title="Admin Team" sub="Manage admin accounts and role permissions">
        <Btn v="primary" onClick={()=>setModal(true)}>+ Invite Admin</Btn>
      </PH>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No team members found"/></Card>

      {modal&&(
        <Modal title="Invite Admin" onClose={()=>setModal(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="First Name" value={form.firstName||""} onChange={v=>setForm(p=>({...p,firstName:v}))}/>
              <Input label="Last Name" value={form.lastName||""} onChange={v=>setForm(p=>({...p,lastName:v}))}/>
            </div>
            <Input label="Email" type="email" value={form.email||""} onChange={v=>setForm(p=>({...p,email:v}))}/>
            <Sel label="Role" value={form.role||""} onChange={v=>setForm(p=>({...p,role:v}))} options={[{value:"",label:"Select role…"},{value:"ops",label:"Operations"},{value:"finance",label:"Finance"},{value:"support",label:"Support"},{value:"readonly",label:"Read Only"}]}/>
            <div style={{ background:"#f0f7ec", border:`1px solid ${C.greenMid}33`, borderRadius:10, padding:"10px 14px", fontSize:12, color:C.textMid }}>🌿 A temporary password will be emailed to the new admin.</div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={invite}>Send Invite</Btn>
            </div>
          </div>
        </Modal>
      )}

      {permModal&&(
        <Modal title={`Permissions — ${permModal.firstName} ${permModal.lastName} (${permModal.role?.name})`} onClose={()=>setPermModal(null)} width={640}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr><th style={{ padding:"6px 10px", textAlign:"left", color:C.textMid, fontWeight:600, textTransform:"uppercase", fontSize:10, letterSpacing:".06em" }}>Resource</th>
                {ACTIONS.map(a=><th key={a} style={{ padding:"6px 10px", textAlign:"center", color:C.textMid, fontWeight:600, textTransform:"uppercase", fontSize:10, letterSpacing:".06em" }}>{a}</th>)}
                </tr>
              </thead>
              <tbody>
                {RESOURCES.map(res=>(
                  <tr key={res} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"8px 10px", fontWeight:600, textTransform:"capitalize" }}>{res}</td>
                    {ACTIONS.map(action=>(
                      <td key={action} style={{ padding:"8px 10px", textAlign:"center" }}>
                        <input type="checkbox" checked={hasPerm(res,action)} onChange={()=>togglePerm(res,action)}
                          style={{ width:15, height:15, accentColor:C.green, cursor:"pointer" }}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <Btn v="ghost" onClick={()=>setPermModal(null)}>Cancel</Btn>
            <Btn onClick={savePerms}>Save Permissions</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── AUDIT LOG ─────────────────────────────────────────────────────────────
const Audit = () => {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.auditLogs({}).then(r=>setRows(r.data||[])).catch(()=>setRows([])).finally(()=>setLoading(false)); },[]);

  const AC=a=>{ if(!a)return C.muted; if(a.includes("APPROV")||a.includes("INVIT"))return C.greenMid; if(a.includes("REJECT")||a.includes("DISABL"))return C.red; if(a.includes("UPDATE")||a.includes("CREATE")||a.includes("LOGIN"))return C.blue; return C.muted; };

  const cols = [
    { key:"time",     label:"Time",       render:r=><span className="mono" style={{ fontSize:11 }}>{new Date(r.createdAt).toLocaleString("en-NG")}</span> },
    { key:"admin",    label:"Admin",      render:r=>`${r.admin?.firstName||""} ${r.admin?.lastName||""}` },
    { key:"action",   label:"Action",     render:r=><Badge color={AC(r.action)}>{r.action?.replace(/_/g," ")}</Badge> },
    { key:"resource", label:"Resource",   render:r=><span style={{ color:C.textMid }}>{r.resource}</span> },
    { key:"resId",    label:"ID",         render:r=><span className="mono" style={{ fontSize:11, color:C.muted }}>{r.resourceId}</span> },
  ];

  return (
    <div>
      <PH title="Audit Log" sub="Complete record of all admin actions"/>
      <Card pad={0}><Table columns={cols} data={rows} loading={loading} emptyMsg="No audit logs yet"/></Card>
    </div>
  );
};

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
const Notifications = ({ toast }) => {
  const [form,setForm]=useState({targetRole:"",subject:"",body:""});
  const [sent,setSent]=useState(null);

  const send = async () => {
    if(!form.subject||!form.body){toast("Subject and body required","warn");return;}
    try {
      const r=await api.sendBulk(form);
      setSent(r.data?.sent||0);
      toast("Sent successfully!","success");
    } catch(e) { toast(e.message||"Send failed","error"); }
    setForm({targetRole:"",subject:"",body:""});
  };

  return (
    <div>
      <PH title="Notifications" sub="Send bulk messages to riders and drivers"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <div className="serif" style={{ fontWeight:600, fontSize:15, marginBottom:20 }}>Compose Message</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Sel label="Target Audience" value={form.targetRole} onChange={v=>setForm(p=>({...p,targetRole:v}))} options={[{value:"",label:"All Users"},{value:"rider",label:"Riders Only"},{value:"driver",label:"Drivers Only"}]}/>
            <Input label="Subject" value={form.subject} onChange={v=>setForm(p=>({...p,subject:v}))} placeholder="Important update from Eco"/>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.textMid, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>Message</label>
              <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Your message here…"
                style={{ width:"100%", minHeight:150, background:C.bgMid, border:`1px solid ${C.borderDk}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, resize:"vertical" }}/>
            </div>
            <Btn v="primary" size="lg" onClick={send} style={{ width:"100%", justifyContent:"center" }}>Send Notification →</Btn>
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ background:C.bgDeep, border:"none" }}>
            <div style={{ fontSize:10, color:C.limeGlow, letterSpacing:".1em", textTransform:"uppercase", marginBottom:12, opacity:.75 }}>Preview — Inbox</div>
            <div style={{ background:"#ffffff0d", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:10, color:"#ffffff40", marginBottom:6 }}>TO: {form.targetRole||"All Users"} · from Eco</div>
              <div style={{ fontWeight:600, color:"#fff", marginBottom:6 }}>{form.subject||"Subject…"}</div>
              <div style={{ fontSize:13, color:"#ffffff80", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{form.body||"Message body…"}</div>
            </div>
          </Card>
          {sent!==null&&(
            <Card style={{ background:"#f0f7ec", border:`1px solid ${C.greenMid}33` }}>
              <div className="serif" style={{ fontWeight:600, fontSize:14, color:C.greenMid, marginBottom:6 }}>✓ Message Delivered</div>
              <div className="serif" style={{ fontSize:40, fontWeight:600, color:C.green }}>{sent.toLocaleString()}</div>
              <div style={{ fontSize:12, color:C.textMid }}>users reached</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("dashboard");
  const [toasts,setToasts]=useState([]);
  const [adminInfo,setAdminInfo]=useState(()=>{
    const t=localStorage.getItem("eco_admin_token");
    if(!t) return null;
    try {
      const payload=JSON.parse(atob(t.split(".")[1]));
      return { email:payload.email, role:payload.role };
    } catch { return null; }
  });

  useEffect(()=>{
    const handler=()=>setAdminInfo(null);
    window.addEventListener("eco:unauthorized",handler);
    return()=>window.removeEventListener("eco:unauthorized",handler);
  },[]);

  const toast=(msg,type="success")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
  };

  if(!adminInfo) {
    return (
      <>
        <GlobalStyle/>
        <Login onLogin={(admin)=>{
          setAdminInfo({ email:admin.email, role:admin.role?.name||admin.role||"admin" });
        }}/>
      </>
    );
  }

  const PAGES={
    dashboard:     <Dashboard toast={toast} onNav={setPage}/>,
    analytics:     <Analytics/>,
    trips:         <Trips toast={toast}/>,
    drivers:       <Drivers toast={toast}/>,
    fare:          <FareEngine toast={toast}/>,
    finance:       <Finance/>,
    refunds:       <Refunds toast={toast}/>,
    promotions:    <Promotions toast={toast}/>,
    tickets:       <Tickets toast={toast}/>,
    co2:           <Co2Analytics toast={toast}/>,
    ecoplus:       <EcoPlus toast={toast}/>,
    team:          <Team toast={toast}/>,
    audit:         <Audit/>,
    notifications: <Notifications toast={toast}/>,
  };

  return (
    <>
      <GlobalStyle/>
      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
        <Sidebar active={page} onNav={setPage} adminInfo={adminInfo}/>
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px", background:C.bg }}>
          <div key={page} className="fade-up">{PAGES[page]}</div>
        </main>
      </div>
      <div style={{ position:"fixed", bottom:0, right:0, display:"flex", flexDirection:"column", gap:8, padding:20, zIndex:9999 }}>
        {toasts.map(t=><Toast key={t.id} msg={t.msg} type={t.type} onClose={()=>setToasts(ts=>ts.filter(x=>x.id!==t.id))}/>)}
      </div>
    </>
  );
}
