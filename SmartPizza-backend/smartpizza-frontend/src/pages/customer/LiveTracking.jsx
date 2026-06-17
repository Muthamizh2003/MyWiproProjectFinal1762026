import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Bike, Clock, MapPin } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { deliveryService } from '../../services/deliveryService'

const RIDER_ICON = L.divIcon({
  html: '<div style="background:#ff6b35;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">🏍️</div>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

const CUSTOMER_ICON = L.divIcon({
  html: '<div style="background:#e74c3c;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">📍</div>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

const SHOP_ICON = L.divIcon({
  html: '<div style="background:#2ecc71;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid #fff">🍕</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
})

export const LiveTracking = () => {
  const { orderId } = useParams()
  const mapRef = useRef(null)
  const riderMarkerRef = useRef(null)
  const customerMarkerRef = useRef(null)
  const routeLineRef = useRef(null)
  const [delivery, setDelivery] = useState(null)
  const [eta, setEta] = useState(null)
  const [error, setError] = useState(null)

  const fetchRoute = useCallback(async (fromLat, fromLng, toLat, toLng) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&overview=full`
      )
      const data = await res.json()
      if (data.code === 'Ok' && data.routes?.length) {
        return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
      }
    } catch {}
    return null
  }, [])

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

    const riderLat = delivery.latitude
    const riderLng = delivery.longitude
    const custLat = delivery.customerLatitude
    const custLng = delivery.customerLongitude

    const map = L.map('tracking-map', { zoomControl: true })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    const shopLat = 13.0827
    const shopLng = 80.2707

    L.marker([shopLat, shopLng], { icon: SHOP_ICON }).addTo(map).bindPopup('<b>SmartPizza Shop</b>')

    riderMarkerRef.current = L.marker([riderLat, riderLng], { icon: RIDER_ICON })
      .addTo(map)
      .bindPopup(`<b>${delivery.agentName}</b><br/>En route to you`)

    customerMarkerRef.current = L.marker([custLat, custLng], { icon: CUSTOMER_ICON })
      .addTo(map)
      .bindPopup('<b>Your Location</b>')

    const bounds = L.latLngBounds(
      [Math.min(riderLat, custLat, shopLat), Math.min(riderLng, custLng, shopLng)],
      [Math.max(riderLat, custLat, shopLat), Math.max(riderLng, custLng, shopLng)]
    )
    map.fitBounds(bounds, { padding: [50, 50] })

    mapRef.current = map

    fetchRoute(riderLat, riderLng, custLat, custLng).then(coords => {
      if (coords && mapRef.current) {
        routeLineRef.current = L.polyline(coords, { color: '#ff6b35', weight: 4, opacity: 0.7 })
          .addTo(mapRef.current)
      }
    })

    return () => { map.remove(); mapRef.current = null }
  }, [delivery, fetchRoute])

  useEffect(() => {
    if (!delivery || !mapRef.current || !riderMarkerRef.current) return

    const riderLat = delivery.latitude
    const riderLng = delivery.longitude
    const custLat = delivery.customerLatitude
    const custLng = delivery.customerLongitude

    riderMarkerRef.current.setLatLng([riderLat, riderLng])

    if (routeLineRef.current) mapRef.current.removeLayer(routeLineRef.current)
    fetchRoute(riderLat, riderLng, custLat, custLng).then(coords => {
      if (coords && mapRef.current) {
        routeLineRef.current = L.polyline(coords, { color: '#ff6b35', weight: 4, opacity: 0.7 })
          .addTo(mapRef.current)
      }
    })

    const bounds = L.latLngBounds(
      [Math.min(riderLat, custLat), Math.min(riderLng, custLng)],
      [Math.max(riderLat, custLat), Math.max(riderLng, custLng)]
    )
    mapRef.current.fitBounds(bounds, { padding: [50, 50] })
  }, [delivery?.latitude, delivery?.longitude, delivery?.customerLatitude, delivery?.customerLongitude, fetchRoute])

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
        <div className="card-body p-0" style={{ height: 450 }}>
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
