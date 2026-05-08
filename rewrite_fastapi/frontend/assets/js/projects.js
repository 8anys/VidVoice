import { api } from "./api.js";
import { formatTranslation, initI18n, setYear, t } from "./common.js?v=theme-2";

function renderProjects(projects) {
  const list = document.getElementById("projects-list");
  list.innerHTML = projects
    .map(
      (project) => `
        <div class="project-item page-card">
          <div class="icon-box" style="width:2.5rem;height:2.5rem;">📁</div>
          <div>
            <div class="inline-row" style="margin-bottom:0.5rem;">
              <strong>${project.name}</strong>
              <span class="pill ${project.status}">${t(`status.${project.status}`, project.status.replace("_", " "))}</span>
            </div>
            <div class="project-meta">
              <span>${project.language}</span>
              <span>${formatTranslation("projects.scenes", { count: project.scenes })}</span>
              <span>${formatTranslation("projects.created", { date: project.created })}</span>
              <span>${formatTranslation("projects.updated", { date: project.updated })}</span>
            </div>
          </div>
          <button class="outline-button" type="button">${t("common.open")}</button>
        </div>
      `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  let projects = [];
  initI18n({
    onChange: () => renderProjects(projects),
  });
  projects = await api.getProjects();
  renderProjects(projects);

  document.getElementById("project-search")?.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = projects.filter((project) => project.name.toLowerCase().includes(query));
    renderProjects(filtered);
  });

  document.getElementById("new-project")?.addEventListener("click", async () => {
    await api.createProject({ name: t("projects.newName"), language: "EN", scenes: 4 });
    projects = await api.getProjects();
    renderProjects(projects);
  });
});

