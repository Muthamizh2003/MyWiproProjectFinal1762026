import { useState, useEffect, useRef } from 'react'
import { ClipboardList, Bike, Search, RefreshCw } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { deliveryService } from '../../services/deliveryService'
import { useToast } from '../../context/ToastContext'

const STATUSES = ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export const OrderManagement = () => {
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const intervalRef = useRef(null)

  const [orderId, setOrderId] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deliveryOrderId, setDeliveryOrderId] = useState('')
  const [startingDelivery, setStartingDelivery] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAllOrders()
      setOrders(data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders(); intervalRef.current = setInterval(fetchOrders, 30000); return () => clearInterval(intervalRef.current) }, [])

  const handleUpdateStatus = async () => {
    if (!orderId || !newStatus) { toast.error('Please fill all fields'); return }
    setUpdating(true)
    try {
      await adminService.updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated')
      setOrderId('')
      setNewStatus('')
      fetchOrders()
    } catch {
      toast.error('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handleStartDelivery = async () => {
    if (!deliveryOrderId) { toast.error('Enter an order ID'); return }
    setStartingDelivery(true)
    try {
      await deliveryService.start(deliveryOrderId)
      toast.success('Delivery started! Agent assigned.')
      setDeliveryOrderId('')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start delivery')
    } finally {
      setStartingDelivery(false)
    }
  }

  const filtered = orders.filter(o =>
    !filter || String(o.id).includes(filter) || (o.userName || '').toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><ClipboardList size={28} /> Order Management</h1>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Update Order Status</h5>
              <div className="d-flex gap-2 align-items-end flex-wrap">
                <div>
                  <label className="form-label small">Order ID</label>
                  <input type="number" className="form-control" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Enter order ID" />
                </div>
                <div>
                  <label className="form-label small">New Status</label>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="">Select status</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <button className="btn btn-pizza" onClick={handleUpdateStatus} disabled={updating || !orderId || !newStatus}>
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><Bike size={20} /> Start Delivery</h5>
              <div className="d-flex gap-2 align-items-end flex-wrap">
                <div>
                  <label className="form-label small">Order ID</label>
                  <input type="number" className="form-control" value={deliveryOrderId} onChange={e => setDeliveryOrderId(e.target.value)} placeholder="Enter confirmed order ID" />
                </div>
                <button className="btn btn-pizza" onClick={handleStartDelivery} disabled={startingDelivery || !deliveryOrderId}>
                  {startingDelivery ? 'Starting...' : 'Assign Agent & Start'}
                </button>
              </div>
              <p className="text-muted small mt-2 mb-0">Assigns an available delivery agent and starts GPS tracking simulation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0">All Orders</h5>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group input-group-sm" style={{ maxWidth: 250 }}>
                <span className="input-group-text"><Search size={14} /></span>
                <input type="text" className="form-control" placeholder="Search by ID or customer..." value={filter} onChange={e => setFilter(e.target.value)} />
              </div>
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={fetchOrders} disabled={loading}>
                <RefreshCw size={14} /> {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-4 text-muted">{orders.length === 0 ? 'No orders found' : 'No orders match your search'}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Delivery Agent</th>
                    <th>Delivery Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id}>
                      <td className="fw-medium">{o.id}</td>
                      <td>{o.userName || `User #${o.userId}`}</td>
                      <td>₹{o.totalAmount?.toFixed(2)}</td>
                      <td><span className={`badge ${o.status === 'DELIVERED' ? 'bg-success' : o.status === 'CANCELLED' ? 'bg-danger' : o.status === 'OUT_FOR_DELIVERY' ? 'bg-warning text-dark' : o.status === 'PREPARING' ? 'bg-info text-dark' : 'bg-secondary'}`}>{o.status?.replace(/_/g, ' ')}</span></td>
                      <td>{o.deliveryAgentName || <span className="text-muted">—</span>}</td>
                      <td>{o.deliveryStatus ? <span className="badge bg-light text-dark border">{o.deliveryStatus.replace(/_/g, ' ')}</span> : <span className="text-muted">—</span>}</td>
                      <td className="text-muted small">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
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
