import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import "./AuthForms.css";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);

  // Get email from local storage or URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const storedEmail = localStorage.getItem("pendingVerificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  // Timer for resending code
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Call your verification API
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {
        email,
        code
      });

      // Handle successful verification
      setVerified(true);
      setMessage({
        type: "success",
        text: "Email verified successfully! Redirecting to login..."
      });
      
      // Remove the email from local storage
      localStorage.removeItem("pendingVerificationEmail");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (error) {
      console.error("Verification failed:", error);
      
      // Set error message
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Verification failed. Please check your code and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Call your resend verification API
      await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {
        email
      });

      // Set success message
      setMessage({
        type: "success",
        text: "Verification code has been resent to your email."
      });
      
      // Set cooldown timer for 60 seconds
      setTimer(60);
      
    } catch (error) {
      console.error("Failed to resend code:", error);
      
      // Set error message
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend code. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Mail size={28} color="#e91e63" style={{ marginBottom: "1rem" }} />
          <h2>Verify Your Email</h2>
          <p className="auth-subtitle">
            We've sent a verification code to {email || "your email address"}
          </p>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.type === "success" ? (
              <CheckCircle size={16} style={{ verticalAlign: "text-bottom", marginRight: "6px" }} />
            ) : (
              <AlertCircle size={16} style={{ verticalAlign: "text-bottom", marginRight: "6px" }} />
            )}
            {message.text}
          </div>
        )}

        {!verified ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                className="form-input"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className={`auth-button ${loading ? "loading" : ""}`}
              disabled={loading || code.length !== 6}
            >
              {loading && <div className="spinner"></div>}
              {loading ? "Verifying..." : "Verify Email"}
              {!loading && <ArrowRight size={18} style={{ marginLeft: "6px" }} />}
            </button>
          </form>
        ) : (
          <div className="verification-container">
            <div style={{ textAlign: "center", color: "#2e7d32" }}>
              <CheckCircle size={48} style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                Your email has been verified!
              </p>
            </div>
          </div>
        )}

        {!verified && (
          <div className="resend-code">
            {timer > 0 ? (
              <p>
                Resend code in <span style={{ fontWeight: "600" }}>{timer}</span> seconds
              </p>
            ) : (
              <p>
                Didn't receive the code?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); handleResendCode(); }}>
                  Resend Code
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;