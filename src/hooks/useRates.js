import { useState, useEffect } from "react";
import { awesomeApi, coinGeckoApi } from "../services/api";

// Principais moedas internacionais exibidas na listagem de moedas fiduciárias.
// A moeda de referência selecionada é removida da lista, sobrando sempre 8 cards.
const FIAT_CURRENCIES = ["USD", "EUR", "BRL", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY"];

export default function useRates(baseCurrency) {
  const [currencies, setCurrencies] = useState([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [currencyError, setCurrencyError] = useState(null);

  const [cryptos, setCryptos] = useState([]);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);
  const [cryptoError, setCryptoError] = useState(null);

  // Moedas fiduciárias (AwesomeAPI)
  useEffect(() => {
    // Evita que a resposta de uma moeda antiga sobrescreva a da moeda atual
    let ignore = false;

    async function fetchCurrencies() {
      try {
        setIsLoadingCurrencies(true);
        setCurrencyError(null);

        // 1. Busca os pares suportados para não enviar pares inválidos
        const availableResponse = await awesomeApi.get("/available");
        const availablePairs = availableResponse.data;

        const pairs = FIAT_CURRENCIES.filter((code) => code !== baseCurrency)
          .map((code) => `${code}-${baseCurrency}`)
          .filter((pair) => availablePairs[pair]);

        if (pairs.length === 0) {
          throw new Error("Nenhum par disponível para a moeda selecionada");
        }

        // 2. Busca a última cotação de todos os pares de uma vez
        const response = await awesomeApi.get(`/last/${pairs.join(",")}`);

        // A resposta é um objeto com chaves como "USDBRL"; transformamos em array
        const data = pairs
          .map((pair) => response.data[pair.replace("-", "")])
          .filter(Boolean);

        if (!ignore) setCurrencies(data);
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setCurrencies([]);
          setCurrencyError("Não foi possível carregar as cotações das moedas. Tente novamente mais tarde.");
        }
      } finally {
        if (!ignore) setIsLoadingCurrencies(false);
      }
    }

    fetchCurrencies();

    return () => {
      ignore = true;
    };
  }, [baseCurrency]);

  // Criptomoedas (CoinGecko)
  useEffect(() => {
    let ignore = false;

    async function fetchCryptos() {
      try {
        setIsLoadingCryptos(true);
        setCryptoError(null);

        const response = await coinGeckoApi.get("/coins/markets", {
          params: {
            vs_currency: baseCurrency.toLowerCase(),
            order: "market_cap_desc",
            per_page: 8,
            page: 1,
          },
        });

        if (!ignore) setCryptos(response.data);
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setCryptos([]);
          // Quando o limite é atingido, a CoinGecko responde 429 sem cabeçalho CORS,
          // então o navegador só enxerga um "Network Error". Por isso a mensagem cita o limite.
          setCryptoError(
            "Não foi possível carregar as cotações das criptomoedas. A API pública da CoinGecko limita as requisições por minuto; aguarde um pouco e troque a moeda ou recarregue a página.",
          );
        }
      } finally {
        if (!ignore) setIsLoadingCryptos(false);
      }
    }

    fetchCryptos();

    return () => {
      ignore = true;
    };
  }, [baseCurrency]);

  return {
    currencies,
    isLoadingCurrencies,
    currencyError,
    cryptos,
    isLoadingCryptos,
    cryptoError,
  };
}
