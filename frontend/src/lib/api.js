// Decide base URL automatically
let API_BASE = "";

if (window.location.hostname === "localhost") {
  // Local development
  API_BASE = "http://localhost:4000";
} else {
  // Production backend URL (change this to your deployed server)
  API_BASE = "https://skillsync-1-b7pt.onrender.com";
}

export async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}
