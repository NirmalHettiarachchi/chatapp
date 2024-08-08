import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          { username, password }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(
          "Registration failed: " +
          (err.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          {message && <div className="mb-4 text-green-500">{message}</div>}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Password"
              />
            </div>
            <button
                type="submit"
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg"
            >
              Register
            </button>
          </form>
        </div>
      </div>
  );
};

export default Register;
