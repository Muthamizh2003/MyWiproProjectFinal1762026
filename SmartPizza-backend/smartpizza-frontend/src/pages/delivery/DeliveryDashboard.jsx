import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bike, ClipboardList, MapPin } from 'lucide-react'
import { deliveryService } from '../../services/deliveryService'
import { formatCurrency } from '../../utils/formatters'

export const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    deliveryService.getAgentOrders().then(data => {
      setDeliveries(Array.isArray(data) ? data : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const inTransit = deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length
  const delivered = deliveries.filter(d => d.status === 'DELIVERED').length
  const today = new Date().toDateString()
  const deliveredToday = deliveries.filter(d => d.status === 'DELIVERED').length

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center gap-3">
        <Bike size={32} className="text-pizza" />
        <div>
          <h1 className="fw-bold h2">Delivery Dashboard</h1>
          <p className="text-muted small mb-0">{deliveries.length} total deliveries assigned</p>
        </div>
      </div>
      <div className="row g-3">
        {[
          { label: 'Assigned', value: deliveries.length },
          { label: 'In Transit', value: inTransit },
          { label: 'Delivered', value: delivered },
          { label: 'Active Now', value: inTransit }
        ].map((item, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card shadow-sm h-100"><div className="card-body">
              <small className="text-muted">{item.label}</small>
              <p className="fs-3 fw-bold mb-0">{loading ? '--' : item.value}</p>
            </div></div>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2">
        <Link to="/delivery/orders" className="btn btn-pizza d-flex align-items-center gap-2"><ClipboardList size={18} /> All Orders</Link>
        <Link to="/delivery/route" className="btn btn-outline-secondary d-flex align-items-center gap-2"><MapPin size={18} /> Route View</Link>
      </div>
      {deliveries.filter(d => d.status !== 'DELIVERED').length > 0 && (
        <div className="d-flex flex-column gap-3">
          <h5 className="fw-bold">Active Deliveries</h5>
          {deliveries.filter(d => d.status !== 'DELIVERED').map(d => (
            <div key={d.orderId} className="card shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">Order #{d.orderId}</span>
                  <small className="text-muted d-block">{d.agentName} · {d.status}</small>
                </div>
                <span className="badge bg-pizza">{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
