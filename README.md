# AcessaCidade

Protótipo CitizenTech para **registrar e acompanhar barreiras de acessibilidade urbana**.
Global Solution 2026.2 · Application Development · Prof. Allan Roberto Molto · FIAP.

**Integrantes:** 
| RM | Nome |
|:---:|---|
| 563415 | Fernando Caires Silva |
| 563500 | Guilherme Martins Rezende |
| 563567 | Raphael Mischiatti de Souza |

**Vídeo pitch:** https://youtu.be/aThKB3GBBYU

## Problema, público-alvo, objetivo e ODS

| | |
|---|---|
| **Problema** | Calçadas quebradas, rampas ausentes, obstáculos, falta de piso tátil e de semáforos sonoros impedem ou colocam em risco o deslocamento de muitas pessoas. As reclamações ficam dispersas e não mostram onde e o que é mais urgente. |
| **Público-alvo** | Quem registra: pessoas com deficiência e mobilidade reduzida, idosos, pais com carrinho de bebê e moradores em geral. Quem usa os dados: subprefeituras, associações de bairro e ONGs de acessibilidade. |
| **Objetivo** | Registrar barreiras de forma simples e transformar os registros em indicadores que ajudem a priorizar reparos. |
| **ODS** | **ODS 11 – Cidades e Comunidades Sustentáveis** (metas 11.2 e 11.7) e **ODS 10 – Redução das Desigualdades** (meta 10.2). |

### O tamanho do problema (IBGE, Censo 2022)

- O Brasil tem **14,4 milhões de pessoas com deficiência**, ou **7,3%** da população com 2 anos ou mais ([Agência Brasil, 23/05/2025](https://agenciabrasil.ebc.com.br/direitos-humanos/noticia/2025-05/brasil-tem-144-milhoes-de-pessoas-com-deficiencia)).
- Das 174,2 milhões de pessoas que moram nas áreas urbanas pesquisadas, só **15,2%** vivem em ruas com rampa para cadeirantes ([SBT News, 17/04/2025](https://sbtnews.sbt.com.br/noticia/brasil/censo-2022-somente-15-2-dos-brasileiros-tem-acesso-a-rampas-para-cadeirantes-diz-ibge); publicação [IBGE – Características urbanísticas do entorno dos domicílios](https://biblioteca.ibge.gov.br/visualizacao/livros/liv102168.pdf)).
- **67,4%** das pessoas com deficiência moram em locais com obstáculos na calçada ([Metrópoles, 18/09/2026](https://www.metropoles.com/brasil/ibge-so-129-das-pessoas-com-deficiencia-tem-rampas-perto-de-casa), estudo IBGE *Pessoas com Deficiência e as Desigualdades Sociais no Brasil*).

## Tecnologias

HTML, CSS, JavaScript, Node.js, Express e MongoDB (driver oficial `mongodb`).

## Como executar

Pré-requisitos:

- **Node.js** instalado.
- **MongoDB Community Server** em execução, por padrão em `mongodb://127.0.0.1:27017`.

Se o MongoDB não estiver rodando como serviço, inicie-o em outro terminal:

```bash
mongod --dbpath <pasta-de-dados>
```

Na pasta do projeto (`gs2-front`):

```bash
npm install
npm start
```

Acesse **http://localhost:3000**.

O terminal deve mostrar `Conectado ao MongoDB (banco "acessacidade", coleção "registros")` e `Servidor rodando em http://localhost:3000`. O servidor só começa a aceitar requisições depois de conectar ao banco. Se a conexão falhar, ele mostra o erro e encerra com código 1.

O banco `acessacidade` e a coleção `registros` são criados automaticamente no primeiro cadastro. Os documentos podem ser conferidos no **MongoDB Compass**, conectando em `mongodb://127.0.0.1:27017`.

### Configuração opcional

| Variável | Padrão | Uso |
|---|---|---|
| `PORT` | `3000` | Porta do servidor web |
| `MONGO_URL` | `mongodb://127.0.0.1:27017` | Endereço do MongoDB (ex.: string de conexão do Atlas) |

```bash
# Linux / macOS
MONGO_URL="mongodb+srv://usuario:senha@cluster.mongodb.net" PORT=8080 npm start

# Windows (PowerShell)
$env:MONGO_URL="mongodb+srv://usuario:senha@cluster.mongodb.net"; $env:PORT=8080; npm start
```

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/` | Introdução + formulário de cadastro. |
| POST | `/registros/salvar` | Valida os campos e salva na coleção `registros`. **Sucesso:** redireciona para `/registros?ok=1` (padrão Post/Redirect/Get, então apertar F5 não duplica o registro). **Erro de validação:** status 400 e o formulário volta preenchido, com a lista de erros. |
| GET | `/registros` | Consulta a coleção (mais recentes primeiro), calcula os indicadores e lista os registros. Com `?ok=1`, mostra a mensagem de confirmação. |
| qualquer outra | — | Página 404. |

Falhas de banco durante o uso respondem com status 500 e uma mensagem de erro.

## Campos de cada registro

| Campo | Validação no servidor |
|---|---|
| `categoria` | Uma das 7 opções de `CATEGORIAS` (`helpers/categorias.js`) |
| `endereco` | Obrigatório, de 5 a 150 caracteres |
| `bairro` | Obrigatório, de 2 a 60 caracteres |
| `prioridade` | `alta`, `media` ou `baixa` |
| `descricao` | Obrigatório, de 10 a 500 caracteres |
| `criadoEm` | Data e hora geradas pelo servidor |

**Fonte única:** as categorias, as prioridades e os limites de tamanho ficam só em `helpers/categorias.js`. O formulário é gerado a partir desse arquivo, então não há como o HTML e o servidor ficarem diferentes. O navegador também valida (`required`, `minlength`, `maxlength`), mas quem decide é o servidor. Todo texto digitado é escapado antes de ir para o HTML (proteção contra XSS).

## Indicadores

Calculados em `helpers/indicadores.js`, em **uma única passada** pelos registros consultados:

1. **Total de registros:** quantidade de barreiras cadastradas.
2. **Resumo por categoria:** quantidade e percentual de cada tipo de barreira.
3. **Resumo por prioridade:** quantidade e percentual de prioridade alta, média e baixa.
4. **% de prioridade alta:** parcela das barreiras que impedem a passagem ou causam risco. Indica a urgência geral.
5. **Bairro com mais barreiras:** os nomes são comparados sem acento, sem diferença entre maiúsculas e minúsculas e sem espaços extras, então "São Paulo", "sao paulo" e " SÃO  PAULO " contam juntos. Na tela aparece o nome como foi digitado no primeiro registro daquele bairro. Em caso de empate, a tela mostra os bairros empatados (até 3) ou "Empate entre N bairros".

Regra de prioridade, explicada no próprio formulário:

- **Alta:** impede a passagem ou causa risco.
- **Média:** exige desvio ou ajuda.
- **Baixa:** dificulta a passagem.

A listagem mostra os **50 registros mais recentes**. Os indicadores sempre consideram todos os registros.

## Estrutura

```
gs2-front/
├── index.js               servidor Express: middlewares, rotas, 404 e inicialização
├── package.json
├── package-lock.json
├── db/conn.js             MongoClient, nome do banco/coleção e acesso à coleção
├── routes/registros.js    Router: GET /registros e POST /registros/salvar
├── helpers/
│   ├── categorias.js      fonte única de categorias, prioridades e limites
│   ├── validacao.js       validação dos campos do formulário
│   ├── indicadores.js     processamento dos dados (indicadores)
│   └── paginas.js         todas as páginas HTML (layout único de cabeçalho e rodapé)
├── public/css/style.css
└── README.md
```

## Entrega

O `.zip` deve conter o código **sem a pasta `node_modules`**. Para gerá-lo:

```bash
git archive -o gs2-front.zip HEAD
```

Se o projeto não estiver em um repositório git, apague a pasta `node_modules` antes de compactar. Abra o zip e confira o conteúdo antes de entregar.
