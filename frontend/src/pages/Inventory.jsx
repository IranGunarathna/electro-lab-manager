import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/items?keyword=${search}&category=${category}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '20px' }}>Lab Inventory & Components</h1>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search items (e.g. ESP32, Resistor, Multimeter)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
        >
          <option value="All">All Categories</option>
          <option value="Microcontroller">Microcontroller</option>
          <option value="Passive Component">Passive Component</option>
          <option value="Active Component">Active Component</option>
          <option value="Sensor">Sensor</option>
          <option value="Equipment">Equipment</option>
          <option value="Tool">Tool</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* Inventory Table */}
      {loading ? (
        <p>Loading components...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '14px' }}>Item Name</th>
              <th style={{ padding: '14px' }}>Category</th>
              <th style={{ padding: '14px' }}>Location</th>
              <th style={{ padding: '14px' }}>Stock</th>
              <th style={{ padding: '14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No items found</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: '600' }}>{item.name}</td>
                  <td style={{ padding: '14px', color: '#64748b' }}>{item.category}</td>
                  <td style={{ padding: '14px', color: '#64748b' }}>
                    {typeof item.location === 'string'
                      ? item.location
                      : (item.location?.rack ? `Rack ${item.location.rack}, Shelf ${item.location.shelf}` : 'Worktable 1')}
                  </td>
                  <td style={{ padding: '14px' }}>{item.availableQuantity} / {item.totalQuantity}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: item.status === 'Available' ? '#dcfce7' : item.status === 'Low Stock' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'Available' ? '#166534' : item.status === 'Low Stock' ? '#92400e' : '#991b1b',
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}