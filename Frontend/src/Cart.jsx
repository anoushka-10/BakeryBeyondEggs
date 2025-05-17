import React from "react";
import { Minus, Plus, X } from "lucide-react";

const Cart = ({ items, selectedItems, onQuantityChange, onRemoveItem, onToggleSelection }) => {
  // // Function to get a placeholder image based on item name
  // const getItemImage = (itemName) => {
  //   // This would ideally be replaced with actual product images
  //   // For now, we'll use a placeholder with a consistent color based on the name
  //   const hash = [...itemName].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  //   const hue = hash % 360;
  //   return `/api/placeholder/400/400?text=${encodeURIComponent(itemName.substring(0, 2))}&bgcolor=hsl(${hue},70%,80%)`;
  // };

 
  return (
    <div className="cart-items-container">
      {items.map((itemWrapper, index) => {
        const item = itemWrapper.item;
        const weightPrice = itemWrapper.weightPrice;
        const isSelected = selectedItems.includes(index);

        return (
          <div className={`cart-item ${isSelected ? 'selected' : ''}`} key={index}>
            <div className="item-select">
              <input
                type="checkbox"
                className="item-checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection(index)}
                aria-label={`Select ${item.name}`}
              />
            </div>
            
            <div className="cart-item-image">
              <img 
                src={`/images/${item.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/images/default.jpg";
                }}
              />
            </div>
            
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-info">Weight: {weightPrice.weight}g</p>
              <p className="item-info">Price: ₹{weightPrice.price.toFixed(2)}</p>
            </div>
            
            <div className="quantity-container">
              <div className="quantity-adjuster">
                <button 
                  className="quantity-button"
                  onClick={() => onQuantityChange(index, itemWrapper.quantity - 1)}
                  disabled={itemWrapper.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-value">{itemWrapper.quantity}</span>
                <button 
                  className="quantity-button"
                  onClick={() => onQuantityChange(index, itemWrapper.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="item-price">
              ₹{(weightPrice.price * itemWrapper.quantity).toFixed(2)}
            </div>
            
            <div className="remove-button-container">
              <button 
                className="remove-button"
                onClick={() => onRemoveItem(index)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;