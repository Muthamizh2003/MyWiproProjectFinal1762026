import { useState } from 'react'
import { Sparkles, Pizza, ShoppingCart } from 'lucide-react'
import { comboService } from '../../services/comboService'
import { cartService } from '../../services/cartService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const AICombos = () => {
  const { user } = useAuth()
  const toast = useToast()
  const [prompt, setPrompt] = useState('')
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState(null)

  const generateCombos = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await comboService.getSmartCombo({ prompt: prompt.trim(), category: '' })
      setCombos(Array.isArray(result) ? result : [result])
    } catch {
      toast.error('Failed to generate combos')
    } finally {
      setLoading(false)
    }
  }

  const addComboToCart = async (combo) => {
    if (!user) { toast.error('Please login first'); return }
    setAddingId(combo.comboName)
    try {
      for (const p of combo.products) {
        await cartService.add(user.id, p.id, 1)
      }
      toast.success('Combo added to cart!')
    } catch {
      toast.error('Failed to add combo')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      <h1 className="fw-bold h2 d-flex align-items-center gap-2"><Sparkles size={28} /> AI Smart Combos</h1>

      <div className="card shadow-sm border-0 bg-pizza-light">
        <div className="card-body d-flex flex-column flex-md-row gap-3 align-items-start">
          <div className="flex-grow-1 w-100">
            <label className="form-label fw-medium">Describe your cravings</label>
            <input type="text" className="form-control" value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., I want a spicy veg combo for 2 people under ₹500" onKeyDown={e => e.key === 'Enter' && generateCombos()} />
          </div>
          <button onClick={generateCombos} disabled={loading || !prompt.trim()} className="btn btn-pizza mt-md-4 d-flex align-items-center gap-2">
            <Sparkles size={18} /> {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {combos.length > 0 && (
        <div className="d-flex flex-column gap-4">
          {combos.map((combo, idx) => (
            <div key={idx} className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h4 className="fw-bold mb-1">{combo.comboName}</h4>
                    {combo.aiSuggestion && <p className="text-muted small mb-0">{combo.aiSuggestion}</p>}
                  </div>
                  <span className="fs-5 fw-bold text-pizza">{formatCurrency(combo.totalPrice)}</span>
                </div>
                <div className="d-flex flex-column gap-2 mb-3">
                  {(combo.products || []).map((p, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 p-2 rounded bg-light">
                      <Pizza size={20} className="text-pizza flex-shrink-0" />
                      <div className="flex-grow-1">
                        <p className="fw-medium mb-0 small">{p.name}</p>
                        <small className="text-muted">{p.categoryName} • {p.size}</small>
                      </div>
                      <span className="fw-medium small">{formatCurrency(p.price)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => addComboToCart(combo)} disabled={addingId === combo.comboName} className="btn btn-pizza d-flex align-items-center gap-2">
                  <ShoppingCart size={18} /> {addingId === combo.comboName ? 'Adding...' : 'Add Combo to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && combos.length === 0 && (
        <div className="text-center py-5">
          <Sparkles size={64} className="text-muted mx-auto d-block mb-3" />
          <h4 className="fw-bold">No combos yet</h4>
          <p className="text-muted">Describe what you're craving and let AI create the perfect combo!</p>
        </div>
      )}
    </div>
  )
}
