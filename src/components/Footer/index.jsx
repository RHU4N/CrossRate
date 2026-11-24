import "./styles.css";

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Cotações de moedas pela{" "}
        <a href="https://docs.awesomeapi.com.br/api-de-moedas" target="_blank" rel="noreferrer">
          AwesomeAPI
        </a>{" "}
        e de criptomoedas pela{" "}
        <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">
          CoinGecko
        </a>
        .
      </p>
      <p>CrossRate · Projeto acadêmico do SENAI feito com React, Vite e Axios.</p>
    </footer>
  );
}
