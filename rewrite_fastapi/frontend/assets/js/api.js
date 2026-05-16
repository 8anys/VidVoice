const jsonHeaders = {
  "Content-Type": "application/json",
};

const TOKEN_STORAGE_KEY = "vidvoice_auth_token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch (error) {
      // Keep the generic message when the server did not return JSON.
    }
    throw new Error(message);
  }
  return response.json();
}

export const api = {
  health: () => request("/api/health"),
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  me: () => request("/api/auth/me"),
  getProfile: () => request("/api/profile"),
  updateProfile: (payload) =>
    request("/api/profile", {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  getProjects: () => request("/api/projects"),
  createProject: (payload) =>
    request("/api/projects", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  updateProject: (id, payload) =>
    request(`/api/projects/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  deleteProject: (id) =>
    request(`/api/projects/${id}`, {
      method: "DELETE",
    }),
  getCredits: () => request("/api/credits"),
  getVoices: () => request("/api/voices"),
  translate: (payload) =>
    request("/api/translate", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  generateAudio: (payload) =>
    request("/api/generate-audio", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  },
  importGeneratedFiles: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await fetch("/api/generated-files/import", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      let message = `Request failed: ${response.status}`;
      try {
        const body = await response.json();
        message = body.detail || message;
      } catch (error) {
        // Keep the generic message when the server did not return JSON.
      }
      throw new Error(message);
    }
    return response.json();
  },
  composeVideo: (payload) =>
    request("/api/compose-video", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
};

