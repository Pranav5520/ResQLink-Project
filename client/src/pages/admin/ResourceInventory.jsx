import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaBox, FaPlus } from 'react-icons/fa';

const CATEGORIES = ['Food', 'Water', 'Medicine', 'Clothing', 'Blankets', 'Rescue Equipment', 'Hygiene Kits', 'Fuel', 'Other'];

export default function ResourceInventory() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRes, setEditRes] = useState(null);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const [form, setForm] = useState({ name: '', category: 'Food', quantity: 0, unit: '', storageLocation: '', minimumStockLevel: 0 });

  useEffect(() => { fetchResources(); }, [filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filters.category) params.set('category', filters.category);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/api/resources?${params}`);
      setResources(data.resources || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setEditRes(null); setForm({ name: '', category: 'Food', quantity: 0, unit: '', storageLocation: '', minimumStockLevel: 0 }); setShowModal(true); };

  const openEdit = (res) => { setEditRes(res); setForm({ name: res.name, category: res.category, quantity: res.quantity, unit: res.unit, storageLocation: res.storageLocation, minimumStockLevel: res.minimumStockLevel }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, quantity: parseInt(form.quantity), minimumStockLevel: parseInt(form.minimumStockLevel) };
      if (editRes) {
        await api.put(`/api/resources/${editRes._id}`, payload);
        toast.success('Resource updated');
      } else {
        await api.post('/api/resources', payload);
        toast.success('Resource created');
      }
      setShowModal(false);
      fetchResources();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try { await api.delete(`/api/resources/${id}`); toast.success('Deleted'); fetchResources(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FaBox /> Resource Inventory</h2>
        <button className="btn btn-primary" onClick={openCreate}><FaPlus /> Add Resource</button>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search resources..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select className="form-control" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : resources.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">📦</div><h4>No resources found</h4></div></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th>Storage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td><span className="badge badge-info">{r.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.quantity}</td>
                    <td>{r.unit}</td>
                    <td>{r.minimumStockLevel}</td>
                    <td><span className={`badge badge-${r.status === 'Available' ? 'success' : r.status === 'Low Stock' ? 'warning' : 'danger'}`}>{r.status}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{r.storageLocation}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-outline" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteResource(r._id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editRes ? 'Edit Resource' : 'Add Resource'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Name *</label><input className="form-control" name="name" value={form.name} onChange={handleChange} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>Category *</label><select className="form-control" name="category" value={form.category} onChange={handleChange}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label>Unit *</label><input className="form-control" name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. kg, pieces, kits" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Quantity *</label><input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} min="0" required /></div>
                  <div className="form-group"><label>Min Stock Level</label><input type="number" className="form-control" name="minimumStockLevel" value={form.minimumStockLevel} onChange={handleChange} min="0" /></div>
                </div>
                <div className="form-group"><label>Storage Location</label><input className="form-control" name="storageLocation" value={form.storageLocation} onChange={handleChange} /></div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="submit" className="btn btn-primary">{editRes ? 'Update' : 'Add'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
