import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, ShoppingCart } from 'lucide-react'

export const PaymentSuccess = () => {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="text-center" style={{ maxWidth: 420 }}>
        <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: 100, height: 100 }}>
          <CheckCircle size={56} className="text-success" />
        </div>
        <h2 className="fw-bold mb-2">Payment Successful!</h2>
        <p className="text-muted mb-3">Your order has been placed successfully.</p>
        {orderId && (
          <div className="bg-light rounded p-3 mb-4">
            <small className="text-muted">Order ID</small>
            <p className="fw-bold fs-5 mb-0">#{orderId}</p>
          </div>
        )}
        <div className="d-flex flex-column gap-2">
          <Link to="/orders" className="btn btn-pizza d-flex align-items-center justify-content-center gap-2">
            <Package size={18} /> Track Order
          </Link>
          <Link to="/menu" className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">
            <ShoppingCart size={18} /> Order More
          </Link>
        </div>
      </div>
    </div>
  )
}
