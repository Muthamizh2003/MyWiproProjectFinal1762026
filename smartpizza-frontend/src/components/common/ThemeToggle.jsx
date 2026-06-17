import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme()

  return (
    <button onClick={toggle}
      className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center border-0"
      style={{ width: 36, height: 36 }}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
