function lessonFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("aula");
  const state = Store.read();
  return PHYTONFREE.lessons.find((item) => item.id === requested)
    || PHYTONFREE.lessons.find((item) => item.id === state.progress.currentLessonId)
    || PHYTONFREE.lessons[0];
}

function renderClassroom(lesson) {
  const state = Store.read();
  const done = state.progress.completedLessons.includes(lesson.id);
  const index = PHYTONFREE.lessons.findIndex((item) => item.id === lesson.id);
  const prev = PHYTONFREE.lessons[index - 1];
  const next = PHYTONFREE.lessons[index + 1];

  document.getElementById("lesson-kicker").textContent = `${lesson.level} · ${PHYTONFREE.modules.find((mod) => mod.id === lesson.module).title}`;
  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-notes").textContent = lesson.notes;
  document.getElementById("lesson-meta").textContent = `${lesson.minutes} min · aula ${index + 1} de ${PHYTONFREE.lessons.length}`;
  document.getElementById("player").src = `https://www.youtube-nocookie.com/embed/${lesson.video}?rel=0`;
  document.getElementById("mark-done").disabled = done;
  document.getElementById("mark-done").textContent = done ? "Aula concluída" : "Marcar como concluída";
  const prevLink = document.getElementById("prev-lesson");
  prevLink.href = prev ? `${Paths.page("sala.html")}?aula=${prev.id}` : `${Paths.page("sala.html")}?aula=l01`;
  prevLink.hidden = !prev;
  document.getElementById("next-lesson").href = next ? `${Paths.page("sala.html")}?aula=${next.id}` : Paths.page("evolucao.html");
  document.getElementById("next-lesson").textContent = next ? "Próxima aula" : "Ver curva final";

  document.getElementById("lesson-list").innerHTML = PHYTONFREE.lessons.map((item, itemIndex) => {
    const complete = state.progress.completedLessons.includes(item.id);
    return `
      <a class="lesson ${item.id === lesson.id ? "is-active" : ""}" href="${Paths.page("sala.html")}?aula=${item.id}">
        <span class="badge ${complete ? "badge-gold" : ""}">${String(itemIndex + 1).padStart(2, "0")}</span>
        <span>
          <strong>${item.title}</strong>
          <small class="caption">${item.level} · ${item.minutes} min</small>
        </span>
        <span>${complete ? "●" : "○"}</span>
      </a>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const lesson = lessonFromQuery();
  Store.setCurrentLesson(lesson.id);
  renderClassroom(lesson);
  document.getElementById("mark-done").addEventListener("click", () => {
    Store.completeLesson(lesson.id);
    renderClassroom(lesson);
  });
});
