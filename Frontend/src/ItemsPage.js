import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ItemsPage.css"; // Custom CSS for styling

const ItemsPage = () => {
  const { categoryName, subcategoryName } = useParams(); // Get both category and subcategory from URL
  const [items, setItems] = useState([]); // State to hold items
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Fetch items for the selected subcategory
    setLoading(true); // Start loading
    axios
      .get(`${process.env.REACT_APP_API_URL}/subcategories/${subcategoryName}/items`) // Backend API to get items for a subcategory
      .then((response) => {
        setItems(response.data); // Set items in state
        setError(null); // Reset error state
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items. Please try again later."); // Set error message
      })
      .finally(() => setLoading(false)); // Stop loading
  }, [subcategoryName]); // Dependency array ensures it runs whenever subcategoryName changes

  if (loading) {
    return <p className="loading-message">Loading items...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
   <div className="items-container">
  <h2>Items in <span className="highlight">{subcategoryName}</span></h2>

  <div className="items-list">
    {items.length > 0 ? (
      items.map((item) => (
        <div className="item-card" key={item.id}>
          <img
            src={`/images/${item.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
            alt={item.name}
            className="item-image"
            onError={(e) => {
              e.target.src = "/images/default.jpg";
            }}
          />
          <h4>{item.name}</h4>
          <p>{item.description}</p>
          <div className="price-list">
            <h5>Available Sizes:</h5>
            {item.weightPrices.map((wp) => (
              <p key={wp.id}>
                {wp.weight} - ₹{wp.price}
              </p>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p className="error-message">No items found in this category.</p>
    )}
  </div>
</div>


  );
};

export default ItemsPage;
