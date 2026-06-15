import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

const ToastContext = createContext(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider = ({ children }) => {
  const show = {
    success: (msg) => toast.success(msg, { duration: 3000, position: 'top-right' }),
    error: (msg) => toast.error(msg, { duration: 4000, position: 'top-right' }),
    info: (msg) => toast(msg, { duration: 3000, position: 'top-right' }),
    loading: (msg) => toast.loading(msg, { position: 'top-right' })
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
    </ToastContext.Provider>
  )
}
