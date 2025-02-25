import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterForm.css";

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
      setIsVerifying(true);
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
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      {!isVerifying ? (
        <form onSubmit={handleSubmit} className="form-content">
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group">
              <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          ))}
          <button type="submit" className="form-button">Register</button>
        </form>
      ) : (
        <div className="verification-section">
          <h3 className="verification-title">Enter Verification Code</h3>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="form-input"
          />
          <button onClick={handleVerify} className="form-button verify-button">Verify</button>
        </div>
      )}
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RegisterForm;
