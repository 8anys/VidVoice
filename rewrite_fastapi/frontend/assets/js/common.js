export function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

export function toggleHidden(element, hidden) {
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

export function createWaveMarkup(progress = 32) {
  return Array.from({ length: 60 })
    .map((_, index) => {
      const active = (index / 60) * 100 < progress ? "active" : "";
      const height = Math.sin(index * 0.35) * 45 + 50;
      return `<span class="${active}" style="height:${height}%"></span>`;
    })
    .join("");
}

