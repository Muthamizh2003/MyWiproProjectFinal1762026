import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export const RootLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}
