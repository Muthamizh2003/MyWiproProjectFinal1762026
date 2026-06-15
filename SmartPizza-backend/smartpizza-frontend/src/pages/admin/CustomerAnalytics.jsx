import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, TrendingUp } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { formatDate } from '../../utils/formatters'
import { StatsSkeleton } from '../../components/common/LoadingSkeleton'

export const CustomerAnalytics = () => {
  const [customers, setCustomers] = useState(null)
  const [trends, setTrends] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminService.getCustomerAnalytics(),
      adminService.getCustomerTrends(),
      adminService.getAllUsers()
    ]).then(([cust, trendData, allUsers]) => {
      setCustomers(cust); setTrends(trendData || []); setUsers(allUsers || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <StatsSkeleton />

  const trendChartData = trends.map(t => ({ date: formatDate(t.date), activeUsers: t.activeUsers || 0 }))
  const topCustomerData = (customers?.topCustomers || []).map(([userId, count], i) => ({
    rank: `#${i + 1}`, userId: `User ${userId}`, orders: count
  }))

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Users size={28} /> Customer Analytics</h1>
      <div className="row g-3">
        <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body"><small className="text-muted">Total Users</small><p className="fs-3 fw-bold mb-0">{users.length}</p></div></div></div>
        <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body"><small className="text-muted">Active Today</small><p className="fs-3 fw-bold mb-0">{trends.length > 0 ? trends[trends.length - 1].activeUsers || 0 : 0}</p></div></div></div>
        <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body"><small className="text-muted">Top Customers</small><p className="fs-3 fw-bold mb-0">{customers?.topCustomers?.length || 0}</p></div></div></div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3"><TrendingUp size={20} className="me-1" /> Active Users Over Time</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="activeUsers" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3"><TrendingUp size={20} className="me-1" /> Top Customers</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="userId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">All Users</h5>
          <div className="table-responsive">
            <table className="table table-hover small mb-0">
              <thead className="table-light">
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Roles</th><th>Status</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.mobile}</td>
                    <td>{(u.roles || []).map(r => <span key={r} className="badge bg-pizza-light text-pizza me-1">{r}</span>)}</td>
                    <td><span className={`badge ${u.blocked ? 'bg-danger' : 'bg-success'}`}>{u.blocked ? 'Blocked' : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
