import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token)
      if (decoded && decoded.sub) {
        let roles = []
        if (Array.isArray(decoded.roles)) {
          roles = decoded.roles
        } else if (decoded.role) {
          roles = [decoded.role]
        }
        setUser({
          id: decoded.id || decoded.userId,
          username: decoded.sub,
          name: decoded.name || decoded.sub,
          email: decoded.sub,
          roles: roles
        })
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [token])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    sessionStorage.setItem('token', res.token)
    setToken(res.token)
    return res
  }, [])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    return res
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!token && !!user,
      login, register, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
