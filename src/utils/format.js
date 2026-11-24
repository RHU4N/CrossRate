// Funções de formatação compartilhadas pelos cards

// A AwesomeAPI devolve o nome do par ("Dólar Americano/Real Brasileiro"); usamos só a moeda de origem
export function getCurrencyName(currency) {
  return currency.name ? currency.name.split("/")[0] : currency.code;
}

// Formata um valor na moeda de referência (ex.: R$ 5,93). Valores ausentes viram "—".
export function formatPrice(value, currency) {
  const number = Number(value);
  if (value === null || value === undefined || value === "" || Number.isNaN(number)) {
    return "—";
  }

  // Valores pequenos (ex.: iene em real) precisam de mais casas decimais
  const decimals = Math.abs(number) < 1 ? 6 : 2;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

// Formata a variação percentual com sinal (ex.: +1,25%)
export function formatChange(value) {
  const number = Number(value);
  if (value === null || value === undefined || value === "" || Number.isNaN(number)) {
    return "—";
  }

  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(2).replace(".", ",")}%`;
}

// Retorna a classe CSS usada para colorir a variação
export function getChangeClass(value) {
  const number = Number(value);
  if (value === null || value === undefined || Number.isNaN(number) || number === 0) {
    return "change-neutral";
  }
  return number > 0 ? "change-positive" : "change-negative";
}
