import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Bike, Clock, MapPin } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { deliveryService } from '../../services/deliveryService'

export const LiveTracking = () => {
  const { orderId } = useParams()
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [delivery, setDelivery] = useState(null)
  const [eta, setEta] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const d = await deliveryService.track(orderId)
        setDelivery(d)
        try { const e = await deliveryService.getEta(orderId); setEta(e) } catch {}
      } catch {
        setError('Tracking not available yet. Order may not be out for delivery.')
      }
    }
    fetchTracking()
    const interval = setInterval(fetchTracking, 15000)
    return () => clearInterval(interval)
  }, [orderId])

  useEffect(() => {
    if (!delivery || mapRef.current) return
    const map = L.map('tracking-map', { zoomControl: true }).setView([delivery.latitude, delivery.longitude], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [delivery])

  useEffect(() => {
    if (!delivery || !mapRef.current) return
    if (markerRef.current) markerRef.current.setLatLng([delivery.latitude, delivery.longitude])
    else markerRef.current = L.marker([delivery.latitude, delivery.longitude]).addTo(mapRef.current)
  }, [delivery?.latitude, delivery?.longitude])

  if (error) return (
    <div className="text-center py-5">
      <Bike size={64} className="text-muted mx-auto d-block mb-3" />
      <h4 className="fw-bold">Tracking Unavailable</h4>
      <p className="text-muted">{error}</p>
    </div>
  )

  if (!delivery) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-pizza" /></div>

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Bike size={28} /> Live Tracking</h1>
      <h5 className="text-muted">Order #{orderId}</h5>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <MapPin size={32} className="text-pizza mb-2" />
              <small className="text-muted">Status</small>
              <p className="fw-bold mb-0">{delivery.status || 'In Transit'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <Bike size={32} className="text-pizza mb-2" />
              <small className="text-muted">Delivery Agent</small>
              <p className="fw-bold mb-0">{delivery.agentName || 'Assigned'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <Clock size={32} className="text-pizza mb-2" />
              <small className="text-muted">Estimated Arrival</small>
              <p className="fw-bold mb-0">{eta ? `${Math.round(eta)} min` : 'Calculating...'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0" style={{ height: 400 }}>
          <div id="tracking-map" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body text-center py-3">
          <h5 className="fw-bold mb-1">Your order is on the way!</h5>
          <p className="text-muted small mb-0">Auto-refreshing every 15 seconds</p>
        </div>
      </div>
    </div>
  )
}
