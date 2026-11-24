import "./styles.css";

export function Header() {
  return (
    <header className="header">
      <span className="eyebrow">COTAÇÕES DO DIA</span>
      <h1>
        <span className="header-icon" aria-hidden="true">💱</span> CrossRate
      </h1>
      <p>
        Escolha uma moeda de referência e veja quanto valem as principais moedas do mundo e as
        criptomoedas mais conhecidas.
      </p>
    </header>
  );
}
