import { api, setAuthToken } from "./api.js";
import { initI18n, setYear, toggleHidden } from "./common.js?v=theme-2";

let mode = "login";

function syncMode() {
  document.getElementById("login-tab")?.classList.toggle("is-active", mode === "login");
  document.getElementById("register-tab")?.classList.toggle("is-active", mode === "register");
  toggleHidden(document.getElementById("auth-name"), mode !== "register");
  document.querySelector("[data-auth-title]").textContent = mode === "login" ? "Sign in" : "Create account";
  document.querySelector("[data-auth-copy]").textContent =
    mode === "login" ? "Use your account to save projects and profile data." : "Create an account for VidVoice projects.";
  document.getElementById("auth-submit").textContent = mode === "login" ? "Login" : "Register";
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initI18n();
  syncMode();

  document.getElementById("login-tab")?.addEventListener("click", () => {
    mode = "login";
    syncMode();
  });

  document.getElementById("register-tab")?.addEventListener("click", () => {
    mode = "register";
    syncMode();
  });

  document.getElementById("auth-submit")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const message = document.getElementById("auth-message");
    const payload = {
      full_name: document.getElementById("auth-name")?.value || "",
      email: document.getElementById("auth-email")?.value || "",
      password: document.getElementById("auth-password")?.value || "",
    };
    const previousLabel = button.textContent;
    button.disabled = true;
    button.textContent = mode === "login" ? "Signing in..." : "Creating...";
    message.textContent = "";
    try {
      const result = mode === "login" ? await api.login(payload) : await api.register(payload);
      setAuthToken(result.token);
      window.location.href = "/profile";
    } catch (error) {
      message.textContent = error.message || "Authentication failed.";
    } finally {
      button.disabled = false;
      button.textContent = previousLabel;
    }
  });
});
