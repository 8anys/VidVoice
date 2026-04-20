import { api } from "./api.js";
import { setYear } from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  const credits = await api.getCredits();
  const pct = Math.round((credits.used / credits.total) * 100);

  document.getElementById("credits-pct").textContent = `${pct}%`;
  document.getElementById("credits-used").textContent = credits.used.toLocaleString();
  document.getElementById("credits-left").textContent = (credits.total - credits.used).toLocaleString();
  document.getElementById("credits-total").textContent = credits.total.toLocaleString();
  document.getElementById("credits-fill").style.width = `${pct}%`;

  document.getElementById("credits-history").innerHTML = credits.history
    .map(
      (item, index) => `
        <div style="display:flex;align-items:flex-end;gap:0.35rem;">
          <div style="width:2rem;height:${Math.max(32, item.chars / 100)}px;background:${index === credits.history.length - 1 ? "var(--primary)" : "color-mix(in srgb, var(--primary) 40%, transparent)"};border-radius:0.5rem 0.5rem 0 0;"></div>
          <span class="muted">${item.month}</span>
        </div>
      `,
    )
    .join("");
});

