document.addEventListener("DOMContentLoaded", () => {
  const state = Store.read();
  const stats = derive(state);
  document.getElementById("curve").style.setProperty("--curve", String(stats.percent));
  document.getElementById("curve-label").textContent = `${stats.percent}% da trilha`;
  document.getElementById("curve-copy").textContent = stats.percent < 25
    ? "A base ainda está sendo traçada: variáveis, tipos e o hábito de ler o próprio código."
    : stats.percent < 60
      ? "A curva sobe: funções, coleções e o primeiro desenho de um programa com partes."
      : stats.percent < 90
        ? "O traço já é de quem orquestra objetos, erros e qualidade."
        : "A conclusão está à vista: feche o projeto final e revise a trilha como autora.";

  const points = [
    { cx: 40, cy: 210, on: stats.percent >= 5 },
    { cx: 150, cy: 176, on: stats.percent >= 20 },
    { cx: 270, cy: 150, on: stats.percent >= 40 },
    { cx: 400, cy: 112, on: stats.percent >= 60 },
    { cx: 530, cy: 78, on: stats.percent >= 80 },
    { cx: 660, cy: 42, on: stats.percent >= 95 },
  ];
  document.getElementById("curve-nodes").innerHTML = points.map((point) => `
    <circle class="node ${point.on ? "is-on" : ""}" cx="${point.cx}" cy="${point.cy}" r="8"></circle>
  `).join("");

  document.getElementById("skill-bars").innerHTML = PHYTONFREE.modules.map((mod) => {
    const ids = PHYTONFREE.lessons.filter((lesson) => lesson.module === mod.id).map((lesson) => lesson.id);
    const value = Math.round((ids.filter((id) => state.progress.completedLessons.includes(id)).length / ids.length) * 100);
    return `
      <div>
        <p><strong>${mod.title}</strong> <span class="caption">${value}%</span></p>
        <div class="progress"><span style="--value:${value}%"></span></div>
      </div>
    `;
  }).join("");

  document.getElementById("history").innerHTML = PHYTONFREE.lessons.map((lesson) => {
    const done = state.progress.completedLessons.includes(lesson.id);
    return `
      <article class="timeline-item ${done ? "is-done" : ""}">
        <div>
          <p class="kicker">${lesson.level}</p>
          <h3>${lesson.title}</h3>
          <p class="legend">${done ? "Concluída — o nó na curva já acendeu." : "Ainda em aberto nesta trilha."}</p>
        </div>
      </article>
    `;
  }).join("");
});
