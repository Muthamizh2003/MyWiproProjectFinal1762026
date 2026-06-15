import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pizza, UserPlus } from 'lucide-react'
import { registerSchema } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const Register = () => {
  const { register: registerUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password
      })
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data || 'Registration failed'
      toast.error(typeof msg === 'string' ? msg : 'Please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-pizza-light py-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: 480, width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <Pizza size={48} className="text-pizza mb-2" />
            <h3 className="fw-bold">Create Account</h3>
            <p className="text-muted small">Join SmartPizza today</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-medium">Full Name</label>
              <input type="text" {...register('name')} className="form-control" placeholder="John Doe" />
              {errors.name && <p className="text-danger small mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label small fw-medium">Email</label>
              <input type="email" {...register('email')} className="form-control" placeholder="you@example.com" />
              {errors.email && <p className="text-danger small mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label small fw-medium">Mobile</label>
              <input type="text" {...register('mobile')} className="form-control" placeholder="9876543210" />
              {errors.mobile && <p className="text-danger small mt-1">{errors.mobile.message}</p>}
            </div>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small fw-medium">Password</label>
                <input type="password" {...register('password')} className="form-control" placeholder="••••••" />
                {errors.password && <p className="text-danger small mt-1">{errors.password.message}</p>}
              </div>
              <div className="col-6">
                <label className="form-label small fw-medium">Confirm</label>
                <input type="password" {...register('confirmPassword')} className="form-control" placeholder="••••••" />
                {errors.confirmPassword && <p className="text-danger small mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-pizza w-100 py-2 d-flex align-items-center justify-content-center gap-2">
              <UserPlus size={18} /> {submitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <hr className="my-3" />
          <p className="text-center small mb-0">
            Already have an account? <Link to="/login" className="text-pizza fw-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
