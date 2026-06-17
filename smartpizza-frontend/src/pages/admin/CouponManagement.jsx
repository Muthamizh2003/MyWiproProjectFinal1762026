import { useState, useEffect } from 'react'
import { Ticket, Plus, Percent, Trash2, Edit2 } from 'lucide-react'
import { couponService } from '../../services/couponService'
import { useToast } from '../../context/ToastContext'

const emptyForm = { code: '', discount: 0, type: 'PERCENTAGE', minOrderAmount: 0, expiryDays: 30 }

export const CouponManagement = () => {
  const toast = useToast()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadCoupons = () => {
    setLoading(true)
    couponService.getAll().then(setCoupons).catch(() => toast.error('Failed to load coupons')).finally(() => setLoading(false))
  }

  useEffect(() => { loadCoupons() }, [])

  const handleSave = async () => {
    if (!form.code || form.discount <= 0) { toast.error('Code and discount are required'); return }
    try {
      const payload = {
        code: form.code,
        discount: form.discount,
        type: form.type,
        minOrderAmount: form.minOrderAmount,
        expiryDate: new Date(Date.now() + form.expiryDays * 86400000).toISOString()
      }
      if (editingId) {
        await couponService.update(editingId, payload)
        toast.success('Coupon updated')
      } else {
        await couponService.create(payload)
        toast.success('Coupon created')
      }
      setShowForm(false); setEditingId(null); setForm(emptyForm)
      loadCoupons()
    } catch { toast.error('Failed to save coupon') }
  }

  const handleDelete = async (id) => {
    try {
      await couponService.delete(id)
      toast.success('Coupon deleted')
      loadCoupons()
    } catch { toast.error('Failed to delete coupon') }
  }

  const handleEdit = (c) => {
    const expiryDate = c.expiryDate ? new Date(c.expiryDate) : new Date()
    const expiryDays = Math.ceil((expiryDate - new Date()) / 86400000)
    setEditingId(c.id)
    setForm({ code: c.code, discount: c.discount, type: c.type, minOrderAmount: c.minOrderAmount, expiryDays: Math.max(expiryDays, 1) })
    setShowForm(true)
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Ticket size={28} /> Coupon Management</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm) }}
          className="btn btn-pizza d-flex align-items-center gap-1"><Plus size={18} /> Add Coupon</button>
      </div>

      {showForm && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">{editingId ? 'Edit Coupon' : 'New Coupon'}</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small">Code</label>
                <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                  className="form-control" placeholder="e.g. PIZZA20" disabled={!!editingId} />
              </div>
              <div className="col-md-2">
                <label className="form-label small">Discount</label>
                <div className="input-group">
                  <input type="number" value={form.discount} onChange={e => setForm({...form, discount: +e.target.value})}
                    className="form-control" min="1" />
                  <span className="input-group-text">{form.type === 'PERCENTAGE' ? '%' : '₹'}</span>
                </div>
              </div>
              <div className="col-md-2">
                <label className="form-label small">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="form-select">
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FLAT">Flat</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small">Min Order (₹)</label>
                <input type="number" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: +e.target.value})}
                  className="form-control" min="0" />
              </div>
              <div className="col-md-2">
                <label className="form-label small">Valid (days)</label>
                <input type="number" value={form.expiryDays} onChange={e => setForm({...form, expiryDays: +e.target.value})}
                  className="form-control" min="1" />
              </div>
              <div className="col-12 d-flex gap-2">
                <button onClick={handleSave} className="btn btn-pizza">{editingId ? 'Update' : 'Create'}</button>
                <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="placeholder-glow">{[1,2,3].map(i => <div key={i} className="placeholder w-100 bg-secondary mb-2" style={{ height: 48 }} />)}</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-4">
              <Percent size={48} className="text-muted mb-2" />
              <p className="text-muted mb-0">No coupons created yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover small mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Discount</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Min Order</th>
                    <th className="px-3 py-2">Expiry</th>
                    <th className="px-3 py-2 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td className="px-3 py-2 fw-medium">{c.code}</td>
                      <td className="px-3 py-2">{c.type === 'PERCENTAGE' ? `${c.discount}%` : `₹${c.discount}`}</td>
                      <td className="px-3 py-2"><span className="badge bg-info">{c.type}</span></td>
                      <td className="px-3 py-2">₹{c.minOrderAmount}</td>
                      <td className="px-3 py-2">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : '—'}</td>
                      <td className="px-3 py-2 text-end">
                        <button onClick={() => handleEdit(c)} className="btn btn-sm btn-outline-secondary me-1"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
