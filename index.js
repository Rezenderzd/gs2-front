const express = require('express');
const path = require('path');
const { client, NOME_BANCO, NOME_COLECAO } = require('./db/conn');
const registros = require('./routes/registros');
const paginas = require('./helpers/paginas');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(paginas.paginaInicial());
});

app.use('/registros', registros);

app.use((req, res) => {
  res.status(404).send(paginas.paginaNaoEncontrada(req.originalUrl));
});

async function iniciarServidor() {
  try {
    await client.connect();
    console.log(`Conectado ao MongoDB (banco "${NOME_BANCO}", coleção "${NOME_COLECAO}")`);
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB. Verifique se ele está em execução.');
    console.error(erro.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

iniciarServidor();
