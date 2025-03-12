import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import ClubDetails from "./components/ClubDetails";
import Dashboard from "./pages/Dashboard";
import "./styles/login.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
         <Route path="/clubs/:id" element={isAuthenticated ? <ClubDetails setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    
  );
}

export default App;
