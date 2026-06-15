import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bike, Navigation } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { deliveryService } from '../../services/deliveryService'

const SHOP_LOCATION = { lat: 13.0827, lng: 80.2707 }

export const RouteView = () => {
  const [deliveries, setDeliveries] = useState([])
  const [activeDelivery, setActiveDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  const load = async () => {
    try {
      const data = await deliveryService.getAgentOrders()
      const arr = Array.isArray(data) ? data : []
      setDeliveries(arr)
      const active = arr.find(d => d.status !== 'DELIVERED')
      setActiveDelivery(active || null)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { load(); const id = setInterval(load, 15000); return () => clearInterval(id) }, [])

  useEffect(() => {
    if (!activeDelivery || mapRef.current) return
    const map = L.map('route-map', { zoomControl: true }).setView([activeDelivery.latitude, activeDelivery.longitude], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [activeDelivery])

  useEffect(() => {
    if (!mapRef.current) return
    markersRef.current.forEach(m => mapRef.current.removeLayer(m))
    markersRef.current = []

    const shopIcon = L.divIcon({ html: '<div style="background:#dc3545;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid #fff">S</div>', className: '', iconSize: [28, 28], iconAnchor: [14, 14] })
    L.marker([SHOP_LOCATION.lat, SHOP_LOCATION.lng], { icon: shopIcon }).addTo(mapRef.current).bindPopup('<b>SmartPizza Shop</b>')

    deliveries.forEach(d => {
      const isActive = d.id === activeDelivery?.id
      const color = d.status === 'DELIVERED' ? '#198754' : isActive ? '#ffc107' : '#0d6efd'
      const icon = L.divIcon({
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid #fff">${d.orderId}</div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 14]
      })
      const marker = L.marker([d.latitude, d.longitude], { icon })
        .addTo(mapRef.current)
        .bindPopup(`<b>Order #${d.orderId}</b><br/>Status: ${d.status}<br/>Agent: ${d.agentName}`)
      markersRef.current.push(marker)

      if (d.status !== 'DELIVERED' && (activeDelivery?.id === d.id || !activeDelivery)) {
        mapRef.current.setView([d.latitude, d.longitude], 12)
      }
    })
  }, [deliveries, activeDelivery])

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-pizza" /></div>

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Navigation size={28} /> Route View</h1>
        <button onClick={load} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <MapPin size={14} /> Refresh
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <MapPin size={64} className="text-muted mx-auto d-block mb-3" />
            <h4 className="fw-bold">No Active Routes</h4>
            <p className="text-muted mb-4">No orders assigned yet. Assigned deliveries will appear here.</p>
            <Link to="/delivery" className="btn btn-pizza">Back to Dashboard</Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><Bike size={20} /> My Deliveries</h5>
                <div className="d-flex flex-column gap-2">
                  {deliveries.map(d => (
                    <div key={d.orderId} className={`p-2 rounded border ${d.id === activeDelivery?.id ? 'border-warning bg-warning bg-opacity-10' : ''}`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold small">Order #{d.orderId}</span>
                        <span className={`badge ${d.status === 'DELIVERED' ? 'bg-success' : 'bg-warning'}`}>{d.status}</span>
                      </div>
                      <small className="text-muted d-block mt-1">{d.agentName}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-0" style={{ height: 500 }}>
                <div id="route-map" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
