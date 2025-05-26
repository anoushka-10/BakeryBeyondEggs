// About.jsx
import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="section-heading">REDEFINING EGG-FREE INDULGENCE</h1>
          <div className="tagline-container">
            <p className="tagline">Artisanal treats. Wholesome ingredients. Limitless joy.</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="story-content">
          <div className="story-image">
            <img src="/images/fruitcake.jpg" alt="Our bakery" />
            <div className="decorative-circle circle-top"></div>
            <div className="decorative-circle circle-bottom"></div>
          </div>
          
          <div className="story-text">
            <h2 className="section-heading">OUR STORY</h2>
            <p>
              At <strong>BakeryBeyondEggs</strong>, we're on a mission to prove that indulgence doesn't need compromise. Since 2020, we've
              blended tradition with innovation to create handcrafted baked goods that are entirely egg-free, yet rich in flavor, texture, and joy.
            </p>
            <p>
              Our kitchen is our lab — experimenting with organic, sustainable, and local ingredients, always chasing that "wow" in every bite.
            </p>
            <button className="about-button">READ MORE</button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-values">
        <h2 className="section-heading">WHAT WE BELIEVE IN</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Sustainability</h3>
            <p>We bake with intention, prioritizing eco-conscious ingredients and practices.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>From aquafaba to almond flour, we experiment to perfect every recipe.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Inclusion</h3>
            <p>Everyone deserves deliciousness — regardless of dietary needs or beliefs.</p>
          </div>
          <div className="gap-card"></div>
        </div>
      </section>
    </div>
  );
}

export default About;