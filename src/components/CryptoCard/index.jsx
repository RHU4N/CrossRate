import { formatPrice, formatChange, getChangeClass } from "../../utils/format";
import "./styles.css";

// Card de uma criptomoeda.
// crypto: objeto da CoinGecko | currency: moeda de referência usada para formatar os preços
// conversions: preço dessa cripto nas outras moedas ([{ code, name, price }])
export function CryptoCard({ crypto, currency, conversions = [] }) {
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

      {/* <details> abre e fecha sozinho, sem precisar de useState.
          Só aparece quando a AwesomeAPI também respondeu. */}
      {conversions.length > 0 && (
        <details className="conversions">
          <summary>Ver em outras {conversions.length} moedas</summary>
          <ul>
            {conversions.map((item) => (
              <li key={item.code} title={item.name}>
                <span>{item.code}</span>
                <strong>≈ {formatPrice(item.price, item.code)}</strong>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="card-footer">
        <span>Variação 24h</span>
        <span className={`change ${getChangeClass(change)}`}>{formatChange(change)}</span>
      </div>
    </article>
  );
}
