import { useState, useEffect } from 'react'
import { Sparkles, ShoppingCart, Pizza, Sun, History, Package } from 'lucide-react'
import { aiService } from '../../services/aiService'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'
import { cartService } from '../../services/cartService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton'

const SEASONS = ['Summer', 'Winter', 'Monsoon']

export const Suggestions = () => {
  const { user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('personalized')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [season, setSeason] = useState('Summer')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    if (user) loadSuggestions()
  }, [tab, season, user])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      if (tab === 'personalized') {
        const orders = await orderService.getUserOrders(user.id).catch(() => [])
        const allProducts = await productService.getAll().catch(() => [])
        if (orders.length === 0 || !Array.isArray(orders)) {
          setProducts(allProducts.slice(0, 8))
          return
        }
        const favCategoryIds = [...new Set(
          orders.flatMap(o => o.items || [])
            .map(i => i.categoryName || i.productName)
            .filter(Boolean)
        )]
        const filtered = allProducts.filter(p =>
          favCategoryIds.includes(p.categoryName)
        )
        setProducts(filtered.length > 0 ? filtered : allProducts.slice(0, 8))
      } else {
        const result = await aiService.recommend({
          season: season.toUpperCase(),
          prompt: `Suggest products suitable for ${season} season`
        })
        const seen = new Set()
        const flat = (result || []).flatMap(r => r.products || []).filter(p => {
          if (seen.has(p.id)) return false
          seen.add(p.id)
          return true
        })
        setProducts(flat.length > 0 ? flat : [])
      }
    } catch {
      toast.error('Failed to load suggestions')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    if (!user) { toast.error('Please login'); return }
    setAddingId(product.id)
    try {
      await cartService.add(user.id, product.id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Sparkles size={28} /> Suggestions</h1>

      <div className="d-flex gap-2 flex-wrap">
        <button onClick={() => setTab('personalized')}
          className={`btn d-flex align-items-center gap-2 ${tab === 'personalized' ? 'btn-pizza' : 'btn-outline-secondary'}`}>
          <History size={18} /> Based on Your Orders
        </button>
        <button onClick={() => setTab('seasonal')}
          className={`btn d-flex align-items-center gap-2 ${tab === 'seasonal' ? 'btn-pizza' : 'btn-outline-secondary'}`}>
          <Sun size={18} /> Seasonal Picks
        </button>
      </div>

      {tab === 'seasonal' && (
        <div className="d-flex gap-2 align-items-center">
          <span className="small fw-medium">Select Season:</span>
          {SEASONS.map(s => (
            <button key={s} onClick={() => setSeason(s)}
              className={`btn btn-sm ${season === s ? 'btn-pizza' : 'btn-outline-secondary'}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <Package size={64} className="text-muted mx-auto d-block mb-3" />
          <h4 className="fw-bold">No suggestions yet</h4>
          <p className="text-muted">
            {tab === 'personalized' ? 'Place some orders to get personalized recommendations!' : 'Try a different season'}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(p => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="rounded-circle bg-pizza-light d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                      <Pizza size={36} className="text-pizza" />
                    </div>
                  </div>
                  <h5 className="fw-bold text-center">{p.name}</h5>
                  <p className="text-muted small text-center mb-1">{p.categoryName}{p.size ? ` • ${p.size}` : ''}</p>
                  <p className="text-muted small text-center mb-2">{p.description}</p>
                  <div className="mt-auto">
                    <p className="text-center mb-2"><span className="fw-bold fs-5">{formatCurrency(p.price)}</span></p>
                    <button onClick={() => addToCart(p)} disabled={addingId === p.id}
                      className="btn btn-pizza btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                      <ShoppingCart size={16} /> {addingId === p.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
