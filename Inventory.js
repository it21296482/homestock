import React, { useState, useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import '../styles/Inventory.css';
import inventoryService from '../services/inventoryService';

const Inventory = () => {
  const { toPDF, targetRef } = usePDF({
    filename: 'HomeStock-Inventory.pdf',
    page: { margin: 20 }
  });

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noHousehold, setNoHousehold] = useState(false);

  // Fetch items from MongoDB on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await inventoryService.getAllItems();
        setItems(data);
        setIsLoading(false);
        setNoHousehold(false);
      } catch (err) {
        if (err.message === 'Please select a household first') {
          setNoHousehold(true);
        } else {
          setError('Failed to load inventory items');
        }
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({
    quantity: '',
    expiryDate: ''
  });
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    category: '',
    expiryDate: ''
  });

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      quantity: '',
      expiryDate: ''
    };

    const itemToValidate = isEditing ? editingItem : newItem;

    // Validate quantity
    if (parseInt(itemToValidate.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
      isValid = false;
    }

    // Validate expiry date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(itemToValidate.expiryDate);
    if (expiryDate < today) {
      newErrors.expiryDate = 'Expiry date cannot be in the past';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle adding new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const itemToAdd = {
          ...newItem,
          quantity: parseInt(newItem.quantity)
        };
        const addedItem = await inventoryService.addItem(itemToAdd);
        setItems([...items, addedItem]);
        setNewItem({ name: '', quantity: '', category: '', expiryDate: '' });
        setErrors({ quantity: '', expiryDate: '' });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add item');
      }
    }
  };

  // Handle editing item
  const handleEditItem = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const updatedItem = await inventoryService.updateItem(editingItem._id, {
          ...editingItem,
          quantity: parseInt(editingItem.quantity)
        });
        setItems(items.map(item => 
          item._id === updatedItem._id ? updatedItem : item
        ));
        setEditingItem(null);
        setIsEditing(false);
        setErrors({ quantity: '', expiryDate: '' });
      } catch (err) {
        setError('Failed to update item');
      }
    }
  };

  // Start editing an item
  const startEdit = (item) => {
    setEditingItem({ ...item });
    setIsEditing(true);
    setErrors({ quantity: '', expiryDate: '' });
  };

  // Handle quantity change with validation
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (isEditing) {
      setEditingItem({ ...editingItem, quantity: value });
    } else {
      setNewItem({ ...newItem, quantity: value });
    }
    
    if (parseInt(value) <= 0) {
      setErrors({ ...errors, quantity: 'Quantity must be a positive number' });
    } else {
      setErrors({ ...errors, quantity: '' });
    }
  };

  // Handle expiry date change with validation
  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    if (isEditing) {
      setEditingItem({ ...editingItem, expiryDate: value });
    } else {
      setNewItem({ ...newItem, expiryDate: value });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(value);
    
    if (expiryDate < today) {
      setErrors({ ...errors, expiryDate: 'Expiry date cannot be in the past' });
    } else {
      setErrors({ ...errors, expiryDate: '' });
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      await inventoryService.deleteItem(id);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  // Get stock level items
  const getStockLevels = () => {
    const lowStock = items.filter(item => item.quantity < 5);
    const mediumStock = items.filter(item => item.quantity >= 5 && item.quantity <= 10);
    const sufficientStock = items.filter(item => item.quantity > 10);
    return { lowStock, mediumStock, sufficientStock };
  };

  // Get alert class based on stock level
  const getStockLevelClass = (quantity) => {
    if (quantity < 5) return 'stock-low';
    if (quantity <= 10) return 'stock-medium';
    return 'stock-sufficient';
  };

  const { lowStock, mediumStock, sufficientStock } = getStockLevels();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (noHousehold) {
    return (
      <div className="no-household-message">
        <h2>No Household Selected</h2>
        <p>Please select a household from your profile to manage inventory.</p>
        <button 
          className="select-household-button"
          onClick={() => window.location.href = '/profile'}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div className="header-left">
          <h1>HomeStock</h1>
          <h2>Inventory Management</h2>
        </div>
        <div className="header-actions">
          <button 
            className="pdf-button"
            onClick={toPDF}
          >
            Download PDF
          </button>
          <button 
            className="add-item-button"
            onClick={() => {
              setShowAddForm(true);
              setErrors({ quantity: '', expiryDate: '' });
            }}
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PDF Content */}
      <div ref={targetRef} className="pdf-content">
        <div className="pdf-header">
          <h1>HomeStock</h1>
          <h2>Household Inventory Report</h2>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="pdf-inventory-table">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Level Alerts */}
      <div className="stock-alerts">
        <div className="stock-alert-header">
          <h3>Stock Level Alerts</h3>
        </div>
        <div className="stock-alert-container">
          <div className="stock-alert low">
            <h4>Low Stock</h4>
            <div className="alert-items">
              {lowStock.length > 0 ? (
                lowStock.map(item => (
                  <div key={item._id} className="alert-item">
                    {item.name} ({item.quantity})
                  </div>
                ))
              ) : (
                <div className="no-alert-items">No items with low stock</div>
              )}
            </div>
          </div>
          <div className="stock-alert medium">
            <h4>Medium Stock</h4>
            <div className="alert-items">
              {mediumStock.length > 0 ? (
                mediumStock.map(item => (
                  <div key={item._id} className="alert-item">
                    {item.name} ({item.quantity})
                  </div>
                ))
              ) : (
                <div className="no-alert-items">No items with medium stock</div>
              )}
            </div>
          </div>
          <div className="stock-alert sufficient">
            <h4>Sufficient Stock</h4>
            <div className="alert-items">
              {sufficientStock.length > 0 ? (
                sufficientStock.map(item => (
                  <div key={item._id} className="alert-item">
                    {item.name} ({item.quantity})
                  </div>
                ))
              ) : (
                <div className="no-alert-items">No items with sufficient stock</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="inventory-list">
        <div className="list-header">
          <span>Item Name</span>
          <span>Quantity</span>
          <span>Category</span>
          <span>Expiry Date</span>
          <span>Actions</span>
        </div>
        {filteredItems.map(item => (
          <div key={item._id} className={`list-item ${getStockLevelClass(item.quantity)}`}>
            <span>{item.name}</span>
            <span>{item.quantity}</span>
            <span>{item.category}</span>
            <span>{new Date(item.expiryDate).toLocaleDateString()}</span>
            <span className="item-actions">
              <button 
                className="edit-button"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteItem(item._id)}
              >
                Delete
              </button>
            </span>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="no-items">
            No items found. Add some items to your inventory!
          </div>
        )}
      </div>

      {/* Add/Edit Item Form Modal */}
      {(showAddForm || isEditing) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
              <button 
                className="close-button"
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                    setEditingItem(null);
                  } else {
                    setShowAddForm(false);
                  }
                  setErrors({ quantity: '', expiryDate: '' });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={isEditing ? handleEditItem : handleAddItem}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  required
                  value={isEditing ? editingItem.name : newItem.name}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingItem({...editingItem, name: e.target.value});
                    } else {
                      setNewItem({...newItem, name: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={isEditing ? editingItem.quantity : newItem.quantity}
                  onChange={handleQuantityChange}
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <div className="error-message">{errors.quantity}</div>}
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  required
                  value={isEditing ? editingItem.category : newItem.category}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingItem({...editingItem, category: e.target.value});
                    } else {
                      setNewItem({...newItem, category: e.target.value});
                    }
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Meat">Meat</option>
                  <option value="Produce">Produce</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  required
                  value={isEditing ? editingItem.expiryDate : newItem.expiryDate}
                  onChange={handleExpiryDateChange}
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                      setEditingItem(null);
                    } else {
                      setShowAddForm(false);
                    }
                    setErrors({ quantity: '', expiryDate: '' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit">{isEditing ? 'Save Changes' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Add these styles to your Inventory.css
const styles = `
  .no-household-message {
    text-align: center;
    padding: 40px;
    max-width: 600px;
    margin: 40px auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .no-household-message h2 {
    color: #1D1D1F;
    margin-bottom: 16px;
  }

  .no-household-message p {
    color: #86868B;
    margin-bottom: 24px;
  }

  .select-household-button {
    padding: 12px 24px;
    background-color: #0071E3;
    color: white;
    border: none;
    border-radius: 980px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .select-household-button:hover {
    background-color: #0077ED;
    transform: translateY(-1px);
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Inventory; 