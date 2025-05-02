import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePDF } from 'react-to-pdf';
import '../styles/ShoppingList.css';

const ShoppingList = () => {
  const { toPDF, targetRef } = usePDF({
    filename: 'HomeStock-Shopping-List.pdf',
    page: { margin: 20 }
  });

  // Get inventory items from localStorage
  const [inventoryItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // States for shopping list management
  const [shoppingList, setShoppingList] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [newManualItem, setNewManualItem] = useState({ name: '', quantity: '', category: '' });
  const [showAddManual, setShowAddManual] = useState(false);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // New states for enhanced features
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('priority');
  const [showHistory, setShowHistory] = useState(false);
  const [shoppingHistory, setShoppingHistory] = useState(() => {
    const saved = localStorage.getItem('shoppingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Market price data (in LKR)
  const marketPrices = useMemo(() => ({
    // Grains
    'Rice': { min: 120, max: 180, avg: 150 },
    'Pasta': { min: 180, max: 250, avg: 220 },
    'Flour': { min: 150, max: 200, avg: 175 },
    'Sugar': { min: 190, max: 220, avg: 205 },
    'Salt': { min: 80, max: 120, avg: 100 },
    
    // Dairy
    'Milk': { min: 180, max: 220, avg: 200 },
    'Yogurt': { min: 150, max: 200, avg: 175 },
    'Cheese': { min: 800, max: 1200, avg: 1000 },
    'Butter': { min: 500, max: 700, avg: 600 },
    'Eggs': { min: 30, max: 40, avg: 35 },
    
    // Bakery
    'Bread': { min: 120, max: 180, avg: 150 },
    'Cereal': { min: 800, max: 1200, avg: 1000 },
    'Cookies': { min: 300, max: 500, avg: 400 },
    
    // Meat
    'Chicken': { min: 500, max: 700, avg: 600 },
    'Beef': { min: 1200, max: 1500, avg: 1350 },
    'Fish': { min: 400, max: 600, avg: 500 },
    'Pork': { min: 800, max: 1000, avg: 900 },
    
    // Produce
    'Tomatoes': { min: 120, max: 180, avg: 150 },
    'Onions': { min: 100, max: 150, avg: 125 },
    'Potatoes': { min: 80, max: 120, avg: 100 },
    'Carrots': { min: 100, max: 150, avg: 125 },
    'Lettuce': { min: 150, max: 200, avg: 175 },
    'Apples': { min: 200, max: 300, avg: 250 },
    'Bananas': { min: 80, max: 120, avg: 100 },
    'Oranges': { min: 150, max: 200, avg: 175 },
    
    // Beverages
    'Coffee': { min: 800, max: 1200, avg: 1000 },
    'Tea': { min: 400, max: 600, avg: 500 },
    'Juice': { min: 300, max: 500, avg: 400 },
    'Soda': { min: 150, max: 200, avg: 175 },
    'Water': { min: 80, max: 120, avg: 100 },
    
    // Snacks
    'Chips': { min: 150, max: 250, avg: 200 },
    'Nuts': { min: 500, max: 800, avg: 650 },
    'Chocolate': { min: 200, max: 300, avg: 250 },
    'Crackers': { min: 200, max: 300, avg: 250 },
    
    // Default for unknown items
    'default': { min: 100, max: 300, avg: 200 }
  }), []);

  // Get low and medium stock items
  const getLowStockItems = useCallback(() => 
    inventoryItems.filter(item => item.quantity < 5),
  [inventoryItems]);

  const getMediumStockItems = useCallback(() => 
    inventoryItems.filter(item => item.quantity >= 5 && item.quantity <= 10),
  [inventoryItems]);

  // Get estimated price based on item name or category
  const getEstimatedPrice = useCallback((name, category) => {
    // Try to find exact match first
    if (marketPrices[name]) {
      return marketPrices[name].avg;
    }
    
    // Try to find by category
    const categoryItems = Object.entries(marketPrices)
      .filter(([key]) => key.toLowerCase().includes(category.toLowerCase()));
    
    if (categoryItems.length > 0) {
      // Calculate average price for the category
      const total = categoryItems.reduce((sum, [_, price]) => sum + price.avg, 0);
      return Math.round(total / categoryItems.length);
    }
    
    // Return default price if no match found
    return marketPrices.default.avg;
  }, [marketPrices]);

  // Initialize shopping list with low stock items and optional medium stock items
  useEffect(() => {
    const lowStockItems = getLowStockItems().map(item => ({
      ...item,
      // For low stock items (< 5):
      // Suggest quantity to make total exactly 10
      suggestedQuantity: 10 - item.quantity,
      priority: 'high',
      estimatedPrice: getEstimatedPrice(item.name, item.category)
    }));

    const mediumStockItems = getMediumStockItems().map(item => ({
      ...item,
      // For medium stock items (5-10):
      // Suggest quantity to make total exactly 10
      suggestedQuantity: 10 - item.quantity,
      priority: 'medium',
      estimatedPrice: getEstimatedPrice(item.name, item.category)
    }));

    setShoppingList([...lowStockItems, ...mediumStockItems]);
  }, [getLowStockItems, getMediumStockItems, getEstimatedPrice]);

  // Get user location and find nearby shops
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Simulate ML-based shop suggestions (replace with actual API call)
  useEffect(() => {
    if (userLocation) {
      // Simulated shop data - replace with actual API call to get nearby shops
      const simulatedShops = [
        {
          name: "Cargills Food City",
          distance: "0.5 km",
          offers: [
            { item: "Rice", discount: "15% off" },
            { item: "Milk", discount: "Buy 1 Get 1 Free" }
          ],
          priceIndex: 0.95 // 5% cheaper than average
        },
        {
          name: "Keells Super",
          distance: "1.2 km",
          offers: [
            { item: "Bread", discount: "10% off" },
            { item: "Dairy Products", discount: "8% off" }
          ],
          priceIndex: 1.02 // 2% more expensive than average
        },
        {
          name: "Sathosa",
          distance: "2.0 km",
          offers: [
            { item: "Vegetables", discount: "20% off" },
            { item: "Fruits", discount: "15% off" }
          ],
          priceIndex: 0.90 // 10% cheaper than average
        }
      ];
      setNearbyShops(simulatedShops);
    }
  }, [userLocation]);

  // Sort shopping list
  const sortedShoppingList = useMemo(() => {
    return [...shoppingList].sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (b.estimatedPrice * b.suggestedQuantity) - (a.estimatedPrice * a.suggestedQuantity);
        default:
          return b.priority === 'high' ? 1 : -1;
      }
    });
  }, [shoppingList, sortBy]);

  // Calculate total estimate
  const calculateTotalEstimate = useCallback(() => {
    return shoppingList.reduce((total, item) => {
      return total + (item.estimatedPrice * item.suggestedQuantity);
    }, 0);
  }, [shoppingList]);

  // Save to history
  const saveToHistory = useCallback(() => {
    const historyEntry = {
      date: new Date().toISOString(),
      items: shoppingList,
      totalItems: shoppingList.length,
      totalBudget: calculateTotalEstimate(),
      completed: checkedItems.size === shoppingList.length
    };
    setShoppingHistory(prev => {
      const updatedHistory = [historyEntry, ...prev].slice(0, 10);
      localStorage.setItem('shoppingHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, [shoppingList, checkedItems, calculateTotalEstimate]);

  // Toggle item check
  const toggleItemCheck = useCallback((itemId) => {
    setCheckedItems(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(itemId)) {
        newChecked.delete(itemId);
      } else {
        newChecked.add(itemId);
      }
      return newChecked;
    });
    
    // Save to history when all items are checked
    const updatedCheckedItems = new Set(checkedItems);
    if (updatedCheckedItems.has(itemId)) {
      updatedCheckedItems.delete(itemId);
    } else {
      updatedCheckedItems.add(itemId);
    }
    
    if (updatedCheckedItems.size === shoppingList.length) {
      saveToHistory();
    }
  }, [checkedItems, shoppingList.length, saveToHistory]);

  // Share shopping list
  const shareShoppingList = async () => {
    try {
      const shareData = {
        title: 'HomeStock Shopping List',
        text: `Shopping List (${new Date().toLocaleDateString()})\n` +
          shoppingList.map(item => 
            `${item.name}: ${item.suggestedQuantity} (${item.category}) - LKR ${item.estimatedPrice * item.suggestedQuantity}`
          ).join('\n') +
          `\n\nTotal Estimated Budget: LKR ${calculateTotalEstimate()}`
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Shopping list copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle adding manual item
  const handleAddManualItem = (e) => {
    e.preventDefault();
    if (newManualItem.name && newManualItem.quantity) {
      const estimatedPrice = getEstimatedPrice(newManualItem.name, newManualItem.category);
      setManualItems([...manualItems, { 
        ...newManualItem, 
        id: Date.now(), 
        priority: 'manual',
        estimatedPrice
      }]);
      setNewManualItem({ name: '', quantity: '', category: '' });
      setShowAddManual(false);
    }
  };

  // Format currency in LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="shopping-list-container">
      <div className="shopping-list-header">
        <div className="header-left">
          <h1>Shopping List</h1>
          <p>Based on your inventory status</p>
        </div>
        <div className="header-actions">
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <button className="share-button" onClick={shareShoppingList}>
            Share List
          </button>
          <button className="history-button" onClick={() => setShowHistory(true)}>
            View History
          </button>
          <button className="pdf-button" onClick={toPDF}>
            Download PDF
          </button>
          <button className="add-manual-button" onClick={() => setShowAddManual(true)}>
            + Add Item
          </button>
        </div>
      </div>

      {/* Shopping List Content */}
      <div className="shopping-list-content">
        <div className="list-section">
          <h3>Shopping List</h3>
          <div className="estimated-total">
            Estimated Budget: {formatCurrency(calculateTotalEstimate())}
          </div>
          <table className="shopping-table">
            <thead>
              <tr>
                <th></th>
                <th>Item</th>
                <th>Current Stock</th>
                <th>To Buy</th>
                <th>Category</th>
                <th>Est. Price (LKR)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedShoppingList.map(item => (
                <tr 
                  key={item.id}
                  className={`${item.priority} ${checkedItems.has(item.id) ? 'checked' : ''}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleItemCheck(item.id)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.suggestedQuantity}</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.estimatedPrice)}</td>
                  <td>{formatCurrency(item.estimatedPrice * item.suggestedQuantity)}</td>
                </tr>
              ))}
              {manualItems.map(item => (
                <tr key={item.id} className={checkedItems.has(item.id) ? 'checked' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleItemCheck(item.id)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>-</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.estimatedPrice)}</td>
                  <td>{formatCurrency(item.estimatedPrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nearby Shops Section */}
        <div className="nearby-shops">
          <h3>Recommended Shops & Offers</h3>
          <div className="shops-grid">
            {nearbyShops.map((shop, index) => (
              <div key={index} className="shop-card">
                <h4>{shop.name}</h4>
                <p className="distance">{shop.distance}</p>
                <p className="price-index">
                  Price Index: {shop.priceIndex < 1 ? 
                    `${Math.round((1 - shop.priceIndex) * 100)}% cheaper than average` : 
                    `${Math.round((shop.priceIndex - 1) * 100)}% more expensive than average`}
                </p>
                <div className="offers">
                  <h5>Current Offers:</h5>
                  <ul>
                    {shop.offers.map((offer, i) => (
                      <li key={i}>
                        {offer.item}: {offer.discount}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="estimated-savings">
                  <p>Estimated Savings: {formatCurrency(calculateTotalEstimate() * (1 - shop.priceIndex))}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping History Modal */}
      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Shopping History</h2>
              <button className="close-button" onClick={() => setShowHistory(false)}>×</button>
            </div>
            <div className="history-list">
              {shoppingHistory.map((entry, index) => (
                <div key={index} className="history-entry">
                  <div className="history-header">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span>{entry.totalItems} items</span>
                    <span className={entry.completed ? 'completed' : ''}>
                      {entry.completed ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                  <div className="history-budget">
                    Budget: {formatCurrency(entry.totalBudget)}
                  </div>
                  <div className="history-items">
                    {entry.items.map((item, i) => (
                      <div key={i} className="history-item">
                        {item.name} ({item.suggestedQuantity}) - {formatCurrency(item.estimatedPrice * item.suggestedQuantity)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Item Add Modal */}
      {showAddManual && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Manual Item</h2>
              <button className="close-button" onClick={() => setShowAddManual(false)}>×</button>
            </div>
            <form onSubmit={handleAddManualItem}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  required
                  value={newManualItem.name}
                  onChange={(e) => setNewManualItem({ ...newManualItem, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newManualItem.quantity}
                  onChange={(e) => setNewManualItem({ ...newManualItem, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newManualItem.category}
                  onChange={(e) => setNewManualItem({ ...newManualItem, category: e.target.value })}
                  required
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
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddManual(false)}>Cancel</button>
                <button type="submit">Add to List</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden PDF content */}
      <div ref={targetRef} className="pdf-content">
        <div className="pdf-header">
          <h1>HomeStock Shopping List</h1>
          <h2>{new Date().toLocaleDateString()}</h2>
          <p>Estimated Budget: {formatCurrency(calculateTotalEstimate())}</p>
        </div>
        
        <div className="shopping-section">
          <h3>Shopping Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Price (LKR)</th>
                <th>Total (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {sortedShoppingList.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.suggestedQuantity}</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.estimatedPrice)}</td>
                  <td>{formatCurrency(item.estimatedPrice * item.suggestedQuantity)}</td>
                </tr>
              ))}
              {manualItems.map((item, index) => (
                <tr key={`manual-${index}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.estimatedPrice)}</td>
                  <td>{formatCurrency(item.estimatedPrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="shopping-section">
          <h3>Recommended Shops</h3>
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Distance</th>
                <th>Price Index</th>
                <th>Estimated Savings</th>
              </tr>
            </thead>
            <tbody>
              {nearbyShops.map((shop, index) => (
                <tr key={index}>
                  <td>{shop.name}</td>
                  <td>{shop.distance}</td>
                  <td>{shop.priceIndex < 1 ? 
                    `${Math.round((1 - shop.priceIndex) * 100)}% cheaper` : 
                    `${Math.round((shop.priceIndex - 1) * 100)}% more expensive`}</td>
                  <td>{formatCurrency(calculateTotalEstimate() * (1 - shop.priceIndex))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList; 