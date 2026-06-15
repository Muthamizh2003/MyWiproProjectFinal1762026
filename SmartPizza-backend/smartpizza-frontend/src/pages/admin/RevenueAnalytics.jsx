import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { formatCurrency } from '../../utils/formatters'
import { StatsSkeleton } from '../../components/common/LoadingSkeleton'

export const RevenueAnalytics = () => {
  const [revenue, setRevenue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getRevenue().then(setRevenue).finally(() => setLoading(false))
  }, [])

  if (loading) return <StatsSkeleton />

  const data = [
    { name: 'Total', amount: revenue?.totalRevenue || 0 },
    { name: 'Daily', amount: revenue?.dailyRevenue || 0 }
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><TrendingUp size={28} /> Revenue Analytics</h1>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Total Revenue</small>
              <p className="fs-2 fw-bold text-success">{formatCurrency(revenue?.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Daily Revenue</small>
              <p className="fs-2 fw-bold text-primary">{formatCurrency(revenue?.dailyRevenue || 0)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Revenue Overview</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
