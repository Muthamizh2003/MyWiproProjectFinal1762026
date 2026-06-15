import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pizza, Mail, ArrowLeft } from 'lucide-react'
import { forgotPasswordSchema } from '../../utils/validators'
import { useToast } from '../../context/ToastContext'

export const ForgotPassword = () => {
  const toast = useToast()
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data) => {
    // Backend does not have password reset yet - show info message
    toast.info('Password reset is not available yet. Please contact support.')
    setSent(true)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-pizza-light py-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-5 text-center">
          <Pizza size={48} className="text-pizza mb-3" />
          <h3 className="fw-bold mb-2">Forgot Password?</h3>
          {sent ? (
            <div>
              <div className="text-success mb-3">✓</div>
              <p className="text-muted small mb-3">Password reset is not yet available via API. Contact support for assistance.</p>
              <Link to="/login" className="btn btn-pizza d-inline-flex align-items-center gap-2">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 text-start">
              <p className="text-muted small">Enter your email address and we'll help you reset your password.</p>
              <div>
                <label className="form-label small fw-medium">Email</label>
                <input type="email" {...register('email')} className="form-control" placeholder="you@example.com" />
                {errors.email && <p className="text-danger small mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" className="btn btn-pizza w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                <Mail size={18} /> Send Reset Link
              </button>
              <Link to="/login" className="text-center small text-pizza d-flex align-items-center justify-content-center gap-1">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
