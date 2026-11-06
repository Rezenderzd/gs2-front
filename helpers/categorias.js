const CATEGORIAS = {
  'calcada-danificada': 'Calçada danificada ou irregular',
  'rampa-ausente': 'Rampa ausente ou inadequada',
  'obstaculo-calcada': 'Obstáculo na calçada',
  'piso-tatil': 'Piso tátil ausente ou danificado',
  'semaforo-sonoro': 'Semáforo sem sinal sonoro',
  'transporte-inacessivel': 'Transporte público inacessível',
  outro: 'Outro',
};

const PRIORIDADES = {
  alta: { rotulo: 'Alta', descricao: 'impede a passagem ou causa risco' },
  media: { rotulo: 'Média', descricao: 'exige desvio ou ajuda' },
  baixa: { rotulo: 'Baixa', descricao: 'dificulta a passagem' },
};

const LIMITES = {
  endereco: { minimo: 5, maximo: 150 },
  bairro: { minimo: 2, maximo: 60 },
  descricao: { minimo: 10, maximo: 500 },
};

function rotuloCategoria(chave) {
  return Object.hasOwn(CATEGORIAS, chave) ? CATEGORIAS[chave] : 'Categoria desconhecida';
}

function rotuloPrioridade(chave) {
  return Object.hasOwn(PRIORIDADES, chave) ? PRIORIDADES[chave].rotulo : 'Não informada';
}

module.exports = { CATEGORIAS, PRIORIDADES, LIMITES, rotuloCategoria, rotuloPrioridade };
