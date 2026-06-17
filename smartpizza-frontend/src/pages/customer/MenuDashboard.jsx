import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pizza, Search, SlidersHorizontal, X } from 'lucide-react'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatters'
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton'

export const MenuDashboard = () => {
  const [searchParams] = useSearchParams()
  const catFilter = searchParams.get('category')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState(catFilter || '')
  const [filterSize, setFilterSize] = useState('')
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large']

  useEffect(() => {
    productService.getAll().then(data => {
      setProducts(data)
      const cats = [...new Set(data.map(p => p.categoryName).filter(Boolean))]
      setCategories(cats)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCat && p.categoryName !== filterCat) return false
    if (filterSize && p.size !== filterSize) return false
    return true
  })

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Pizza size={28} /> Menu</h1>

      <div className="d-flex flex-wrap gap-2 align-items-center">
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text bg-white"><Search size={16} /></span>
          <input type="text" className="form-control" placeholder="Search pizza..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ maxWidth: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 140 }} value={filterSize} onChange={e => setFilterSize(e.target.value)}>
          <option value="">All Sizes</option>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterCat || filterSize) && (
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={() => { setSearch(''); setFilterCat(''); setFilterSize('') }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {loading ? <ProductGridSkeleton /> : filtered.length === 0 ? (
        <div className="text-center py-5">
          <Pizza size={64} className="text-muted mx-auto d-block mb-3" />
          <h4 className="fw-bold">No pizzas found</h4>
          <p className="text-muted">Try a different category or search term</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(p => (
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
                    <Link to={`/menu/${p.id}`} className="btn btn-pizza btn-sm w-100">View Details</Link>
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
