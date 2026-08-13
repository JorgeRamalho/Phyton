function topicFromQuery() {
  const id = new URLSearchParams(window.location.search).get("tema");
  return PHYTONFREE_DOCS.find((item) => item.id === id) || PHYTONFREE_DOCS[0];
}

function renderDocs(topic) {
  const index = PHYTONFREE_DOCS.findIndex((item) => item.id === topic.id);
  const prev = PHYTONFREE_DOCS[index - 1];
  const next = PHYTONFREE_DOCS[index + 1];

  document.getElementById("doc-kicker").textContent = `${topic.level} · ${index + 1} de ${PHYTONFREE_DOCS.length}`;
  document.getElementById("doc-title").textContent = topic.title;
  document.getElementById("doc-lead").textContent = topic.lead;
  document.getElementById("doc-body").textContent = topic.body;
  document.getElementById("doc-code").textContent = topic.code;
  const official = document.getElementById("doc-official");
  official.href = topic.official;
  official.textContent = "Abrir na documentação oficial";

  const prevLink = document.getElementById("prev-doc");
  const nextLink = document.getElementById("next-doc");
  prevLink.hidden = !prev;
  prevLink.href = prev ? `${Paths.page("docs.html")}?tema=${prev.id}` : Paths.page("docs.html");
  nextLink.href = next ? `${Paths.page("docs.html")}?tema=${next.id}` : Paths.page("exercicios.html");
  nextLink.textContent = next ? "Próximo tema" : "Ir aos exercícios";

  document.getElementById("doc-toc").innerHTML = PHYTONFREE_DOCS.map((item, itemIndex) => `
    <a class="lesson ${item.id === topic.id ? "is-active" : ""}" href="${Paths.page("docs.html")}?tema=${item.id}">
      <span class="badge">${String(itemIndex + 1).padStart(2, "0")}</span>
      <span>
        <strong>${item.title}</strong>
        <small class="caption">${item.level}</small>
      </span>
    </a>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderDocs(topicFromQuery());
});
