import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, LogIn } from 'lucide-react'
import { cartService } from '../../services/cartService'
import { couponService } from '../../services/couponService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { TableSkeleton } from '../../components/common/LoadingSkeleton'

export const CartPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    cartService.get(user.id).then(data => {
      setItems(Array.isArray(data) ? data : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0)
  const tax = subtotal * 0.05
  const discount = coupon ? coupon.discountAmount || 0 : 0
  const total = Math.max(0, subtotal + tax - discount)

  const updateQty = async (productId, qty) => {
    if (qty < 1) return
    try {
      await cartService.update(user.id, productId, qty)
      setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
    } catch { toast.error('Failed to update') }
  }

  const removeItem = async (productId) => {
    try {
      await cartService.remove(user.id, productId)
      setItems(prev => prev.filter(i => i.productId !== productId))
      toast.success('Item removed')
    } catch { toast.error('Failed to remove') }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplying(true)
    try {
      const res = await couponService.apply(couponCode.trim(), subtotal)
      setCoupon(res)
      toast.success('Coupon applied!')
    } catch { toast.error('Invalid coupon code'); setCoupon(null) }
    finally { setApplying(false) }
  }

  if (!user) return (
    <div className="text-center py-5">
      <ShoppingCart size={64} className="text-muted mx-auto d-block mb-3" />
      <h4 className="fw-bold">Please login to view cart</h4>
      <button onClick={() => navigate('/login')} className="btn btn-pizza mt-3 d-inline-flex align-items-center gap-2">
        <LogIn size={18} /> Login
      </button>
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><ShoppingCart size={28} /> Your Cart</h1>

      {loading ? <TableSkeleton /> : items.length === 0 ? (
        <div className="text-center py-5">
          <ShoppingCart size={64} className="text-muted mx-auto d-block mb-3" />
          <h4 className="fw-bold">Your cart is empty</h4>
          <p className="text-muted">Add some pizzas from the menu!</p>
          <Link to="/menu" className="btn btn-pizza d-inline-flex align-items-center gap-2">
            <ArrowLeft size={18} /> Browse Menu
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {items.map(item => (
                <div key={item.productId} className="card shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className="rounded bg-pizza-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56 }}>
                      <ShoppingCart size={24} className="text-pizza" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.productName}</h6>
                      <small className="text-muted">{formatCurrency(item.price)} each</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(item.productId, item.quantity - 1)}><Minus size={14} /></button>
                      <span className="fw-medium" style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(item.productId, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                    <div className="text-end" style={{ minWidth: 80 }}>
                      <p className="fw-bold mb-0">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.productId)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column gap-3">
                <h5 className="fw-bold mb-0">Order Summary</h5>
                <hr className="my-0" />
                <div className="d-flex justify-content-between small"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="d-flex justify-content-between small"><span>Tax (5%)</span><span>{formatCurrency(tax)}</span></div>
                {coupon && <div className="d-flex justify-content-between small text-success"><span>Discount ({coupon.code})</span><span>-{formatCurrency(discount)}</span></div>}
                <hr className="my-0" />
                <div className="d-flex justify-content-between fw-bold"><span>Total</span><span className="text-pizza">{formatCurrency(total)}</span></div>
                <div className="input-group input-group-sm">
                  <input type="text" className="form-control" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                  <button className="btn btn-outline-pizza" onClick={applyCoupon} disabled={applying}>{applying ? '...' : 'Apply'}</button>
                </div>
                {coupon && <p className="text-success small mb-0">{coupon.message}</p>}
                <button className="btn btn-pizza w-100" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
