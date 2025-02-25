import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset the error message before trying to log in again
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Make the login request to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password,
    }, {
        headers: {
          'Content-Type': 'application/json', // Ensure this header is set
        },
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setSuccessMessage("Login successful!");
      
      

      // If login is successful, log the response and you can redirect to another page if needed
      console.log("Login successful:", response.data);
      <label>Login successful</label>
      // You can set a success message or redirect the user
    } catch (error) {
      // If login fails, display the error message from the response
      console.error("Login failed:", error.response?.data || "Unknown error");
      setErrorMessage(error.response?.data || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
