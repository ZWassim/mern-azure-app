import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API Base URL - Automatically switches between dev and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? ''  // Same origin in production
  : 'http://localhost:5000';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/items`, {
        name: newItemName,
        description: description
      });
      setItems([response.data, ...items]);
      setNewItemName('');
      setDescription('');
      setError('');
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Stack App on Azure</h1>
        <p>Successfully Deployed!</p>
      </header>
      
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={addItem} className="add-form">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>

        <div className="items-list">
          <h2>Items ({items.length})</h2>
          {loading && <p>Loading...</p>}
          {items.length === 0 && !loading && (
            <p>No items yet. Add your first item!</p>
          )}
          {items.map(item => (
            <div key={item._id} className="item-card">
              <div className="item-info">
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                <small>Added: {new Date(item.createdAt).toLocaleString()}</small>
              </div>
              <button onClick={() => deleteItem(item._id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
