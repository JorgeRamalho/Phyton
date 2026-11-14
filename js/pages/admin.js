function showAdminNotice(message, ok) {
  const el = document.getElementById("admin-notice");
  el.hidden = false;
  el.className = `notice ${ok ? "notice-ok" : "notice-err"}`;
  el.textContent = message;
}

function renderSummary(data) {
  document.getElementById("admin-stats").innerHTML = `
    <article class="card stat"><p class="kicker">Matrículas</p><strong>${data.enrollments_count}</strong></article>
    <article class="card stat"><p class="kicker">Perfis com progresso</p><strong>${data.progress_count}</strong></article>
    <article class="card stat"><p class="kicker">Motor</p><strong>${PhytonAPI.runtime?.label || "—"}</strong></article>
  `;
  document.getElementById("admin-enrollments").innerHTML = (data.enrollments || [])
    .map(
      (row) => `
      <article class="card">
        <p class="kicker">${row.level_start || "—"} · ${row.enrolled_at || ""}</p>
        <h3>${row.name}</h3>
        <p class="legend">${row.email}</p>
        <p class="caption">${[row.city, row.state].filter(Boolean).join(" — ") || "Sem local"}</p>
      </article>
    `,
    )
    .join("") || `<p class="legend">Nenhuma matrícula no servidor ainda.</p>`;
  document.getElementById("admin-progress").textContent = JSON.stringify(data.progress_by_email || {}, null, 2);
}

document.addEventListener("DOMContentLoaded", async () => {
  await PhytonAPI.probe();
  if (!PhytonAPI.runtime?.ok) {
    showAdminNotice("API offline. Execute npm run api e recarregue.", false);
    return;
  }
  const data = await PhytonAPI.adminSummary();
  if (!data.ok) {
    showAdminNotice(data.error || "Não foi possível carregar o painel.", false);
    return;
  }
  showAdminNotice("Painel carregado do servidor local.", true);
  renderSummary(data);
});