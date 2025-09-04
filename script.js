document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".form-step");
  const stepIndicators = document.querySelectorAll(".step");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((form, i) => form.classList.toggle("active", i === index));
    stepIndicators.forEach((ind, i) => ind.classList.toggle("active", i === index));
  }

  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll(".prev-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Mostrar descrição quando "Outros" for selecionado
  const salaSelect = document.getElementById("sala");
  const salaDescricao = document.getElementById("salaDescricaoContainer");

  salaSelect.addEventListener("change", () => {
    if (salaSelect.value === "Outros") {
      salaDescricao.classList.remove("hidden");
    } else {
      salaDescricao.classList.add("hidden");
    }
  });

  // Resumo no passo 3
  const formStep3 = document.getElementById("formStep3");
  formStep3.addEventListener("click", () => {
    if (currentStep === 2) {
      const resumoDiv = document.getElementById("resumo");
      const nome = document.getElementById("nome").value;
      const data = document.getElementById("data").value;
      const horaInicio = document.getElementById("horaInicio").value;
      const horaFim = document.getElementById("horaFim").value;
      const sala = document.getElementById("sala").value;
      const descricao = document.getElementById("salaDescricao").value;
      const repetir = document.getElementById("repetir").checked ? "Sim" : "Não";

      resumoDiv.innerHTML = `
        <p><b>Nome:</b> ${nome}</p>
        <p><b>Data:</b> ${data}</p>
        <p><b>Horário:</b> ${horaInicio} - ${horaFim}</p>
        <p><b>Sala:</b> ${sala} ${sala === "Outros" ? `(${descricao})` : ""}</p>
        <p><b>Repetir semanalmente:</b> ${repetir}</p>
      `;
    }
  });
});
