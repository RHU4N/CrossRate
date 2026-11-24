import { formatPrice, formatChange, getChangeClass, getCurrencyName } from "../../utils/format";
import "./styles.css";

// Card de uma moeda fiduciária.
// currency: objeto da AwesomeAPI | bitcoinPrice: quanto vale 1 BTC nessa moeda (pode ser null)
export function CurrencyCard({ currency, bitcoinPrice }) {
  if (!currency) return null;

  const { code, codein, bid, high, low, pctChange } = currency;

  return (
    <article className="card currency-card">
      <div className="card-top">
        <span className="currency-code">{code}</span>
      </div>

      <h3 className="card-title">{getCurrencyName(currency)}</h3>
      <p className="card-price">{formatPrice(bid, codein)}</p>

      <dl className="card-details">
        <div>
          <dt>Máxima</dt>
          <dd>{formatPrice(high, codein)}</dd>
        </div>
        <div>
          <dt>Mínima</dt>
          <dd>{formatPrice(low, codein)}</dd>
        </div>
      </dl>

      {/* Só aparece quando a CoinGecko também respondeu */}
      {bitcoinPrice ? (
        <p className="bitcoin-line">
          <span className="bitcoin-symbol">₿</span> 1 BTC ≈ <strong>{formatPrice(bitcoinPrice, code)}</strong>
        </p>
      ) : null}

      <div className="card-footer">
        <span>Variação</span>
        <span className={`change ${getChangeClass(pctChange)}`}>{formatChange(pctChange)}</span>
      </div>
    </article>
  );
}
