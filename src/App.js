import './App.css';
import { useEffect, useState } from 'react';
function App() {
  const [state, setState] = useState([]);
  const url = `https://api.delta.exchange/v2/products`
  const fetchData = async () => {
    const resp = await fetch(url)
    const json = await resp.json()
    setState(json.result)
  }
  useEffect(() => {
    fetchData()
    let ws = new WebSocket('wss://production-esocket.delta.exchange')
    const data = {
      type: 'subscribe',
      payload: {
        channel: [
          { name: 'v2/ticker', symbol: ['RENUSDT'] }
        ]
      }
    };
    ws.onopen = () => {
      console.log("Connection established");
      ws.send(JSON.stringify(data));
      console.log(JSON.stringify(data));
    };
    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      console.log(json, "data");
    };
    ws.onerror = function (error) {
      console.log('WebSocket Error: ' + error);
    };
  }, [])
  console.log(state)

  return (
    <div className="App">
      <table>
        <tr>
          <th>Symbol</th>
          <th>Description</th>
          <th>Underlying Asset</th>
          <th>Mark Price</th>
        </tr>
        {state.map((data) => {
          return <tr key={data.symbol}>
            <td>{data.symbol}</td>
            <td>{data.description}</td>
            <td>{data.underlying_asset.symbol}</td>
          </tr>
        })}
      </table>
    </div>
  );
}

export default App;
