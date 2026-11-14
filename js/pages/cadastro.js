function showNotice(el, message, ok) {
  el.hidden = false;
  el.className = `notice ${ok ? "notice-ok" : "notice-err"}`;
  el.textContent = message;
}

function switchTab(tab) {
  document.getElementById("form-cadastro").hidden = tab !== "cadastro";
  document.getElementById("form-login").hidden = tab !== "login";
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.tab === tab));
    button.classList.toggle("btn-gold", button.dataset.tab === tab);
    button.classList.toggle("btn-ghost", button.dataset.tab !== tab);
  });
}

async function registerWithServer(payload, password) {
  await PhytonAPI.probe();
  if (!PhytonAPI.runtime?.ok) {
    Store.register(payload);
    return { local: true, server: false };
  }
  const server = await PhytonAPI.syncMatricula({ ...payload, password });
  if (server?.ok) {
    PhytonAPI.rememberAuth(server);
    Store.register({ ...payload, serverId: server.id, password });
    await Store.syncProgress();
    return { local: true, server: true };
  }
  Store.register(payload);
  return { local: true, server: false, serverError: server?.errors?.join(" ") };
}

async function loginWithServer(email, password) {
  await PhytonAPI.probe();
  if (PhytonAPI.runtime?.ok) {
    const remote = await PhytonAPI.login(email, password);
    if (remote?.ok) {
      Store.applyServerSession(remote.student, remote.progress, password, remote.access_token);
      await Store.syncProgress();
      return { ok: true, source: "python" };
    }
    if (remote?.error && !remote.error.includes("não conferem")) {
      showNotice(document.getElementById("form-notice"), remote.error, false);
    }
  }
  const result = Store.login(email, password);
  if (!result.ok) return result;
  await Store.syncProgress();
  return { ok: true, source: "local" };
}

document.addEventListener("DOMContentLoaded", () => {
  const notice = document.getElementById("form-notice");
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.getElementById("form-cadastro")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password.length < 6) {
      showNotice(notice, "A senha precisa ter ao menos 6 caracteres.", false);
      return;
    }
    if (password !== confirm) {
      showNotice(notice, "A confirmação não coincide com a senha.", false);
      return;
    }
    if (!data.get("terms")) {
      showNotice(notice, "Aceite os termos locais para gravar o progresso.", false);
      return;
    }
    const payload = {
      name: String(data.get("name")),
      email: String(data.get("email")),
      password,
      levelStart: String(data.get("levelStart")),
      goal: String(data.get("goal")),
      hours: String(data.get("hours")),
    };
    const outcome = await registerWithServer(payload, password);
    const message = outcome.server
      ? "Cadastro gravado no navegador e no servidor Python. Abrindo a área do aluno…"
      : outcome.serverError
        ? `Cadastro local criado. Servidor: ${outcome.serverError}`
        : "Cadastro gravado neste navegador (API offline). Abrindo a área do aluno…";
    showNotice(notice, message, true);
    window.setTimeout(() => {
      window.location.href = Paths.page("aluno.html");
    }, 800);
  });

  document.getElementById("form-login")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const result = await loginWithServer(email, password);
    if (!result.ok) {
      showNotice(notice, result.error, false);
      return;
    }
    const suffix = result.source === "python" ? " Progresso sincronizado com o servidor." : "";
    showNotice(notice, `Entrada confirmada.${suffix}`, true);
    window.setTimeout(() => {
      window.location.href = Paths.page("aluno.html");
    }, 500);
  });

  document.getElementById("btn-guest")?.addEventListener("click", () => {
    Store.guest();
    window.location.href = Paths.page("aluno.html");
  });
});