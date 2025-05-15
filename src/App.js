import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage";
import Signinup from "./Components/Signinup";
import TemplateSelection from "./Components/Templateselection";
import UserDetails from "./Components/UserDetails";
import AdminDashboard from "./Components/AdminDashboard";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signin" element={<Signinup />} />
          <Route path="/template-selection" element={<TemplateSelection />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
