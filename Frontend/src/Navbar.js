import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";


function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [subDropdownVisible, setSubDropdownVisible] = useState(false);
  const[name, setName]=useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // 🔧

  useEffect(()=>{
    const token =localStorage.getItem("authToken");
    if(token){
      axios
        .get(`${process.env.REACT_APP_API_URL}/name`,{
          headers:{
            Authorization:`Bearer ${token}`
          },
        })
        .then((res)=>{
          setName(res.data);
        })
        .catch((err)=>{
          console.error("Error fetching name:", err);
          localStorage.removeItem("token");
        });
    }
  },[]);

  const isLoggedIn = !!localStorage.getItem("authToken");

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
        {/* <li><Link to="/login" className="navbar-link">Login</Link></li>
        <li><Link to="/registerform" className="navbar-link">Register</Link></li> */}
       {isLoggedIn ? (
  <>
    <li className="navbar-link">Welcome, {name}!</li>
    <li>
      <button
        className="navbar-link logout-button"
        onClick={() => {
          localStorage.removeItem("authToken");
          window.location.reload(); // refresh to update navbar or use navigate
        }}
      >
        Logout
      </button>
    </li>
  </>
) : (
  <>
    <li>
      <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="navbar-link">
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
                                                    