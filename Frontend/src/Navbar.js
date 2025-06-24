import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [subDropdownVisible, setSubDropdownVisible] = useState(false);
  const [name, setName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const location = useLocation(); // This will help us detect route changes

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Decode token to get role
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setIsLoggedIn(true);

        // Fetch user name
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/name`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Clear invalid token
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setName("");
        setUserRole(null);
      }
    } else {
      // No token found
      setIsLoggedIn(false);
      setName("");
      setUserRole(null);
    }
  };

  // Fetch user data on component mount and when location changes
  useEffect(() => {
    fetchUserData();
  }, [location]); // Adding location as dependency will refresh navbar when route changes

  // Also listen for storage changes (useful if user logs out in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserData();
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event we'll dispatch after login
    window.addEventListener('authStateChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setName("");
    setUserRole(null);
    
    // Dispatch custom event to update other components if needed
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Reload page to ensure clean state
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/images/Logo.jpg"
          alt="BakeryBeyondEggs Logo"
          className="navbar-logo"
        />
        <h1 className="navbar-title">BakeryBeyondEggs</h1>
      </div>
      
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li>
          <Link to="/about" className="navbar-link">About</Link>
        </li>
        <li
          className="dropdown"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <span className="navbar-link">Categories</span>
          {dropdownVisible && (
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onMouseEnter={() => setSubDropdownVisible(true)}
                onMouseLeave={() => setSubDropdownVisible(false)}
              >
                Cakes
                {subDropdownVisible && (
                  <ul className="sub-dropdown-menu">
                    <li>
                      <Link to="/categories/Chocolate" className="dropdown-link">Chocolate</Link>
                    </li>
                    <li>
                      <Link to="/categories/Fruit" className="dropdown-link">Fruit</Link>
                    </li>
                    <li>
                      <Link to="/categories/Cheesecake" className="dropdown-link">Cheesecake</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/categories/Cookies" className="dropdown-link">Cookies</Link>
              </li>
              <li>
                <Link to="/categories/Namkeen" className="dropdown-link">Namkeen</Link>
              </li>
              <li>
                <Link to="/categories" className="dropdown-link">View All</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/gift-options" className="navbar-link">Gift Options</Link>
        </li>
        <li>
          <Link to="/cart" className="navbar-link">Cart</Link>
        </li>
        
        {/* Admin Links */}
        {userRole === "ADMIN" && (
          <>
            <li>
              <Link to="/admin/add-category" className="navbar-link">Add Category</Link>
            </li>
            <li>
              <Link to="/admin/add-subcategory" className="navbar-link">Add SubCategory</Link>
            </li>
            <li>
              <Link to="/additem" className="navbar-link">Add Item</Link>
            </li>
          </>
        )}

        {/* Auth Links */}
        {isLoggedIn ? (
          <>
            <li className="navbar-link">Welcome, {name}!</li>
            <li>
              <button
                className="navbar-link logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} 
                className="navbar-link"
              >
                Login
              </Link>
            </li>
            <li>
              <Link to="/registerform" className="navbar-link">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;