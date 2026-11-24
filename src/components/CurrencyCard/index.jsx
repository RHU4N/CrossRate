import { formatPrice, formatChange, getChangeClass, getCurrencyName } from "../../utils/format";
import "./styles.css";

// Card de uma moeda fiduciária.
// currency: objeto da AwesomeAPI (code, codein, name, bid, high, low, pctChange)
export function CurrencyCard({ currency }) {
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

      <div className="card-footer">
        <span>Variação</span>
        <span className={`change ${getChangeClass(pctChange)}`}>{formatChange(pctChange)}</span>
      </div>
    </article>
  );
}
