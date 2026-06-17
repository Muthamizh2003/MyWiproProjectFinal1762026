import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, ClipboardList, Truck, Users, DollarSign, Package, Activity, Pizza, Calendar, RefreshCw, MapPin, Bike } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { formatCurrency } from '../../utils/formatters'
import { StatsSkeleton } from '../../components/common/LoadingSkeleton'
import { OrderHeatmap } from '../../components/admin/OrderHeatmap'

export const Dashboard = () => {
  const [revenue, setRevenue] = useState(null)
  const [orders, setOrders] = useState(null)
  const [delivery, setDelivery] = useState(null)
  const [dailyOrders, setDailyOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  const fetchAll = async () => {
    const [rev, ord, del, daily] = await Promise.all([
      adminService.getRevenue().catch(() => null),
      adminService.getOrderAnalytics().catch(() => null),
      adminService.getDeliveryAnalytics().catch(() => null),
      adminService.getDailyOrders().catch(() => [])
    ])
    if (rev) setRevenue(rev)
    if (ord) setOrders(ord)
    if (del) setDelivery(del)
    if (daily) setDailyOrders(daily)
  }

  useEffect(() => {
    setLoading(true)
    fetchAll().finally(() => setLoading(false))
    intervalRef.current = setInterval(fetchAll, 30000)
    return () => clearInterval(intervalRef.current)
  }, [])

  if (loading) return <StatsSkeleton />

  const totalDailyOrders = dailyOrders.reduce((s, d) => s + (d.count || 0), 0)
  const avgDaily = dailyOrders.length > 0 ? Math.round(totalDailyOrders / dailyOrders.length) : 0
  const maxDay = dailyOrders.reduce((best, d) => (d.count > (best?.count || 0) ? d : best), dailyOrders[0])

  const statusMap = {}
  if (delivery?.deliveryStats) {
    delivery.deliveryStats.forEach(([status, count]) => { statusMap[status] = count })
  }
  const inTransit = statusMap['OUT_FOR_DELIVERY'] || 0
  const delivered = statusMap['DELIVERED'] || 0
  const pending = statusMap['PENDING'] || 0
  const totalDeliveries = inTransit + delivered + pending

  const stats = [
    { label: 'Total Revenue', value: revenue ? formatCurrency(revenue.totalRevenue || 0) : 'N/A', icon: DollarSign, color: 'success' },
    { label: 'Daily Revenue', value: revenue ? formatCurrency(revenue.dailyRevenue || 0) : 'N/A', icon: TrendingUp, color: 'primary' },
    { label: 'Total Orders', value: orders?.totalOrders ?? 'N/A', icon: ClipboardList, color: 'info' },
    { label: 'In Transit', value: inTransit, icon: Bike, color: 'warning' },
    { label: 'Delivered', value: delivered, icon: Truck, color: 'success' },
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold h2 d-flex align-items-center gap-2"><LayoutDashboard size={28} /> Dashboard</h1>
        <button onClick={fetchAll} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <div className="row g-3">
        {stats.map(s => (
          <div key={s.label} className="col-md-2 col-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className={`rounded bg-${s.color} bg-opacity-10 d-flex align-items-center justify-content-center`} style={{ width: 36, height: 36 }}>
                    <s.icon size={18} className={`text-${s.color}`} />
                  </div>
                  <small className="text-muted">{s.label}</small>
                </div>
                <p className="fs-4 fw-bold mb-0">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LeetCode-style Calendar Heatmap */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><Calendar size={20} /> Daily Order Activity</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="p-3 rounded bg-pizza-light text-center">
                <small className="text-muted d-block">Total Orders (365d)</small>
                <span className="fs-4 fw-bold text-pizza">{totalDailyOrders}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded bg-pizza-light text-center">
                <small className="text-muted d-block">Avg Orders / Day</small>
                <span className="fs-4 fw-bold text-pizza">{avgDaily}</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded bg-pizza-light text-center">
                <small className="text-muted d-block">Best Day</small>
                <span className="fs-4 fw-bold text-pizza">{maxDay ? `${maxDay.date} (${maxDay.count})` : '—'}</span>
              </div>
            </div>
          </div>
          <OrderHeatmap data={dailyOrders} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><Activity size={20} /> Order Status</h5>
              {orders?.statusCounts ? (
                <div className="d-flex flex-column gap-2">
                  {orders.statusCounts.map(([status, count], i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                      <span className="small fw-medium">{status}</span>
                      <span className="badge bg-secondary">{count}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted small">No order data</p>}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <div className="d-flex flex-column gap-2">
                {[
                  { to: '/admin/revenue', icon: TrendingUp, label: 'Revenue Analytics' },
                  { to: '/admin/orders', icon: ClipboardList, label: 'Order Management' },
                  { to: '/admin/menu', icon: Pizza, label: 'Menu Management' },
                  { to: '/admin/customers', icon: Users, label: 'Customer Analytics' }
                ].map(l => (
                  <Link key={l.to} to={l.to} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <l.icon size={18} /> {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
