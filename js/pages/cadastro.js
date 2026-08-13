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

document.addEventListener("DOMContentLoaded", () => {
  const notice = document.getElementById("form-notice");
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.getElementById("form-cadastro")?.addEventListener("submit", (event) => {
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
      showNotice(notice, "Aceite os termos locais para gravar o progresso neste navegador.", false);
      return;
    }
    Store.register({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password,
      levelStart: String(data.get("levelStart")),
      goal: String(data.get("goal")),
      hours: String(data.get("hours")),
    });
    showNotice(notice, "Cadastro gravado neste navegador. Abrindo a área do aluno…", true);
    window.setTimeout(() => {
      window.location.href = Paths.page("aluno.html");
    }, 700);
  });

  document.getElementById("form-login")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const result = Store.login(String(data.get("email")), String(data.get("password")));
    if (!result.ok) {
      showNotice(notice, result.error, false);
      return;
    }
    window.location.href = Paths.page("aluno.html");
  });

  document.getElementById("btn-guest")?.addEventListener("click", () => {
    Store.guest();
    window.location.href = Paths.page("aluno.html");
  });
});
