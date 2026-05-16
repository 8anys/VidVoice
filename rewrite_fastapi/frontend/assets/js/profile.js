import { api, setAuthToken } from "./api.js";
import { initI18n, setYear } from "./common.js?v=theme-2";

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

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  initI18n();
  let profile;
  try {
    profile = await api.getProfile();
  } catch (error) {
    window.location.href = "/auth";
    return;
  }

  document.getElementById("profile-name").textContent = profile.full_name || "User";
  document.getElementById("profile-email").textContent = profile.email || "";
  document.getElementById("member-since").textContent = profile.created_date
    ? new Date(profile.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "-";
  document.getElementById("name-input").value = profile.full_name || "";
  document.getElementById("profile-avatar-large").textContent = getInitials(profile.full_name || "", profile.email || "");
  document.getElementById("profile-projects-count").textContent = profile.stats?.projects ?? 0;
  document.getElementById("profile-audio-count").textContent = profile.stats?.audio_generated ?? 0;
  document.getElementById("profile-video-count").textContent = profile.stats?.videos_generated ?? 0;
  document.getElementById("profile-credits-used").textContent = Number(profile.stats?.credits_used ?? 0).toLocaleString("en-US");

  document.getElementById("save-profile")?.addEventListener("click", async () => {
    const full_name = document.getElementById("name-input").value;
    const updated = await api.updateProfile({ full_name });
    document.getElementById("profile-name").textContent = updated.full_name || "User";
    document.getElementById("profile-avatar-large").textContent = getInitials(updated.full_name || "", updated.email || profile.email || "");
  });

  document.getElementById("logout-profile")?.addEventListener("click", () => {
    setAuthToken("");
    window.location.href = "/auth";
  });
});
