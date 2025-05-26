// FounderSection.jsx
import React from 'react';
import './FounderSection.css';

function FounderSection() {
  return (
    <div className="founder-section">
      <div className="founder-container">
        {/* Image Side with Circle Frame - Now on the left */}
        <div className="founder-image-container">
          <div className="founder-image-wrapper">
            <img 
              src="/images/Founder.jpeg" 
              alt="Our Founder" 
              className="founder-image"
            />
            <div className="decorative-circle circle-top"></div>
            <div className="decorative-circle circle-bottom"></div>
          </div>
        </div>
        
        {/* Content Side - Now on the right */}
        <div className="founder-content">
          <h2 className="founder-heading">MEET OUR FOUNDER</h2>
          
          <p className="founder-text">
            At Back Door Donuts, our journey began with one passionate baker with 
            a dream to create the most delicious, unforgettable donuts in town. Our founder's 
            dedication to quality and creativity is baked into everything we do.
          </p>
          
          <p className="founder-text">
            With over 25 years of baking experience, our founder perfected the art of 
            donut-making through trial, error, and a whole lot of taste-testing. What started as 
            a small late-night window service has grown into the beloved brand you know today.
          </p>
          
          <p className="founder-quote">
            "I believe that every donut should bring joy. That's why we craft each one with love 
            and attention to detail, using only the finest ingredients and traditional methods that 
            honor the art of baking."
          </p>
          
          <button className="founder-button">OUR STORY</button>
        </div>
      </div>
    </div>
  );
}

export default FounderSection;