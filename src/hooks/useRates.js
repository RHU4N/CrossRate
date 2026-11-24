import { useState, useEffect } from "react";
import { awesomeApi, coinGeckoApi } from "../services/api";

// Moedas que aparecem na listagem de moedas fiduciárias.
// A moeda de referência escolhida sai da lista, então sempre sobram 8 cards.
const FIAT_CURRENCIES = ["USD", "EUR", "BRL", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY"];

// A CoinGecko gratuita aceita poucas consultas por minuto.
// Para não estourar o limite quando o usuário troca BRL → USD → BRL,
// guardamos a última resposta de cada moeda por 1 minuto.
// Ex.: cryptoCache.brl = { data: [...], time: 1716400000000 }
const cryptoCache = {};
const CACHE_TIME = 60 * 1000;

// Hook que busca as cotações das duas APIs sempre que a moeda de referência muda
// (ou quando o usuário clica em "Atualizar cotações").
export default function useRates(baseCurrency) {
  // Estados das moedas fiduciárias
  const [currencies, setCurrencies] = useState([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [currencyError, setCurrencyError] = useState(null);

  // Estados das criptomoedas
  const [cryptos, setCryptos] = useState([]);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);
  const [cryptoError, setCryptoError] = useState(null);

  // Cada clique em "Atualizar" soma 1 aqui; como ele está nas dependências
  // dos useEffect, as requisições são feitas de novo
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Moedas fiduciárias (AwesomeAPI)
  useEffect(() => {
    // Se o usuário trocar de moeda antes da resposta chegar, a resposta antiga é ignorada
    let ignore = false;

    async function fetchCurrencies() {
      try {
        setIsLoadingCurrencies(true);
        setCurrencyError(null);

        // 1º) Pega a lista de pares que a API suporta.
        // Se um único par for inválido, a AwesomeAPI devolve erro para a requisição inteira.
        const availableResponse = await awesomeApi.get("/available");
        const availablePairs = availableResponse.data;

        // Monta pares como "USD-BRL" (quanto vale 1 USD em BRL) e mantém só os que existem
        const pairs = FIAT_CURRENCIES.filter((code) => code !== baseCurrency)
          .map((code) => `${code}-${baseCurrency}`)
          .filter((pair) => availablePairs[pair]);

        if (pairs.length === 0) {
          throw new Error("Nenhum par disponível para a moeda selecionada");
        }

        // 2º) Busca a cotação de todos os pares em uma requisição só
        const response = await awesomeApi.get(`/last/${pairs.join(",")}`);

        // A resposta vem como objeto ({ USDBRL: {...}, EURBRL: {...} }),
        // então transformamos em array para conseguir usar .map() na tela
        const data = pairs
          .map((pair) => response.data[pair.replace("-", "")])
          .filter(Boolean);

        if (!ignore) {
          setCurrencies(data);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setCurrencies([]);
          setCurrencyError("Não conseguimos buscar as cotações das moedas agora. Tente atualizar daqui a pouco.");
        }
      } finally {
        if (!ignore) setIsLoadingCurrencies(false);
      }
    }

    fetchCurrencies();

    // Função de limpeza: roda antes do próximo efeito
    return () => {
      ignore = true;
    };
  }, [baseCurrency, refreshCount]);

  // Criptomoedas (CoinGecko)
  useEffect(() => {
    let ignore = false;

    async function fetchCryptos() {
      try {
        setIsLoadingCryptos(true);
        setCryptoError(null);

        const vsCurrency = baseCurrency.toLowerCase();
        const cached = cryptoCache[vsCurrency];

        // Se já buscamos essa moeda há menos de 1 minuto, reaproveita a resposta
        if (cached && Date.now() - cached.time < CACHE_TIME) {
          if (!ignore) setCryptos(cached.data);
          return;
        }

        const response = await coinGeckoApi.get("/coins/markets", {
          params: {
            vs_currency: vsCurrency,
            order: "market_cap_desc",
            per_page: 8,
            page: 1,
          },
        });

        cryptoCache[vsCurrency] = { data: response.data, time: Date.now() };

        if (!ignore) {
          setCryptos(response.data);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setCryptos([]);
          // Quando o limite é atingido, a CoinGecko responde 429 sem cabeçalho CORS,
          // e o navegador só enxerga um "Network Error". Por isso a mensagem já fala do limite.
          setCryptoError(
            "Não conseguimos buscar as criptomoedas agora. A CoinGecko gratuita aceita poucas consultas por minuto, então espere um pouquinho e clique em atualizar.",
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
  }, [baseCurrency, refreshCount]);

  // Botão "Atualizar cotações": apaga o cache da moeda atual e busca tudo de novo
  function refresh() {
    delete cryptoCache[baseCurrency.toLowerCase()];
    setRefreshCount((count) => count + 1);
  }

  return {
    currencies,
    isLoadingCurrencies,
    currencyError,
    cryptos,
    isLoadingCryptos,
    cryptoError,
    lastUpdate,
    refresh,
  };
}
