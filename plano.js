/**
 * Checklist do plano de execução: marcações persistidas no localStorage
 * e contagem de progresso por fase e no total.
 */
(function iniciarPlano() {
  const CHAVE_ARMAZENAMENTO = "cybertech_plano_v1";

  const caixas = Array.from(document.querySelectorAll("input[data-tarefa]"));
  const fases = Array.from(document.querySelectorAll("[data-fase]"));
  const elTotal = document.getElementById("progresso-total");
  const btnLimpar = document.getElementById("btn-limpar-progresso");

  /** @returns {Set<string>} ids das tarefas marcadas */
  function lerMarcadas() {
    try {
      const lista = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) || "[]");
      return new Set(Array.isArray(lista) ? lista.filter((id) => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  }

  function salvarMarcadas() {
    const marcadas = caixas.filter((caixa) => caixa.checked).map((caixa) => caixa.dataset.tarefa);
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(marcadas));
    } catch {
      // Navegação privada ou armazenamento cheio: o checklist continua funcionando sem persistir.
    }
  }

  function atualizarContagens() {
    fases.forEach((fase) => {
      const caixasDaFase = fase.querySelectorAll("input[data-tarefa]");
      const feitas = fase.querySelectorAll("input[data-tarefa]:checked").length;
      const elContagem = fase.querySelector("[data-contagem]");
      elContagem.textContent = `${feitas} de ${caixasDaFase.length}`;
      elContagem.classList.toggle("completa", feitas === caixasDaFase.length);
    });
    const feitasTotal = caixas.filter((caixa) => caixa.checked).length;
    elTotal.textContent = `${feitasTotal} de ${caixas.length}`;
  }

  const marcadas = lerMarcadas();
  caixas.forEach((caixa) => {
    caixa.checked = marcadas.has(caixa.dataset.tarefa);
    caixa.addEventListener("change", () => {
      salvarMarcadas();
      atualizarContagens();
    });
  });

  btnLimpar.addEventListener("click", () => {
    caixas.forEach((caixa) => {
      caixa.checked = false;
    });
    salvarMarcadas();
    atualizarContagens();
  });

  atualizarContagens();
})();
