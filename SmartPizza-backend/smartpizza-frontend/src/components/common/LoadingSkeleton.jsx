export const CardSkeleton = () => (
  <div className="card placeholder-glow">
    <div className="placeholder w-100 bg-secondary" style={{ height: 192 }} />
    <div className="card-body">
      <div className="placeholder w-75 bg-secondary mb-2" style={{ height: 16 }} />
      <div className="placeholder w-50 bg-secondary mb-2" style={{ height: 16 }} />
      <div className="placeholder w-100 bg-secondary mb-2" style={{ height: 16 }} />
      <div className="placeholder w-25 bg-secondary mt-3" style={{ height: 32 }} />
    </div>
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="placeholder-glow d-flex flex-column gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="d-flex gap-3">
        <div className="placeholder bg-secondary flex-grow-1" style={{ height: 16 }} />
        <div className="placeholder bg-secondary" style={{ height: 16, width: 96 }} />
        <div className="placeholder bg-secondary" style={{ height: 16, width: 128 }} />
      </div>
    ))}
  </div>
)

export const StatsSkeleton = () => (
  <div className="row g-3 placeholder-glow">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="col-md-3">
        <div className="card"><div className="card-body">
          <div className="placeholder bg-secondary w-50 mb-2" style={{ height: 16 }} />
          <div className="placeholder bg-secondary w-25" style={{ height: 32 }} />
        </div></div>
      </div>
    ))}
  </div>
)

export const ProductGridSkeleton = () => (
  <div className="row g-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3"><CardSkeleton /></div>
    ))}
  </div>
)
