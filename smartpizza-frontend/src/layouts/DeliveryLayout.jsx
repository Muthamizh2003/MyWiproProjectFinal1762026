import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Bike, ClipboardList, MapPin, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/common/ThemeToggle'

export const DeliveryLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = [
    { to: '/delivery', icon: Bike, label: 'Dashboard' },
    { to: '/delivery/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/delivery/route', icon: MapPin, label: 'Route' }
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom sticky-top">
        <div className="container">
          <Link to="/delivery" className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <Bike size={24} className="text-pizza" /> Delivery
          </Link>
          <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-2">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}
                className={`btn btn-sm ${location.pathname === item.to ? 'btn-pizza' : 'btn-outline-secondary'} d-flex align-items-center gap-1`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <Link to="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
              <ArrowLeft size={16} /> Site
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
