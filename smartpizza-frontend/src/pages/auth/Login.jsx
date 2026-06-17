import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pizza, LogIn } from 'lucide-react'
import { loginSchema } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const Login = () => {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await login(data)
      toast.success('Login successful!')
      setTimeout(() => navigate('/'), 500)
    } catch (err) {
      const msg = err.response?.data || 'Invalid credentials'
      toast.error(typeof msg === 'string' ? msg : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-pizza-light py-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <Pizza size={48} className="text-pizza mb-2" />
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted small">Sign in to your SmartPizza account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-medium">Email / Username</label>
              <input type="text" {...register('username')} className="form-control" placeholder="you@example.com" />
              {errors.username && <p className="text-danger small mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="form-label small fw-medium">Password</label>
              <input type="password" {...register('password')} className="form-control" placeholder="••••••••" />
              {errors.password && <p className="text-danger small mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn btn-pizza w-100 py-2 d-flex align-items-center justify-content-center gap-2">
              <LogIn size={18} /> {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="text-center mt-3">
            <Link to="/forgot-password" className="small text-pizza">Forgot password?</Link>
          </div>
          <hr className="my-3" />
          <p className="text-center small mb-0">
            Don't have an account? <Link to="/register" className="text-pizza fw-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
