import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { userService } from '../../services/userService'
import { useToast } from '../../context/ToastContext'

export const UserProfile = () => {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: ''
  })

  useEffect(() => {
    if (user?.id) {
      userService.getById(user.id).then(data => {
        setForm({ name: data.name || '', email: data.email || '', mobile: data.mobile || '' })
      }).catch(() => {})
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const updated = await userService.update(user.id, form)
      updateUser({ name: updated.name, email: updated.email })
      toast.success('Profile updated')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><User size={28} /> My Profile</h1>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body py-4">
              <div className="rounded-circle bg-pizza-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 100, height: 100 }}>
                <User size={48} className="text-pizza" />
              </div>
              <h5 className="fw-bold mb-1">{user?.name || 'User'}</h5>
              <p className="text-muted small mb-0">{user?.email}</p>
              <div className="mt-3 d-flex justify-content-center gap-1">
                {(user?.roles || []).map(role => (
                  <span key={role} className="badge bg-pizza-light text-pizza">
                    <Shield size={12} className="me-1" />{role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0">Profile Details</h5>
                {!editing && <button onClick={() => setEditing(true)} className="btn btn-outline-pizza btn-sm">Edit</button>}
              </div>
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small text-muted">Name</label>
                  <div className="input-group">
                    <span className="input-group-text"><User size={16} /></span>
                    <input type="text" className="form-control" value={form.name} disabled={!editing}
                      onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label small text-muted">Email</label>
                  <div className="input-group">
                    <span className="input-group-text"><Mail size={16} /></span>
                    <input type="email" className="form-control" value={form.email} disabled={!editing}
                      onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label small text-muted">Mobile</label>
                  <div className="input-group">
                    <span className="input-group-text"><Phone size={16} /></span>
                    <input type="text" className="form-control" value={form.mobile} disabled={!editing}
                      onChange={e => setForm({...form, mobile: e.target.value})} />
                  </div>
                </div>
                {editing && (
                  <div className="d-flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="btn btn-pizza d-flex align-items-center gap-1">
                      <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn btn-outline-secondary">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
