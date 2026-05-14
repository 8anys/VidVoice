const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const response = await fetch(path, options);
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

