// ─── ECO ADMIN · API SERVICE LAYER ───────────────────────────────────────────
// Place in src/api.js alongside App.jsx
// Set VITE_API_URL in your .env (defaults to http://localhost:9000/api)

const BASE_URL  = import.meta.env.VITE_API_URL || "http://localhost:9000/api";
const TOKEN_KEY = "eco_admin_token";

const api = {
  getToken:   ()    => localStorage.getItem(TOKEN_KEY),
  setToken:   (t)   => localStorage.setItem(TOKEN_KEY, t),
  clearToken: ()    => localStorage.removeItem(TOKEN_KEY),

  headers() {
    const h = { "Content-Type": "application/json" };
    const t = this.getToken();
    if (t) h["Authorization"] = `Bearer ${t}`;
    return h;
  },

  async request(method, path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: this.headers(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (res.status === 401) {
      this.clearToken();
      window.dispatchEvent(new Event("eco:unauthorized"));
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },

  get:   (path)        => api.request("GET",   path),
  post:  (path, body)  => api.request("POST",  path, body),
  put:   (path, body)  => api.request("PUT",   path, body),
  patch: (path, body)  => api.request("PATCH", path, body),

  qs(params) {
    const q = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.set(k, v);
    });
    return q.toString() ? `?${q}` : "";
  },

  login:            (body)          => api.post("/admin/login", body),
  dashboard:        ()              => api.get("/admin/dashboard"),
  activeTrips:      ()              => api.get("/admin/dashboard/active-trips"),
  onlineDrivers:    ()              => api.get("/admin/dashboard/online-drivers"),
  analytics:        (period)        => api.get(`/admin/analytics?period=${period}`),
  riders:           (q)             => api.get(`/admin/riders${api.qs(q)}`),
  blockUser:        (id, reason)    => api.put(`/admin/riders/${id}/block`,   { reason }),
  unblockUser:      (id)            => api.put(`/admin/riders/${id}/unblock`),
  drivers:          (q)             => api.get(`/admin/drivers${api.qs(q)}`),
  approveDriver:    (id)            => api.put(`/admin/drivers/${id}/approve`),
  trips:            (q)             => api.get(`/admin/trips${api.qs(q)}`),
  fareRules:        ()              => api.get("/admin/fare-rules"),
  saveFareRule:     (body)          => api.post("/admin/fare-rules", body),
  surgeRules:       ()              => api.get("/admin/surge-rules"),
  saveSurgeRule:    (body)          => api.post("/admin/surge-rules", body),
  payments:         (q)             => api.get(`/admin/finance${api.qs(q)}`),
  refunds:          (q)             => api.get(`/admin/refunds${api.qs(q)}`),
  approveRefund:    (id, notes)     => api.put(`/admin/refunds/${id}/approve`, { notes }),
  rejectRefund:     (id, notes)     => api.put(`/admin/refunds/${id}/reject`,  { notes }),
  promotions:       ()              => api.get("/admin/promotions"),
  createPromo:      (body)          => api.post("/admin/promotions", body),
  updatePromo:      (id, body)      => api.patch(`/admin/promotions/${id}`, body),
  tickets:          (q)             => api.get(`/admin/tickets${api.qs(q)}`),
  resolveTicket:    (id, resolution)=> api.put(`/admin/tickets/${id}/resolve`, { resolution }),
  replyTicket:      (id, message)   => api.post(`/admin/tickets/${id}/reply`,  { message }),
  team:             ()              => api.get("/admin/team"),
  inviteAdmin:      (body)          => api.post("/admin/team/invite", body),
  disableAdmin:     (id)            => api.put(`/admin/team/${id}/disable`),
  updatePerms:      (roleId, perms) => api.put(`/admin/team/roles/${roleId}/permissions`, { permissions: perms }),
  auditLogs:        (q)             => api.get(`/admin/audit-logs${api.qs(q)}`),
  co2Analytics:     ()              => api.get("/admin/co2/analytics"),
  saveCo2Config:    (body)          => api.post("/admin/co2/config", body),
  ecoPlusPlans:     ()              => api.get("/admin/ecoplus/plans"),
  saveEcoPlusPlan:  (body)          => api.post("/admin/ecoplus/plans", body),
  ecoPlusOverview:  ()              => api.get("/admin/ecoplus/overview"),
  ecoPlusSubs:      (q)             => api.get(`/admin/ecoplus/subscribers${api.qs(q)}`),
  cancelSub:        (id)            => api.put(`/admin/ecoplus/subscribers/${id}/cancel`),
  sendBulk:         (body)          => api.post("/admin/notifications/send-bulk", body),
};

export default api;
