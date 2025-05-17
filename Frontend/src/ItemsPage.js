import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ItemsPage.css"; // Custom CSS for styling

const ItemsPage = () => {
  const { subcategoryName } = useParams(); // Get subcategory from URL
  const [items, setItems] = useState([]); // State to hold items
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading
  const [selectedWeights, setSelectedWeights] = useState({}); // State to track selected weight for each item
  const [feedbackMessage, setFeedbackMessage] = useState("");
const [feedbackType, setFeedbackType] = useState("success"); // "success" or "error"
const showFeedback = (message, type) => {
  setFeedbackMessage(message);
  setFeedbackType(type);

  setTimeout(() => {
    setFeedbackMessage("");
  }, 3000); // 3 seconds
};

  useEffect(() => {
    // Fetch items for the selected subcategory
    setLoading(true); // Start loading
    axios
      .get(`${process.env.REACT_APP_API_URL}/subcategories/${subcategoryName}/items`) // Backend API to get items for a subcategory
      .then((response) => {
        const fetchedItems = response.data;
        setItems(fetchedItems); // Set items in state
        
        // Initialize selected weights with default values (first weight option for each item)
        const initialWeights = {};
        fetchedItems.forEach(item => {
          if (item.weightPrices && item.weightPrices.length > 0) {
            initialWeights[item.id] = item.weightPrices[0];
          }
        });
        setSelectedWeights(initialWeights);
        
        setError(null); // Reset error state
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items. Please try again later."); // Set error message
      })
      .finally(() => setLoading(false)); // Stop loading
  }, [subcategoryName]); // Dependency array ensures it runs whenever subcategoryName changes

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

  if (loading) {
    return <p className="loading-message">Loading items...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="items-container">
      {feedbackMessage && (
  <div className={`feedback-message ${feedbackType}`}>
    {feedbackMessage}
  </div>
)}


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
          <p className="error-message">No items found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;