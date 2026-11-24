import "./styles.css";

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Dados de moedas:{" "}
        <a href="https://docs.awesomeapi.com.br/api-de-moedas" target="_blank" rel="noreferrer">
          AwesomeAPI
        </a>{" "}
        · Dados de criptomoedas:{" "}
        <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">
          CoinGecko
        </a>
      </p>
      <p>CrossRate · Projeto acadêmico SENAI · React + Vite + Axios</p>
    </footer>
  );
}
