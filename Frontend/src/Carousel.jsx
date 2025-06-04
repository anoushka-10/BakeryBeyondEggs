import React, { useState, useEffect } from 'react';
import './Carousel.css';

const TOTAL_SLIDES = 5; // Match with your total images like car1.jpg to car5.jpg

const Carousel = ({ autoplaySpeed = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = Array.from({ length: TOTAL_SLIDES }, (_, i) => ({
    src: `/images/car${i + 1}.jpg`,
    alt: `Slide ${i + 1}`
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) goToNext();
    }, autoplaySpeed);
    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning]);

  const goToNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="carousel-slide">
              <img src={img.src} alt={img.alt} className="carousel-image" />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-button carousel-button-prev" onClick={goToPrevious} aria-label="Previous">
        &#10094;
      </button>
      <button className="carousel-button carousel-button-next" onClick={goToNext} aria-label="Next">
        &#10095;
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
