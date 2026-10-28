/**
 * Pesquisa com IA (assistente Cybhor):
 * a pessoa escolhe perguntas, texto livre ou áudio → recomenda PDV / Looma / sob medida → cadastro.
 */
(function iniciarPesquisaIa() {
  const raiz = document.getElementById('pesquisa-ia');
  if (!raiz) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let reconhecimento = null;
  let gravando = false;

  const PERGUNTAS = [
    {
      id: 'cenario',
      titulo: 'Qual é o seu momento agora?',
      opcoes: [
        { id: 'loja', texto: 'Tenho loja física / balcão e preciso vender no caixa', pts: { pdv: 3, looma: 0, sob: 0 } },
        { id: 'online', texto: 'Quero vender pela internet sem montar tudo do zero', pts: { pdv: 0, looma: 3, sob: 0 } },
        { id: 'unico', texto: 'Preciso de site, sistema ou automação feitos para a minha rotina', pts: { pdv: 0, looma: 0, sob: 3 } },
        { id: 'duvida', texto: 'Ainda não sei — quero uma orientação', pts: { pdv: 1, looma: 1, sob: 1 } },
      ],
    },
    {
      id: 'dor',
      titulo: 'O que mais atrapalha hoje?',
      opcoes: [
        { id: 'caixa', texto: 'Fila no caixa, estoque errado ou venda sem internet', pts: { pdv: 3, looma: 0, sob: 0 } },
        { id: 'venda', texto: 'Não apareço online ou o pagamento é complicado', pts: { pdv: 0, looma: 3, sob: 1 } },
        { id: 'manual', texto: 'Planilha, WhatsApp solto ou processo que não existe em produto pronto', pts: { pdv: 0, looma: 0, sob: 3 } },
        { id: 'rapido', texto: 'Quero algo pronto o quanto antes, sem inventar a roda', pts: { pdv: 2, looma: 2, sob: 0 } },
      ],
    },
    {
      id: 'prazo',
      titulo: 'Quando precisa estar funcionando?',
      opcoes: [
        { id: 'ja', texto: 'Esta semana / o quanto antes', pts: { pdv: 2, looma: 2, sob: 0 } },
        { id: 'projeto', texto: 'Posso esperar um projeto sob medida bem feito', pts: { pdv: 0, looma: 0, sob: 3 } },
        { id: 'ambos', texto: 'Quero começar rápido e depois evoluir', pts: { pdv: 2, looma: 1, sob: 1 } },
      ],
    },
  ];

  const RESULTADOS = {
    pdv: {
      chave: 'pdv',
      nome: 'CybhorPDV',
      rotulo: 'Produto pronto',
      resumo: 'Pelo que você contou, o melhor agora é o caixa CybhorPDV: vende rápido, controla estoque e continua funcionando se a internet cair.',
      cadastro: 'https://pdv.cybhor.tech/cadastro.html?plano=teste&origem=pesquisa-ia',
      botao: 'Fazer cadastro no CybhorPDV (30 dias grátis)',
      secundario: { href: 'pdv.html', texto: 'Ver detalhes do PDV' },
      tipoContato: 'Usar o CybhorPDV (produto pronto)',
    },
    looma: {
      chave: 'looma',
      nome: 'Looma',
      rotulo: 'Produto pronto',
      resumo: 'Pelo que você contou, o melhor agora é a Looma: sua loja em um shopping online, com Pix e cartão pelo Mercado Pago.',
      cadastro: 'https://looma.cybhor.tech/seller-dashboard.html?origem=pesquisa-ia',
      botao: 'Fazer cadastro / abrir minha loja na Looma',
      secundario: { href: 'looma.html', texto: 'Ver detalhes da Looma' },
      tipoContato: 'Vender na Looma (produto pronto)',
    },
    sob: {
      chave: 'sob',
      nome: 'Projeto sob medida',
      rotulo: 'Feito do zero para você',
      resumo: 'Pelo que você contou, um produto pronto não cobre bem o seu caso. O melhor agora é um projeto sob medida: site, sistema ou automação desenhados para a sua rotina.',
      cadastro: null,
      botao: 'Fazer cadastro do pedido sob medida',
      secundario: { href: 'sob-medida.html', texto: 'Como funciona o sob medida' },
      tipoContato: 'Projeto sob medida (site, sistema ou automação)',
    },
  };

  const estado = {
    modo: null, // perguntas | texto (texto inclui microfone)
    passo: 0,
    respostas: {},
    pontos: { pdv: 0, looma: 0, sob: 0 },
    textoLivre: '',
    lead: { nome: '', empresa: '', whatsapp: '' },
  };

  function escapeHtml(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function analisarTexto(texto) {
    const t = String(texto || '').toLowerCase();
    const pts = { pdv: 0, looma: 0, sob: 0 };

    const regras = [
      { re: /pdv|caixa|balc[aã]o|loja f[ií]sica|estoque|cupom|impressora|c[oó]digo de barras|troco|offline|sem internet/, alvo: 'pdv', n: 3 },
      { re: /mercado|padaria|conveni[eê]ncia|supermercado|a[cç]ougue/, alvo: 'pdv', n: 2 },
      { re: /looma|vender online|loja online|e-?commerce|shopping online|mercado pago|pix|internet.*vender|vender.*internet/, alvo: 'looma', n: 3 },
      { re: /marketplace|pedidos online|entrega|delivery/, alvo: 'looma', n: 2 },
      { re: /sob medida|sob encomenda|personaliz|do zero|espec[ií]fico|custom/, alvo: 'sob', n: 3 },
      { re: /site|sistema|automa[cç][aã]o|planilha|relat[oó]rio|agenda|portal|crm|erp|login/, alvo: 'sob', n: 2 },
      { re: /whatsapp.*organiz|processo manual|n[aã]o existe/, alvo: 'sob', n: 2 },
      { re: /r[aá]pido|pronto|hoje|esta semana|urgente/, alvo: 'pdv', n: 1 },
      { re: /r[aá]pido|pronto|hoje|esta semana|urgente/, alvo: 'looma', n: 1 },
    ];

    regras.forEach(({ re, alvo, n }) => {
      if (re.test(t)) pts[alvo] += n;
    });

    if (pts.pdv === 0 && pts.looma === 0 && pts.sob === 0) {
      pts.sob = 2; // texto genérico → sob medida / conversa
      pts.pdv = 1;
      pts.looma = 1;
    }

    return pts;
  }

  function vencedor() {
    const { pdv, looma, sob } = estado.pontos;
    if (sob >= pdv && sob >= looma) return RESULTADOS.sob;
    if (looma >= pdv) return RESULTADOS.looma;
    return RESULTADOS.pdv;
  }

  function progresso() {
    let total = 3;
    let atual = 1;
    if (!estado.modo) {
      total = 3;
      atual = 1;
    } else if (estado.modo === 'perguntas') {
      total = PERGUNTAS.length + 2;
      atual = Math.min(estado.passo + 1, total);
    } else {
      // texto/audio: modo → texto → lead → resultado
      total = 4;
      if (estado.passo === 0) atual = 2;
      else if (estado.passo === 1) atual = 3;
      else atual = 4;
    }
    const pct = Math.round((atual / total) * 100);
    return `<div class="pesquisa-progresso" aria-hidden="true"><span style="width:${pct}%"></span></div>
      <p class="pesquisa-passo">Passo ${Math.min(atual, total)} de ${total}</p>`;
  }

  function pararAudio() {
    gravando = false;
    try { reconhecimento && reconhecimento.stop(); } catch (_) { /* ignore */ }
    const btn = raiz.querySelector('[data-acao="audio-toggle"]');
    if (btn) {
      btn.classList.remove('gravando');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Falar no microfone');
      const icone = btn.querySelector('.pesquisa-mic-icone');
      if (icone) {
        icone.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v3"/></svg>';
      }
    }
  }

  function renderEscolhaModo() {
    pararAudio();
    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card">
        <p class="pesquisa-chip">Assistente Cybhor · IA</p>
        <h2>Como você prefere contar o que precisa?</h2>
        <p class="pesquisa-texto">Escolha o jeito mais confortável. No final indicamos a melhor opção e já vamos ao cadastro.</p>
        <div class="pesquisa-modos">
          <button type="button" class="pesquisa-modo" data-modo="perguntas">
            <strong>Perguntas</strong>
            <span>Respondo opções rápidas, uma a uma</span>
          </button>
          <button type="button" class="pesquisa-modo" data-modo="texto">
            <strong>Escrever ou falar</strong>
            <span>Digito o que quero ou aperto o microfone para falar</span>
          </button>
        </div>
      </div>`;
  }

  function renderPergunta() {
    const pergunta = PERGUNTAS[estado.passo];
    const botoes = pergunta.opcoes.map((op) => `
      <button type="button" class="pesquisa-opcao" data-opcao="${escapeHtml(op.id)}">
        ${escapeHtml(op.texto)}
      </button>`).join('');

    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card">
        <p class="pesquisa-chip">Modo perguntas</p>
        <h2>${escapeHtml(pergunta.titulo)}</h2>
        <div class="pesquisa-opcoes">${botoes}</div>
        <button type="button" class="btn-contorno pesquisa-voltar" data-acao="voltar">Voltar</button>
      </div>`;
  }

  function renderTexto() {
    const suporte = Boolean(SpeechRecognition);
    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card">
        <p class="pesquisa-chip">Modo escrever ou falar</p>
        <h2>O que você precisa?</h2>
        <p class="pesquisa-texto">
          Digite com as suas palavras ou aperte o microfone para falar — o texto aparece no campo e você pode editar.
        </p>
        <div class="pesquisa-texto-com-mic">
          <label class="campo campo-claro pesquisa-campo-texto">
            <span>O que você quer</span>
            <textarea id="pesquisa-texto-livre" rows="5" maxlength="1200" required
              placeholder="Ex.: tenho uma loja de roupa e preciso de caixa com estoque, ou um site sob medida para receber pedidos.">${escapeHtml(estado.textoLivre)}</textarea>
          </label>
          <button type="button"
            class="pesquisa-mic${gravando ? ' gravando' : ''}"
            data-acao="audio-toggle"
            aria-pressed="${gravando ? 'true' : 'false'}"
            aria-label="${gravando ? 'Parar microfone' : 'Falar no microfone'}"
            title="${suporte ? (gravando ? 'Parar' : 'Falar') : 'Áudio no Chrome ou Edge'}"
            ${suporte ? '' : 'disabled'}>
            <span class="pesquisa-mic-icone" aria-hidden="true">${gravando
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v3"/></svg>'}</span>
          </button>
        </div>
        <p class="pesquisa-audio-status" id="pesquisa-audio-status">
          ${gravando
    ? 'Ouvindo… fale com clareza.'
    : (suporte ? 'Aperte o microfone para falar · pt-BR' : 'Microfone disponível no Chrome ou Edge. Você ainda pode digitar.')}
        </p>
        <p class="form-erro pesquisa-erro" hidden></p>
        <div class="acoes">
          <button type="button" class="btn-tinta" data-acao="enviar-texto">Continuar</button>
          <button type="button" class="btn-contorno" data-acao="voltar">Voltar</button>
        </div>
      </div>`;
  }

  function renderLead() {
    pararAudio();
    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card">
        <p class="pesquisa-chip">Quase lá · cadastro</p>
        <h2>Para liberar a recomendação e o cadastro</h2>
        <p class="pesquisa-texto">Usamos só para te encaminhar à solução certa. Sem spam.</p>
        <form class="formulario pesquisa-lead" id="pesquisa-lead" novalidate>
          <label class="campo campo-claro">
            <span>Seu nome</span>
            <input name="nome" type="text" required minlength="2" maxlength="80" autocomplete="name" value="${escapeHtml(estado.lead.nome)}" />
          </label>
          <label class="campo campo-claro">
            <span>Empresa <small>(opcional)</small></span>
            <input name="empresa" type="text" maxlength="80" autocomplete="organization" value="${escapeHtml(estado.lead.empresa)}" />
          </label>
          <label class="campo campo-claro">
            <span>WhatsApp</span>
            <input name="whatsapp" type="tel" required inputmode="tel" maxlength="20" autocomplete="tel" placeholder="(11) 99999-9999" value="${escapeHtml(estado.lead.whatsapp)}" />
          </label>
          <p class="form-erro pesquisa-erro" hidden></p>
          <button type="submit" class="btn-tinta">Ver recomendação e cadastrar</button>
        </form>
        <button type="button" class="btn-contorno pesquisa-voltar" data-acao="voltar">Voltar</button>
      </div>`;
  }

  function renderAnalisando(depois) {
    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card pesquisa-analisando">
        <p class="pesquisa-chip">Assistente Cybhor · IA</p>
        <h2>Analisando…</h2>
        <p class="pesquisa-texto">Comparando com CybhorPDV, Looma e projetos sob medida.</p>
        <div class="pesquisa-loader" aria-hidden="true"></div>
      </div>`;
    window.setTimeout(depois, 900);
  }

  function renderResultado() {
    const rec = vencedor();
    const resumoRespostas = estado.modo === 'perguntas'
      ? Object.values(estado.respostas).map((t) => `• ${t}`).join('\n')
      : `• ${estado.textoLivre}`;

    try {
      sessionStorage.setItem('cybhor-pesquisa', JSON.stringify({
        modo: estado.modo,
        lead: estado.lead,
        recomendacao: rec.chave,
        respostas: estado.respostas,
        textoLivre: estado.textoLivre,
        pontos: estado.pontos,
      }));
    } catch (_) { /* ignore */ }

    const cadastroHtml = rec.cadastro
      ? `<a class="btn-tinta" href="${escapeHtml(rec.cadastro)}" target="_blank" rel="noopener">${escapeHtml(rec.botao)}</a>`
      : `<button type="button" class="btn-tinta" data-acao="cadastro-sob">${escapeHtml(rec.botao)}</button>`;

    raiz.innerHTML = `
      ${progresso()}
      <div class="pesquisa-card pesquisa-resultado">
        <p class="pesquisa-chip">Recomendação · ${escapeHtml(rec.rotulo)}</p>
        <h2>Melhor para você agora: ${escapeHtml(rec.nome)}</h2>
        <p class="pesquisa-texto">${escapeHtml(rec.resumo)}</p>
        <p class="pesquisa-nome">Olá, <strong>${escapeHtml(estado.lead.nome)}</strong> — próximo passo: cadastro.</p>
        <div class="acoes pesquisa-acoes">
          ${cadastroHtml}
          <a class="btn-contorno" href="${escapeHtml(rec.secundario.href)}">${escapeHtml(rec.secundario.texto)}</a>
        </div>
        <button type="button" class="pesquisa-reiniciar" data-acao="reiniciar">Refazer pesquisa</button>
      </div>`;

    raiz.dataset.descricao = [
      `Pesquisa IA (${estado.modo}) — recomendação: ${rec.nome}.`,
      `Nome: ${estado.lead.nome}.`,
      estado.lead.empresa ? `Empresa: ${estado.lead.empresa}.` : '',
      `WhatsApp: ${estado.lead.whatsapp}.`,
      'O que a pessoa disse:',
      resumoRespostas,
    ].filter(Boolean).join('\n');
    raiz.dataset.tipo = rec.tipoContato;
  }

  function abrirCadastroSobMedida() {
    const dialog = document.getElementById('contato');
    const form = document.getElementById('form-orcamento');
    if (!form) return;

    form.nome.value = estado.lead.nome;
    form.empresa.value = estado.lead.empresa;
    form.whatsapp.value = estado.lead.whatsapp;
    form.tipo.value = raiz.dataset.tipo || 'Projeto sob medida (site, sistema ou automação)';
    form.descricao.value = raiz.dataset.descricao || 'Quero um projeto sob medida (veio da Pesquisa IA).';

    if (dialog && typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
    }
  }

  function responder(opcaoId) {
    const pergunta = PERGUNTAS[estado.passo];
    const opcao = pergunta.opcoes.find((o) => o.id === opcaoId);
    if (!opcao) return;

    estado.respostas[pergunta.id] = opcao.texto;
    estado.pontos.pdv += opcao.pts.pdv;
    estado.pontos.looma += opcao.pts.looma;
    estado.pontos.sob += opcao.pts.sob;
    estado.passo += 1;

    if (estado.passo < PERGUNTAS.length) {
      renderPergunta();
    } else {
      estado.passo = PERGUNTAS.length;
      renderLead();
    }
  }

  function escolherModo(modo) {
    estado.modo = modo;
    estado.passo = 0;
    estado.respostas = {};
    estado.pontos = { pdv: 0, looma: 0, sob: 0 };
    estado.textoLivre = '';

    if (modo === 'perguntas') {
      renderPergunta();
      return;
    }
    renderTexto();
  }

  function enviarTexto() {
    const area = document.getElementById('pesquisa-texto-livre');
    const erro = raiz.querySelector('.pesquisa-erro');
    const texto = (area && area.value || '').trim();
    if (texto.length < 12) {
      if (erro) {
        erro.hidden = false;
        erro.textContent = 'Conte um pouco mais (pelo menos uma frase) para a IA indicar a melhor opção.';
      }
      return;
    }
    if (erro) erro.hidden = true;
    estado.textoLivre = texto;
    estado.pontos = analisarTexto(texto);
    estado.passo = 1;
    renderLead();
  }

  function voltar() {
    pararAudio();
    if (!estado.modo) {
      renderEscolhaModo();
      return;
    }

    if (estado.modo === 'perguntas') {
      if (estado.passo <= 0) {
        estado.modo = null;
        renderEscolhaModo();
        return;
      }
      const idxAnterior = estado.passo - 1;
      if (idxAnterior >= 0 && idxAnterior < PERGUNTAS.length) {
        const pergunta = PERGUNTAS[idxAnterior];
        const texto = estado.respostas[pergunta.id];
        const opcao = pergunta.opcoes.find((o) => o.texto === texto);
        if (opcao) {
          estado.pontos.pdv -= opcao.pts.pdv;
          estado.pontos.looma -= opcao.pts.looma;
          estado.pontos.sob -= opcao.pts.sob;
        }
        delete estado.respostas[pergunta.id];
        estado.passo = idxAnterior;
        renderPergunta();
        return;
      }
      // voltando do lead
      estado.passo = PERGUNTAS.length - 1;
      const pergunta = PERGUNTAS[estado.passo];
      const texto = estado.respostas[pergunta.id];
      const opcao = pergunta.opcoes.find((o) => o.texto === texto);
      if (opcao) {
        estado.pontos.pdv -= opcao.pts.pdv;
        estado.pontos.looma -= opcao.pts.looma;
        estado.pontos.sob -= opcao.pts.sob;
      }
      delete estado.respostas[pergunta.id];
      renderPergunta();
      return;
    }

    // texto (com microfone)
    if (estado.passo <= 0) {
      estado.modo = null;
      renderEscolhaModo();
      return;
    }
    // do lead volta ao texto
    estado.passo = 0;
    renderTexto();
  }

  function telefoneOk(valor) {
    const digitos = String(valor || '').replace(/\D/g, '');
    return digitos.length >= 10 && digitos.length <= 13;
  }

  function alternarAudio() {
    const status = document.getElementById('pesquisa-audio-status');
    const area = document.getElementById('pesquisa-texto-livre');
    if (!SpeechRecognition) {
      if (status) status.textContent = 'Áudio disponível no Chrome ou Edge.';
      return;
    }

    if (gravando) {
      pararAudio();
      if (status) status.textContent = 'Gravação encerrada. Pode editar o texto.';
      return;
    }

    reconhecimento = new SpeechRecognition();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.continuous = true;
    reconhecimento.interimResults = true;

    let base = (area && area.value) || '';
    if (base && !/\s$/.test(base)) base += ' ';

    reconhecimento.onstart = () => {
      gravando = true;
      const btn = raiz.querySelector('[data-acao="audio-toggle"]');
      if (btn) {
        btn.classList.add('gravando');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Parar microfone');
        const icone = btn.querySelector('.pesquisa-mic-icone');
        if (icone) {
          icone.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>';
        }
      }
      if (status) status.textContent = 'Ouvindo… fale com clareza.';
    };

    reconhecimento.onerror = () => {
      pararAudio();
      if (status) status.textContent = 'Não deu para captar o áudio. Tente de novo ou escreva.';
    };

    reconhecimento.onend = () => {
      if (gravando) {
        // reinicia se ainda estiver “gravando” (alguns browsers param sozinhos)
        try { reconhecimento.start(); } catch (_) { pararAudio(); }
      }
    };

    reconhecimento.onresult = (evento) => {
      let final = '';
      let parcial = '';
      for (let i = 0; i < evento.results.length; i += 1) {
        const r = evento.results[i];
        if (r.isFinal) final += r[0].transcript;
        else parcial += r[0].transcript;
      }
      if (area) area.value = `${base}${final}${parcial}`.trimStart();
      estado.textoLivre = area ? area.value : '';
    };

    try {
      reconhecimento.start();
    } catch (_) {
      if (status) status.textContent = 'Não foi possível abrir o microfone.';
    }
  }

  raiz.addEventListener('click', (evento) => {
    const modoBtn = evento.target.closest('[data-modo]');
    if (modoBtn) {
      escolherModo(modoBtn.getAttribute('data-modo'));
      return;
    }

    const alvo = evento.target.closest('[data-acao], [data-opcao]');
    if (!alvo) return;

    const acao = alvo.getAttribute('data-acao');
    if (acao === 'voltar') { voltar(); return; }
    if (acao === 'enviar-texto') { enviarTexto(); return; }
    if (acao === 'audio-toggle') { alternarAudio(); return; }
    if (acao === 'cadastro-sob') { abrirCadastroSobMedida(); return; }
    if (acao === 'reiniciar') {
      pararAudio();
      estado.modo = null;
      estado.passo = 0;
      estado.respostas = {};
      estado.pontos = { pdv: 0, looma: 0, sob: 0 };
      estado.textoLivre = '';
      estado.lead = { nome: '', empresa: '', whatsapp: '' };
      renderEscolhaModo();
      return;
    }

    const opcao = alvo.getAttribute('data-opcao');
    if (opcao) responder(opcao);
  });

  raiz.addEventListener('submit', (evento) => {
    const form = evento.target.closest('#pesquisa-lead');
    if (!form) return;
    evento.preventDefault();

    const nome = form.nome.value.trim();
    const empresa = form.empresa.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const erro = form.querySelector('.pesquisa-erro');

    if (nome.length < 2) {
      erro.hidden = false;
      erro.textContent = 'Informe seu nome.';
      return;
    }
    if (!telefoneOk(whatsapp)) {
      erro.hidden = false;
      erro.textContent = 'Informe um WhatsApp válido com DDD.';
      return;
    }
    erro.hidden = true;
    estado.lead = { nome, empresa, whatsapp };
    estado.passo = estado.modo === 'perguntas' ? PERGUNTAS.length + 1 : 2;
    renderAnalisando(renderResultado);
  });

  renderEscolhaModo();
}());
