import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [subDropdownVisible, setSubDropdownVisible] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/path-to-your-logo/logo.png"
          alt="BakeryBeyondEggs Logo"
          className="navbar-logo"
        />
        <h1 className="navbar-title">BakeryBeyondEggs</h1>
      </div>
      <ul className="navbar-links">
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
        <li><Link to="/login" className="navbar-link">Login</Link></li>
        <li><Link to="/registerform" className="navbar-link">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
