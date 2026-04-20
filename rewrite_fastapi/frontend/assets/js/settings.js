import { api } from "./api.js";
import { setYear } from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  const profile = await api.getProfile();

  document.getElementById("language-select").value = profile.language;
  document.getElementById("voice-select").value = profile.voice;
  document.getElementById("quality-select").value = profile.quality;
  document.getElementById("format-select").value = profile.export_format;
  document.getElementById("auto-save").checked = profile.auto_save;
  document.getElementById("auto-translate").checked = profile.auto_translate;

  document.getElementById("save-settings")?.addEventListener("click", async () => {
    await api.updateProfile({
      language: document.getElementById("language-select").value,
      voice: document.getElementById("voice-select").value,
      quality: document.getElementById("quality-select").value,
      export_format: document.getElementById("format-select").value,
      auto_save: document.getElementById("auto-save").checked,
      auto_translate: document.getElementById("auto-translate").checked,
    });
  });
});

