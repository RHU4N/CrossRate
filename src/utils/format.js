// Funções de formatação usadas pelos cards e pela página

// Confere se o valor existe e é um número de verdade
function isValidNumber(value) {
  return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
}

// A AwesomeAPI devolve o nome do par ("Dólar Americano/Real Brasileiro"),
// mas no card queremos mostrar só a moeda de origem ("Dólar Americano")
export function getCurrencyName(currency) {
  return currency.name ? currency.name.split("/")[0] : currency.code;
}

// Formata um valor no padrão brasileiro com o símbolo da moeda (ex.: R$ 5,93).
// Se o valor não vier da API, mostra "—" no lugar.
export function formatPrice(value, currency) {
  if (!isValidNumber(value)) return "—";

  const number = Number(value);

  // Valores bem pequenos (ex.: 1 iene em reais = 0,037) precisam de mais casas decimais
  const decimals = Math.abs(number) < 1 ? 6 : 2;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

// Formata a variação percentual com seta (ex.: ▲ 1,25% ou ▼ 0,33%).
// A seta ajuda quem não diferencia bem verde de vermelho.
export function formatChange(value) {
  if (!isValidNumber(value)) return "—";

  const number = Number(value);
  const text = `${Math.abs(number).toFixed(2).replace(".", ",")}%`;

  if (number > 0) return `▲ ${text}`;
  if (number < 0) return `▼ ${text}`;
  return text;
}

// Escolhe a classe CSS que pinta a variação de verde, vermelho ou cinza
export function getChangeClass(value) {
  if (!isValidNumber(value) || Number(value) === 0) return "change-neutral";
  return Number(value) > 0 ? "change-positive" : "change-negative";
}

// Mostra só a hora da última atualização (ex.: 14:05)
export function formatTime(date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
