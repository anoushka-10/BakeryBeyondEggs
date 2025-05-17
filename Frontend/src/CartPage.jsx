import React, { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./Cart";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import "./Cart.css";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(res.data);
        // Initialize selected items with all item IDs
        if (res.data?.items?.length > 0) {
          setSelectedItems(res.data.items.map((_, index) => index));
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = { ...cart };
    updatedCart.items[index].quantity = newQuantity;
    setCart(updatedCart);

    // In a real implementation, you would update the quantity on the server as well
    updateCartItemOnServer(index, newQuantity);
  };

  const updateCartItemOnServer = async (index, quantity) => {
    try {
      const token = localStorage.getItem("authToken");
      const itemId = cart.items[index].item._id;
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart/item/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const removeItem = async (index) => {
    try {
      const token = localStorage.getItem("authToken");
      const itemId = cart.items[index].item._id;
      
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedCart = { ...cart };
      updatedCart.items = updatedCart.items.filter((_, i) => i !== index);
      setCart(updatedCart);
      
      // Update selected items
      setSelectedItems(selectedItems.filter(i => i !== index).map(i => i > index ? i - 1 : i));
      
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const toggleItemSelection = (index) => {
    setSelectedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const calculateSubtotal = () => {
    if (!cart?.items?.length) return 0;
    
    return cart.items
      .filter((_, index) => selectedItems.includes(index))
      .reduce((total, itemWrapper) => {
        return total + itemWrapper.weightPrice.price * itemWrapper.quantity;
      }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping over ₹500, otherwise ₹50
    return subtotal > 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    // Here you would implement the checkout process
    // For now, we'll just log the selected items
    const itemsToCheckout = cart.items.filter((_, index) => selectedItems.includes(index));
    console.log("Proceeding to checkout with items:", itemsToCheckout);
    alert("Proceeding to checkout!");
  };

  const continueShopping = () => {
    // Navigate back to the products page
    window.location.href = "/products";
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="cart-page">
        <div className="empty-cart-page">
          <ShoppingCart size={64} className="cart-icon-large" />
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-message">Looks like you haven't added any items to your cart yet.</p>
          <button className="continue-shopping-button-large" onClick={continueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingCart className="icon" size={20} />
            Your Cart ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
          </h2>
        </div>
        
        <Cart 
          items={cart.items} 
          selectedItems={selectedItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={removeItem}
          onToggleSelection={toggleItemSelection}
        />

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-row" style={{ marginTop: "0.5rem" }}>
            <span>Shipping</span>
            <span>₹{calculateShipping().toFixed(2)}</span>
          </div>
          {calculateShipping() === 0 && (
            <p className="shipping-note">You qualified for free shipping!</p>
          )}
          <div className="summary-row" style={{ marginTop: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
            <span>Total</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-container">
          <button 
            className="checkout-button full-width"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>

        <div className="continue-shopping-container">
          <button className="continue-shopping-button" onClick={continueShopping}>
            <ArrowLeft size={14} style={{ marginRight: "4px" }} />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;