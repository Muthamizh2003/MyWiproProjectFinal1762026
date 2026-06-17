import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, ArrowLeft } from 'lucide-react'
import { deliveryService } from '../../services/deliveryService'
import { useToast } from '../../context/ToastContext'

const STATUSES = ['OUT_FOR_DELIVERY', 'DELIVERED']

export const StatusUpdate = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [deliveryId, setDeliveryId] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    if (!deliveryId || !newStatus) { toast.error('Please fill all fields'); return }
    setUpdating(true)
    try {
      await deliveryService.updateStatus(Number(deliveryId), newStatus)
      toast.success('Status updated!')
      setDeliveryId(''); setNewStatus('')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <button onClick={() => navigate(-1)} className="btn btn-light d-inline-flex align-items-center gap-2 align-self-start">
        <ArrowLeft size={18} /> Back
      </button>
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Bike size={28} /> Update Status</h1>
      <div className="card shadow-sm" style={{ maxWidth: 480 }}>
        <div className="card-body d-flex flex-column gap-3">
          <div>
            <label className="form-label small">Delivery ID</label>
            <input type="number" className="form-control" value={deliveryId} onChange={e => setDeliveryId(e.target.value)} placeholder="Enter delivery ID" />
          </div>
          <div>
            <label className="form-label small">New Status</label>
            <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="">Select status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <button onClick={handleUpdate} disabled={updating || !deliveryId || !newStatus} className="btn btn-pizza">
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}
