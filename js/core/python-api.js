/**
 * Cliente da API Python (FastAPI). JWT + fallback Skulpt.
 */
const PhytonAPI = {
  baseUrl: (document.body?.dataset?.api || "http://127.0.0.1:8765").replace(/\/$/, ""),
  adminKey: document.body?.dataset?.adminKey || "phytonfree-local-dev",
  tokenKey: "phytonfree.jwt",
  runtime: null,

  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  },

  setToken(token) {
    if (token) sessionStorage.setItem(this.tokenKey, token);
  },

  clearToken() {
    sessionStorage.removeItem(this.tokenKey);
  },

  authHeaders(json = true) {
    const headers = { Accept: "application/json" };
    if (json) headers["Content-Type"] = "application/json";
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  },

  rememberAuth(data) {
    if (data?.access_token) this.setToken(data.access_token);
  },

  async probe() {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("health not ok");
      const data = await response.json();
      this.runtime = {
        ok: true,
        engine: "python",
        version: data.python_version,
        label: `Python ${data.python_version}`,
        features: data.features || [],
        storage: data.storage || "sqlite",
      };
    } catch {
      this.runtime = {
        ok: false,
        engine: "skulpt",
        version: null,
        label: "Skulpt (navegador)",
        features: [],
        storage: null,
      };
    } finally {
      window.clearTimeout(timer);
      window.dispatchEvent(new CustomEvent("phytonfree:runtime", { detail: this.runtime }));
    }
    return this.runtime;
  },

  async run(source, options = {}) {
    const repl = options.repl !== false;
    if (!this.runtime?.ok) {
      return { ok: false, offline: true, stdout: "", error: "API Python offline." };
    }
    try {
      const response = await fetch(`${this.baseUrl}/api/run`, {
        method: "POST",
        headers: this.authHeaders(),
        body: JSON.stringify({ source, repl }),
      });
      const data = await response.json();
      const stdout = String(data.stdout || "").trimEnd();
      const error = data.error ? String(data.error) : null;
      return {
        ok: data.exit_code === 0 && !error,
        stdout,
        stderr: String(data.stderr || ""),
        error,
        engine: "python",
      };
    } catch (err) {
      return { ok: false, stdout: "", error: String(err), engine: "python" };
    }
  },

  async syncMatricula(payload) {
    if (!this.runtime?.ok) return { ok: false, skipped: true };
    try {
      const response = await fetch(`${this.baseUrl}/api/matricula`, {
        method: "POST",
        headers: this.authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      this.rememberAuth(data);
      return data;
    } catch {
      return { ok: false, skipped: true };
    }
  },

  async login(email, password) {
    if (!this.runtime?.ok) return { ok: false, offline: true };
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    this.rememberAuth(data);
    return data;
  },

  async checkExercise(payload) {
    if (!this.runtime?.ok) return { ok: false, offline: true };
    const response = await fetch(`${this.baseUrl}/api/exercises/check`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async fetchProgressMe() {
    if (!this.runtime?.ok || !this.getToken()) return { ok: false, offline: true };
    const response = await fetch(`${this.baseUrl}/api/progress/me`, {
      headers: this.authHeaders(false),
    });
    return response.json();
  },

  async syncProgress(progress) {
    if (!this.runtime?.ok || !this.getToken()) return { ok: false, skipped: true };
    const response = await fetch(`${this.baseUrl}/api/progress/sync`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify({ progress }),
    });
    return response.json();
  },

  async pullProgress(email, password) {
    if (!this.runtime?.ok) return { ok: false, offline: true };
    const response = await fetch(`${this.baseUrl}/api/progress/pull`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    this.rememberAuth(data);
    return data;
  },

  async pushProgress(payload) {
    if (!this.runtime?.ok) return { ok: false, offline: true };
    if (this.getToken()) return this.syncProgress(payload.progress);
    const response = await fetch(`${this.baseUrl}/api/progress/push`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async adminSummary() {
    if (!this.runtime?.ok) return { ok: false, offline: true };
    const response = await fetch(`${this.baseUrl}/api/admin/summary?key=${encodeURIComponent(this.adminKey)}`, {
      headers: { Accept: "application/json", "X-Admin-Key": this.adminKey },
    });
    return response.json();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  PhytonAPI.probe();
});