import React from "react";
import { Minus, Plus, X } from "lucide-react";

const Cart = ({ items, selectedItems, onQuantityChange, onRemoveItem, onToggleSelection }) => {
  const allSelected = selectedItems.length === items.length && items.length > 0;

  const onSelectAll = () => {
    const allIndices = items.map((_, index) => index);
    // Call the parent's toggle function for each item that's not selected
    allIndices.forEach(index => {
      if (!selectedItems.includes(index)) {
        onToggleSelection(index);
      }
    });
  };

  const onDeselectAll = () => {
    // Call the parent's toggle function for each selected item to deselect it
    selectedItems.forEach(index => {
      onToggleSelection(index);
    });
  };

  return (
    <div className="cart-items-container">
      <div className="select-all-container">
        <input
          type="checkbox"
          className="item-checkbox"
          checked={allSelected}
          onChange={() => allSelected ? onDeselectAll() : onSelectAll()}
          aria-label="Select or Deselect All"
        />
        <label style={{ marginLeft: '0.5rem' }}>
          {allSelected ? 'Deselect All' : 'Select All'} ({selectedItems.length}/{items.length})
        </label>
      </div>

      {items.map((itemWrapper, index) => {
        const item = itemWrapper.item;
        const weightPrice = itemWrapper.weightPrice;
        const isSelected = selectedItems.includes(index);

        return (
          <div className={`cart-item ${isSelected ? 'selected' : ''}`} key={`${item.id}-${index}`}>
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
                src={`${process.env.REACT_APP_API_URL}${item.imagepath || "/images/default.jpg"}`}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default.jpg";
                }}
                className="item-image"
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
                onClick={() => {
                  console.log("Removing item at index:", index, "Item ID:", item.id);
                  onRemoveItem(index);
                }}
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