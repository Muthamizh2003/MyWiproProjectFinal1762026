import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Truck, Bike, Users } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { StatsSkeleton } from '../../components/common/LoadingSkeleton'

const COLORS = ['#22c55e', '#f97316', '#3b82f6', '#ef4444', '#a855f7']

export const DeliveryPerformance = () => {
  const [delivery, setDelivery] = useState(null)
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminService.getDeliveryAnalytics().catch(() => null),
      adminService.getDeliveryAgents()
    ]).then(([del, ag]) => { setDelivery(del); setAgents(ag || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <StatsSkeleton />

  const pieData = (delivery?.deliveryStats || []).map(([name, value]) => ({
    name: String(name).replace(/_/g, ' '), value
  }))
  const totalDeliveries = pieData.reduce((s, d) => s + d.value, 0)
  const availableAgents = agents.filter(a => a.available).length

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Truck size={28} /> Delivery Performance</h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="text-muted small mb-0">Note: Backend has a DeliveryPerformance service method but no controller endpoint. Average delivery time and detailed performance stats are unavailable via API.</p>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <Truck size={20} className="text-success" />
                </div>
                <small className="text-muted">Total Deliveries</small>
              </div>
              <p className="fs-3 fw-bold mb-0">{totalDeliveries}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <Users size={20} className="text-primary" />
                </div>
                <small className="text-muted">Agents</small>
              </div>
              <p className="fs-3 fw-bold mb-0">{agents.length}</p>
              <small className="text-success">{availableAgents} available</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <Bike size={20} className="text-warning" />
                </div>
                <small className="text-muted">Available Rate</small>
              </div>
              <p className="fs-3 fw-bold mb-0">{agents.length > 0 ? `${Math.round((availableAgents / agents.length) * 100)}%` : '0%'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Status Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100} dataKey="value">
                    {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Delivery Agents</h5>
              {agents.length === 0 ? <p className="text-muted small">No agents registered</p> : (
                <div className="d-flex flex-column gap-2">
                  {agents.map(agent => (
                    <div key={agent.id} className="d-flex align-items-center justify-content-between p-2 rounded bg-light">
                      <div><p className="fw-medium mb-0 small">{agent.name}</p><small className="text-muted">{agent.phone}</small></div>
                      <span className={`badge ${agent.available ? 'bg-success' : 'bg-danger'}`}>{agent.available ? 'Available' : 'Busy'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
