import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pizza, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react'
import { productService } from '../../services/productService'
import { cartService } from '../../services/cartService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const PizzaDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    if (!product) return
    setAdding(true)
    try {
      await cartService.add(user.id, product.id, qty)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="spinner-border text-pizza" role="status" />

  if (!product) return (
    <div className="text-center py-5">
      <h4 className="fw-bold">Product not found</h4>
      <button onClick={() => navigate('/menu')} className="btn btn-pizza mt-3">Back to Menu</button>
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      <button onClick={() => navigate(-1)} className="btn btn-light d-inline-flex align-items-center gap-2 align-self-start">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card shadow-sm border-0">
        <div className="row g-0">
          <div className="col-md-5 d-flex align-items-center justify-content-center bg-pizza-light p-5">
            <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: 200, height: 200 }}>
              <Pizza size={96} className="text-pizza" />
            </div>
          </div>
          <div className="col-md-7">
            <div className="card-body p-4 d-flex flex-column gap-3">
              <div>
                <span className="badge bg-pizza-light text-pizza mb-2">{product.categoryName}</span>
                <h2 className="fw-bold">{product.name}</h2>
                {product.size && <p className="text-muted small mb-0">Size: {product.size}</p>}
              </div>
              <p className="text-muted">{product.description || 'A delicious pizza made with fresh ingredients.'}</p>
              <div className="d-flex align-items-baseline gap-2">
                <span className="fs-3 fw-bold text-pizza">{formatCurrency(product.price)}</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group" style={{ maxWidth: 130 }}>
                  <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                  <input type="text" className="form-control text-center" value={qty} readOnly />
                  <button className="btn btn-outline-secondary" onClick={() => setQty(q => q + 1)}><Plus size={16} /></button>
                </div>
                <span className="text-muted small">{formatCurrency(product.price * qty)}</span>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn btn-pizza btn-lg d-flex align-items-center justify-content-center gap-2">
                <ShoppingCart size={20} /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
