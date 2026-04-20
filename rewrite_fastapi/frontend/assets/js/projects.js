import { api } from "./api.js";
import { setYear } from "./common.js";

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
              <span class="pill ${project.status}">${project.status.replace("_", " ")}</span>
            </div>
            <div class="project-meta">
              <span>${project.language}</span>
              <span>${project.scenes} scenes</span>
              <span>Created: ${project.created}</span>
              <span>Updated: ${project.updated}</span>
            </div>
          </div>
          <button class="outline-button" type="button">Open</button>
        </div>
      `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  let projects = await api.getProjects();
  renderProjects(projects);

  document.getElementById("project-search")?.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = projects.filter((project) => project.name.toLowerCase().includes(query));
    renderProjects(filtered);
  });

  document.getElementById("new-project")?.addEventListener("click", async () => {
    await api.createProject({ name: "New Project", language: "EN", scenes: 4 });
    projects = await api.getProjects();
    renderProjects(projects);
  });
});

