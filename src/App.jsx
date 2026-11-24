import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CurrencyCard } from "./components/CurrencyCard";
import { CryptoCard } from "./components/CryptoCard";
import useRates from "./hooks/useRates";
import { getCurrencyName } from "./utils/format";
import "./App.css";

const BASE_CURRENCIES = [
  { code: "BRL", label: "BRL — Real brasileiro" },
  { code: "USD", label: "USD — Dólar americano" },
  { code: "EUR", label: "EUR — Euro" },
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
  } = useRates(baseCurrency);

  // Busca local: filtra os dados já guardados no estado, sem novas requisições
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

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="controls">
          <label className="control">
            Moeda de referência
            <select value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>
              {BASE_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>
          </label>

          <label className="control control-search">
            Buscar por nome ou sigla
            <input
              type="search"
              placeholder="Ex.: Euro, BTC, ethereum..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </section>

        <section className="rates-section">
          <h2>Moedas fiduciárias</h2>
          <p className="section-subtitle">Quanto vale 1 unidade de cada moeda em {baseCurrency}.</p>

          {isLoadingCurrencies && <p className="status-message">Carregando cotações das moedas...</p>}

          {!isLoadingCurrencies && currencyError && (
            <p className="status-message status-error">{currencyError}</p>
          )}

          {!isLoadingCurrencies && !currencyError && filteredCurrencies.length === 0 && (
            <p className="status-message">Nenhuma moeda encontrada para "{searchTerm}".</p>
          )}

          {!isLoadingCurrencies && !currencyError && filteredCurrencies.length > 0 && (
            <div className="cards-grid">
              {filteredCurrencies.map((currency) => (
                <CurrencyCard key={`${currency.code}-${currency.codein}`} currency={currency} />
              ))}
            </div>
          )}
        </section>

        <section className="rates-section">
          <h2>Criptomoedas</h2>
          <p className="section-subtitle">
            As 8 maiores por capitalização de mercado, cotadas em {baseCurrency}.
          </p>

          {isLoadingCryptos && <p className="status-message">Carregando cotações das criptomoedas...</p>}

          {!isLoadingCryptos && cryptoError && (
            <p className="status-message status-error">{cryptoError}</p>
          )}

          {!isLoadingCryptos && !cryptoError && filteredCryptos.length === 0 && (
            <p className="status-message">Nenhuma criptomoeda encontrada para "{searchTerm}".</p>
          )}

          {!isLoadingCryptos && !cryptoError && filteredCryptos.length > 0 && (
            <div className="cards-grid">
              {filteredCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} currency={baseCurrency} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
