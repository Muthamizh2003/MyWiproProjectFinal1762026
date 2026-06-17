import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Bike, CheckCircle, MapPin } from 'lucide-react'
import { deliveryService } from '../../services/deliveryService'
import { useToast } from '../../context/ToastContext'

export const AssignedOrders = () => {
  const toast = useToast()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    deliveryService.getAgentOrders().then(data => {
      setDeliveries(Array.isArray(data) ? data : [])
    }).catch(() => toast.error('Failed to load orders'))
    .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelivered = async (deliveryId) => {
    try {
      await deliveryService.updateStatus(deliveryId, 'DELIVERED')
      toast.success('Order marked as delivered')
      load()
    } catch { toast.error('Failed to update status') }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold h2 d-flex align-items-center gap-2"><ClipboardList size={28} /> Assigned Orders</h1>
        <button onClick={load} className="btn btn-outline-secondary btn-sm">Refresh</button>
      </div>
      {loading ? (
        <div className="text-center py-5 text-muted">Loading...</div>
      ) : deliveries.length === 0 ? (
        <div className="card shadow-sm"><div className="card-body text-center py-5">
          <Bike size={64} className="text-muted mx-auto d-block mb-3" />
          <p className="text-muted mb-0">No orders assigned yet.</p>
          <Link to="/delivery" className="btn btn-pizza mt-3">Back to Dashboard</Link>
        </div></div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {deliveries.map(d => (
            <div key={d.orderId} className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">Order #{d.orderId}</span>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <MapPin size={14} className="text-muted" />
                    <small className="text-muted">{d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${d.status === 'DELIVERED' ? 'bg-success' : 'bg-warning'}`}>{d.status}</span>
                  {d.status !== 'DELIVERED' && (
                    <button onClick={() => handleDelivered(d.id || d.orderId)} className="btn btn-sm btn-outline-success d-flex align-items-center gap-1">
                      <CheckCircle size={16} /> Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
