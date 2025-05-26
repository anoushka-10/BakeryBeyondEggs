// src/components/Contact.jsx
import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-message">
        We'd love to bake something special for you! Get in touch for all sorts
        of customized goods 🎂🍪🧁
      </p>

      <div className="contact-details">
        <div className="contact-info">
          <h2>📍 Address</h2>
          <p>123 Cupcake Street, Sweetville, CA 12345</p>

          <h2>📞 Phone</h2>
          <p>+1 (123) 456-7890</p>

          <h2>✉️ Email</h2>
          <p>hello@bakerybeyondeggs.com</p>
        </div>

        <div className="social-links">
          <h2>💌 Follow Us</h2>
          <ul>
            <li>
              <a href="https://instagram.com/bakerybeyondeggs" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com/bakerybeyondeggs" target="_blank">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com/bakerybeyond" target="_blank">
                Twitter (X)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
