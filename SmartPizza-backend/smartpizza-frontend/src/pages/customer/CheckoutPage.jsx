import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Plus, Percent, X } from 'lucide-react'
import { cartService } from '../../services/cartService'
import { addressService } from '../../services/addressService'
import { couponService } from '../../services/couponService'
import { orderService } from '../../services/orderService'
import { paymentService } from '../../services/paymentService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { AddressForm } from '../../components/customer/AddressForm'

export const CheckoutPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [items, setItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    Promise.all([
      cartService.get(user.id),
      addressService.getUserAddresses(user.id)
    ]).then(([cartData, addrData]) => {
      setItems(Array.isArray(cartData) ? cartData : [])
      setAddresses(Array.isArray(addrData) ? addrData : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0)
  const tax = subtotal * 0.05
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const total = subtotal + tax - discount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const result = await couponService.apply(couponCode.trim(), subtotal + tax)
      setAppliedCoupon(result)
      toast.success(`Coupon applied: ${result.message}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return }
    if (items.length === 0) { toast.error('Cart is empty'); return }
    setPlacing(true)
    try {
      const order = await orderService.place(user.id, selectedAddress, appliedCoupon?.code || null)
      try { await cartService.clear(user.id) } catch {}
      navigate(`/payment-success?orderId=${order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-pizza" /></div>

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><CreditCard size={28} /> Checkout</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><MapPin size={20} /> Delivery Address</h5>
              {addresses.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`form-check p-3 rounded border ${selectedAddress === addr.id ? 'border-pizza bg-pizza-light' : ''}`}
                      onClick={() => setSelectedAddress(addr.id)} style={{ cursor: 'pointer' }}>
                      <input className="form-check-input" type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                      <label className="form-check-label w-100">
                        <p className="fw-medium mb-1 small">{addr.street}, {addr.city}</p>
                        <small className="text-muted">{addr.state} - {addr.pincode}</small>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No addresses saved. Add one below.</p>
              )}
              {!showAddressForm ? (
                <button onClick={() => setShowAddressForm(true)} className="btn btn-outline-pizza btn-sm mt-2 d-flex align-items-center gap-1">
                  <Plus size={16} /> Add New Address
                </button>
              ) : (
                <AddressForm onSuccess={(addr) => { setAddresses(prev => [...prev, addr]); setSelectedAddress(addr.id); setShowAddressForm(false) }}
                  onCancel={() => setShowAddressForm(false)} />
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column gap-3">
              <h5 className="fw-bold mb-0">Order Summary</h5>
              <div className="d-flex flex-column gap-2">
                {items.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between small">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-0" />
              <div className="d-flex justify-content-between small"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="d-flex justify-content-between small"><span>Tax (5%)</span><span>{formatCurrency(tax)}</span></div>

              <div className="bg-light rounded p-3">
                {appliedCoupon ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Percent size={16} className="text-success" />
                      <span className="small fw-medium text-success">{appliedCoupon.code}</span>
                      <span className="small text-muted">-{formatCurrency(discount)}</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="btn btn-sm btn-outline-danger"><X size={14} /></button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code" className="form-control form-control-sm" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                      className="btn btn-pizza btn-sm d-flex align-items-center gap-1">
                      <Percent size={14} /> {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <hr className="my-0" />
              <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span className="text-pizza">{formatCurrency(total)}</span></div>
              <button onClick={handlePlaceOrder} disabled={placing || !selectedAddress} className="btn btn-pizza btn-lg w-100 d-flex align-items-center justify-content-center gap-2">
                <CreditCard size={20} /> {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
