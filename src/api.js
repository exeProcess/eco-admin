// ── Centralized API Client ─────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() { return localStorage.getItem('eco_admin_token'); }

export function setToken(t) {
  if (t) localStorage.setItem('eco_admin_token', t);
  else localStorage.removeItem('eco_admin_token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event('eco:unauthorized'));
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const qs = (q) => {
  const params = Object.fromEntries(
    Object.entries(q).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
};

const api = {
  setToken,

  // Auth
  login: (body) => request('POST', '/admin/login', body),

  // Dashboard
  dashboard:     () => request('GET', '/admin/dashboard'),
  activeTrips:   () => request('GET', '/admin/dashboard/active-trips'),
  onlineDrivers: () => request('GET', '/admin/dashboard/online-drivers'),

  // Analytics
  analytics: (period) => request('GET', `/admin/analytics?period=${period || '7d'}`),

  // Riders  (alias: riders = listRiders)
  riders:      (q = {}) => request('GET', `/admin/riders${qs(q)}`),
  listRiders:  (q = {}) => request('GET', `/admin/riders${qs(q)}`),
  getRider:    (id)     => request('GET', `/admin/riders/${id}`),
  blockUser:   (id, reason) => request('PUT', `/admin/riders/${id}/block`, { reason }),
  unblockUser: (id)         => request('PUT', `/admin/riders/${id}/unblock`),

  // Drivers (alias: drivers = listDrivers)
  drivers:      (q = {}) => request('GET', `/admin/drivers${qs(q)}`),
  listDrivers:  (q = {}) => request('GET', `/admin/drivers${qs(q)}`),
  getDriver:    (id)     => request('GET', `/admin/drivers/${id}`),
  approveDriver:(id)     => request('PUT', `/admin/drivers/${id}/approve`),
  blockDriver:  (id, reason) => request('PUT', `/admin/drivers/${id}/block`, { reason }),

  // Trips (alias: trips = listTrips)
  trips:     (q = {}) => request('GET', `/admin/trips${qs(q)}`),
  listTrips: (q = {}) => request('GET', `/admin/trips${qs(q)}`),

  // Fare engine
  fareRules:     ()     => request('GET',  '/admin/fare-rules'),
  saveFareRule:  (body) => request('POST', '/admin/fare-rules', body),
  surgeRules:    ()     => request('GET',  '/admin/surge-rules'),
  saveSurgeRule: (body) => request('POST', '/admin/surge-rules', body),

  // Finance / Payments (alias: payments = listFinance)
  payments:    (q = {}) => request('GET', `/admin/finance${qs(q)}`),
  listFinance: (q = {}) => request('GET', `/admin/finance${qs(q)}`),

  // Refunds (alias: refunds = listRefunds)
  refunds:       (q = {}) => request('GET', `/admin/refunds${qs(q)}`),
  listRefunds:   (q = {}) => request('GET', `/admin/refunds${qs(q)}`),
  approveRefund: (id, notes) => request('PUT', `/admin/refunds/${id}/approve`, { notes }),
  rejectRefund:  (id, notes) => request('PUT', `/admin/refunds/${id}/reject`, { notes }),

  // Tickets (alias: tickets = listTickets)
  tickets:       (q = {})      => request('GET',  `/admin/tickets${qs(q)}`),
  listTickets:   (q = {})      => request('GET',  `/admin/tickets${qs(q)}`),
  assignTicket:  (id, toId)    => request('PUT',  `/admin/tickets/${id}/assign`, { assignToAdminId: toId }),
  resolveTicket: (id, res)     => request('PUT',  `/admin/tickets/${id}/resolve`, { resolution: res }),
  replyTicket:   (id, msg)     => request('POST', `/admin/tickets/${id}/reply`, { message: msg }),

  // Team & RBAC (aliases: team = listAdmins, roles = listRoles)
  team:        ()              => request('GET',  '/admin/team'),
  listAdmins:  ()              => request('GET',  '/admin/team'),
  roles:       ()              => request('GET',  '/admin/team/roles'),
  listRoles:   ()              => request('GET',  '/admin/team/roles'),
  inviteAdmin: (body)          => request('POST', '/admin/team/invite', body),
  disableAdmin:(id)            => request('PUT',  `/admin/team/${id}/disable`),
  updatePerms: (roleId, perms) => request('PUT',  `/admin/team/roles/${roleId}/permissions`, { permissions: perms }),

  // Audit
  auditLogs: (q = {}) => request('GET', `/admin/audit-logs${qs(q)}`),

  // Promotions (aliases: promotions = listPromos)
  promotions:   ()         => request('GET',   '/admin/promotions'),
  listPromos:   ()         => request('GET',   '/admin/promotions'),
  createPromo:  (body)     => request('POST',  '/admin/promotions', body),
  updatePromo:  (id, body) => request('PATCH', `/admin/promotions/${id}`, body),

  // CO2
  co2Config:    ()     => request('GET',  '/admin/co2/config'),
  saveCo2Config:(body) => request('POST', '/admin/co2/config', body),
  co2Analytics: ()     => request('GET',  '/admin/co2/analytics'),

  // Eco+
  ecoPlusPlans:    ()       => request('GET',  '/admin/ecoplus/plans'),
  saveEcoPlusPlan: (body)   => request('POST', '/admin/ecoplus/plans', body),
  ecoPlusOverview: ()       => request('GET',  '/admin/ecoplus/overview'),
  ecoPlusSubs:     (q = {}) => request('GET',  `/admin/ecoplus/subscribers${qs(q)}`),
  cancelSub:       (id)     => request('PUT',  `/admin/ecoplus/subscribers/${id}/cancel`),

  // Notifications
  sendBulk: (body) => request('POST', '/admin/notifications/send-bulk', body),
};

export default api;
