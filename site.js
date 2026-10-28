/**
 * Página institucional Cybhor Tech (estrutura no estilo TOTVS):
 * menu com dropdown, painel de contato e formulário.
 */

(function iniciarContato() {
  const dialog = document.getElementById('contato');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  function abrir() {
    if (dialog.open) return;
    // Depois do clique: o mesmo evento não cai no fundo do dialog e fecha na hora
    window.setTimeout(() => {
      if (!dialog.open) dialog.showModal();
    }, 0);
  }

  function fechar() {
    if (dialog.open) dialog.close();
  }

  // Delegação: cobre botões do topo, da faixa final e do rodapé
  document.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-abrir-contato]');
    if (!botao) return;
    evento.preventDefault();
    evento.stopPropagation();
    abrir();
  });

  dialog.addEventListener('click', (evento) => {
    if (evento.target === dialog) fechar();
  });

  if (location.hash === '#contato') abrir();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#contato') abrir();
  });
}());

(function iniciarMenu() {
  const abrir = document.getElementById('menu-abrir');
  const menu = document.getElementById('menu-principal');
  if (!abrir || !menu) return;

  abrir.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    abrir.setAttribute('aria-expanded', String(aberto));
  });

  menu.querySelectorAll('[data-dropdown]').forEach((item) => {
    const gatilho = item.querySelector('.menu-gatilho');
    const painel = item.querySelector('.menu-painel');
    if (!gatilho || !painel) return;

    gatilho.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const vaiAbrir = painel.hasAttribute('hidden');
      fecharDropdowns();
      if (vaiAbrir) {
        painel.hidden = false;
        gatilho.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function fecharDropdowns() {
    menu.querySelectorAll('.menu-painel').forEach((painel) => {
      painel.hidden = true;
    });
    menu.querySelectorAll('.menu-gatilho').forEach((botao) => {
      botao.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', fecharDropdowns);
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharDropdowns();
  });

  menu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('aberto');
      abrir.setAttribute('aria-expanded', 'false');
      fecharDropdowns();
    });
  });
}());

(function iniciarFormularioOrcamento() {
  const formulario = document.getElementById('form-orcamento');
  if (!formulario) return;

  const caixaErro = document.getElementById('form-erro');
  const caixaRetorno = document.getElementById('form-retorno');

  const REGRAS = {
    nome: { minimo: 2, maximo: 80, mensagem: 'Informe seu nome.' },
    tipo: { minimo: 1, maximo: 60, mensagem: 'Escolha o que você precisa.' },
    descricao: { minimo: 10, maximo: 1000, mensagem: 'Conte um pouco mais sobre o pedido (pelo menos 10 letras).' },
  };

  function limparTexto(valor, maximo) {
    return String(valor || '')
      .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
      .replace(/[ \t]+/g, ' ')
      .trim()
      .slice(0, maximo);
  }

  function normalizarTelefone(valor) {
    return String(valor || '').replace(/\D/g, '');
  }

  function telefoneValido(digitos) {
    return digitos.length >= 10 && digitos.length <= 13;
  }

  function lerPedido() {
    const dados = new FormData(formulario);
    return {
      nome: limparTexto(dados.get('nome'), REGRAS.nome.maximo),
      empresa: limparTexto(dados.get('empresa'), 80),
      tipo: limparTexto(dados.get('tipo'), REGRAS.tipo.maximo),
      descricao: limparTexto(dados.get('descricao'), REGRAS.descricao.maximo),
      whatsapp: normalizarTelefone(dados.get('whatsapp')),
    };
  }

  function validarPedido(pedido) {
    for (const [campo, regra] of Object.entries(REGRAS)) {
      if (pedido[campo].length < regra.minimo) return { campo, mensagem: regra.mensagem };
    }
    if (!telefoneValido(pedido.whatsapp)) {
      return { campo: 'whatsapp', mensagem: 'Informe um WhatsApp com DDD, por exemplo (11) 99999-9999.' };
    }
    return null;
  }

  function montarMensagem(pedido) {
    const linhas = [
      'Olá, Cybhor Tech! Quero um orçamento.',
      '',
      `Nome: ${pedido.nome}`,
    ];
    if (pedido.empresa) linhas.push(`Empresa: ${pedido.empresa}`);
    linhas.push(`Preciso de: ${pedido.tipo}`, `WhatsApp: ${pedido.whatsapp}`, '', pedido.descricao);
    return linhas.join('\n');
  }

  async function copiarTexto(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      return false;
    }
  }

  function mostrarErro(problema) {
    formulario.querySelectorAll('[aria-invalid]').forEach((campo) => campo.removeAttribute('aria-invalid'));
    caixaRetorno.hidden = true;
    if (!problema) {
      caixaErro.hidden = true;
      return;
    }
    const campo = formulario.elements.namedItem(problema.campo);
    if (campo) {
      campo.setAttribute('aria-invalid', 'true');
      campo.focus();
    }
    caixaErro.textContent = problema.mensagem;
    caixaErro.hidden = false;
  }

  function mostrarRetorno(texto) {
    caixaRetorno.textContent = texto;
    caixaRetorno.hidden = false;
  }

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const pedido = lerPedido();
    const problema = validarPedido(pedido);
    mostrarErro(problema);
    if (problema) return;

    const mensagem = montarMensagem(pedido);
    const whatsappComercial = normalizarTelefone(formulario.dataset.whatsapp);

    if (telefoneValido(whatsappComercial)) {
      window.open(`https://wa.me/${whatsappComercial}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
      mostrarRetorno('Abrimos o WhatsApp com o seu pedido. É só tocar em enviar.');
      return;
    }

    const usuarioInstagram = limparTexto(formulario.dataset.instagram, 30).replace(/[^\w.]/g, '');
    const copiou = await copiarTexto(mensagem);
    window.open(`https://ig.me/m/${usuarioInstagram}`, '_blank', 'noopener');
    mostrarRetorno(copiou
      ? 'Seu pedido foi copiado. Cole na conversa do Instagram que abriu e envie.'
      : `Abrimos o Instagram @${usuarioInstagram}. Envie por lá: ${mensagem}`);
  });
}());

(function iniciarRevelar() {
  const blocos = document.querySelectorAll('.revelar');
  if (!blocos.length) return;

  if (!('IntersectionObserver' in window)) {
    blocos.forEach((el) => el.classList.add('visivel'));
    return;
  }

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      observer.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  blocos.forEach((el) => observer.observe(el));
}());
