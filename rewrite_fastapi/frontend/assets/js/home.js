import { api } from "./api.js";
import { formatTranslation, getCurrentLanguage, initI18n, setCurrentLanguage, setYear, t, toggleHidden } from "./common.js?v=audio-upload-1";

const fallbackVoices = [
  { id: "21m00Tcm4TlvDq8ikWAM", label: "Rachel", style: "Calm & Clear" },
  { id: "hvUegXh0mf2ABlDTB4TE", label: "Script Voice", style: "Voice from script.zip" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Bella", style: "Soft & Natural" },
  { id: "ErXwobaYiN019PkySvjV", label: "Antoni", style: "Warm narrator" },
];

const state = {
  voices: fallbackVoices,
  selectedVoice: fallbackVoices[0],
  generatedAudio: null,
  audioFiles: [],
  images: [],
  profileOpen: false,
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderVoiceOptions() {
  const container = document.getElementById("voice-options");
  if (!container) return;
  container.innerHTML = state.voices
    .map(
      (voice) => `
        <button type="button" class="voice-card ${state.selectedVoice.id === voice.id ? "is-selected" : ""}" data-voice-id="${escapeHtml(voice.id)}">
          <span class="voice-avatar">${escapeHtml((voice.label || "V").slice(0, 1))}</span>
          <span><strong>${escapeHtml(voice.label)}</strong><small>${escapeHtml(voice.style)}</small></span>
        </button>
      `,
    )
    .join("");
}

function syncSelectedVoice() {
  const label = document.getElementById("voice-label");
  const style = document.getElementById("voice-style");
  if (label) label.textContent = state.selectedVoice.label;
  if (style) style.textContent = state.selectedVoice.style;
}

function syncRangeValues() {
  const fields = {
    stability: document.getElementById("stability"),
    similarity_boost: document.getElementById("similarity-boost"),
    style: document.getElementById("style"),
    speed: document.getElementById("speed"),
  };

  Object.entries(fields).forEach(([key, input]) => {
    const target = document.querySelector(`[data-range-value="${key}"]`);
    if (!input || !target) return;
    const value = Number(input.value);
    target.textContent = key === "speed" ? `${value.toFixed(2)}x` : `${Math.round(value * 100)}%`;
  });
}

async function loadVoices() {
  try {
    const result = await api.getVoices();
    if (Array.isArray(result.voices) && result.voices.length) {
      state.voices = result.voices;
      state.selectedVoice = result.voices[0];
    }
  } catch (error) {
    console.error("Failed to load ElevenLabs voices", error);
  } finally {
    renderVoiceOptions();
    syncSelectedVoice();
  }
}

function getVoiceSettings() {
  return {
    model_id: document.getElementById("voice-model")?.value || "eleven_multilingual_v2",
    stability: Number(document.getElementById("stability")?.value || 0.5),
    similarity_boost: Number(document.getElementById("similarity-boost")?.value || 0.75),
    style: Number(document.getElementById("style")?.value || 0),
    speed: Number(document.getElementById("speed")?.value || 1),
    use_speaker_boost: Boolean(document.getElementById("speaker-boost")?.checked),
  };
}

function formatFileSize(bytes = 0) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeGeneratedItem(item) {
  if (item.type === "audio") {
    return {
      generated: true,
      id: item.id,
      audio_url: item.url,
      download_url: item.download_url || item.url,
      provider: "Local file",
      voice: { label: item.name, style: "Imported audio" },
      model_id: "local",
      characters: 0,
      text: item.name,
    };
  }

  return {
    done: true,
    id: item.id,
    slides: 0,
    format: "mp4",
    aspect_ratio: "local",
    video_url: item.url,
    download_url: item.download_url || item.url,
    message: item.name,
  };
}

function audioItemFromGeneratedAudio(audio) {
  const url = audio.audio_url || "";
  const name = url.split("/").pop() || `${audio.id || "audio"}.mp3`;
  return {
    id: audio.id || url || name,
    type: "audio",
    name,
    url,
    download_url: audio.download_url || url,
    size: audio.size || 0,
  };
}

function getInitials(name = "", email = "") {
  if (name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email[0] || "U").toUpperCase();
}

function initNavSectionHighlight() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const activeId = `#${visible.target.id}`;
      links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === activeId));
    },
    { threshold: [0.35, 0.6], rootMargin: "-15% 0px -45% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

async function renderProfileMenu() {
  try {
    const profile = await api.getProfile();
    const initials = getInitials(profile.full_name || "", profile.email || "");
    document.getElementById("profile-initials").textContent = initials;
    document.getElementById("profile-dropdown-avatar").textContent = initials;
    document.getElementById("profile-dropdown-name").textContent = profile.full_name || "User";
    document.getElementById("profile-dropdown-email").textContent = profile.email || "";
    document.getElementById("profile-theme-badge").textContent = t("common.dark");
  } catch (error) {
    console.error("Failed to load profile menu", error);
  }
}

function renderAudio() {
  const section = document.getElementById("audio-player");
  const preview = document.getElementById("audio-preview");
  if (!section || !preview) return;
  toggleHidden(section, !state.generatedAudio);
  if (!state.generatedAudio) return;

  preview.innerHTML = `
    <div class="inline-row" style="justify-content:space-between;margin-bottom:1rem;">
      <div class="inline-row">
        <div class="icon-box" style="width:2.25rem;height:2.25rem;"><span>♪</span></div>
        <div>
          <div><strong>${escapeHtml(state.generatedAudio.voice.label)} — ElevenLabs</strong></div>
          <div class="muted">"${escapeHtml((state.generatedAudio.text || "").slice(0, 60))}..."</div>
        </div>
      </div>
      <div style="width:0.5rem;height:0.5rem;border-radius:999px;background:#4ade80;"></div>
    </div>
    <div class="content-card is-active" style="background:color-mix(in srgb, var(--secondary) 70%, transparent); margin-bottom:1rem;">
      <audio class="audio-control" controls src="${state.generatedAudio.audio_url || ""}"></audio>
      <div class="muted audio-meta">${escapeHtml(state.generatedAudio.model_id || "eleven_multilingual_v2")} • ${state.generatedAudio.characters || 0} chars</div>
    </div>
    <div class="button-row">
      <button class="outline-button" type="button" id="regenerate-audio">${t("audio.regenerate")}</button>
      <a class="button" href="${state.generatedAudio.download_url || state.generatedAudio.audio_url || "#"}" download>${t("audio.download")}</a>
    </div>
  `;

  document.getElementById("regenerate-audio")?.addEventListener("click", () => {
    state.generatedAudio = null;
    renderAudio();
    renderAudioFiles();
    document.getElementById("audio-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderImages() {
  const grid = document.getElementById("image-grid");
  if (!grid) return;
  grid.innerHTML = state.images
    .map(
      (image) => `
        <div class="image-item">
          <img src="${image.url}" alt="${image.name}">
          <div class="image-controls">
            <button class="outline-button" type="button" data-move="${image.id}" data-dir="-1">←</button>
            <button class="outline-button" type="button" data-move="${image.id}" data-dir="1">→</button>
            <button class="button" type="button" data-remove="${image.id}">×</button>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderAudioFiles() {
  const list = document.getElementById("audio-file-list");
  if (!list) return;
  list.innerHTML = state.audioFiles
    .map(
      (item) => `
        <div class="audio-file-item ${state.generatedAudio?.audio_url === item.url ? "is-selected" : ""}">
          <div class="audio-file-icon">♪</div>
          <div class="audio-file-main">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${item.size ? formatFileSize(item.size) : t("audio.ready")}</span>
          </div>
          <button class="outline-button audio-use-button" type="button" data-use-audio="${escapeHtml(item.id)}">${t("audio.use")}</button>
          <a class="ghost-button audio-use-button" href="${item.download_url || item.url}" download>${t("audio.downloadShort")}</a>
        </div>
      `,
    )
    .join("");
}

async function importAudioFiles(files) {
  const audioFiles = files.filter((file) => file.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(file.name));
  if (!audioFiles.length) return;
  const result = await api.importGeneratedFiles(audioFiles);
  const items = (result.items || []).filter((item) => item.type === "audio");
  state.audioFiles = [...items, ...state.audioFiles].slice(0, 12);
  if (!state.generatedAudio && items[0]) {
    state.generatedAudio = normalizeGeneratedItem(items[0]);
    renderAudio();
  }
  renderAudioFiles();
}

function renderVideoResult(result) {
  const target = document.getElementById("video-result");
  if (!target) return;
  toggleHidden(target, false);
  target.innerHTML = `
    <div class="content-card is-active">
      <div class="heading" style="font-size:1.25rem;margin-bottom:0.25rem;">${t("video.ready")}</div>
      <div class="muted">${formatTranslation("video.export", { slides: result.slides, format: result.format.toUpperCase() })} • ${escapeHtml(result.aspect_ratio || "16:9")}</div>
      ${
        result.video_url
          ? `<video class="video-preview" controls src="${result.video_url}"></video>`
          : ""
      }
      <div class="button-row" style="margin-top:1rem;">
        <a class="button" href="${result.download_url || result.video_url || "#"}" download>${t("video.download")}</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initI18n({
    onChange: () => {
      renderAudio();
      if (state.lastVideoResult) renderVideoResult(state.lastVideoResult);
      renderAudioFiles();
      renderProfileMenu();
    },
  });
  renderVoiceOptions();
  syncSelectedVoice();
  syncRangeValues();
  loadVoices();
  renderAudio();
  renderAudioFiles();
  renderImages();
  renderProfileMenu();
  initNavSectionHighlight();

  document.getElementById("profile-toggle")?.addEventListener("click", () => {
    state.profileOpen = !state.profileOpen;
    toggleHidden(document.getElementById("profile-dropdown"), !state.profileOpen);
    document.getElementById("profile-toggle")?.classList.toggle("is-active", state.profileOpen);
  });

  document.getElementById("profile-language-toggle")?.addEventListener("click", () => {
    setCurrentLanguage(getCurrentLanguage() === "uk" ? "en" : "uk");
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".profile-menu")) return;
    state.profileOpen = false;
    toggleHidden(document.getElementById("profile-dropdown"), true);
    document.getElementById("profile-toggle")?.classList.remove("is-active");
  });

  document.getElementById("voice-options")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-voice-id]");
    if (!target) return;
    const voice = state.voices.find((item) => item.id === target.dataset.voiceId);
    if (!voice) return;
    state.selectedVoice = voice;
    syncSelectedVoice();
    renderVoiceOptions();
  });

  document.querySelectorAll(".range-field input").forEach((input) => {
    input.addEventListener("input", syncRangeValues);
  });

  document.getElementById("translate-en")?.addEventListener("click", async (event) => {
    event.currentTarget.classList.add("is-active");
    const textarea = document.getElementById("script-text");
    const result = await api.translate({ text: textarea.value, direction: "toEN" });
    textarea.value = result.text;
  });

  document.getElementById("translate-ua")?.addEventListener("click", async (event) => {
    event.currentTarget.classList.add("is-active");
    const textarea = document.getElementById("script-text");
    const result = await api.translate({ text: textarea.value, direction: "toUA" });
    textarea.value = result.text;
  });

  document.getElementById("text-file-input")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadButton = document.querySelector(".file-upload-button");
    const textarea = document.getElementById("script-text");
    if (!textarea) return;

    uploadButton?.classList.add("is-active");
    try {
      textarea.value = await file.text();
      textarea.focus();
    } catch (error) {
      console.error("Failed to read text file", error);
    } finally {
      event.target.value = "";
      setTimeout(() => uploadButton?.classList.remove("is-active"), 700);
    }
  });

  document.getElementById("generate-audio")?.addEventListener("click", async (event) => {
    const text = document.getElementById("script-text")?.value.trim();
    if (!text) return;
    const button = event.currentTarget;
    const previousLabel = button.textContent;
    button.classList.add("is-active");
    button.disabled = true;
    button.textContent = t("audio.generating");
    try {
      state.generatedAudio = await api.generateAudio({
        text,
        voice_id: state.selectedVoice.id,
        voice: state.selectedVoice,
        ...getVoiceSettings(),
      });
      state.audioFiles = [audioItemFromGeneratedAudio(state.generatedAudio), ...state.audioFiles].slice(0, 12);
      renderAudio();
      renderAudioFiles();
      document.getElementById("audio-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Failed to generate audio", error);
      alert(error.message || "Failed to generate audio");
    } finally {
      button.classList.remove("is-active");
      button.disabled = false;
      button.textContent = previousLabel;
    }
  });

  document.getElementById("audio-input")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    const zone = document.querySelector(".audio-upload-zone");
    zone?.classList.add("is-active");
    try {
      await importAudioFiles(files);
    } catch (error) {
      console.error("Failed to upload audio files", error);
      alert(error.message || "Failed to upload audio files");
    } finally {
      event.target.value = "";
      setTimeout(() => zone?.classList.remove("is-active"), 700);
    }
  });

  document.querySelector(".audio-upload-zone")?.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over", "is-active");
  });

  document.querySelector(".audio-upload-zone")?.addEventListener("dragleave", (event) => {
    event.currentTarget.classList.remove("drag-over");
  });

  document.querySelector(".audio-upload-zone")?.addEventListener("drop", async (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
    event.currentTarget.classList.add("is-active");
    const files = Array.from(event.dataTransfer?.files || []);
    try {
      await importAudioFiles(files);
    } catch (error) {
      console.error("Failed to upload audio files", error);
      alert(error.message || "Failed to upload audio files");
    }
  });

  document.getElementById("audio-file-list")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-use-audio]");
    if (!target) return;
    const item = state.audioFiles.find((file) => file.id === target.dataset.useAudio);
    if (!item) return;
    state.generatedAudio = normalizeGeneratedItem(item);
    renderAudio();
    renderAudioFiles();
  });

  document.getElementById("image-input")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    document.querySelector(".image-upload-zone")?.classList.add("is-active");
    const uploaded = await api.uploadImages(files);
    state.images = [...state.images, ...uploaded];
    renderImages();
  });

  document.querySelector(".image-upload-zone")?.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over", "is-active");
  });

  document.querySelector(".image-upload-zone")?.addEventListener("dragleave", (event) => {
    event.currentTarget.classList.remove("drag-over");
  });

  document.querySelector(".image-upload-zone")?.addEventListener("click", (event) => {
    event.currentTarget.classList.add("is-active");
  });

  document.querySelector(".image-upload-zone")?.addEventListener("drop", async (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
    event.currentTarget.classList.add("is-active");
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length) return;
    const uploaded = await api.uploadImages(files);
    state.images = [...state.images, ...uploaded];
    renderImages();
  });

  document.getElementById("image-grid")?.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      state.images = state.images.filter((item) => item.id !== removeBtn.dataset.remove);
      renderImages();
      return;
    }
    const moveBtn = event.target.closest("[data-move]");
    if (!moveBtn) return;
    const id = moveBtn.dataset.move;
    const dir = Number(moveBtn.dataset.dir);
    const index = state.images.findIndex((item) => item.id === id);
    if (index < 0) return;
    const next = [...state.images];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    state.images = next;
    renderImages();
  });

  document.getElementById("compose-video")?.addEventListener("click", async (event) => {
    if (!state.generatedAudio || !state.images.length) return;
    const button = event.currentTarget;
    const previousLabel = button.textContent;
    button.classList.add("is-active");
    button.disabled = true;
    button.textContent = t("video.creating");
    try {
      const result = await api.composeVideo({
        images: state.images,
        audio: state.generatedAudio,
        audio_url: state.generatedAudio.audio_url,
        aspect_ratio: document.getElementById("video-aspect-ratio")?.value || "16:9",
        fit: document.getElementById("video-fit")?.value || "cover",
        format: "mp4",
      });
      state.lastVideoResult = result;
      renderVideoResult(result);
    } catch (error) {
      console.error("Failed to compose video", error);
      alert(error.message || "Failed to compose video");
    } finally {
      button.classList.remove("is-active");
      button.disabled = false;
      button.textContent = previousLabel;
    }
  });

});

