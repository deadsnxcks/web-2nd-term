import "./CSS/app.css";
import songs from "./data.jsx";
import Table from "./components/Table.jsx";

function App() {
  return (
    <div className="App">
      <h3>Самые популярные песни Spotify</h3>
      <Table data={songs} amountRows={10} pagination={true} />
    </div>
  );
}

export default App;
