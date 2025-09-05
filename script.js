// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const form = $("#wizardForm");
const steps = [$("#step-1"), $("#step-2"), $("#step-3")];
const stepBtns = $$(".stepper__item");
let current = 0;

function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("is-visible", idx === i));
  stepBtns.forEach((b, idx) => {
    b.classList.toggle("is-current", idx === i);
    b.classList.toggle("is-done", idx < i);
    b.setAttribute("aria-selected", idx === i ? "true" : "false");
    b.tabIndex = idx === i ? 0 : -1;
  });
  current = i;
}

// ===== Step 1: Sala "Outros" =====
const salaSelect = $("#salaSelect");
const salaOutrosWrap = $("#salaOutrosWrap");
const salaDescricao = $("#salaDescricao");

salaSelect.addEventListener("change", () => {
  const isOutros = salaSelect.value === "Outros";
  salaOutrosWrap.classList.toggle("is-hidden", !isOutros);
  isOutros ? salaDescricao.setAttribute("required", "required")
           : salaDescricao.removeAttribute("required");
});

// ===== Navegação =====
function validateStep1() {
  const required = [
    $("#nomeCompleto"),
    $("#data"),
    $("#horaInicio"),
    $("#horaFim"),
    $("#salaSelect"),
    ...(salaSelect.value === "Outros" ? [$("#salaDescricao")] : [])
  ];

  for (const el of required) {
    if (!el.value) {
      el.reportValidity?.();
      el.focus();
      return false;
    }
  }
  // checa horário
  const ini = $("#horaInicio").value;
  const fim = $("#horaFim").value;
  if (ini && fim && ini >= fim) {
    alert("A hora de término deve ser maior que a hora de início.");
    $("#horaFim").focus();
    return false;
  }
  return true;
}

function hydrateEquipAvailability() {
  $("#avData").textContent = $("#data").value || "—";
  $("#avIni").textContent = $("#horaInicio").value || "—";
  $("#avFim").textContent = $("#horaFim").value || "—";
}

function fillReview() {
  $("#rvNome").textContent = $("#nomeCompleto").value || "—";
  const salaVal = salaSelect.value === "Outros"
    ? `Outros (${salaDescricao.value})` : salaSelect.value || "—";
  $("#rvLocal").textContent = salaVal;
  $("#rvData").textContent = $("#data").value || "—";
  $("#rvHora").textContent = `${$("#horaInicio").value} - ${$("#horaFim").value}`;

  // equipamentos
  const list = $("#rvEquip");
  list.innerHTML = "";
  const chosen = $$("#step-2 input[type='number']")
    .filter(i => Number(i.value) > 0)
    .map(i => ({ nome: i.dataset.equip, qtd: Number(i.value) }));

  if (!chosen.length) {
    const li = document.createElement("li");
    li.textContent = "Nenhum equipamento selecionado.";
    list.appendChild(li);
  } else {
    chosen.forEach(it => {
      const li = document.createElement("li");
      li.textContent = `${it.nome}: ${it.qtd}`;
      list.appendChild(li);
    });
  }
}

document.addEventListener("click", (e) => {
  const next = e.target.closest("[data-next]");
  const prev = e.target.closest("[data-prev]");

  if (next) {
    if (current === 0) {
      if (!validateStep1()) return;
      hydrateEquipAvailability();
      showStep(1);
      return;
    }
    if (current === 1) {
      fillReview();
      showStep(2);
      return;
    }
  }

  if (prev) {
    if (current > 0) showStep(current - 1);
  }
});

// permite clicar no stepper (opcional)
stepBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    if (idx === 0 || (idx === 1 && validateStep1()) || idx === 2) {
      if (idx === 1) hydrateEquipAvailability();
      if (idx === 2) fillReview();
      showStep(idx);
    }
  });
});

// ===== Submit =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // monta objeto
  const equipamentos = $$("#step-2 input[type='number']")
    .filter(i => Number(i.value) > 0)
    .map(i => ({ nome: i.dataset.equip, quantidade: Number(i.value) }));

  const agendamento = {
    nome: $("#nomeCompleto").value.trim(),
    data: $("#data").value,
    horaInicio: $("#horaInicio").value,
    horaFim: $("#horaFim").value,
    sala: salaSelect.value === "Outros" ? `Outros (${salaDescricao.value.trim()})` : salaSelect.value,
    repetirSemanalmente: $("#repetirSemanalmente").checked,
    equipamentos,
    observacoes: $("#observacoes").value.trim(),
    status: "ATIVO"
  };

  // salva localmente (p/ próxima tela de cards)
  const STORAGE = "agendamentos";
  const lista = JSON.parse(localStorage.getItem(STORAGE) || "[]");
  lista.push(agendamento);
  localStorage.setItem(STORAGE, JSON.stringify(lista));

  // redireciona se existir a página, senão apenas confirma
  try {
    window.location.href = "agendamentos.html";
  } catch {
    alert("Agendamento confirmado!");
    showStep(0);
    form.reset();
  }
});

// inicia
showStep(0);
