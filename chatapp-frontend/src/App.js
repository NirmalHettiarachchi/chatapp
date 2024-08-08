import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setSenderId(decodedToken.sub); // Using 'sub' from the decoded token as senderId
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        {token ? (
          <>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <Routes>
              <Route
                path="/chat"
                element={<Chat token={token} senderId={senderId} />}
              />
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
