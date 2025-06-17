// src/components/Contact.jsx
import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p className="catchline">Where every bite is made with love, not eggs!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            
            <div className="info-item">
              <strong>Address</strong>
              <p>123 Cupcake Street<br/>Sweetville, CA 12345</p>
            </div>

            <div className="info-item">
              <strong>Phone Numbers</strong>
              <div className="phone-numbers">
                <div className="phone-item">
                  <span>Main: +1 (123) 456-7890</span>
                  <a href="https://wa.me/11234567890" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                    Call or Message on WhatsApp
                  </a>
                </div>
                <div className="phone-item">
                  <span>Orders: +1 (123) 456-7891</span>
                  <a href="https://wa.me/11234567891" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                    Call or Message on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="info-item">
              <strong>Email</strong>
              <p>hello@bakerybeyondeggs.com</p>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0059728!3d40.7589702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMyLjMiTiA3NMKwMDAnMjEuNSJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bakery Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;