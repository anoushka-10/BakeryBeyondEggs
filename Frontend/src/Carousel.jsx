// Carousel.jsx
import React, { useState, useEffect } from 'react';
import './Carousel.css';

function Carousel({ images, autoplaySpeed = 5000, showIndicators = true, showArrows = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle automatic slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, autoplaySpeed]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition time
  };

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition time
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition time
  };

  // If no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-slide placeholder">
          <p>No images to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-track-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img 
                src={image.src} 
                alt={image.alt || `Slide ${index + 1}`} 
                className="carousel-image"
              />
              {image.caption && (
                <div className="carousel-caption">
                  <h3>{image.caption}</h3>
                  {image.description && <p>{image.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button 
            className="carousel-button carousel-button-prev" 
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button 
            className="carousel-button carousel-button-next" 
            onClick={goToNext}
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </>
      )}

      {showIndicators && (
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
      )}
    </div>
  );
}

export default Carousel;