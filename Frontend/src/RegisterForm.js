import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthForms.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseMessage("");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
      setResponseMessage("Registration successful! Please check your email for the verification code.");
      localStorage.setItem("pendingVerificationEmail", formData.email);
       navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
     
    } catch (error) {
      setError(error.response?.data || "An error occurred during registration.");
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {
        email: formData.email,
        code: verificationCode,
      });
      setResponseMessage("Verification successful! You can now log in.");
      setTimeout(() => navigate("/"), 1000);
      setIsVerifying(false);
    } catch {
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{!isVerifying ? "Create an Account" : "Verify Your Email"}</h2>
          <p className="auth-subtitle">
            {!isVerifying 
              ? "Please fill in the information below" 
              : "Enter the verification code sent to your email"}
          </p>
        </div>

        {!isVerifying ? (
          <form className="auth-form" onSubmit={handleSubmit}>
  {Object.keys(formData).map((key) => (
    <div className="form-group" key={key}>
      <label htmlFor={key} className="form-label">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </label>
      <input
        type={key === "password" ? "password" : key === "email" ? "email" : "text"}
        id={key}
        name={key}
        value={formData[key]}
        onChange={handleChange}
        required
        className="form-input"
        placeholder={`Enter your ${key}`}
      />
    </div>
  ))}

  <button type="submit" className="auth-button">
    Register
  </button>

  <div className="auth-links">
    <p>
      Already have an account? <a href="/login">Sign in</a>
    </p>
  </div>

  {/* {responseMessage && <div className="auth-message success">{responseMessage}</div>}
  {error && <div className="auth-message error">{error}</div>} */}
</form>

        ) : (
          <div className="verification-container">
            <div className="form-group">
              <label htmlFor="verificationCode" className="form-label">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="form-input"
                placeholder="6-digit code"
              />
            </div>
            
            <button onClick={handleVerify} className="auth-button">
              Verify
            </button>
            
            <div className="resend-code">
              <p>
                Didn't receive the code? <a href="#" onClick={(e) => { e.preventDefault(); handleSubmit(e); }}>Resend</a>
              </p>
            </div>
          </div>
        )}
        
        {responseMessage && (
          <div className="auth-message success">
            {responseMessage}
          </div>
        )}
        
        {error && (
          <div className="auth-message error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;