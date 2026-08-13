function normalize(value) {
  return value.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function renderList(filter) {
  const state = Store.read();
  const list = PHYTONFREE.exercises.filter((item) => filter === "todas" || item.level === filter);
  document.getElementById("exercise-list").innerHTML = list.map((item) => {
    const done = state.progress.completedExercises.includes(item.id);
    return `
      <article class="card" id="${item.id}">
        <p class="kicker">${item.theme} · ${item.level}</p>
        <h3>${item.title}</h3>
        <p>${item.prompt}</p>
        ${item.type === "choice"
          ? `<div class="choice-grid" role="radiogroup" aria-label="${item.title}">
              ${item.options.map((option, index) => `
                <label class="choice">
                  <input type="radio" name="${item.id}" value="${index}">
                  <span>${option}</span>
                </label>
              `).join("")}
            </div>`
          : `<label class="field"><span>Sua resposta</span>
              <input name="${item.id}" placeholder="${item.placeholder}" autocomplete="off">
            </label>`}
        <p>
          <button class="btn" type="button" data-check="${item.id}" ${done ? "disabled" : ""}>${done ? "Já resolvida" : `Enviar · +${item.xp} XP`}</button>
        </p>
        <p class="notice" hidden data-feedback="${item.id}"></p>
      </article>
    `;
  }).join("");
}

function checkExercise(id) {
  const item = PHYTONFREE.exercises.find((exercise) => exercise.id === id);
  const feedback = document.querySelector(`[data-feedback="${id}"]`);
  let ok = false;
  if (item.type === "choice") {
    const selected = document.querySelector(`input[name="${id}"]:checked`);
    ok = selected && Number(selected.value) === item.answer;
  } else {
    const field = document.querySelector(`input[name="${id}"]`);
    const value = normalize(field?.value || "");
    ok = item.accept.some((accepted) => normalize(accepted) === value);
  }
  feedback.hidden = false;
  feedback.className = `notice ${ok ? "notice-ok" : "notice-err"}`;
  feedback.textContent = ok ? `Correto. ${item.explain}` : `Ainda não. ${item.explain}`;
  if (ok) {
    Store.completeExercise(id, item.xp);
    const button = document.querySelector(`[data-check="${id}"]`);
    button.disabled = true;
    button.textContent = "Já resolvida";
  }
}

function applyFilter(filter) {
  document.querySelectorAll("[data-filter]").forEach((item) => {
    const active = item.dataset.filter === filter;
    item.classList.toggle("btn-gold", active);
    item.classList.toggle("btn-ghost", !active);
  });
  renderList(filter);
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const allowed = new Set(["todas", "iniciante", "intermediario", "avancado"]);
  const nivel = allowed.has(params.get("nivel")) ? params.get("nivel") : "todas";
  applyFilter(nivel);
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
  document.getElementById("exercise-list").addEventListener("click", (event) => {
    const id = event.target.dataset.check;
    if (id) checkExercise(id);
  });
  const focusId = params.get("atividade");
  if (focusId) {
    document.getElementById(focusId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
