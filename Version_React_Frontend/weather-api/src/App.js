import './App.css';
import Graph from './Graph';
import background from './images/weather.png'

function App() {
  return (
    <div style={{ backgroundImage: `url(${background})` }}>
      <Graph />
    </div>
  );
}

export default App;
