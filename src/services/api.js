import axios from "axios";

// Instância da AwesomeAPI: cotações de moedas fiduciárias
export const awesomeApi = axios.create({
  baseURL: "https://economia.awesomeapi.com.br/json",
  timeout: 10000,
});

// Instância da CoinGecko: cotações de criptomoedas
export const coinGeckoApi = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
});
