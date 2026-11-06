const { CATEGORIAS, PRIORIDADES, LIMITES } = require('./categorias');

function textoLimpo(valor) {
  if (typeof valor === 'string') {
    return valor.trim();
  }
  return '';
}

function validarTexto(valor, campo, rotulo, erros) {
  const { minimo, maximo } = LIMITES[campo];
  if (valor.length === 0) {
    erros.push(`O campo "${rotulo}" é obrigatório.`);
  } else if (valor.length < minimo || valor.length > maximo) {
    erros.push(`O campo "${rotulo}" deve ter entre ${minimo} e ${maximo} caracteres.`);
  }
}

function validarRegistro(body) {
  const dados = {
    categoria: textoLimpo(body.categoria),
    endereco: textoLimpo(body.endereco),
    bairro: textoLimpo(body.bairro),
    prioridade: textoLimpo(body.prioridade),
    descricao: textoLimpo(body.descricao),
  };
  const erros = [];

  if (!Object.hasOwn(CATEGORIAS, dados.categoria)) {
    erros.push('Selecione uma categoria válida.');
  }
  validarTexto(dados.endereco, 'endereco', 'Endereço / ponto de referência', erros);
  validarTexto(dados.bairro, 'bairro', 'Bairro', erros);
  if (!Object.hasOwn(PRIORIDADES, dados.prioridade)) {
    erros.push('Selecione uma prioridade válida (baixa, média ou alta).');
  }
  validarTexto(dados.descricao, 'descricao', 'Descrição', erros);

  return {
    valido: erros.length === 0,
    erros: erros,
    dados: dados,
  };
}

module.exports = { validarRegistro };
