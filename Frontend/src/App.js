import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import CategoriesPage from "./CategoriesPage";
import SubcategoriesPage from "./SubcategoriesPage";
import ItemsPage from "./ItemsPage";
import Login from "./Login";
import RegisterForm from "./RegisterForm";
import CartPage from "./CartPage";
import Verification from "./EmailVerification";
import About from "./About";
import HomePage from "./HomePage"; // Import it

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Shows CategoriesPage + About */}
        <Route path="/login" element={<Login />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/categories/:categoryName" element={<SubcategoriesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<About />} /> {/* Still here if you want separate About too */}
        <Route path="/subcategories/:subcategoryName/items" element={<ItemsPage />} />
      </Routes>
    </Router>
  );
}


export default App;
