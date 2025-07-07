import "./App.css";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TableVisual from "./Components/TableVisual";
import PlayVisual from "./Components/PlayVisual";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableVisual/>}/>
        <Route path="/play/:id" element={<PlayVisual/>}/>
      </Routes>
    </Router>
  );
}

export default App;
