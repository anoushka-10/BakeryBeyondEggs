import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoriesPage.css"; // Custom CSS for styling

function CategoriesPage() {
  const [categories, setCategories] = useState([]); // State to hold categories
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // To navigate to the subcategory page when clicked

  useEffect(() => {
    // Fetch categories from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/getallcategories`) // Your backend API endpoint for categories
      .then((response) => setCategories(response.data)) // Set categories in state
      .catch(() => setError("Failed to load categories.")); // Handle error
  }, []); // Empty array means it will run only once on component mount

  const handleCategoryClick = (categoryName) => {
    // Navigate to the subcategories page when a category is clicked
    navigate(`/categories/${categoryName}`);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!categories.length) {
    return <p className="loading-message">Loading categories...</p>;
  }

  return (
    <div className="categories-container">
        <div className="overlay">
      <h1 className="categories-title">EXPLORE OUR CATEGORIES</h1>
     <div className="categories-carousel-wrapper">
  <div className="categories-carousel">
    {categories.map((category) => (
      <div
        key={category.id}
        className="category-card"
        onClick={() => handleCategoryClick(category.name)}
      >
        <img
          src={`${process.env.REACT_APP_API_URL}${category.imagePath}`}
          alt={category.name}
          className="category-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
        />
        <p className="category-name">{category.name}</p>
      </div>

    ))}
    </div>
  </div>
</div>


    </div>
  );
}

export default CategoriesPage;
