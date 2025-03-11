
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage";
import Signinup from './Components/Signinup';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} /> 
          <Route path="/signin" element={<Signinup />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
