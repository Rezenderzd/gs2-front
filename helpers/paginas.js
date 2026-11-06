const {
  CATEGORIAS,
  PRIORIDADES,
  LIMITES,
  rotuloCategoria,
  rotuloPrioridade,
} = require('./categorias');

const LIMITE_LISTAGEM = 50;

function escaparHTML(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatarData(data) {
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  const doisDigitos = (numero) => (numero < 10 ? '0' + numero : numero);
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()} ${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

function layout(titulo, conteudo) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escaparHTML(titulo)} | AcessaCidade</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topo">
    <div class="container topo__conteudo">
      <a class="marca" href="/">AcessaCidade</a>
      <nav class="menu" aria-label="Navegação principal">
        <a href="/#formulario">Registrar barreira</a>
        <a href="/registros">Registros e indicadores</a>
      </nav>
    </div>
  </header>
  <main class="container">
${conteudo}
  </main>
  <footer class="rodape">
    <div class="container">AcessaCidade · Global Solution 2026.2 · CitizenTech · ODS 10 e ODS 11</div>
  </footer>
</body>
</html>`;
}

function mensagem(tipo, conteudo) {
  const papel = tipo === 'erro' ? 'alert' : 'status';
  return `<div class="mensagem mensagem--${tipo}" role="${papel}">${conteudo}</div>`;
}

function opcoesCategoria(selecionada) {
  const valida = Object.hasOwn(CATEGORIAS, selecionada ?? '');
  let opcoes = `<option value="" disabled${valida ? '' : ' selected'}>Selecione…</option>`;
  for (const chave of Object.keys(CATEGORIAS)) {
    const marcado = chave === selecionada ? ' selected' : '';
    opcoes += `
            <option value="${chave}"${marcado}>${CATEGORIAS[chave]}</option>`;
  }
  return opcoes;
}

function opcoesPrioridade(selecionada) {
  let opcoes = '';
  let primeira = true;
  for (const chave of Object.keys(PRIORIDADES)) {
    const marcado = chave === selecionada ? ' checked' : '';
    const obrigatorio = primeira ? ' required' : '';
    primeira = false;
    opcoes += `
            <div class="opcao">
              <input type="radio" id="prioridade-${chave}" name="prioridade" value="${chave}"${marcado}${obrigatorio}>
              <label for="prioridade-${chave}">${PRIORIDADES[chave].rotulo} <small>${PRIORIDADES[chave].descricao}</small></label>
            </div>`;
  }
  return opcoes;
}

function formulario(dados = {}) {
  return `
    <section id="formulario" class="cartao formulario">
      <h2>Registrar uma barreira</h2>
      <p class="formulario__ajuda">Todos os campos são obrigatórios.</p>

      <form action="/registros/salvar" method="POST">
        <div class="campo">
          <label for="categoria">Categoria</label>
          <select id="categoria" name="categoria" required>
            ${opcoesCategoria(dados.categoria)}
          </select>
        </div>

        <div class="campo">
          <label for="endereco">Endereço / ponto de referência</label>
          <input id="endereco" name="endereco" type="text" minlength="${LIMITES.endereco.minimo}" maxlength="${LIMITES.endereco.maximo}"
                 placeholder="Ex.: Rua Vergueiro, 1200 – em frente ao ponto de ônibus" value="${escaparHTML(dados.endereco)}" required>
        </div>

        <div class="campo">
          <label for="bairro">Bairro</label>
          <input id="bairro" name="bairro" type="text" minlength="${LIMITES.bairro.minimo}" maxlength="${LIMITES.bairro.maximo}"
                 placeholder="Ex.: Vila Mariana" value="${escaparHTML(dados.bairro)}" required>
        </div>

        <fieldset class="campo grupo">
          <legend>Prioridade</legend>
          <div class="opcoes">${opcoesPrioridade(dados.prioridade)}
          </div>
        </fieldset>

        <div class="campo">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" rows="4" minlength="${LIMITES.descricao.minimo}" maxlength="${LIMITES.descricao.maximo}"
                    placeholder="Descreva a barreira e quem ela afeta." required>${escaparHTML(dados.descricao)}</textarea>
        </div>

        <button type="submit" class="botao">Enviar registro</button>
      </form>
    </section>`;
}

function paginaInicial() {
  return layout('Registre barreiras de acessibilidade', `
    <section class="introducao">
      <h1>Calçadas e acessos para todas as pessoas</h1>
      <p class="introducao__chamada">
        O AcessaCidade é um protótipo CitizenTech para registrar barreiras de acessibilidade
        nas ruas e transformar esses registros em informação para quem pode resolvê-las.
      </p>

      <div class="dados">
        <div class="dado">
          <span class="dado__valor">14,4 milhões</span>
          <span class="dado__texto">de pessoas com deficiência no Brasil (7,3% da população com 2 anos ou mais)</span>
        </div>
        <div class="dado">
          <span class="dado__valor">15,2%</span>
          <span class="dado__texto">dos moradores das áreas urbanas pesquisadas vivem em ruas com rampa para cadeirantes</span>
        </div>
        <div class="dado">
          <span class="dado__valor">67,4%</span>
          <span class="dado__texto">das pessoas com deficiência moram em locais com obstáculos na calçada</span>
        </div>
      </div>
      <p class="fonte">Fonte: IBGE, Censo Demográfico 2022 (Pessoas com Deficiência; Características Urbanísticas do Entorno dos Domicílios).</p>

      <div class="cartoes-intro">
        <article class="cartao">
          <h2>Problema</h2>
          <p>
            Calçadas quebradas, rampas ausentes, obstáculos e falta de piso tátil impedem
            ou colocam em risco o deslocamento de muitas pessoas. Esses problemas ficam dispersos
            em reclamações isoladas, sem dados que mostrem onde e o que é mais urgente.
          </p>
        </article>
        <article class="cartao">
          <h2>Público-alvo</h2>
          <p>
            Pessoas com deficiência e mobilidade reduzida, idosos, pais com carrinhos de bebê e
            qualquer morador que queira registrar uma barreira. Os dados beneficiam também
            subprefeituras, associações de bairro e ONGs de acessibilidade.
          </p>
        </article>
        <article class="cartao">
          <h2>Objetivo</h2>
          <p>
            Permitir o registro rápido de barreiras (categoria, local, bairro, prioridade e descrição)
            e consolidar indicadores — total, categorias e prioridades mais frequentes e bairro
            mais crítico — para orientar a priorização de reparos.
          </p>
        </article>
        <article class="cartao">
          <h2>ODS relacionados</h2>
          <p>
            <strong>ODS 11 – Cidades e Comunidades Sustentáveis</strong> (metas 11.2 e 11.7:
            acesso seguro e espaços públicos acessíveis, com atenção a pessoas com deficiência e idosos).
          </p>
          <p>
            <strong>ODS 10 – Redução das Desigualdades</strong> (meta 10.2: inclusão social de todas as pessoas).
          </p>
        </article>
      </div>
    </section>
${formulario()}`);
}

function paginaErroValidacao(dados, erros) {
  let itens = '';
  for (const erro of erros) {
    itens += `<li>${escaparHTML(erro)}</li>`;
  }
  return layout('Corrija o cadastro', `
    <h1>Não foi possível salvar o registro</h1>
    ${mensagem('erro', `Corrija os campos abaixo e envie novamente. O que você já digitou foi mantido.<ul>${itens}</ul>`)}
${formulario(dados)}`);
}

function blocoResumo(titulo, itens, total) {
  let linhas = '';
  for (const item of itens) {
    const percentual = total > 0 ? Math.round((item.quantidade / total) * 100) : 0;
    linhas += `
          <li class="barra">
            <span class="barra__rotulo">${escaparHTML(item.rotulo)}</span>
            <span class="barra__trilho"><span class="barra__preenchimento" style="width: ${percentual}%"></span></span>
            <span class="barra__valor">${item.quantidade} <small>(${percentual}%)</small></span>
          </li>`;
  }
  return `
      <section class="cartao resumo">
        <h3>${titulo}</h3>
        <ul class="lista-barras">${linhas}
        </ul>
      </section>`;
}

function textoBairroCritico(bairroCritico) {
  if (bairroCritico === null) {
    return '—';
  }
  const { nomes, quantidade, empate } = bairroCritico;
  if (!empate) {
    return `${escaparHTML(nomes[0])} <small>(${quantidade})</small>`;
  }
  if (nomes.length <= 3) {
    const lista = nomes.map(escaparHTML).join(', ');
    return `Empate: ${lista} <small>(${quantidade} cada)</small>`;
  }
  return `Empate entre ${nomes.length} bairros <small>(${quantidade} cada)</small>`;
}

function painelIndicadores(indicadores) {
  return `
    <section>
      <h2>Indicadores</h2>
      <div class="indicadores">
        <div class="indicador">
          <span class="indicador__valor">${indicadores.total}</span>
          <span class="indicador__nome">Total de registros</span>
        </div>
        <div class="indicador indicador--alerta">
          <span class="indicador__valor">${indicadores.percentualAlta}%</span>
          <span class="indicador__nome">Prioridade alta</span>
        </div>
        <div class="indicador">
          <span class="indicador__valor indicador__valor--texto">${textoBairroCritico(indicadores.bairroCritico)}</span>
          <span class="indicador__nome">Bairro com mais barreiras</span>
        </div>
      </div>
      <div class="resumos">${blocoResumo('Resumo por categoria', indicadores.porCategoria, indicadores.total)}${blocoResumo('Resumo por prioridade', indicadores.porPrioridade, indicadores.total)}
      </div>
    </section>`;
}

function classeSelo(prioridade) {
  return Object.hasOwn(PRIORIDADES, prioridade) ? prioridade : 'desconhecida';
}

function listaRegistros(registros) {
  if (registros.length === 0) {
    return `
      <p class="vazio">Nenhuma barreira registrada ainda. <a href="/#formulario">Faça o primeiro registro.</a></p>`;
  }

  const recentes = registros.slice(0, LIMITE_LISTAGEM);
  let cartoes = '';
  for (const registro of recentes) {
    cartoes += `
        <article class="registro">
          <header class="registro__topo">
            <span class="selo selo--${classeSelo(registro.prioridade)}">${rotuloPrioridade(registro.prioridade)}</span>
            <span class="registro__data">${formatarData(registro.criadoEm)}</span>
          </header>
          <h3>${escaparHTML(rotuloCategoria(registro.categoria))}</h3>
          <p><strong>Local:</strong> ${escaparHTML(registro.endereco)} · ${escaparHTML(registro.bairro)}</p>
          <p>${escaparHTML(registro.descricao)}</p>
        </article>`;
  }

  const aviso = registros.length > LIMITE_LISTAGEM
    ? `<p class="aviso-limite">Mostrando os ${LIMITE_LISTAGEM} registros mais recentes de ${registros.length}. Os indicadores consideram todos.</p>`
    : '';

  return `
      ${aviso}
      <div class="registros">${cartoes}
      </div>`;
}

function paginaRegistros(registros, indicadores, sucesso) {
  const confirmacao = sucesso
    ? mensagem('sucesso', 'Registro salvo com sucesso! Obrigado por contribuir com uma cidade mais acessível. <a href="/#formulario">Registrar outra barreira</a>')
    : '';
  return layout('Registros e indicadores', `
    <h1>Registros e indicadores</h1>
    ${confirmacao}
    ${painelIndicadores(indicadores)}
    <section>
      <h2>Barreiras registradas <small class="subtitulo">(mais recentes primeiro)</small></h2>
      ${listaRegistros(registros)}
    </section>`);
}

function paginaNaoEncontrada(caminho) {
  return layout('Página não encontrada', `
    <h1>404 · Página não encontrada!</h1>
    ${mensagem('erro', `O endereço <code>${escaparHTML(caminho)}</code> não existe nesta aplicação.`)}
    <p><a class="botao" href="/">Voltar ao início</a></p>`);
}

function paginaErroServidor() {
  return layout('Erro no servidor', `
    <h1>Erro no servidor</h1>
    ${mensagem('erro', 'Não foi possível acessar o banco de dados agora. Verifique se o MongoDB está em execução e tente novamente.')}
    <p><a class="botao" href="/">Voltar ao início</a></p>`);
}

module.exports = {
  escaparHTML,
  paginaInicial,
  paginaErroValidacao,
  paginaRegistros,
  paginaNaoEncontrada,
  paginaErroServidor,
};
