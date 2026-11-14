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
          : item.type === "code_run"
            ? `<label class="field"><span>Seu código Python</span>
                <textarea name="${item.id}" rows="5" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="${item.placeholder || ""}">${item.starter || ""}</textarea>
              </label>`
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

function checkExerciseLocal(item) {
  if (item.type === "choice") {
    const selected = document.querySelector(`input[name="${item.id}"]:checked`);
    return selected && Number(selected.value) === item.answer;
  }
  const field = document.querySelector(`input[name="${item.id}"]`);
  const value = normalize(field?.value || "");
  return item.accept.some((accepted) => normalize(accepted) === value);
}

async function checkExercise(id) {
  const item = PHYTONFREE.exercises.find((exercise) => exercise.id === id);
  const feedback = document.querySelector(`[data-feedback="${id}"]`);
  const button = document.querySelector(`[data-check="${id}"]`);
  if (!item || !feedback || button?.disabled) return;

  let ok = false;
  let explain = item.explain;
  let checkedBy = "local";

  if (PhytonAPI.runtime?.ok) {
    const payload = { exercise_id: id };
    if (item.type === "code_run") {
      const field = document.querySelector(`textarea[name="${id}"]`);
      payload.source = field?.value || "";
      if (!payload.source.trim()) {
        feedback.hidden = false;
        feedback.className = "notice notice-err";
        feedback.textContent = "Escreva o código antes de enviar.";
        return;
      }
    } else if (item.type === "choice") {
      const selected = document.querySelector(`input[name="${id}"]:checked`);
      if (!selected) {
        feedback.hidden = false;
        feedback.className = "notice notice-err";
        feedback.textContent = "Escolha uma alternativa antes de enviar.";
        return;
      }
      payload.choice_index = Number(selected.value);
    } else {
      const field = document.querySelector(`input[name="${id}"]`);
      payload.value = field?.value || "";
    }
    const result = await PhytonAPI.checkExercise(payload);
    if (!result.offline) {
      ok = Boolean(result.ok);
      explain = result.explain || explain;
      checkedBy = "python";
    } else {
      ok = checkExerciseLocal(item);
    }
  } else {
    ok = checkExerciseLocal(item);
  }

  feedback.hidden = false;
  feedback.className = `notice ${ok ? "notice-ok" : "notice-err"}`;
  const engineNote = checkedBy === "python" ? " Corrigido pelo servidor Python." : "";
  feedback.textContent = ok ? `Correto.${engineNote} ${explain}` : `Ainda não. ${explain}`;
  if (ok) {
    Store.completeExercise(id, item.xp);
    button.disabled = true;
    button.textContent = "Já resolvida";
  }
}

function mountSandbox() {
  const host = document.getElementById("lab-sandbox");
  if (!host) return;
  const input = document.getElementById("sandbox-code");
  const out = document.getElementById("sandbox-out");
  const runBtn = document.getElementById("sandbox-run");
  if (!input || !out || !runBtn) return;

  input.value = 'print("PhytonFree · ateliê de código")';

  async function runSandbox() {
    const source = input.value.trim();
    if (!source) return;
    out.textContent = "Executando…";
    if (PhytonAPI.runtime?.ok) {
      const result = await PhytonAPI.run(source, { repl: false });
      out.textContent = result.ok
        ? result.stdout || "(sem saída)"
        : result.error || result.stderr || result.stdout || "Erro ao executar.";
      return;
    }
    if (typeof Sk === "undefined") {
      out.textContent = "API offline e Skulpt não carregado. Inicie npm run api ou recarregue com internet.";
      return;
    }
    out.textContent = "";
    Sk.configure({
      output: (text) => {
        out.textContent += text;
      },
      read: (filename) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[filename] === undefined) {
          throw new Error(`File not found: '${filename}'`);
        }
        return Sk.builtinFiles.files[filename];
      },
    });
    try {
      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("sandbox", false, source, true));
      if (!out.textContent.trim()) out.textContent = "(sem saída)";
    } catch (error) {
      out.textContent = String(error).replace(/^Error:\s*/i, "");
    }
  }

  runBtn.addEventListener("click", runSandbox);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      runSandbox();
    }
  });
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
  window.addEventListener("phytonfree:runtime", mountSandbox);
  mountSandbox();
});