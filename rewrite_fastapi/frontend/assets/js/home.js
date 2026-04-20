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
};

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
    <div class="content-card" style="background:color-mix(in srgb, var(--secondary) 70%, transparent); margin-bottom:1rem;">
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
      (image, index) => `
        <div class="image-item">
          <img src="${image.url}" alt="${image.name}">
          <div class="floating-order">${index + 1}</div>
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
    <div class="content-card">
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

  document.getElementById("voice-toggle")?.addEventListener("click", () => {
    state.voiceOpen = !state.voiceOpen;
    toggleHidden(document.getElementById("voice-options"), !state.voiceOpen);
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
  });

  document.getElementById("translate-en")?.addEventListener("click", async () => {
    const textarea = document.getElementById("script-text");
    const result = await api.translate({ text: textarea.value, direction: "toEN" });
    textarea.value = result.text;
  });

  document.getElementById("translate-ua")?.addEventListener("click", async () => {
    const textarea = document.getElementById("script-text");
    const result = await api.translate({ text: textarea.value, direction: "toUA" });
    textarea.value = result.text;
  });

  document.getElementById("generate-audio")?.addEventListener("click", async () => {
    const text = document.getElementById("script-text")?.value.trim();
    if (!text) return;
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

  document.getElementById("compose-video")?.addEventListener("click", async () => {
    if (!state.generatedAudio || !state.images.length) return;
    const result = await api.composeVideo({
      images: state.images,
      format: "mp4",
    });
    renderVideoResult(result);
  });
});

