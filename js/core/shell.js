function navItems() {
  return [
    { href: Paths.page("cadastro.html"), id: "cadastro", label: "Cadastro" },
    { href: Paths.page("docs.html"), id: "docs", label: "Documentação" },
    { href: Paths.page("sala.html"), id: "sala", label: "Sala de aula" },
    { href: "https://www.python.org/downloads/", id: "download", label: "Download", external: true },
  ];
}

function pageId() {
  return document.body.dataset.page || "home";
}

function renderHeader() {
  const current = pageId();
  const state = Store.read();
  const authed = Boolean(state.student);
  return `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="${Paths.home()}" aria-label="PhytonFree, portal de estudos em Python">
          <img class="brand-mark" src="${Paths.brand("python-logo.svg")}" alt="Logo oficial do Python" width="40" height="40">
          <span class="brand-name">PHYTON<span>FREE</span></span>
        </a>
        <nav class="nav" id="menu-principal" aria-label="Principal">
          ${navItems().map((item) => `
            <a class="nav-link" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener noreferrer" title="Baixar Python no site oficial"' : ""} ${!item.external && item.id === current ? 'aria-current="page"' : ""}>${item.label}</a>
          `).join("")}
        </nav>
        <div class="header-actions">
          <a class="nav-link" href="${Paths.page("aluno.html")}" ${current === "aluno" ? 'aria-current="page"' : ""}>Área do aluno</a>
          ${authed
            ? `<a class="btn btn-gold" href="${Paths.page("aluno.html")}">${state.student.name.split(" ")[0]}</a>
               <button class="btn btn-ghost" type="button" data-logout>Sair</button>`
            : `<a class="btn-enter" href="${Paths.page("cadastro.html")}"><span>Entrar</span></a>`}
        </div>
      </div>
    </header>
  `;
}

function renderStatus() {
  const state = Store.read();
  const stats = derive(state);
  const student = state.student;
  const firstName = student ? student.name.split(" ")[0] : "Visitante";
  const items = [
    ["Aluno", firstName],
    ["Nível", stats.level.label],
    ["XP", String(state.progress.xp)],
    ["Prog.", `${stats.percent}%`],
    ["Seq.", `${state.progress.streak}d`],
    ["Mód.", `${stats.modulesDone}/${PHYTONFREE.modules.length}`],
    ["Aulas", `${stats.doneLessons}/${stats.lessons}`],
    ["Exer.", `${stats.doneExercises}/${stats.exercises}`],
    ["Tempo", `${stats.hours}h`],
    ["Liga", stats.league],
  ];
  return `
    <aside class="status-bar" aria-label="Variáveis de progresso do aluno">
      <dl class="wrap status-track">
        ${items.map(([label, value], index) => `
          <div class="status-item">
            <dt>${label}</dt>
            <dd>${index === 3 || index === 2 ? `<em>${value}</em>` : value}</dd>
          </div>
        `).join("")}
      </dl>
    </aside>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <p class="kicker">Identidade</p>
          <p class="brand-name">PHYTON<span>FREE</span></p>
          <p class="footer-copy">PhytonFree — portal de estudos em Python: do primeiro print à conclusão da trilha, com curva de aprendizado, exercícios e sala de aula em vídeo.</p>
        </div>
        <div>
          <p class="kicker">Percurso</p>
          <p><a href="${Paths.page("sala.html")}">Sala de aula</a><br><a href="${Paths.page("docs.html")}">Documentação</a><br><a href="${Paths.page("exercicios.html")}">Atividades</a><br><a href="${Paths.page("evolucao.html")}">Curva de evolução</a></p>
        </div>
        <div>
          <p class="kicker">Tipografia</p>
          <p class="legend">Fraunces nos títulos, Source Serif 4 nas legendas, Manrope no texto e IBM Plex Mono no código — uma hierarquia pensada para ler e programar.</p>
        </div>
      </div>
    </footer>
  `;
}

function mountShell() {
  const headerHost = document.getElementById("app-header");
  const statusHost = document.getElementById("status-bar");
  const footerHost = document.getElementById("app-footer");
  if (headerHost) headerHost.innerHTML = renderHeader();
  if (statusHost) statusHost.innerHTML = renderStatus();
  if (footerHost) footerHost.innerHTML = renderFooter();

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    Store.logout();
    window.location.href = Paths.home();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Store.touchStreak();
  mountShell();
});

window.addEventListener("phytonfree:update", () => mountShell());
