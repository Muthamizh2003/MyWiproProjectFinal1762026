import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pizza, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatters'
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton'

export const HomePage = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getTopExpensive()
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    { name: 'Veg Pizza', icon: '🍕', color: 'success' },
    { name: 'Non-Veg Pizza', icon: '🍗', color: 'danger' },
    { name: 'Sides', icon: '🧀', color: 'warning' },
    { name: 'Beverages', icon: '🥤', color: 'info' }
  ]

  return (
    <div className="d-flex flex-column gap-5">
      <section className="text-center py-5 bg-pizza-light rounded-4 px-3">
        <h1 className="display-4 fw-bold mb-3">Your AI-Powered<br /><span className="text-pizza">Pizza Experience</span></h1>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: 500 }}>
          Discover pizzas crafted with AI recommendations, smart combos, and real-time delivery tracking.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/menu" className="btn btn-pizza btn-lg px-4">Order Now</Link>
          <Link to="/ai-combos" className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center gap-2">
            <Sparkles size={20} /> AI Combos
          </Link>
        </div>
      </section>

      <section>
        <h3 className="fw-bold mb-4 d-flex align-items-center gap-2"><TrendingUp size={24} /> Top Picks</h3>
        {loading ? <ProductGridSkeleton /> : (
          <div className="row g-4">
            {featured.map(p => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-center mb-3">
                      <div className="rounded-circle bg-pizza-light d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                        <Pizza size={36} className="text-pizza" />
                      </div>
                    </div>
                    <h5 className="fw-bold text-center">{p.name}</h5>
                    <p className="text-muted small text-center mb-2">{p.categoryName}</p>
                    <p className="text-center mb-0"><span className="fw-bold fs-5">{formatCurrency(p.price)}</span></p>
                    <Link to={`/menu/${p.id}`} className="btn btn-outline-pizza btn-sm w-100 mt-3">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="fw-bold mb-4">Categories</h3>
        <div className="row g-3">
          {categories.map(cat => (
            <div key={cat.name} className="col-6 col-md-3">
              <Link to={`/menu?category=${cat.name.toLowerCase()}`} className="card shadow-sm border-0 text-center p-4 h-100 text-decoration-none">
                <div className="fs-1 mb-2">{cat.icon}</div>
                <h6 className="fw-bold mb-0">{cat.name}</h6>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
