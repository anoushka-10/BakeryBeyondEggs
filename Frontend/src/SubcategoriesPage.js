import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Subcategories.css"; // Custom CSS for styling

const SubcategoriesPage = () => {
  const { categoryName } = useParams(); // Fetch categoryName from URL
  const [subcategories, setSubcategories] = useState([]); // State to hold subcategories
  const [items, setItems] = useState([]); // State to hold items of the category
  const [loading, setLoading] = useState(true); // Loading state to manage async requests
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedWeights, setSelectedWeights] = useState({}); // Track selected weight for each item
  const navigate = useNavigate(); // Use navigate hook for programmatic navigation
const [feedbackMessage, setFeedbackMessage] = useState("");
const [feedbackType, setFeedbackType] = useState("success");

const showFeedback = (message, type) => {
  setFeedbackMessage(message);
  setFeedbackType(type);

  setTimeout(() => {
    setFeedbackMessage("");
  }, 3000);
};

  useEffect(() => {
    // Fetch subcategories for the selected category
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${categoryName}/subcategories`)
      .then((response) => setSubcategories(response.data))
      .catch((error) => console.error("Error fetching subcategories:", error));

    // Fetch items for the selected category
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${categoryName}/items`)
      .then((response) => {
        const fetchedItems = response.data;
        setItems(fetchedItems);
        
        // Initialize selected weights with default values (first weight option for each item)
        const initialWeights = {};
        fetchedItems.forEach(item => {
          if (item.weightPrices && item.weightPrices.length > 0) {
            initialWeights[item.id] = item.weightPrices[0];
          }
        });
        setSelectedWeights(initialWeights);
      })
      .catch((error) => console.error("Error fetching category items:", error))
      .finally(() => setLoading(false));
  }, [categoryName, setLoading]);

  // Handle weight selection change
  const handleWeightChange = (itemId, weightPrice) => {
    setSelectedWeights({
      ...selectedWeights,
      [itemId]: weightPrice
    });
  };

  // Handle add to cart
  const addToCart = (item, quantity = 1) => {
    const selectedWeight = selectedWeights[item.id];
    if (!selectedWeight) return;

    // Get the authentication token from localStorage or wherever it's stored
    const token = localStorage.getItem('authToken'); // Adjust based on how you store the token
    
    // Make the API call with the correct format
axios.post(
  `${process.env.REACT_APP_API_URL}/api/cart/add`,
  null,
  {
    params: {
      itemId: item.id,
      weightPriceId: selectedWeight.id,
      quantity: quantity
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
)
.then(response => {
  showFeedback(`Added ${item.name} (${selectedWeight.weight}) to cart!`, "success");
})
.catch(error => {
  console.error("Error adding item to cart:", error);
  showFeedback("Failed to add item to cart. Please try again.", "error");
});

  };

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
      {feedbackMessage && (
  <div className={`feedback-message ${feedbackType}`}>
    {feedbackMessage}
  </div>
)}

      <h2>
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

      {/* Displaying Items with consistent style and shopping features */}
      <div className="items-list">
        {loading ? (
          <p className="loading-message">Loading items...</p>
        ) : items.length > 0 ? (
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
              
              {item.weightPrices && item.weightPrices.length > 0 ? (
                <div className="product-actions">
                  <div className="weight-selector">
                    <select 
                      value={selectedWeights[item.id]?.id}
                      onChange={(e) => {
                        const selectedWeightPrice = item.weightPrices.find(
                          wp => wp.id === parseInt(e.target.value)
                        );
                        handleWeightChange(item.id, selectedWeightPrice);
                      }}
                    >
                      {item.weightPrices.map((wp) => (
                        <option key={wp.id} value={wp.id}>
                          {wp.weight} - ₹{wp.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="quantity-controls">
                    <input 
                      type="number" 
                      min="1" 
                      defaultValue="1" 
                      id={`qty-${item.id}`}
                      className="quantity-input"
                    />
                  </div>
                  
                  <button 
                    className="add-to-cart" 
                    onClick={() => {
                      const quantityInput = document.getElementById(`qty-${item.id}`);
                      const quantity = parseInt(quantityInput?.value || 1);
                      addToCart(item, quantity);
                    }}
                    title="Add to Cart"
                  >
                    🛒
                  </button>
                </div>
              ) : (
                <p className="error-message">No pricing available</p>
              )}
            </div>
          ))
        ) : (
          <p className="error-message">No items found in this category or subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default SubcategoriesPage;