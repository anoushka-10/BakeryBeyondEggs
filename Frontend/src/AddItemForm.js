import React, { useState, useEffect } from 'react';
import './AddItemForm.css';

function AddItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategoryid: '',
    weightPrices: [{ weight: '', price: '' }],
  });
  const [image, setImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  // Load subcategories on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/subcategories/getAll`)
      .then(res => res.json())
      .then(data => setSubcategories(data))
      .catch(err => {
        console.error('Failed to fetch subcategories:', err);
        setSubcategories([]);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWeightPriceChange = (index, e) => {
    const updated = [...formData.weightPrices];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, weightPrices: updated });
  };

  const addWeightPrice = () => {
    setFormData({
      ...formData,
      weightPrices: [...formData.weightPrices, { weight: '', price: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate subcategory is selected
    if (!formData.subcategoryid) {
      alert('Please select a subcategory');
      return;
    }

    const payload = new FormData();
    payload.append('itemRequest', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    payload.append('image', image);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/items/additems`, {
        method: 'POST',
        body: payload,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const result = await res.json();
      alert('Item added successfully!');
      console.log(result);
    } catch (err) {
      alert('Error adding item.');
      console.error(err);
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h2>Add New Item</h2>

      <label>Item Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

      <label>Description</label>
      <textarea name="description" value={formData.description} onChange={handleInputChange} required />

      <label>Subcategory</label>
      <select
        name="subcategoryid"
        value={formData.subcategoryid}
        onChange={handleInputChange}
        required
      >
        <option value="">-- Select Subcategory --</option>
        {subcategories.map((subcat) => (
          <option key={subcat.id} value={subcat.id}>
            {subcat.name}
          </option>
        ))}
      </select>

      <label>Image</label>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

      <div className="weight-price-section">
        <label>Weight & Price</label>
        {formData.weightPrices.map((wp, idx) => (
          <div key={idx} className="weight-price-row">
            <input
              type="text"
              name="weight"
              placeholder="Weight (e.g. 500g)"
              value={wp.weight}
              onChange={(e) => handleWeightPriceChange(idx, e)}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={wp.price}
              onChange={(e) => handleWeightPriceChange(idx, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addWeightPrice}>+ Add More</button>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddItemForm;
