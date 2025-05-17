import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Redefining Egg-Free Indulgence</h1>
          <p>Artisanal treats. Wholesome ingredients. Limitless joy.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="story-image">
          <img src="/images/fruitcake.jpg" alt="Our bakery" />
        </div>
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            At <strong>BakeryBeyondEggs</strong>, we're on a mission to prove that indulgence doesn't need compromise. Since 2020, we've
            blended tradition with innovation to create handcrafted baked goods that are entirely egg-free, yet rich in flavor, texture, and joy.
          </p>
          <p>
            Our kitchen is our lab — experimenting with organic, sustainable, and local ingredients, always chasing that “wow” in every bite.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-values">
        <h2>What We Believe In</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>🌱 Sustainability</h3>
            <p>We bake with intention, prioritizing eco-conscious ingredients and practices.</p>
          </div>
          <div className="value-card">
            <h3>💡 Innovation</h3>
            <p>From aquafaba to almond flour, we experiment to perfect every recipe.</p>
          </div>
          <div className="value-card">
            <h3>❤️ Inclusion</h3>
            <p>Everyone deserves deliciousness — regardless of dietary needs or beliefs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
