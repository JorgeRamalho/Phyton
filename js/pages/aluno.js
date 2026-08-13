function requireStudent() {
  const state = Store.read();
  if (!state.student) {
    window.location.href = Paths.page("cadastro.html");
    return null;
  }
  return state;
}

document.addEventListener("DOMContentLoaded", () => {
  const state = requireStudent();
  if (!state) return;
  const stats = derive(state);
  const first = state.student.name.split(" ")[0];
  document.getElementById("aluno-hello").textContent = `Olá, ${first}.`;
  document.getElementById("aluno-goal").textContent = state.student.goal;
  document.getElementById("aluno-level").textContent = stats.level.label;
  document.getElementById("aluno-xp").textContent = `${state.progress.xp} XP`;
  document.getElementById("aluno-percent").textContent = `${stats.percent}%`;
  document.getElementById("aluno-ring").style.setProperty("--ring", `${stats.percent}%`);
  document.getElementById("aluno-ring").dataset.label = `${stats.percent}%`;
  document.getElementById("continue-title").textContent = stats.current.title;
  document.getElementById("continue-link").href = `${Paths.page("sala.html")}?aula=${stats.current.id}`;
  document.getElementById("aluno-bar").style.setProperty("--value", `${stats.percent}%`);

  const nextExercises = PHYTONFREE.exercises
    .filter((item) => !state.progress.completedExercises.includes(item.id))
    .slice(0, 3);
  document.getElementById("next-exercises").innerHTML = nextExercises.map((item) => `
    <article class="card">
      <p class="kicker">${item.theme}</p>
      <h3>${item.title}</h3>
      <p class="legend">${item.prompt}</p>
      <p><span class="badge badge-gold">+${item.xp} XP</span></p>
      <p><a class="btn" href="${Paths.page("exercicios.html")}?atividade=${item.id}">Resolver</a></p>
    </article>
  `).join("") || `<p class="legend">Todas as atividades desta trilha já foram resolvidas.</p>`;

  document.getElementById("module-path").innerHTML = PHYTONFREE.modules.map((mod) => {
    const ids = PHYTONFREE.lessons.filter((lesson) => lesson.module === mod.id).map((lesson) => lesson.id);
    const done = ids.filter((id) => state.progress.completedLessons.includes(id)).length;
    const value = Math.round((done / ids.length) * 100);
    return `
      <article class="card path-step">
        <p class="badge">${mod.level}</p>
        <h3>${mod.title}</h3>
        <p class="caption">${done} de ${ids.length} aulas</p>
        <div class="progress" aria-hidden="true"><span style="--value:${value}%"></span></div>
      </article>
    `;
  }).join("");
});
