import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AuthForms.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      
      // Dispatch custom event to notify navbar of auth state change
      window.dispatchEvent(new Event('authStateChanged'));
      
      setSuccessMessage("Login successful!");
      console.log("Login successful:", response.data);
      
      // Navigate to where the user was before login
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error.response?.data || "Unknown error");
      setErrorMessage(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Please sign in to your account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your password"
            />
            {/* <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div> */}
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="auth-links">
            <p>
              Don't have an account? <a href="/registerform">Register now</a>
            </p>
          </div>
        </form>
        
        {errorMessage && (
          <div className="auth-message error">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="auth-message success">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;