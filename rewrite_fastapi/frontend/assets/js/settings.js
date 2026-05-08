import { api } from "./api.js";
import { getCurrentLanguage, initI18n, setCurrentLanguage, setYear } from "./common.js?v=theme-2";

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  initI18n({
    onChange: (language) => {
      document.getElementById("language-select").value = language;
    },
  });
  const profile = await api.getProfile();

  document.getElementById("language-select").value = getCurrentLanguage() || profile.language;
  document.getElementById("voice-select").value = profile.voice;
  document.getElementById("quality-select").value = profile.quality;
  document.getElementById("format-select").value = profile.export_format;
  document.getElementById("auto-save").checked = profile.auto_save;
  document.getElementById("auto-translate").checked = profile.auto_translate;

  document.getElementById("language-select")?.addEventListener("change", (event) => {
    setCurrentLanguage(event.target.value);
  });

  document.getElementById("save-settings")?.addEventListener("click", async () => {
    const language = document.getElementById("language-select").value;
    setCurrentLanguage(language);
    await api.updateProfile({
      language,
      voice: document.getElementById("voice-select").value,
      quality: document.getElementById("quality-select").value,
      export_format: document.getElementById("format-select").value,
      auto_save: document.getElementById("auto-save").checked,
      auto_translate: document.getElementById("auto-translate").checked,
    });
  });
});

