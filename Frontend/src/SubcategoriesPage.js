import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Subcategories.css"; // Custom CSS for styling

const SubcategoriesPage = () => {
  const { categoryName } = useParams(); // Fetch categoryName from URL
  const [subcategories, setSubcategories] = useState([]); // State to hold subcategories
  const [items, setItems] = useState([]); // State to hold items of the category
  const [ setLoading] = useState(true); // Loading state to manage async requests
  const [ setSelectedSubcategory] = useState(null); // To track selected subcategory
  const navigate = useNavigate(); // Use navigate hook for programmatic navigation

  useEffect(() => {
    // Fetch subcategories for the selected category
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${categoryName}/subcategories`)
      .then((response) => setSubcategories(response.data))
      .catch((error) => console.error("Error fetching subcategories:", error));

    // Fetch items for the selected category
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${categoryName}/items`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching category items:", error))
      .finally(() => setLoading(false));
  }, [categoryName, setLoading]);

  const handleSubcategoryClick = (subcategoryName) => {
    navigate(`/subcategories/${subcategoryName}/items`);
    axios
      .get(`${process.env.REACT_APP_API_URL}/subcategories/${subcategoryName}/items`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items for subcategory:", error));
    setSelectedSubcategory(subcategoryName);
  };

  return (
    <div className="subcategories-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Choose in <span className="highlight">{categoryName}</span>
      </h2>

      {/* Displaying Subcategories */}
      <div className="subcategories-list">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            onClick={() => handleSubcategoryClick(subcategory.name)}
            className="subcategory-card"
          >
            <img
              src={`/images/${subcategory.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
              alt={subcategory.name}
              className="subcategory-image"
              onError={(e) => {
                console.warn(`Image not found: ${e.target.src}, loading default image.`);
                e.target.src = "/images/default.jpg";
              }}
            />
            <h3>{subcategory.name}</h3>
          </div>
        ))}
      </div>
      <h2>All items in <span className="highlight">{categoryName}</span></h2>

      {/* Displaying Items */}
      <div className="items-list">
        
        {items.length > 0 ? (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              <img
                src={`/images/${item.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
                alt={item.name}
                className="item-image"
                onError={(e) => {
                  console.warn(`Image not found: ${e.target.src}, loading default image.`);
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
          <p style={{ textAlign: "center" }}>No items found in this category or subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default SubcategoriesPage;
