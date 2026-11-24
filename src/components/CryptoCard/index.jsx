import { formatPrice, formatChange, getChangeClass } from "../../utils/format";
import "./styles.css";

// Card de uma criptomoeda.
// crypto: objeto da CoinGecko | currency: moeda de referência usada para formatar os preços
export function CryptoCard({ crypto, currency }) {
  if (!crypto) return null;

  // Renomeia os campos da API para nomes mais fáceis de ler
  const {
    name,
    symbol,
    image,
    market_cap_rank: rank,
    current_price: price,
    high_24h: high,
    low_24h: low,
    price_change_percentage_24h: change,
  } = crypto;

  return (
    <article className="card crypto-card">
      <div className="card-top">
        <div className="crypto-identity">
          {image ? <img className="crypto-image" src={image} alt={`Logo ${name}`} /> : null}
          <span className="crypto-symbol">{symbol ? symbol.toUpperCase() : "—"}</span>
        </div>
        <span className="crypto-rank" title="Posição no ranking por capitalização de mercado">
          #{rank ?? "—"}
        </span>
      </div>

      <h3 className="card-title">{name ?? "Sem nome"}</h3>
      <p className="card-price">{formatPrice(price, currency)}</p>

      <dl className="card-details">
        <div>
          <dt>Máxima 24h</dt>
          <dd>{formatPrice(high, currency)}</dd>
        </div>
        <div>
          <dt>Mínima 24h</dt>
          <dd>{formatPrice(low, currency)}</dd>
        </div>
      </dl>

      <div className="card-footer">
        <span>Variação 24h</span>
        <span className={`change ${getChangeClass(change)}`}>{formatChange(change)}</span>
      </div>
    </article>
  );
}
