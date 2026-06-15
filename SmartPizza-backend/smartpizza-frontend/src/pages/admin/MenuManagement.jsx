import { useState, useEffect } from 'react'
import { Pizza, Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import { TableSkeleton } from '../../components/common/LoadingSkeleton'

export const MenuManagement = () => {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', size: '', categoryName: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    productService.getAll().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const resetForm = () => setForm({ name: '', price: '', description: '', size: '', categoryName: '' })

  const handleSave = async () => {
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      if (editing) {
        const updated = await productService.update(editing, payload)
        setProducts(prev => prev.map(p => p.id === editing ? updated : p))
        toast.success('Product updated')
      } else {
        const created = await productService.add(payload)
        setProducts(prev => [...prev, created])
        toast.success('Product added')
      }
      setShowForm(false); setEditing(null); resetForm()
    } catch { toast.error('Failed to save product') }
    finally { setSaving(false) }
  }

  const handleEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), description: p.description || '', size: p.size || '', categoryName: p.categoryName || '' })
    setEditing(p.id); setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await productService.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Pizza size={28} /> Menu Management</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm() }} className="btn btn-pizza d-flex align-items-center gap-1">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-primary">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">{editing ? 'Edit Product' : 'New Product'}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setShowForm(false); setEditing(null) }}><X size={16} /></button>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small">Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="col-md-2">
                <label className="form-label small">Price</label>
                <input type="number" step="0.01" className="form-control" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Category</label>
                <input className="form-control" value={form.categoryName} onChange={e => setForm({...form, categoryName: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Size</label>
                <input className="form-control" value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label small">Description</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button onClick={handleSave} disabled={saving} className="btn btn-pizza d-flex align-items-center gap-1">
                  <Check size={16} /> {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null) }} className="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? <TableSkeleton /> : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Size</th><th className="px-3 py-2">Price</th><th className="px-3 py-2">Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="px-3 py-2 fw-medium">{p.name}</td>
                    <td className="px-3 py-2"><span className="badge bg-pizza-light text-pizza">{p.categoryName}</span></td>
                    <td className="px-3 py-2">{p.size || '-'}</td>
                    <td className="px-3 py-2 fw-bold">{formatCurrency(p.price)}</td>
                    <td className="px-3 py-2">
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(p)}><Edit2 size={14} /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
