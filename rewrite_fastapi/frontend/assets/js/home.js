import { api } from "./api.js";
import { createWaveMarkup, setYear, toggleHidden } from "./common.js";

const voices = [
  { id: "rachel", label: "Rachel", style: "Calm & Clear" },
  { id: "clyde", label: "Clyde", style: "Strong & Warm" },
  { id: "domi", label: "Domi", style: "Confident" },
  { id: "bella", label: "Bella", style: "Soft & Natural" },
  { id: "josh", label: "Josh", style: "Deep & Steady" },
  { id: "arnold", label: "Arnold", style: "Authoritative" },
];

const state = {
  voiceOpen: false,
  selectedVoice: voices[0],
  generatedAudio: null,
  images: [],
  profileOpen: false,
};

const languageMap = { en: "EN", uk: "UK", ru: "RU" };
const themeMap = { dark: "Темна", light: "Світла", system: "Системна" };

function renderVoiceOptions() {
  const container = document.getElementById("voice-options");
  if (!container) return;
  container.innerHTML = voices
    .map(
      (voice) => `
        <button type="button" class="dropdown-item ${state.selectedVoice.id === voice.id ? "active" : ""}" data-voice-id="${voice.id}">
          <div><strong>${voice.label}</strong><div class="muted">${voice.style}</div></div>
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
    document.getElementById("profile-language-badge").textContent = languageMap[profile.language] || "EN";
    document.getElementById("profile-theme-badge").textContent = themeMap[profile.theme] || "Темна";
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
          <div><strong>${state.generatedAudio.voice.label} — ElevenLabs</strong></div>
          <div class="muted">"${(state.generatedAudio.text || "").slice(0, 60)}..."</div>
        </div>
      </div>
      <div style="width:0.5rem;height:0.5rem;border-radius:999px;background:#4ade80;"></div>
    </div>
    <div class="content-card is-active" style="background:color-mix(in srgb, var(--secondary) 70%, transparent); margin-bottom:1rem;">
      <div class="inline-row">
        <button class="button" type="button" id="toggle-play">Play</button>
        <div class="player-wave">${createWaveMarkup()}</div>
        <span class="muted">${state.generatedAudio.duration}</span>
      </div>
      <div class="progress-bar" style="margin-top:0.75rem;"><div style="width:32%"></div></div>
    </div>
    <div class="button-row">
      <button class="outline-button" type="button" id="regenerate-audio">Regenerate</button>
      <button class="button" type="button">Download Audio</button>
    </div>
  `;

  document.getElementById("regenerate-audio")?.addEventListener("click", () => {
    state.generatedAudio = null;
    renderAudio();
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

function renderVideoResult(result) {
  const target = document.getElementById("video-result");
  if (!target) return;
  toggleHidden(target, false);
  target.innerHTML = `
    <div class="content-card is-active">
      <div class="heading" style="font-size:1.25rem;margin-bottom:0.25rem;">${result.message}</div>
      <div class="muted">${result.slides} slides • ${result.format.toUpperCase()} export</div>
      <div class="button-row" style="margin-top:1rem;">
        <button class="button" type="button">Download MP4</button>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  renderVoiceOptions();
  syncSelectedVoice();
  renderAudio();
  renderImages();
  renderProfileMenu();
  initNavSectionHighlight();

  document.getElementById("voice-toggle")?.addEventListener("click", () => {
    state.voiceOpen = !state.voiceOpen;
    toggleHidden(document.getElementById("voice-options"), !state.voiceOpen);
    document.getElementById("voice-toggle")?.classList.toggle("is-active", state.voiceOpen);
  });

  document.getElementById("profile-toggle")?.addEventListener("click", () => {
    state.profileOpen = !state.profileOpen;
    toggleHidden(document.getElementById("profile-dropdown"), !state.profileOpen);
    document.getElementById("profile-toggle")?.classList.toggle("is-active", state.profileOpen);
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
    const voice = voices.find((item) => item.id === target.dataset.voiceId);
    if (!voice) return;
    state.selectedVoice = voice;
    state.voiceOpen = false;
    syncSelectedVoice();
    renderVoiceOptions();
    toggleHidden(document.getElementById("voice-options"), true);
    document.getElementById("voice-toggle")?.classList.remove("is-active");
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

  document.getElementById("generate-audio")?.addEventListener("click", async (event) => {
    const text = document.getElementById("script-text")?.value.trim();
    if (!text) return;
    event.currentTarget.classList.add("is-active");
    state.generatedAudio = await api.generateAudio({
      text,
      voice: state.selectedVoice,
    });
    renderAudio();
    document.getElementById("audio-player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("image-input")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    document.querySelector(".upload-zone")?.classList.add("is-active");
    const uploaded = await api.uploadImages(files);
    state.images = [...state.images, ...uploaded];
    renderImages();
  });

  document.querySelector(".upload-zone")?.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over", "is-active");
  });

  document.querySelector(".upload-zone")?.addEventListener("dragleave", (event) => {
    event.currentTarget.classList.remove("drag-over");
  });

  document.querySelector(".upload-zone")?.addEventListener("click", (event) => {
    event.currentTarget.classList.add("is-active");
  });

  document.querySelector(".upload-zone")?.addEventListener("drop", async (event) => {
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
    event.currentTarget.classList.add("is-active");
    const result = await api.composeVideo({
      images: state.images,
      format: "mp4",
    });
    renderVideoResult(result);
  });
});

