import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, ClipboardList, Pizza, Ticket, Users, Truck,
  LogOut, Menu, X, User, Edit3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { useToast } from '../context/ToastContext'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { Save, Mail, Phone } from 'lucide-react'

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/revenue', icon: TrendingUp, label: 'Revenue' },
  { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/admin/menu', icon: Pizza, label: 'Menu' },
  { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/delivery', icon: Truck, label: 'Delivery' }
]

export const AdminLayout = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '' })

  const handleLogout = () => { logout(); navigate('/login') }

  const openEditProfile = async () => {
    if (!user?.id) return
    try {
      const data = await userService.getById(user.id)
      setForm({ name: data.name || '', email: data.email || '', mobile: data.mobile || '' })
      setShowModal(true)
    } catch {
      toast.error('Failed to load profile')
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return
    setSaving(true)
    try {
      const updated = await userService.update(user.id, form)
      updateUser({ name: updated.name, email: updated.email })
      toast.success('Profile updated')
      setShowModal(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="d-flex min-vh-100">
      <aside className={`bg-dark text-white d-flex flex-column flex-shrink-0 p-3 ${sidebarOpen ? 'd-block' : 'd-none d-md-flex'}`} style={{ width: 250, minHeight: '100vh' }}>
        <Link to="/admin" className="text-white text-decoration-none mb-4 d-flex align-items-center gap-2">
          <LayoutDashboard size={24} /> <span className="fw-bold">Admin Panel</span>
        </Link>
        <nav className="d-flex flex-column gap-1 flex-grow-1">
          {sidebarLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${location.pathname === link.to ? 'bg-white bg-opacity-25 text-white' : 'text-white text-opacity-75 hover-bg-light'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </nav>
        <hr className="text-white text-opacity-25" />
        <Link to="/" className="text-white text-opacity-75 text-decoration-none small mb-2 d-flex align-items-center gap-1">
          ← Back to Site
        </Link>
        <div className="dropdown mb-2" style={{ position: 'relative' }}>
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 w-100">
            <User size={16} /> {user?.name || user?.username || 'Account'}
          </button>
          {showDropdown && (
            <ul className="dropdown-menu show w-100" style={{ position: 'absolute', bottom: '100%', zIndex: 1050 }}>
              <li><button onClick={() => { openEditProfile(); setShowDropdown(false) }} className="dropdown-item"><Edit3 size={16} className="me-2" />Edit Profile</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button onClick={() => { handleLogout(); setShowDropdown(false) }} className="dropdown-item text-danger"><LogOut size={16} className="me-2" />Logout</button></li>
            </ul>
          )}
        </div>
      </aside>

      <div className="d-flex flex-column flex-grow-1">
        <nav className="navbar navbar-light bg-white shadow-sm px-3 d-md-none">
          <button className="btn btn-outline-secondary" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="fw-bold">Admin Panel</span>
          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            <div className="dropdown" style={{ position: 'relative' }}>
              <button onClick={() => setShowDropdown(!showDropdown)}
                className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1">
                <User size={16} />
              </button>
              {showDropdown && (
                <ul className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}>
                  <li><button onClick={() => { openEditProfile(); setShowDropdown(false) }} className="dropdown-item"><Edit3 size={16} className="me-2" />Edit Profile</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={() => { handleLogout(); setShowDropdown(false) }} className="dropdown-item text-danger"><LogOut size={16} className="me-2" />Logout</button></li>
                </ul>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2"><User size={20} /> Edit Profile</h5>
                <button onClick={() => setShowModal(false)} className="btn-close" />
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <div>
                  <label className="form-label small">Name</label>
                  <div className="input-group">
                    <span className="input-group-text"><User size={16} /></span>
                    <input type="text" className="form-control" value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label small">Email</label>
                  <div className="input-group">
                    <span className="input-group-text"><Mail size={16} /></span>
                    <input type="email" className="form-control" value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label small">Mobile</label>
                  <div className="input-group">
                    <span className="input-group-text"><Phone size={16} /></span>
                    <input type="text" className="form-control" value={form.mobile}
                      onChange={e => setForm({...form, mobile: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowModal(false)} className="btn btn-outline-secondary d-flex align-items-center gap-1">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="btn btn-pizza d-flex align-items-center gap-1">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
