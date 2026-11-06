const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const NOME_BANCO = 'acessacidade';
const NOME_COLECAO = 'registros';

const client = new MongoClient(url);

function colecaoRegistros() {
  return client.db(NOME_BANCO).collection(NOME_COLECAO);
}

module.exports = { client, colecaoRegistros, NOME_BANCO, NOME_COLECAO };
