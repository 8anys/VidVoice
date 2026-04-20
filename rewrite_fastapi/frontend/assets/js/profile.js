import { api } from "./api.js";
import { setYear } from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  const profile = await api.getProfile();

  document.getElementById("profile-name").textContent = profile.full_name || "User";
  document.getElementById("profile-email").textContent = profile.email || "";
  document.getElementById("member-since").textContent = profile.created_date ? new Date(profile.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  document.getElementById("name-input").value = profile.full_name || "";

  document.getElementById("save-profile")?.addEventListener("click", async () => {
    const full_name = document.getElementById("name-input").value;
    const updated = await api.updateProfile({ full_name });
    document.getElementById("profile-name").textContent = updated.full_name;
  });
});

