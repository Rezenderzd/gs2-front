const express = require('express');
const router = express.Router();

const { colecaoRegistros } = require('../db/conn');
const { validarRegistro } = require('../helpers/validacao');
const { calcularIndicadores } = require('../helpers/indicadores');
const paginas = require('../helpers/paginas');

router.post('/salvar', async (req, res) => {
  const resultado = validarRegistro(req.body);

  if (!resultado.valido) {
    return res.status(400).send(paginas.paginaErroValidacao(resultado.dados, resultado.erros));
  }

  try {
    await colecaoRegistros().insertOne({
      categoria: resultado.dados.categoria,
      endereco: resultado.dados.endereco,
      bairro: resultado.dados.bairro,
      prioridade: resultado.dados.prioridade,
      descricao: resultado.dados.descricao,
      criadoEm: new Date(),
    });
    console.log('Registro cadastrado com sucesso!');
    res.redirect('/registros?ok=1');
  } catch (erro) {
    console.error('Erro ao salvar registro:', erro.message);
    res.status(500).send(paginas.paginaErroServidor());
  }
});

router.get('/', async (req, res) => {
  try {
    const lista = await colecaoRegistros().find().sort({ criadoEm: -1 }).toArray();
    const indicadores = calcularIndicadores(lista);
    res.send(paginas.paginaRegistros(lista, indicadores, req.query.ok === '1'));
  } catch (erro) {
    console.error('Erro ao consultar registros:', erro.message);
    res.status(500).send(paginas.paginaErroServidor());
  }
});

module.exports = router;
