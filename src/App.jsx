import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CurrencyCard } from "./components/CurrencyCard";
import { CryptoCard } from "./components/CryptoCard";
import useRates from "./hooks/useRates";
import { getCurrencyName, formatTime } from "./utils/format";
import "./App.css";

// Moedas que o usuário pode escolher como referência
const BASE_CURRENCIES = [
  { code: "BRL", symbol: "R$", label: "Real", plural: "reais" },
  { code: "USD", symbol: "US$", label: "Dólar", plural: "dólares" },
  { code: "EUR", symbol: "€", label: "Euro", plural: "euros" },
];

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState("BRL");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    currencies,
    isLoadingCurrencies,
    currencyError,
    cryptos,
    isLoadingCryptos,
    cryptoError,
    lastUpdate,
    refresh,
  } = useRates(baseCurrency);

  const isLoading = isLoadingCurrencies || isLoadingCryptos;
  const selectedBase = BASE_CURRENCIES.find((currency) => currency.code === baseCurrency);

  // Busca local: filtra o que já está salvo no estado, sem fazer novas requisições
  const search = searchTerm.trim().toLowerCase();

  const filteredCurrencies = currencies.filter(
    (currency) =>
      getCurrencyName(currency).toLowerCase().includes(search) ||
      currency.code?.toLowerCase().includes(search),
  );

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name?.toLowerCase().includes(search) ||
      crypto.symbol?.toLowerCase().includes(search),
  );

  // Preço de uma cripto em cada uma das outras moedas (cross rate).
  // Ex.: se 1 BTC = R$ 356.000 e 1 USD = R$ 5,93, então 1 BTC = 356.000 ÷ 5,93 ≈ US$ 60.000.
  // Usamos a lista completa de moedas (e não a filtrada) para os valores não sumirem durante a busca.
  function getConversions(crypto) {
    if (!crypto.current_price) return [];

    return currencies
      .filter((currency) => Number(currency.bid))
      .map((currency) => ({
        code: currency.code,
        name: getCurrencyName(currency),
        price: crypto.current_price / Number(currency.bid),
      }));
  }

  // Texto do contador ao lado do título de cada seção (ex.: "8 moedas" ou "2 de 8 moedas")
  function getCountText(shown, total, word) {
    return search ? `${shown} de ${total} ${word}` : `${total} ${word}`;
  }

  // Texto ao lado do botão "Atualizar cotações"
  function getUpdateText() {
    if (isLoading) return "Buscando cotações...";
    if (lastUpdate) return `Atualizado às ${formatTime(lastUpdate)}`;
    return "Ainda não foi possível atualizar";
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="controls">
          <div className="control-row">
            <span className="control-label">Comparar com</span>
            <div className="base-buttons">
              {BASE_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  className={currency.code === baseCurrency ? "base-button active" : "base-button"}
                  aria-pressed={currency.code === baseCurrency}
                  onClick={() => setBaseCurrency(currency.code)}
                >
                  <strong>{currency.symbol}</strong> {currency.label}
                </button>
              ))}
            </div>
          </div>

          <input
            type="search"
            className="search-input"
            aria-label="Buscar por nome ou sigla"
            placeholder="🔎 Buscar por nome ou sigla"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="update-row">
            <span className="update-text">{getUpdateText()}</span>
            <button type="button" className="refresh-button" onClick={refresh} disabled={isLoading}>
              🔄 Atualizar cotações
            </button>
          </div>
        </section>

        {/* ---------- Moedas fiduciárias ---------- */}
        <section className="rates-section">
          <div className="section-header">
            <h2>Moedas</h2>
            {!isLoadingCurrencies && !currencyError && (
              <span className="section-count">
                {getCountText(filteredCurrencies.length, currencies.length, "moedas")}
              </span>
            )}
          </div>
          <p className="section-subtitle">
            Quanto vale 1 unidade de cada moeda em {selectedBase.plural}.
          </p>

          {isLoadingCurrencies && <p className="status-message">⏳ Buscando cotações das moedas...</p>}

          {!isLoadingCurrencies && currencyError && (
            <p className="status-message status-error">⚠️ {currencyError}</p>
          )}

          {!isLoadingCurrencies && !currencyError && filteredCurrencies.length === 0 && (
            <p className="status-message">🔍 Nenhuma moeda encontrada para "{searchTerm}".</p>
          )}

          {!isLoadingCurrencies && !currencyError && filteredCurrencies.length > 0 && (
            <div className="cards-grid">
              {filteredCurrencies.map((currency) => (
                <CurrencyCard key={`${currency.code}-${currency.codein}`} currency={currency} />
              ))}
            </div>
          )}
        </section>

        {/* ---------- Criptomoedas ---------- */}
        <section className="rates-section">
          <div className="section-header">
            <h2>Criptomoedas</h2>
            {!isLoadingCryptos && !cryptoError && (
              <span className="section-count">
                {getCountText(filteredCryptos.length, cryptos.length, "criptomoedas")}
              </span>
            )}
          </div>
          <p className="section-subtitle">
            As 8 maiores por valor de mercado, com preços em {selectedBase.plural}. Em cada card, abra "Ver
            em outras moedas" para conferir o preço nas demais moedas.
          </p>

          {isLoadingCryptos && <p className="status-message">⏳ Buscando cotações das criptomoedas...</p>}

          {!isLoadingCryptos && cryptoError && (
            <p className="status-message status-error">⚠️ {cryptoError}</p>
          )}

          {!isLoadingCryptos && !cryptoError && filteredCryptos.length === 0 && (
            <p className="status-message">🔍 Nenhuma criptomoeda encontrada para "{searchTerm}".</p>
          )}

          {!isLoadingCryptos && !cryptoError && filteredCryptos.length > 0 && (
            <div className="cards-grid">
              {filteredCryptos.map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  currency={baseCurrency}
                  conversions={getConversions(crypto)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
