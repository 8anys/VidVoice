import { api } from "./api.js";
import { formatTranslation, initI18n, setYear, t, toggleHidden } from "./common.js?v=theme-2";

let projects = [];
let editingProjectId = null;

function label(en, uk) {
  return document.documentElement.lang === "uk" ? uk : en;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function filteredProjects() {
  const query = document.getElementById("project-search")?.value.toLowerCase().trim() || "";
  if (!query) return projects;
  return projects.filter((project) => project.name.toLowerCase().includes(query));
}

function renderProjects(items = filteredProjects()) {
  const list = document.getElementById("projects-list");
  if (!items.length) {
    list.innerHTML = `<div class="page-card empty-state">${t("projects.empty", "No projects yet.")}</div>`;
    return;
  }
  list.innerHTML = items
    .map(
      (project) => `
        <div class="project-item page-card" data-project-id="${escapeHtml(project.id)}">
          <div class="icon-box project-folder" style="width:2.5rem;height:2.5rem;">📁</div>
          <div>
            <div class="inline-row" style="margin-bottom:0.5rem;">
              <strong>${escapeHtml(project.name)}</strong>
              <span class="pill ${escapeHtml(project.status)}">${t(`status.${project.status}`, project.status.replace("_", " "))}</span>
            </div>
            <div class="project-meta">
              <span>${escapeHtml(project.language)}</span>
              <span>${formatTranslation("projects.scenes", { count: project.scenes })}</span>
              <span>${formatTranslation("projects.created", { date: project.created })}</span>
              <span>${formatTranslation("projects.updated", { date: project.updated })}</span>
            </div>
          </div>
          <div class="project-actions">
            <button class="outline-button" type="button" data-open-project="${escapeHtml(project.id)}">${label("Open", "Відкрити")}</button>
            <button class="outline-button" type="button" data-edit-project="${escapeHtml(project.id)}">${label("Edit", "Редагувати")}</button>
            <button class="outline-button danger-button" type="button" data-delete-project="${escapeHtml(project.id)}">${label("Delete", "Видалити")}</button>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadProjects() {
  try {
    projects = await api.getProjects();
    renderProjects();
  } catch (error) {
    window.location.href = "/auth";
  }
}

function projectPayload() {
  return {
    name: document.getElementById("project-name-input").value,
    description: document.getElementById("project-description-input").value,
    language: document.getElementById("project-language-input").value,
    scenes: Number(document.getElementById("project-scenes-input").value || 1),
    status: document.getElementById("project-status-input").value,
  };
}

function openProjectModal(project = null) {
  editingProjectId = project?.id || null;
  document.getElementById("project-modal-title").textContent = project ? label("Edit project", "Редагування проєкту") : label("New project", "Новий проєкт");
  document.getElementById("project-modal-kicker").textContent = project ? label("Project settings", "Налаштування проєкту") : t("projects.account", "Account");
  document.getElementById("project-name-input").value = project?.name || t("projects.newName", "New project");
  document.getElementById("project-description-input").value = project?.description || "";
  document.getElementById("project-language-input").value = project?.language || "EN";
  document.getElementById("project-scenes-input").value = project?.scenes || 4;
  document.getElementById("project-status-input").value = project?.status || "draft";
  toggleHidden(document.getElementById("project-open-workspace"), !project);
  document.getElementById("project-form-message").textContent = "";
  toggleHidden(document.getElementById("project-modal"), false);
  document.getElementById("project-name-input").focus();
}

function closeProjectModal() {
  toggleHidden(document.getElementById("project-modal"), true);
  editingProjectId = null;
}

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  initI18n({
    onChange: () => renderProjects(),
  });
  await loadProjects();

  document.getElementById("project-search")?.addEventListener("input", () => renderProjects());

  document.getElementById("new-project")?.addEventListener("click", () => openProjectModal());

  document.querySelectorAll("[data-project-close]").forEach((item) => {
    item.addEventListener("click", closeProjectModal);
  });

  document.getElementById("project-save")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const previousLabel = button.textContent;
    button.disabled = true;
    button.textContent = t("common.saving", "Saving...");
    try {
      if (editingProjectId) {
        await api.updateProject(editingProjectId, projectPayload());
      } else {
        await api.createProject(projectPayload());
      }
      closeProjectModal();
      await loadProjects();
    } catch (error) {
      document.getElementById("project-form-message").textContent = error.message || "Project save failed.";
    } finally {
      button.disabled = false;
      button.textContent = previousLabel;
    }
  });

  document.getElementById("project-open-workspace")?.addEventListener("click", () => {
    if (!editingProjectId) return;
    window.location.href = `/#audio-editor?project=${encodeURIComponent(editingProjectId)}`;
  });

  document.getElementById("projects-list")?.addEventListener("click", async (event) => {
    const openButton = event.target.closest("[data-open-project]");
    if (openButton) {
      const project = projects.find((item) => item.id === openButton.dataset.openProject);
      if (project) openProjectModal(project);
      return;
    }

    const editButton = event.target.closest("[data-edit-project]");
    if (editButton) {
      const project = projects.find((item) => item.id === editButton.dataset.editProject);
      if (project) openProjectModal(project);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-project]");
    if (!deleteButton) return;
    const project = projects.find((item) => item.id === deleteButton.dataset.deleteProject);
    if (!project) return;
    if (!confirm(`${label("Delete", "Видалити")} "${project.name}"?`)) return;
    await api.deleteProject(project.id);
    await loadProjects();
  });
});
