import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import CategoriesPage from "./CategoriesPage";
import SubcategoriesPage from "./SubcategoriesPage";
import ItemsPage from "./ItemsPage";
import Login from "./Login";
import RegisterForm from "./RegisterForm";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route for the home page with all categories */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/RegisterForm" element={<RegisterForm/>} />

        {/* Route for the subcategories of a specific category */}
        <Route path="/categories/:categoryName" element={<SubcategoriesPage />} />

        {/* Route for items under a specific subcategory */}
        <Route path="/subcategories/:subcategoryName/items" element={<ItemsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
