import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, X } from 'lucide-react'
import { addressSchema } from '../../utils/validators'
import { addressService } from '../../services/addressService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const AddressForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema)
  })

  const onSubmit = async (data) => {
    if (!user) return
    setSubmitting(true)
    try {
      const address = await addressService.addAddress(user.id, data)
      toast.success('Address added successfully')
      onSuccess(address)
    } catch {
      toast.error('Failed to add address')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 mb-3 p-3 bg-light rounded">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="fw-medium small d-flex align-items-center gap-1 mb-0">
          <MapPin size={16} /> New Address
        </h5>
        <button type="button" onClick={onCancel} className="btn btn-sm p-0 text-muted border-0">
          <X size={18} />
        </button>
      </div>
      <input type="text" {...register('street')} placeholder="Street address" className="form-control form-control-sm" />
      {errors.street && <p className="text-danger small mb-0">{errors.street.message}</p>}
      <div className="row g-2">
        <div className="col-6">
          <input type="text" {...register('city')} placeholder="City" className="form-control form-control-sm" />
          {errors.city && <p className="text-danger small mb-0">{errors.city.message}</p>}
        </div>
        <div className="col-6">
          <input type="text" {...register('state')} placeholder="State" className="form-control form-control-sm" />
          {errors.state && <p className="text-danger small mb-0">{errors.state.message}</p>}
        </div>
      </div>
      <div className="row g-2">
        <div className="col-6">
          <input type="text" {...register('pincode')} placeholder="Pincode" className="form-control form-control-sm" />
          {errors.pincode && <p className="text-danger small mb-0">{errors.pincode.message}</p>}
        </div>
        <div className="col-6">
          <input type="text" {...register('landmark')} placeholder="Landmark" className="form-control form-control-sm" />
          {errors.landmark && <p className="text-danger small mb-0">{errors.landmark.message}</p>}
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn btn-pizza w-100 small">
        {submitting ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  )
}
