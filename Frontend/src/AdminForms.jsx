import React, { useState, useEffect } from 'react';
import './AdminForms.css';

// Add Category Component
const AddCategory = () => {
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryForm.name.trim()) {
      showMessage('error', 'Category name is required');
      return;
    }
    
    if (!categoryForm.image) {
      showMessage('error', 'Category image is required');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('categoryRequest', new Blob([JSON.stringify({ name: categoryForm.name })], {
        type: 'application/json'
      }));
      formData.append('image', categoryForm.image);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/categories/addcategory`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showMessage('success', 'Category added successfully!');
        setCategoryForm({ name: '', image: null });
      } else {
        const errorText = await response.text();
        showMessage('error', 'Failed to add category: ' + errorText);
      }
    } catch (error) {
      showMessage('error', 'Error adding category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="admin-forms-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-container">
        <h2>Add New Category</h2>
        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name:</label>
            <input
              type="text"
              id="categoryName"
              name="name"
              value={categoryForm.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryImage">Category Image:</label>
            <input
              type="file"
              id="categoryImage"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </div>

          <button onClick={handleSubmit} className="submit-button" disabled={loading}>
            {loading ? 'Adding Category...' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Subcategory Component
const AddSubcategory = () => {
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    categoryId: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/categories/getallcategories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        showMessage('error', 'Failed to fetch categories');
      }
    } catch (error) {
      showMessage('error', 'Error fetching categories: ' + error.message);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subcategoryForm.name.trim()) {
      showMessage('error', 'Subcategory name is required');
      return;
    }
    
    if (!subcategoryForm.categoryId) {
      showMessage('error', 'Please select a category');
      return;
    }
    
    if (!subcategoryForm.image) {
      showMessage('error', 'Subcategory image is required');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('subcategoryRequest', new Blob([JSON.stringify({
        name: subcategoryForm.name,
        categoryId: parseInt(subcategoryForm.categoryId)
      })], {
        type: 'application/json'
      }));
      formData.append('image', subcategoryForm.image);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/subcategories/addSubcategory`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showMessage('success', 'Subcategory added successfully!');
        setSubcategoryForm({ name: '', categoryId: '', image: null });
      } else {
        const errorText = await response.text();
        showMessage('error', 'Failed to add subcategory: ' + errorText);
      }
    } catch (error) {
      showMessage('error', 'Error adding subcategory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSubcategoryForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="admin-forms-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-container">
        <h2>Add New Subcategory</h2>
        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="subcategoryName">Subcategory Name:</label>
            <input
              type="text"
              id="subcategoryName"
              name="name"
              value={subcategoryForm.name}
              onChange={handleChange}
              placeholder="Enter subcategory name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorySelect">Select Category:</label>
            <select
              id="categorySelect"
              name="categoryId"
              value={subcategoryForm.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subcategoryImage">Subcategory Image:</label>
            <input
              type="file"
              id="subcategoryImage"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </div>

          <button onClick={handleSubmit} className="submit-button" disabled={loading}>
            {loading ? 'Adding Subcategory...' : 'Add Subcategory'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export both components
export { AddCategory, AddSubcategory };