import { formatPrice, formatChange, getChangeClass, getCurrencyName } from "../../utils/format";
import "./styles.css";

export function CurrencyCard({ currency }) {
  if (!currency) return null;

  const { code, codein, bid, high, low, pctChange } = currency;
  const currencyName = getCurrencyName(currency);

  return (
    <article className="card currency-card">
      <div className="card-top">
        <span className="currency-code">{code}</span>
      </div>

      <h3 className="card-title">{currencyName}</h3>
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

      <p className="card-change">
        Variação: <span className={`change ${getChangeClass(pctChange)}`}>{formatChange(pctChange)}</span>
      </p>
    </article>
  );
}
