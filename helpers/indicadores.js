const { CATEGORIAS, PRIORIDADES, rotuloPrioridade } = require('./categorias');

function normalizarBairro(bairro) {
  return String(bairro)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function contagemInicial(opcoes) {
  const contagem = new Map();
  for (const chave of Object.keys(opcoes)) {
    contagem.set(chave, 0);
  }
  return contagem;
}

function somar(contagem, chave) {
  if (contagem.has(chave)) {
    contagem.set(chave, contagem.get(chave) + 1);
  }
}

function paraLista(contagem, rotuloDe) {
  const lista = [];
  for (const [chave, quantidade] of contagem) {
    lista.push({ chave: chave, rotulo: rotuloDe(chave), quantidade: quantidade });
  }
  return lista;
}

function bairrosMaisCriticos(bairros) {
  let maior = 0;
  for (const bairro of bairros.values()) {
    if (bairro.quantidade > maior) {
      maior = bairro.quantidade;
    }
  }
  if (maior === 0) {
    return null;
  }

  const nomes = [];
  for (const bairro of bairros.values()) {
    if (bairro.quantidade === maior) {
      nomes.push(bairro.nome);
    }
  }
  return { nomes: nomes, quantidade: maior, empate: nomes.length > 1 };
}

function calcularIndicadores(registros) {
  const porCategoria = contagemInicial(CATEGORIAS);
  const porPrioridade = contagemInicial(PRIORIDADES);
  const bairros = new Map();

  for (const registro of registros) {
    somar(porCategoria, registro.categoria);
    somar(porPrioridade, registro.prioridade);

    if (typeof registro.bairro === 'string' && registro.bairro.trim() !== '') {
      const chave = normalizarBairro(registro.bairro);
      const nomeDigitado = registro.bairro.trim().replace(/\s+/g, ' ');
      const cadastradoEm = new Date(registro.criadoEm).getTime() || 0;
      const atual = bairros.get(chave);
      if (!atual) {
        bairros.set(chave, { nome: nomeDigitado, primeiroEm: cadastradoEm, quantidade: 1 });
      } else {
        atual.quantidade += 1;
        if (cadastradoEm < atual.primeiroEm) {
          atual.nome = nomeDigitado;
          atual.primeiroEm = cadastradoEm;
        }
      }
    }
  }

  const total = registros.length;
  const listaPrioridades = paraLista(porPrioridade, rotuloPrioridade);
  const quantidadeAlta = listaPrioridades.find((item) => item.chave === 'alta').quantidade;

  return {
    total: total,
    porCategoria: paraLista(porCategoria, (chave) => CATEGORIAS[chave]),
    porPrioridade: listaPrioridades,
    percentualAlta: total > 0 ? Math.round((quantidadeAlta / total) * 100) : 0,
    bairroCritico: bairrosMaisCriticos(bairros),
  };
}

module.exports = { calcularIndicadores, normalizarBairro };
