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

  // WhatsApp formatting utility functions
  const formatWhatsAppMessage = () => {
    const itemsToCheckout = cart.items.filter((_, index) =>
      selectedItems.includes(index)
    );

    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const total = calculateTotal();

    // Use WhatsApp text formatting:
    // *bold* _italic_ ~strikethrough~ ```monospace```
    // We'll also use Unicode symbols that are well-supported across devices
    
    let message = "* NEW ORDER REQUEST*\n\n";
    
    // Items section with better formatting
    message += "*📋 ORDER ITEMS:*\n";
    
    itemsToCheckout.forEach((itemWrapper, idx) => {
      const name = itemWrapper.item.name;
      const quantity = itemWrapper.quantity;
      const unitPrice = itemWrapper.weightPrice.price;
      const totalPrice = unitPrice * quantity;
      
      message += `${idx + 1}. *${name}*\n`;
      message += `   • Qty: ${quantity} × ₹${unitPrice} = ₹${totalPrice}\n`;
    });
    
    // Price details with clean formatting
    message += "\n* PRICE SUMMARY:*\n";
    message += `• Subtotal: ₹${subtotal.toFixed(2)}\n`;
    message += `• Shipping: ₹${shipping.toFixed(2)}${shipping === 0 ? ' ✓ FREE' : ''}\n`;
    message += `• *TOTAL AMOUNT: ₹${total.toFixed(2)}*\n`;
    
    // Customer details section
    message += "\n* YOUR DETAILS:*\n";
    message += "Please fill in your delivery details:\n";
    message += "• Name: _[Your Name]_\n";
    message += "• Address: _[Complete Address]_\n";
    message += "• Phone: _[Contact Number]_\n";
    message += "• Preferred delivery time: _[Morning/Afternoon/Evening]_\n\n";
    
    // Footer with thank you note
    message += "Thanks for shopping with us!\n";
    message += "We'll process your order as soon as we receive your details.";
    
    return message;
  };
  
  const generateWhatsAppLink = (phoneNumber, message) => {
    // Filter out any characters that might break the URL
    const cleanMessage = message.replace(/&/g, 'and');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(cleanMessage)}`;
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    
    // Format the message with the WhatsApp formatting
    const message = formatWhatsAppMessage();
    
    // Generate the WhatsApp link
    const phoneNumber = "919999114647";
    const whatsappUrl = generateWhatsAppLink(phoneNumber, message);
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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