const STORAGE = "agendamentos";

function getStatus(data, horaFim) {
  const agora = new Date();
  const fim = new Date(`${data}T${horaFim}`);
  return agora > fim ? "Encerrado" : "Ativo";
}

function renderCard(ag) {
  const status = getStatus(ag.data, ag.horaFim);
  const statusClass = status === "Ativo" ? "tag--green" : "tag--red";

  const equips = ag.equipamentos && ag.equipamentos.length
    ? ag.equipamentos.map(e => `<div>💻 ${e.nome} — ${e.quantidade} unidade(s)</div>`).join("")
    : "<div>Nenhum equipamento</div>";

  return `
    <article class="card">
      <div class="card__head">
        <div class="card__avatar">👤</div>
        <div><strong>Professor(a) ${ag.nome}</strong></div>
        <span class="tag ${statusClass}">${status}</span>
      </div>
      <div class="card__body">
        ${equips}
        <div>📍 ${ag.sala}</div>
        <div>📅 ${ag.data}</div>
        <div>⏰ ${ag.horaInicio} - ${ag.horaFim}</div>
      </div>
    </article>
  `;
}

function renderAgenda() {
  const lista = JSON.parse(localStorage.getItem(STORAGE) || "[]");
  const container = document.querySelector("#agendaList");

  if (!lista.length) {
    container.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
    return;
  }

  container.innerHTML = lista.map(renderCard).join("");
}

renderAgenda();
