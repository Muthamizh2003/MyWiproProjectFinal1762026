import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Pizza, Package, History, Home, Edit3, Save, X, Mail, Phone, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { useToast } from '../context/ToastContext'
import { ThemeToggle } from '../components/common/ThemeToggle'

export const CustomerLayout = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '' })

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

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <Pizza size={24} className="text-pizza" /> SmartPizza
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link to="/" className="nav-link"><Home size={16} className="me-1" />Home</Link></li>
              <li className="nav-item"><Link to="/menu" className="nav-link"><Pizza size={16} className="me-1" />Menu</Link></li>
              <li className="nav-item"><Link to="/suggestions" className="nav-link"><Sparkles size={16} className="me-1" />Suggestions</Link></li>
              <li className="nav-item"><Link to="/orders" className="nav-link"><History size={16} className="me-1" />Orders</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-2">
              <ThemeToggle />
              <Link to="/cart" className="btn btn-outline-pizza btn-sm position-relative">
                <ShoppingCart size={18} />
              </Link>
              <div className="dropdown" style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1">
                  <User size={16} /> {user?.name || user?.username || 'Account'}
                </button>
                {showDropdown && (
                  <ul className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}>
                    <li><Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}><User size={16} className="me-2" />Profile</Link></li>
                    <li><button onClick={() => { openEditProfile(); setShowDropdown(false) }} className="dropdown-item"><Edit3 size={16} className="me-2" />Edit Profile</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button onClick={() => { handleLogout(); setShowDropdown(false) }} className="dropdown-item text-danger"><LogOut size={16} className="me-2" />Logout</button></li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="btn btn-pizza d-flex align-items-center gap-1">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="flex-grow-1" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="bg-light py-3 border-top mt-auto">
        <div className="container text-center text-muted small">
          &copy; {new Date().getFullYear()} SmartPizza AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
