import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import "./css/App.css";
import { defaultGlobalData, defaultCryptoData } from "./defaultData";
import DarkMode from "./components/DarkMode";
import logo from "./assets/logo.png"


function App() {
  const [cryptos, setCryptos] = useState([]);
  const [pageNum, setPageNum] = useState(1)
  const [globalData, setGlobalData] = useState({
    active_cryptocurrencies: 0,
    markets: 0,
    market_cap_change_percentage_24h_usd: 0,
    total_market_cap: { usd: 0 },
    total_volume: { usd: 0 },
    market_cap_percentage: { btc: 0, eth: 0 },
  });
  const [favorites, setFavorites] = useState(loadFavorites);


  function loadFavorites() {
    let saved: any = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    if (saved != undefined) {
      return saved;
    } else {
      localStorage.setItem("favorites", JSON.stringify([]));
      return false;
    }
  }

  useEffect(getCryptoData, [pageNum]);
  useEffect(getGlobalData, []);



  const coingeckoUrl = "https://www.coingecko.com/en/coins/";
  const baseUrl = "https://api.coingecko.com/api/v3/";
  const currency = "usd";
  const order = "market_cap_desc";
  const perPage = "100";
  const sparkline = "true";
  const pricePercentage = "1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y";

  const cryptosUrl = `${baseUrl}coins/markets?vs_currency=${currency}&order=${order}&per_page=${perPage}&page=${String(pageNum)}&sparkline=${sparkline}&price_change_percentage=${pricePercentage}`;
  const globalUrl = "https://api.coingecko.com/api/v3/global";

  function getCryptoData() {
    fetch(cryptosUrl)
      .then((res) => res.json())
      .then((data) => {
        setCryptos(data);
      });
  }

  function getGlobalData() {
    fetch(globalUrl)
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data.data);
      });
  }



  function nextPage() {
    setPageNum(prevPage => prevPage+1)
  }
  function prevPage() {
    if (pageNum > 1) {
      setPageNum((prevPage) => prevPage - 1);
    }
  }

  function favoriteCrypto(crypto: any) {
    const fav = favorites.slice();
    if (fav.includes(crypto)) {
      var index = fav.indexOf(crypto);
      if (index !== -1) {
        fav.splice(index, 1);
      }
    } else {
      fav.push(crypto);
    }
    setFavorites(fav);
    localStorage.setItem("favorites", JSON.stringify(fav));
    console.log(fav);
  }
   

  function renderPagination() {
    const maxPage = pageNum + 5;
    const minPage = pageNum - 5;
  }

  return (
    <div className="App">
      <div className="Header">
        <div className="main-header">
          <div className="header-title">
            <img src={logo} />
            <p>CryptoTracker</p>
          </div>
          <DarkMode />
        </div>

        <div className="sub-header">
          <p>
            Coins: {Number(globalData.active_cryptocurrencies).toLocaleString()}
          </p>
          <p>Exchanges: {globalData.markets.toLocaleString()}</p>
          <div className="market-change">
            <p>
              Market Cap: $
              {globalData.total_market_cap.usd.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
            <p>
              {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
              <i className="fa-solid fa-caret-up"></i>
              {/* <i className="fa-solid fa-caret-down"></i> */}
            </p>
          </div>

          <p>
            24h Vol: $
            {Number(globalData.total_volume.usd).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
          <div className="crypto-dominance">
            <p>Dominance:</p>
            <p>BTC {globalData.market_cap_percentage.btc.toFixed(1)}%</p>
            <p>ETH {globalData.market_cap_percentage.eth.toFixed(1)}%</p>
          </div>
        </div>
        {/* <p>Gas: {globalData.active_cryptocurrencies}</p> */}
      </div>

      <div className="Cryptos">
        <table>
          <thead>
            <tr className="table-head">
              <th className="center">#</th>
              <th className="left">Coin</th>
              <th className="center">Price</th>
              <th className="right">1h</th>
              <th className="right">24h</th>
              <th className="right">7d</th>
              <th className="center">24h Volume</th>
              <th className="center">Market Cap</th>
              <th className="center">Sparkline</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto: any) => (
              <tr key={nanoid()} className="crypto-row">
                <td className="">
                  <p>
                    <button
                      className="star-btn"
                      onClick={() => {
                        favoriteCrypto(crypto.id);
                      }}
                    >
                      {favorites.includes(crypto.id) ? (
                        <i className="starred fa-solid fa-star"></i>
                      ) : (
                        <i className="fa-regular fa-star"></i>
                      )}
                    </button>
                    {crypto.market_cap_rank}.
                  </p>
                </td>

                <td>
                  <a
                    href={`${coingeckoUrl}${crypto.id}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <div className="coin-data">
                      <img className="crypto-img" src={crypto.image} />
                      <p className="crypto-name">{crypto.name}</p>
                      <p className="crypto-symbol">{crypto.symbol}</p>
                    </div>
                  </a>
                </td>

                <td>
                  <p className="right">
                    $
                    {crypto.current_price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </td>

                <td>
                  <p className="right">
                    {Number(
                      crypto.price_change_percentage_1h_in_currency
                    ).toFixed(1)}
                    %
                  </p>
                </td>

                <td>
                  <p className="right">
                    {Number(
                      crypto.price_change_percentage_24h_in_currency
                    ).toFixed(1)}
                    %
                  </p>
                </td>

                <td>
                  <p className="right">
                    {Number(
                      crypto.price_change_percentage_7d_in_currency
                    ).toFixed(1)}
                    %
                  </p>
                </td>

                <td>
                  <p className="right">
                    ${crypto.total_volume.toLocaleString()}
                  </p>
                </td>

                <td>
                  <p className="right">${crypto.market_cap.toLocaleString()}</p>
                </td>

                <td className="center">sparkline</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Pagination">
        <button className="page-btn" onClick={prevPage}>
          <i className="fa-solid fa-angle-left"></i>Back
        </button>

        <button className="page-btn current-page">{pageNum}</button>

        <button className="page-btn" onClick={nextPage}>
          Next<i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
