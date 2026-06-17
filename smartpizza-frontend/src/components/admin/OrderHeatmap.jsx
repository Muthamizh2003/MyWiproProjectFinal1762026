import { useMemo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getIntensity(count, max) {
  if (count === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

const CELL = 14
const GAP = 3
const SIDE = CELL + GAP

export const OrderHeatmap = ({ data }) => {
  const { weeks, maxCount, monthLabels } = useMemo(() => {
    const map = {}
    for (const d of data || []) {
      map[d.date] = d.count
    }

    const today = new Date()
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = new Date(end)
    start.setDate(start.getDate() - 364)

    // Align start to Sunday
    start.setDate(start.getDate() - start.getDay())

    const cells = []
    const current = new Date(start)
    let max = 0
    const monthPositions = []

    while (current <= end) {
      const y = current.getFullYear()
      const m = String(current.getMonth() + 1).padStart(2, '0')
      const d = String(current.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      const count = map[dateStr] || 0
      if (count > max) max = count

      const dayOfWeek = current.getDay()
      const diffDays = Math.floor((current - start) / (1000 * 60 * 60 * 24))
      const col = Math.floor(diffDays / 7)

      cells.push({ date: dateStr, count, dayOfWeek, col })

      // Month label at first week of each month
      if (current.getDate() <= 7 && current.getMonth() !== (new Date(current.getTime() - 86400000)).getMonth()) {
        monthPositions.push({ col, label: MONTHS[current.getMonth()] })
      }

      current.setDate(current.getDate() + 1)
    }

    return { weeks: cells, maxCount: max, monthLabels: monthPositions }
  }, [data])

  const totalCols = useMemo(() => {
    if (weeks.length === 0) return 0
    return Math.max(...weeks.map(w => w.col)) + 1
  }, [weeks])

  if (!data || data.length === 0) {
    return <p className="text-muted small py-3">No daily order data available</p>
  }

  return (
    <div className="overflow-auto">
      <svg width={totalCols * SIDE + 40} height={7 * SIDE + 30}>
        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text key={i} x={m.col * SIDE + 2} y={12} fontSize={10} fill="#888">
            {m.label}
          </text>
        ))}

        {/* Day labels */}
        {DAYS.map((d, i) => (
          <text key={d} x={0} y={i * SIDE + 26} fontSize={9} fill="#888" textAnchor="end">
            {d}
          </text>
        ))}

        {/* Cells */}
        {weeks.map((w, i) => {
          const level = getIntensity(w.count, maxCount)
          const fill = level === 0 ? '#ebedf0' :
                       level === 1 ? '#c6e48b' :
                       level === 2 ? '#7bc96f' :
                       level === 3 ? '#239a3b' :
                       '#196127'
          return (
            <g key={i}>
              <rect
                x={w.col * SIDE + 32}
                y={w.dayOfWeek * SIDE + 16}
                width={CELL}
                height={CELL}
                fill={fill}
                rx={2}
              >
                <title>{w.date} — {w.count} order{w.count !== 1 ? 's' : ''}</title>
              </rect>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="d-flex align-items-center gap-1 mt-2 justify-content-end small text-muted">
        <span>Less</span>
        {['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, backgroundColor: c, borderRadius: 2 }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
