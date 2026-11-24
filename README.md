# CrossRate

Aplicação web desenvolvida em React, Vite e Axios para acompanhamento de cotações de moedas fiduciárias e criptomoedas, permitindo alternar dinamicamente a moeda de referência da comparação (*cross-rate*) entre **BRL**, **USD** e **EUR**.

---

## 🎯 Objetivo acadêmico

Projeto desenvolvido como atividade do curso SENAI para praticar o consumo de APIs REST públicas em React. Os conceitos trabalhados são:

* Criação de projeto com **Vite + React (JavaScript)**;
* Requisições HTTP `GET` com **Axios** e instâncias configuradas com `axios.create()`;
* Uso de **`useEffect`** para disparar requisições e de **`useState`** para guardar dados, carregamento e erros;
* Hook personalizado (`useRates`) para separar a lógica de dados da interface;
* Renderização de listas com **`.map()`** e `key` únicas;
* Componentização com dados passados por **props**;
* Filtro local com **`.filter()`** (busca).

---

## ✅ Funcionalidades

* **Seleção da moeda de referência:** BRL (padrão), USD ou EUR. Ao trocar, as duas listagens são recarregadas já convertidas para a moeda escolhida.
* **Moedas fiduciárias (AwesomeAPI):** 8 moedas internacionais (USD, EUR, BRL, GBP, JPY, CHF, CAD, AUD e CNY, sem a moeda de referência) com nome, sigla, cotação atual, máxima, mínima e variação percentual.
* **Criptomoedas (CoinGecko):** as 8 maiores por capitalização de mercado, com imagem, nome, sigla, posição no ranking, cotação atual, máxima e mínima de 24h e variação percentual de 24h.
* **Busca (bônus):** campo que filtra as duas listagens em tempo real pelo nome ou pela sigla, usando `.filter()` sobre os dados já armazenados no estado (nenhuma requisição nova a cada tecla). Exibe mensagem quando nada é encontrado.
* **Feedback ao usuário:**
  * mensagem de carregamento em cada listagem;
  * mensagem amigável de erro;
  * as duas APIs são tratadas de forma **independente**: se uma falhar, a outra listagem continua funcionando;
  * valores ausentes são exibidos como `—`;
  * variação positiva em verde e negativa em vermelho.
* **Layout responsivo** com cards em grid (computador e celular).

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
| :--- | :--- |
| [React](https://react.dev/) | Interface e hooks (`useState`, `useEffect`) |
| [Vite](https://vite.dev/) | Criação do projeto, servidor de desenvolvimento e build |
| [Axios](https://axios-http.com/) | Requisições HTTP |
| CSS puro | Estilização (um `styles.css` por componente) |
| ESLint | Verificação de código (`npm run lint`) |

---

## 🌐 APIs Utilizadas e Documentação

O projeto consome duas APIs REST públicas e gratuitas, **sem chave de acesso**, através de instâncias separadas configuradas com `axios.create()` em `src/services/api.js`.

### 1. AwesomeAPI: cotações de moedas fiduciárias

Utilizada como fonte para o câmbio comercial entre moedas internacionais.

* **Base URL:** `https://economia.awesomeapi.com.br/json`
* **Endpoints consumidos:**
  * `GET /available`: lista os pares suportados. É consultado antes das cotações para montar apenas pares válidos.
  * `GET /last/{pares}`: última cotação dos pares (ex.: `/last/USD-BRL,EUR-BRL,GBP-BRL`).
* **Documentação oficial:** [AwesomeAPI - API de Moedas](https://docs.awesomeapi.com.br/api-de-moedas)
* **Pares disponíveis:** [Lista de combinações suportadas](https://economia.awesomeapi.com.br/json/available)

Os pares são montados no formato `{MOEDA}-{REFERÊNCIA}`. Por exemplo, com BRL selecionado, `USD-BRL` retorna quanto vale 1 dólar em reais. A resposta é um objeto com chaves sem o hífen (`USDBRL`, `EURBRL`...), que o hook transforma em array para usar `.map()`.

**Principais campos utilizados na resposta:**

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `code` | `string` | Sigla da moeda de origem (ex.: `EUR`, `GBP`) |
| `codein` | `string` | Sigla da moeda de referência (ex.: `BRL`); usada na formatação do preço e na `key` |
| `name` | `string` | Nome do par (ex.: `Dólar Americano/Real Brasileiro`); é exibida só a parte antes da `/` |
| `bid` | `string` | Valor de compra (cotação atual de referência) |
| `high` | `string` | Cotação máxima registrada |
| `low` | `string` | Cotação mínima registrada |
| `pctChange` | `string` | Variação percentual |

---

### 2. CoinGecko API: mercado de criptomoedas

Utilizada para listar os principais criptoativos por capitalização de mercado, convertidos diretamente para a moeda de referência selecionada.

* **Base URL:** `https://api.coingecko.com/api/v3`
* **Endpoint consumido:** `GET /coins/markets`
* **Parâmetros enviados:**

| Parâmetro | Valor | Descrição |
| :--- | :--- | :--- |
| `vs_currency` | `brl`, `usd` ou `eur` | Moeda de referência selecionada |
| `order` | `market_cap_desc` | Ordena pela capitalização de mercado |
| `per_page` | `8` | Quantidade de criptomoedas |
| `page` | `1` | Primeira página |

* **Documentação oficial (endpoint):** [CoinGecko - Coins Markets](https://docs.coingecko.com/reference/coins-markets)
* **Documentação geral e limites:** [CoinGecko API Introduction](https://docs.coingecko.com/reference/introduction)
* **Moedas de referência suportadas:** [Supported VS Currencies](https://api.coingecko.com/api/v3/simple/supported_vs_currencies)

**Principais campos utilizados na resposta:**

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | Identificador único do criptoativo (usado como `key` na listagem) |
| `symbol` | `string` | Sigla da criptomoeda (ex.: `btc`, `eth`) |
| `name` | `string` | Nome completo do ativo (ex.: `Bitcoin`) |
| `image` | `string` | URL do logotipo oficial do ativo |
| `current_price` | `number` | Preço atual na moeda definida em `vs_currency` |
| `market_cap_rank` | `number` | Posição no ranking global por capitalização |
| `high_24h` | `number` | Preço máximo nas últimas 24 horas |
| `low_24h` | `number` | Preço mínimo nas últimas 24 horas |
| `price_change_percentage_24h` | `number` | Variação percentual nas últimas 24 horas |

---

## ⚠️ Limitações das APIs

* **Limite de requisições da CoinGecko:** a API pública (sem chave) aceita poucas requisições por minuto. Trocar de moeda muitas vezes seguidas pode estourar o limite. Nesse caso a API responde `429` **sem o cabeçalho CORS**, então o navegador só enxerga um erro de rede. A aplicação mostra uma mensagem pedindo para aguardar e a listagem de moedas continua funcionando normalmente.
* **Modo de desenvolvimento:** o `<StrictMode>` do React executa os efeitos duas vezes em `npm run dev`, dobrando as requisições. Isso não acontece no build de produção.
* **Pares inválidos na AwesomeAPI:** se um único par da URL não existir, a API retorna `404` para a requisição inteira. Por isso o hook consulta `/available` e envia apenas pares suportados.
* **Atualização dos dados:** as cotações não são em tempo real a cada segundo. As APIs atualizam os valores periodicamente, e a aplicação busca novos dados ao abrir a página e ao trocar a moeda de referência.

---

## 📁 Estrutura de pastas

```text
src/
├── components/
│   ├── Header/          # Título e descrição da aplicação
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── Footer/          # Créditos das APIs e identificação do projeto
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── CurrencyCard/    # Card de moeda fiduciária (recebe dados por props)
│   │   ├── index.jsx
│   │   └── styles.css
│   └── CryptoCard/      # Card de criptomoeda (recebe dados por props)
│       ├── index.jsx
│       └── styles.css
├── hooks/
│   └── useRates.js      # Requisições com useEffect + estados com useState
├── services/
│   └── api.js           # Duas instâncias do Axios (AwesomeAPI e CoinGecko)
├── utils/
│   └── format.js        # Formatação de preços e variações (compartilhada pelos cards)
├── App.jsx              # Página: seleção de moeda, busca e listagens
├── App.css              # Estilos da página
├── index.css            # Paleta de cores e estilos globais dos cards
└── main.jsx             # Ponto de entrada do React
```

---

## 🔄 Fluxo dos dados

```text
App (useState: baseCurrency, searchTerm)
 │
 ├─ useRates(baseCurrency) ── useEffect [baseCurrency] ──► awesomeApi.get("/available") + ("/last/...")
 │                         └─ useEffect [baseCurrency] ──► coinGeckoApi.get("/coins/markets", { params })
 │        │
 │        └─ respostas salvas com useState (dados, carregando, erro) para cada API
 │
 ├─ .filter() pelo searchTerm (sem novas requisições)
 │
 └─ .map() ──► <CurrencyCard currency={...} />   <CryptoCard crypto={...} currency={...} />
```

1. O usuário escolhe a moeda de referência; o valor fica em um `useState` no `App`.
2. O hook `useRates` recebe essa moeda. Seus dois `useEffect` têm `baseCurrency` como dependência e são executados de novo sempre que ela muda.
3. Cada efeito usa sua instância do Axios (`src/services/api.js`), liga o carregamento, faz a requisição e guarda o resultado (ou a mensagem de erro) em `useState`. Cada API tem seus próprios estados, por isso uma falha não afeta a outra.
4. Uma variável `ignore` na função de limpeza do `useEffect` descarta respostas antigas caso o usuário troque de moeda antes da requisição anterior terminar.
5. O `App` aplica a busca com `.filter()` e renderiza os cards com `.map()`, usando `key` estáveis (`code-codein` para moedas e `id` para criptomoedas). Os cards recebem os dados por props.

---

## ▶️ Instalação e execução

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

```bash
# Clonar o repositório
git clone https://github.com/RHU4N/CrossRate.git
cd CrossRate

# Instalar as dependências
npm install

# Rodar em modo de desenvolvimento (http://localhost:5173)
npm run dev
```

Outros comandos:

```bash
npm run lint      # Verifica o código com ESLint
npm run build     # Gera a versão de produção na pasta dist/
npm run preview   # Serve localmente o build de produção
```

Não é necessário configurar variáveis de ambiente nem chaves de API.
