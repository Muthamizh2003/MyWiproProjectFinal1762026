import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, MapPin, Eye, CreditCard, FileText } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { paymentService } from '../../services/paymentService'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { STATUS_COLORS } from '../../utils/constants'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { TableSkeleton } from '../../components/common/LoadingSkeleton'

export const OrderHistory = () => {
  const { user } = useAuth()
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingOrderId, setPayingOrderId] = useState(null)
  const [paying, setPaying] = useState(false)
  const [invoiceOrderId, setInvoiceOrderId] = useState(null)
  const [invoiceText, setInvoiceText] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    loadOrders()
  }, [user])

  const loadOrders = () => {
    setLoading(true)
    orderService.getUserOrders(user.id)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handlePay = async (orderId) => {
    setPaying(true)
    try {
      const payment = await paymentService.pay({ orderId, paymentMethod: 'CARD' })
      if (payment) {
        toast.success('Payment successful!')
        setPayingOrderId(null)
        loadOrders()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const handleInvoice = async (orderId) => {
    setInvoiceOrderId(orderId)
    setInvoiceLoading(true)
    try {
      const text = await paymentService.invoice(orderId)
      setInvoiceText(text)
    } catch {
      toast.error('Failed to load invoice')
      setInvoiceOrderId(null)
    } finally {
      setInvoiceLoading(false)
    }
  }

  const total = (order) => order.totalAmount + (order.taxAmount || 0)

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Package size={28} /> My Orders</h1>

      {loading ? <TableSkeleton /> : orders.length === 0 ? (
        <div className="text-center py-5">
          <Package size={64} className="text-muted mx-auto d-block mb-3" />
          <h4 className="fw-bold">No orders yet</h4>
          <p className="text-muted">Order your first pizza!</p>
          <Link to="/menu" className="btn btn-pizza">Browse Menu</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map(order => (
            <div key={order.id} className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div>
                    <h5 className="fw-bold mb-1">Order #{order.id}</h5>
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <Clock size={14} /> {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'bg-secondary'}`}>
                    {order.status?.replace(/_/g, ' ') || 'N/A'}
                  </span>
                </div>
                {order.deliveryAddress && (
                  <p className="small text-muted d-flex align-items-center gap-1 mb-2">
                    <MapPin size={14} /> {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </p>
                )}
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {(order.items || []).map((item, i) => (
                    <span key={i} className="badge bg-light text-dark">{item.productName} x{item.quantity}</span>
                  ))}
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold">{formatCurrency(total(order))}</span>
                  <div className="d-flex gap-2">
                    {order.status === 'PENDING_PAYMENT' && (
                      <button onClick={() => setPayingOrderId(order.id)}
                        className="btn btn-sm btn-pizza d-flex align-items-center gap-1">
                        <CreditCard size={14} /> Pay Now
                      </button>
                    )}
                    {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                      <Link to={`/tracking/${order.id}`} className="btn btn-sm btn-outline-pizza d-flex align-items-center gap-1">
                        <Eye size={14} /> Track
                      </Link>
                    )}
                    {!['PENDING_PAYMENT', 'CANCELLED'].includes(order.status) && (
                      <button onClick={() => handleInvoice(order.id)}
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                        <FileText size={14} /> Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pay Now Modal */}
      {payingOrderId && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2"><CreditCard size={20} /> Complete Payment</h5>
                <button onClick={() => setPayingOrderId(null)} className="btn-close" />
              </div>
              <div className="modal-body text-center py-4">
                <CreditCard size={64} className="text-pizza mb-3" />
                <h5 className="fw-bold mb-1">Pay for Order #{payingOrderId}</h5>
                <p className="text-muted mb-0">
                  Total: {formatCurrency(total(orders.find(o => o.id === payingOrderId)))}
                </p>
                <p className="small text-muted">Payment will be processed via simulated gateway</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button onClick={() => setPayingOrderId(null)} className="btn btn-outline-secondary">Cancel</button>
                <button onClick={() => handlePay(payingOrderId)} disabled={paying}
                  className="btn btn-pizza d-flex align-items-center gap-2">
                  <CreditCard size={18} /> {paying ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrderId && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2"><FileText size={20} /> Invoice - Order #{invoiceOrderId}</h5>
                <button onClick={() => { setInvoiceOrderId(null); setInvoiceText('') }} className="btn-close" />
              </div>
              <div className="modal-body">
                {invoiceLoading ? (
                  <div className="text-center py-4 text-muted">Loading invoice...</div>
                ) : (
                  <pre className="mb-0" style={{ fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{invoiceText}</pre>
                )}
              </div>
              <div className="modal-footer justify-content-center">
                <button onClick={() => { setInvoiceOrderId(null); setInvoiceText('') }}
                  className="btn btn-outline-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
