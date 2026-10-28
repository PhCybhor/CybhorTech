#!/usr/bin/env python3
"""Gera as páginas HTML do site institucional a partir de um casco compartilhado."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSET = "20261027o"


def casco(titulo: str, descricao: str, ativo: str, corpo: str, scripts: str = "") -> str:
    def nav_cls(chave: str) -> str:
        return ' class="ativo"' if ativo == chave else ""

    scripts_extra = f"\n  {scripts}" if scripts else ""

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{titulo}</title>
  <meta name="description" content="{descricao}" />
  <link rel="icon" type="image/svg+xml" href="img/logo.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="site.css?v={ASSET}" />
</head>
<body>
  <header class="topo">
    <div class="container topo-conteudo">
      <a href="index.html" class="marca">
        <img src="img/logo-branco.svg" width="28" height="28" alt="" class="marca-clara" />
        <img src="img/logo.svg" width="28" height="28" alt="" class="marca-escura" />
        <span>Cybhor <strong>Tech</strong></span>
      </a>

      <button type="button" class="menu-abrir" id="menu-abrir" aria-expanded="false" aria-controls="menu-principal">
        Menu
      </button>

      <nav class="menu" id="menu-principal" aria-label="Principal">
        <div class="menu-item" data-dropdown>
          <button type="button" class="menu-gatilho" aria-expanded="false">Produtos</button>
          <div class="menu-painel" hidden>
            <a href="pdv.html"><strong>CybhorPDV</strong><span>Caixa para loja física</span></a>
            <a href="looma.html"><strong>Looma</strong><span>Shopping online para sua loja</span></a>
            <a href="sob-medida.html"><strong>Projeto sob medida</strong><span>Site, sistema ou automação feitos do zero para você</span></a>
          </div>
        </div>
        <a href="segmentos.html"{nav_cls("segmentos")}>Segmentos</a>
        <a href="sobre.html"{nav_cls("sobre")}>Sobre</a>
        <a href="pesquisa.html" class="btn-pesquisa-nav">Pesquisa IA</a>
        <button type="button" class="btn-contato" data-abrir-contato>Entre em contato</button>
        <div class="menu-item" data-dropdown>
          <button type="button" class="menu-gatilho menu-cliente" aria-expanded="false">Sou cliente</button>
          <div class="menu-painel" hidden>
            <a href="https://pdv.cybhor.tech/login.html" target="_blank" rel="noopener">Entrar no CybhorPDV</a>
            <a href="https://looma.cybhor.tech/login.html" target="_blank" rel="noopener">Entrar na Looma</a>
            <a href="https://looma.cybhor.tech/seller-dashboard.html" target="_blank" rel="noopener">Painel da loja (Looma)</a>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <main>
{corpo}
  </main>

  <dialog id="contato" class="contato-dialog" aria-labelledby="contato-titulo">
    <form method="dialog" class="contato-dialog-topo">
      <h2 id="contato-titulo">Entre em contato</h2>
      <button type="submit" class="contato-fechar" aria-label="Fechar">×</button>
    </form>
    <p class="contato-intro">Conte o que precisa. Fazemos <strong>projeto sob medida</strong> (site, sistema ou automação) e também indicamos o CybhorPDV ou a Looma se um produto pronto já resolver. Proposta sem compromisso.</p>
    <form id="form-orcamento" class="formulario" novalidate data-whatsapp="" data-instagram="cybhortech">
      <label class="campo">
        <span>Seu nome</span>
        <input name="nome" type="text" required minlength="2" maxlength="80" autocomplete="name" />
      </label>
      <label class="campo">
        <span>Nome da empresa <small>(opcional)</small></span>
        <input name="empresa" type="text" maxlength="80" autocomplete="organization" />
      </label>
      <label class="campo">
        <span>O que você precisa?</span>
        <select name="tipo" required>
          <option value="">Escolha uma opção</option>
          <option>Projeto sob medida (site, sistema ou automação)</option>
          <option>Um site sob medida</option>
          <option>Um sistema sob medida</option>
          <option>Automatizar uma tarefa sob medida</option>
          <option>Usar o CybhorPDV (produto pronto)</option>
          <option>Vender na Looma (produto pronto)</option>
          <option>Ainda não sei — quero orientação</option>
        </select>
      </label>
      <label class="campo">
        <span>Conte em poucas palavras</span>
        <textarea name="descricao" rows="4" required minlength="10" maxlength="1000"
                  placeholder="Ex.: preciso de um sistema sob medida para agenda e pedidos da minha clínica."></textarea>
      </label>
      <label class="campo">
        <span>Seu WhatsApp</span>
        <input name="whatsapp" type="tel" required inputmode="tel" maxlength="20" autocomplete="tel" placeholder="(11) 99999-9999" />
      </label>
      <p class="form-erro" id="form-erro" role="alert" hidden></p>
      <button type="submit" class="btn-claro">Enviar pedido</button>
      <p class="form-retorno" id="form-retorno" role="status" hidden></p>
    </form>
  </dialog>

  <footer class="rodape">
    <div class="container rodape-grade">
      <div>
        <p class="rodape-marca">Cybhor Tech</p>
        <p>Produtos prontos e projetos sob medida para o seu negócio.</p>
        <p class="rodape-marca-linha">cybhor.tech</p>
      </div>
      <div>
        <p class="rodape-titulo">Soluções</p>
        <a href="pdv.html">CybhorPDV</a>
        <a href="looma.html">Looma</a>
        <a href="sob-medida.html">Projeto sob medida</a>
      </div>
      <div>
        <p class="rodape-titulo">Cliente</p>
        <a href="https://pdv.cybhor.tech/login.html" target="_blank" rel="noopener">Área do CybhorPDV</a>
        <a href="https://looma.cybhor.tech/login.html" target="_blank" rel="noopener">Área da Looma</a>
        <button type="button" class="rodape-contato" data-abrir-contato>Entre em contato</button>
      </div>
      <div>
        <p class="rodape-titulo">Empresa</p>
        <a href="pesquisa.html">Pesquisa IA</a>
        <a href="segmentos.html">Segmentos</a>
        <a href="sobre.html">Sobre</a>
        <a href="https://instagram.com/cybhortech" target="_blank" rel="noopener">Instagram @cybhortech</a>
      </div>
    </div>
    <div class="container rodape-base">
      <span>© Cybhor Tech · cybhor.tech</span>
    </div>
  </footer>

  <script src="site.js?v={ASSET}"></script>{scripts_extra}
</body>
</html>
"""


PAGINAS: dict[str, tuple[str, str, str, str]] = {}

PAGINAS["index.html"] = (
    "inicio",
    "Cybhor Tech — Tecnologia para o seu negócio",
    "Cybhor Tech: CybhorPDV, Looma e projetos sob medida — site, sistema ou automação feitos do zero para a sua empresa.",
    """
    <section class="hero" aria-label="Cybhor Tech">
      <div class="hero-fundo" aria-hidden="true"></div>
      <div class="container hero-grade">
        <div class="hero-copy">
          <p class="hero-marca" aria-hidden="true">Cybhor Tech</p>
          <h1>Produtos prontos e projetos sob medida para o seu negócio.</h1>
          <p class="hero-lead">
            CybhorPDV no caixa, Looma para vender online — e, se nada pronto servir,
            <strong>fazemos sob medida</strong>: site, sistema ou automação desenhados para a sua rotina.
          </p>
          <div class="hero-acoes">
            <a class="btn-claro btn-hero-ia" href="pesquisa.html">Fazer Pesquisa IA agora</a>
            <a class="btn-fantasma" href="#unidades">Ver soluções</a>
          </div>
          <p class="hero-ia-dica">1 minuto · indica PDV, Looma ou sob medida · já leva ao cadastro</p>
          <nav class="hero-atalhos" aria-label="Caminhos">
            <a href="pesquisa.html"><span>Pesquisa IA</span> Qual solução combina comigo?</a>
            <a href="sob-medida.html"><span>Sob medida</span> Projeto feito do zero para você</a>
          </nav>
        </div>
        <figure class="hero-visual">
          <img src="img/pdv-caixa.webp" width="1280" height="760"
               alt="Tela do caixa do CybhorPDV com produtos, carrinho e total da venda" />
          <figcaption>CybhorPDV — o caixa da loja, de verdade.</figcaption>
        </figure>
      </div>
    </section>

    <section class="faixa-pesquisa" aria-label="Pesquisa com IA">
      <div class="container faixa-pesquisa-conteudo">
        <div>
          <p class="eyebrow eyebrow-claro">Pesquisa com IA</p>
          <h2>Não sabe se precisa de produto pronto ou sob medida?</h2>
          <p>Responda 3 perguntas. O assistente Cybhor indica a melhor opção para o seu momento e já encaminha o cadastro.</p>
        </div>
        <a class="btn-claro" href="pesquisa.html">Começar Pesquisa IA</a>
      </div>
    </section>

    <section class="faixa-prova" aria-label="Em poucas palavras">
      <div class="container faixa-prova-grade">
        <p><strong>Cybhor Tech</strong> tecnologia para quem vende todo dia no Brasil e no mundo</p>
        <p><strong>Sob medida</strong> site, sistema ou automação sob encomenda</p>
        <p><strong>Preço justo</strong> proposta clara, sem surpresa na conta</p>
      </div>
    </section>

    <section class="secao secao-institucional" aria-labelledby="titulo-institucional">
      <div class="container institucional institucional-com-desenho revelar">
        <div class="institucional-texto">
          <p class="eyebrow">A empresa</p>
          <h2 id="titulo-institucional">Quem vende todo dia confia na Cybhor Tech.</h2>
          <p>
            Criamos sistemas e sites para pequenas e médias empresas brasileiras.
            Temos produtos prontos (CybhorPDV e Looma) e, além disso,
            <strong>fazemos projetos sob medida</strong>: site, sistema ou automação
            desenhados do zero para a sua empresa — do jeito que a sua rotina pede.
          </p>
          <div class="acoes">
            <a class="btn-tinta" href="sob-medida.html">Ver projetos sob medida</a>
            <a class="btn-contorno" href="sobre.html">Conhecer a Cybhor</a>
          </div>
        </div>
        <figure class="desenho">
          <img src="img/desenho-confianca.jpg" width="1024" height="768" loading="lazy"
               alt="Ilustração em traço de duas pessoas apertando as mãos ao lado de uma loja e um notebook" />
        </figure>
      </div>
    </section>

    <section id="unidades" class="secao secao-escura" aria-labelledby="titulo-unidades">
      <div class="container">
        <p class="eyebrow eyebrow-claro">Soluções</p>
        <h2 id="titulo-unidades">Nossas soluções prontas e completas</h2>
        <p class="secao-intro secao-intro-clara">
          CybhorPDV e Looma prontos para usar — e <strong>projeto sob medida</strong> quando você precisa de algo único.
        </p>
        <div class="unidades">
          <a class="unidade revelar" href="pdv.html">
            <img class="unidade-desenho" src="img/unidade-pdv.jpg" width="1280" height="720" loading="lazy"
                 alt="Ilustração em traço de um lojista no caixa" />
            <span class="unidade-rotulo">Produto pronto</span>
            <h3>CybhorPDV</h3>
            <p>Sistema de caixa com estoque, cupom impresso, vários funcionários e vendas mesmo sem internet.</p>
            <span class="unidade-link">Saiba mais</span>
          </a>
          <a class="unidade revelar" href="looma.html">
            <img class="unidade-desenho" src="img/unidade-looma.jpg" width="1280" height="720" loading="lazy"
                 alt="Ilustração em traço de uma pessoa embalando pedido de venda online" />
            <span class="unidade-rotulo">Produto pronto</span>
            <h3>Looma</h3>
            <p>Shopping onde várias lojas vendem juntas. Pix e cartão pelo Mercado Pago.</p>
            <span class="unidade-link">Saiba mais</span>
          </a>
          <a class="unidade revelar" href="sob-medida.html">
            <img class="unidade-desenho" src="img/unidade-projeto.jpg" width="1280" height="720" loading="lazy"
                 alt="Ilustração em traço de uma pessoa montando um site no notebook" />
            <span class="unidade-rotulo">Feito do zero para você</span>
            <h3>Projeto sob medida</h3>
            <p>Site, sistema de rotina, automação ou recebimento online — desenhados sob medida para a sua empresa.</p>
            <span class="unidade-link">Pedir sob medida</span>
          </a>
        </div>
      </div>
    </section>

    <section class="secao secao-cta" aria-labelledby="titulo-contato">
      <div class="container cta-faixa revelar">
        <div>
          <p class="eyebrow eyebrow-claro">Não sabe qual escolher?</p>
          <h2 id="titulo-contato">Faça a pesquisa com IA e cadastre na melhor opção.</h2>
        </div>
        <a class="btn-claro" href="pesquisa.html">Começar pesquisa IA</a>
      </div>
    </section>
""",
)

PAGINAS["pdv.html"] = (
    "pdv",
    "CybhorPDV — Caixa para loja | Cybhor Tech",
    "Sistema de caixa com estoque, cupom impresso e vendas mesmo sem internet. Teste 30 dias grátis.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Produto</p>
        <p class="produto-nome produto-nome-claro">CybhorPDV</p>
        <h1>O caixa da sua loja, sem fila e com o estoque certo.</h1>
        <p class="pagina-hero-lead">Para mercados, padarias, lojas de roupa, conveniências e qualquer negócio com balcão.</p>
        <div class="acoes">
          <a class="btn-claro" href="https://pdv.cybhor.tech/cadastro.html?plano=teste" target="_blank" rel="noopener">Testar 30 dias grátis</a>
          <a class="btn-fantasma" href="https://pdv.cybhor.tech" target="_blank" rel="noopener">Abrir o CybhorPDV</a>
        </div>
      </div>
    </section>

    <section class="secao">
      <div class="container produto revelar">
        <div class="produto-texto">
          <ul class="beneficios">
            <li><strong>Venda em segundos.</strong> Bipe o código de barras ou busque pelo nome; o troco sai calculado.</li>
            <li><strong>A internet caiu? Continue vendendo.</strong> As vendas ficam no computador e sobem sozinhas quando a conexão volta.</li>
            <li><strong>Cupom na hora.</strong> Compatível com impressoras térmicas comuns, como a Jetway JP-800.</li>
            <li><strong>Estoque que se atualiza sozinho.</strong> Cada venda baixa o produto e o sistema avisa antes de faltar.</li>
            <li><strong>Roda no computador que você já tem.</strong> Inclusive máquinas antigas com Windows 7.</li>
            <li><strong>Vários caixas e funcionários.</strong> Cada um com seu login; você acompanha as vendas no navegador.</li>
          </ul>
          <p class="entrar-valores">
            <a href="https://pdv.cybhor.tech" target="_blank" rel="noopener">Entre no site para ver os valores</a>
          </p>
          <div class="acoes">
            <a class="btn-tinta" href="https://pdv.cybhor.tech/cadastro.html?plano=teste" target="_blank" rel="noopener">Testar 30 dias grátis</a>
            <a class="btn-contorno" href="https://pdv.cybhor.tech" target="_blank" rel="noopener">Abrir o CybhorPDV</a>
          </div>
        </div>
        <figure class="produto-figura">
          <img src="img/pdv-caixa.webp" width="1280" height="760" loading="lazy"
               alt="Tela do caixa do CybhorPDV com produtos, carrinho e total da venda" />
          <figcaption>Tela real do caixa do CybhorPDV.</figcaption>
        </figure>
      </div>
    </section>

    <section class="secao secao-cta">
      <div class="container cta-faixa">
        <div>
          <p class="eyebrow eyebrow-claro">Outras soluções</p>
          <h2>Além do PDV: Looma pronta ou projeto sob medida.</h2>
        </div>
        <div class="acoes">
          <a class="btn-fantasma" href="looma.html">Ver Looma</a>
          <a class="btn-claro" href="sob-medida.html">Projeto sob medida</a>
        </div>
      </div>
    </section>
""",
)

PAGINAS["looma.html"] = (
    "looma",
    "Looma — Shopping online | Cybhor Tech",
    "Coloque sua loja em um shopping online. Pix e cartão pelo Mercado Pago.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Produto</p>
        <p class="produto-nome produto-nome-claro">Looma</p>
        <h1>Sua loja dentro de um shopping online.</h1>
        <p class="pagina-hero-lead">Para quem quer vender pela internet sem montar site, hospedagem e pagamento do zero.</p>
        <div class="acoes">
          <a class="btn-claro" href="https://looma.cybhor.tech/seller-dashboard.html" target="_blank" rel="noopener">Abrir minha loja na Looma</a>
          <a class="btn-fantasma" href="https://looma.cybhor.tech" target="_blank" rel="noopener">Abrir a Looma</a>
        </div>
      </div>
    </section>

    <section class="secao secao-clara">
      <div class="container produto revelar">
        <div class="produto-texto">
          <ul class="beneficios">
            <li><strong>Fácil de montar.</strong> Cadastre a loja e os produtos pelo painel, sem programador.</li>
            <li><strong>Mais gente vendo seus produtos.</strong> O comprador encontra sua loja junto com as outras da Looma.</li>
            <li><strong>Pagamento seguro.</strong> Pix e cartão pelo Mercado Pago; sua parte vai para a sua carteira.</li>
            <li><strong>Lojas verificadas.</strong> Toda loja passa por aprovação com CNPJ.</li>
          </ul>
          <p class="entrar-valores">
            <a href="https://looma.cybhor.tech" target="_blank" rel="noopener">Entre no site para ver os valores</a>
          </p>
          <div class="acoes">
            <a class="btn-tinta" href="https://looma.cybhor.tech/seller-dashboard.html" target="_blank" rel="noopener">Abrir minha loja na Looma</a>
            <a class="btn-contorno" href="https://looma.cybhor.tech" target="_blank" rel="noopener">Abrir a Looma</a>
          </div>
        </div>
        <figure class="produto-figura produto-figura-desenho">
          <img src="img/unidade-looma.jpg" width="1280" height="720" loading="lazy"
               alt="Ilustração em traço de venda online: pessoa embalando pedido" />
          <figcaption>Looma — vender online sem montar tudo do zero.</figcaption>
        </figure>
      </div>
    </section>

    <section class="secao secao-cta">
      <div class="container cta-faixa">
        <div>
          <p class="eyebrow eyebrow-claro">Outras soluções</p>
          <h2>Precisa de caixa físico ou de um projeto sob medida?</h2>
        </div>
        <div class="acoes">
          <a class="btn-fantasma" href="pdv.html">Ver CybhorPDV</a>
          <a class="btn-claro" href="sob-medida.html">Projeto sob medida</a>
        </div>
      </div>
    </section>
""",
)

PAGINAS["sob-medida.html"] = (
    "sob-medida",
    "Projeto sob medida — Sites e sistemas | Cybhor Tech",
    "Fazemos projeto sob medida: site, sistema, automação e pagamento online criados do zero para a sua empresa.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Projeto sob medida</p>
        <h1>Fazemos sob medida o que ainda não existe pronto.</h1>
        <p class="pagina-hero-lead">
          Não é pacote genérico: você explica a rotina, nós desenhamos e entregamos
          <strong>site, sistema ou automação sob medida</strong> para a sua empresa.
        </p>
        <div class="acoes">
          <button type="button" class="btn-claro" data-abrir-contato>Pedir proposta sob medida</button>
        </div>
      </div>
    </section>

    <section class="secao">
      <div class="container">
        <div class="sob-medida-cabeca revelar">
          <div>
            <p class="eyebrow">O que fazemos sob medida</p>
            <h2>Quatro tipos de entrega sob medida</h2>
            <p class="secao-intro">Tudo abaixo é projeto sob medida — feito sob encomenda, com prazo e preço na proposta.</p>
          </div>
          <figure class="desenho desenho-compacto">
            <img src="img/unidade-projeto.jpg" width="1280" height="720" loading="lazy"
                 alt="Ilustração em traço de alguém criando um projeto no computador" />
          </figure>
        </div>
        <div class="servicos revelar">
          <article class="servico">
            <h3>Sites sob medida</h3>
            <p>Site da empresa, página de vendas ou cardápio, com botão de WhatsApp e bom no celular.</p>
          </article>
          <article class="servico">
            <h3>Sistemas sob medida</h3>
            <p>Cadastro de clientes, pedidos, agenda, estoque ou equipe. Sai a planilha, entra um sistema com login.</p>
          </article>
          <article class="servico">
            <h3>Automação sob medida</h3>
            <p>Aquele relatório que leva uma tarde. Exemplo real: laudo com mais de 340 fotos que agora sai em minutos.</p>
          </article>
          <article class="servico">
            <h3>Pagamento sob medida</h3>
            <p>Receber por Pix e cartão no seu site ou sistema, com confirmação automática.</p>
          </article>
        </div>
        <ol class="passos revelar">
          <li><strong>Você conta o que precisa</strong> — o pedido de projeto sob medida.</li>
          <li><strong>Mandamos uma proposta</strong> com o que será feito, prazo e preço fechado.</li>
          <li><strong>Você acompanha</strong> e testa as partes prontas durante o projeto.</li>
          <li><strong>Entrega e suporte</strong> depois de colocar no ar.</li>
        </ol>
        <div class="acoes">
          <button type="button" class="btn-tinta" data-abrir-contato>Pedir proposta sob medida</button>
          <a class="btn-contorno" href="sobre.html">Ver entregas sob medida</a>
        </div>
      </div>
    </section>
""",
)

PAGINAS["segmentos.html"] = (
    "segmentos",
    "Segmentos — Cybhor Tech",
    "Atendemos varejo, alimentação, serviços e escritórios com produtos prontos ou projeto sob medida.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Para quem</p>
        <h1>Segmentos que atendemos</h1>
        <p class="pagina-hero-lead">
          Em cada segmento oferecemos produto pronto (PDV ou Looma) ou
          <strong>projeto sob medida</strong> quando a rotina pede algo específico.
        </p>
      </div>
    </section>

    <section class="secao secao-clara">
      <div class="container revelar">
        <ul class="segmentos">
          <li><strong>Varejo</strong><span>PDV pronto ou sistema sob medida para a loja</span></li>
          <li><strong>Alimentação</strong><span>Caixa, cardápio online ou projeto sob medida</span></li>
          <li><strong>Serviços</strong><span>Agenda, clientes e rotina sob medida</span></li>
          <li><strong>Vendas online</strong><span>Looma pronta ou loja sob medida</span></li>
          <li><strong>Escritórios</strong><span>Sai a planilha, entra sistema sob medida</span></li>
          <li><strong>Outros</strong><span>Conte o caso — avaliamos se cabe sob medida</span></li>
        </ul>
        <div class="acoes" style="margin-top:2rem">
          <button type="button" class="btn-tinta" data-abrir-contato>Pedir projeto sob medida</button>
          <a class="btn-contorno" href="sob-medida.html">Como funciona o sob medida</a>
        </div>
      </div>
    </section>
""",
)

PAGINAS["sobre.html"] = (
    "sobre",
    "Sobre — Cybhor Tech",
    "Produtos prontos e projetos sob medida que a Cybhor Tech já entregou.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Portfólio</p>
        <h1>Produtos prontos e projetos sob medida</h1>
        <p class="pagina-hero-lead">
          Duas frentes: o que você pode usar hoje (PDV e Looma) e o que
          <strong>já fizemos sob medida</strong> sob encomenda.
        </p>
      </div>
    </section>

    <section class="secao">
      <div class="container revelar">
        <h2 class="prontos-subtitulo" style="margin-top:0">Produtos prontos</h2>
        <div class="prontos-grade">
          <article class="pronto">
            <h3>CybhorPDV</h3>
            <p>O caixa da loja física. Vende rápido, baixa o estoque sozinho e continua funcionando se a internet cair.</p>
            <div class="pronto-acoes">
              <a class="btn-tinta" href="pdv.html">Conhecer o PDV</a>
              <a class="btn-contorno" href="https://pdv.cybhor.tech" target="_blank" rel="noopener">Abrir o site</a>
            </div>
          </article>
          <article class="pronto">
            <h3>Looma</h3>
            <p>Sua loja dentro de um shopping online. Cadastre produtos e receba por Pix ou cartão.</p>
            <div class="pronto-acoes">
              <a class="btn-tinta" href="looma.html">Conhecer a Looma</a>
              <a class="btn-contorno" href="https://looma.cybhor.tech" target="_blank" rel="noopener">Ver a Looma</a>
            </div>
          </article>
        </div>

        <h2 class="prontos-subtitulo">Projetos sob medida que já entregamos</h2>
        <p class="secao-intro secao-intro-curta">Exemplos reais de <strong>trabalho sob medida</strong> — feitos do zero para cada cliente.</p>
        <ul class="entregas">
          <li>
            <strong>Portal de projetos sob medida</strong>
            <span>O cliente entra e vê o andamento do próprio projeto, sem ficar pedindo atualização no WhatsApp.</span>
          </li>
          <li>
            <strong>Lista de interessados sob medida</strong>
            <span>Organiza quem pediu contato e respeita a LGPD (quem pediu para não receber mais, não recebe).</span>
          </li>
          <li>
            <strong>Relatório com fotos sob medida</strong>
            <span>Mais de 340 fotos viraram um documento Word pronto, em minutos em vez de uma tarde inteira.</span>
          </li>
          <li>
            <strong>Marca e conteúdo sob medida</strong>
            <span>Logo, textos e posts prontos para publicar e apresentar a empresa.</span>
          </li>
        </ul>
        <div class="acoes" style="margin-top:1.5rem">
          <a class="btn-tinta" href="sob-medida.html">Quero um projeto sob medida</a>
        </div>
      </div>
    </section>

    <section class="secao secao-clara" aria-labelledby="titulo-duvidas">
      <div class="container container-estreito revelar">
        <p class="eyebrow">FAQ</p>
        <h2 id="titulo-duvidas">Dúvidas comuns</h2>
        <div class="faq">
          <details>
            <summary>Vocês só vendem produto pronto ou também fazem sob medida?</summary>
            <p>Os dois. CybhorPDV e Looma são produtos prontos. Se a sua necessidade for outra, <strong>fazemos projeto sob medida</strong> — site, sistema ou automação.</p>
          </details>
          <details>
            <summary>Preciso de internet o tempo todo para usar o CybhorPDV?</summary>
            <p>Não. Se a internet cair, o caixa continua vendendo. As vendas sobem sozinhas quando a conexão volta.</p>
          </details>
          <details>
            <summary>O teste grátis tem compromisso?</summary>
            <p>Não. São 30 dias com o sistema completo. Sem fidelidade.</p>
          </details>
          <details>
            <summary>Como recebo o dinheiro das vendas na Looma?</summary>
            <p>O comprador paga pelo Mercado Pago. A parte da sua loja fica na sua carteira. Os valores estão no site da Looma.</p>
          </details>
          <details>
            <summary>Quanto custa um projeto sob medida?</summary>
            <p>Depende do tamanho. Você recebe o preço fechado na proposta de projeto sob medida, antes de qualquer pagamento.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="secao secao-cta">
      <div class="container cta-faixa">
        <div>
          <p class="eyebrow eyebrow-claro">Projeto sob medida</p>
          <h2>Quer um projeto sob medida para a sua empresa?</h2>
        </div>
        <button type="button" class="btn-claro" data-abrir-contato>Pedir proposta sob medida</button>
      </div>
    </section>
""",
)


# Página da pesquisa: (ativo, titulo, descricao, corpo, scripts_opcionais)
PAGINAS_EXTRA: dict[str, tuple[str, str, str, str, str]] = {}

PAGINAS_EXTRA["pesquisa.html"] = (
    "pesquisa",
    "Pesquisa IA — Qual solução Cybhor é ideal para você?",
    "Escolha perguntas ou escrever/falar. A pesquisa com IA indica CybhorPDV, Looma ou projeto sob medida — e leva ao cadastro.",
    """
    <section class="pagina-hero">
      <div class="container pagina-hero-conteudo">
        <p class="eyebrow eyebrow-claro">Pesquisa com IA</p>
        <h1>Qual solução combina com você agora?</h1>
        <p class="pagina-hero-lead">
          Você escolhe: <strong>responder perguntas</strong> ou <strong>escrever / falar</strong>
          (microfone no mesmo campo). O assistente Cybhor indica se o melhor é produto pronto
          ou projeto sob medida — e já encaminha o cadastro.
        </p>
      </div>
    </section>

    <section class="secao secao-clara">
      <div class="container">
        <div id="pesquisa-ia" class="pesquisa-ia" aria-live="polite"></div>
      </div>
    </section>
""",
    f'<script src="pesquisa.js?v={ASSET}"></script>',
)


def main() -> None:
    for nome, (ativo, titulo, descricao, corpo) in PAGINAS.items():
        html = casco(titulo, descricao, ativo, corpo.rstrip() + "\n")
        (ROOT / nome).write_text(html, encoding="utf-8")
        print(f"ok {nome}")

    for nome, (ativo, titulo, descricao, corpo, scripts) in PAGINAS_EXTRA.items():
        html = casco(titulo, descricao, ativo, corpo.rstrip() + "\n", scripts=scripts)
        (ROOT / nome).write_text(html, encoding="utf-8")
        print(f"ok {nome}")


if __name__ == "__main__":
    main()
