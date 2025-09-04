// Salvar agendamento no localStorage
const form = document.getElementById("agendamentoForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const agendamento = {
      nome: document.getElementById("nome").value,
      equipamento: document.getElementById("equipamento").value,
      quantidade: document.getElementById("quantidade").value,
      local: document.getElementById("local").value,
      data: document.getElementById("data").value,
      horaInicio: document.getElementById("horaInicio").value,
      horaFim: document.getElementById("horaFim").value,
      status: "ATIVO"
    };

    // pega agendamentos existentes
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos.push(agendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    // redireciona para a tela de listagem
    window.location.href = "agd.html";
  });
}

// Carregar agendamentos na página de listagem
const cardsContainer = document.getElementById("cards");
if (cardsContainer) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

  agendamentos.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-header">
        <strong>Professor(a) ${item.nome}</strong>
        <span class="status">${item.status}</span>
      </div>
      <p><b>${item.equipamento}</b></p>
      <p>${item.quantidade} unidade(s)</p>
      <p>📍 ${item.local}</p>
      <p>📅 ${item.data}</p>
      <p>⏰ ${item.horaInicio} - ${item.horaFim}</p>
    `;

    cardsContainer.appendChild(card);
  });
}
