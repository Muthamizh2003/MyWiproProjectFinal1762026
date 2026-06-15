import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { CustomerLayout } from '../layouts/CustomerLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { DeliveryLayout } from '../layouts/DeliveryLayout'
import { ProtectedRoute } from '../components/common/ProtectedRoute'

// Auth pages
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { ForgotPassword } from '../pages/auth/ForgotPassword'

// Customer pages
import { HomePage } from '../pages/customer/HomePage'
import { MenuDashboard } from '../pages/customer/MenuDashboard'
import { PizzaDetails } from '../pages/customer/PizzaDetails'
import { AICombos } from '../pages/customer/AICombos'
import { Suggestions } from '../pages/customer/Suggestions'
import { CartPage } from '../pages/customer/CartPage'
import { CheckoutPage } from '../pages/customer/CheckoutPage'
import { PaymentSuccess } from '../pages/customer/PaymentSuccess'
import { OrderHistory } from '../pages/customer/OrderHistory'
import { LiveTracking } from '../pages/customer/LiveTracking'
import { UserProfile } from '../pages/customer/UserProfile'

// Admin pages
import { Dashboard } from '../pages/admin/Dashboard'
import { RevenueAnalytics } from '../pages/admin/RevenueAnalytics'
import { OrderManagement } from '../pages/admin/OrderManagement'
import { MenuManagement } from '../pages/admin/MenuManagement'
import { CouponManagement } from '../pages/admin/CouponManagement'
import { CustomerAnalytics } from '../pages/admin/CustomerAnalytics'
import { DeliveryPerformance } from '../pages/admin/DeliveryPerformance'

// Delivery pages
import { DeliveryDashboard as DeliveryDashboardPage } from '../pages/delivery/DeliveryDashboard'
import { AssignedOrders } from '../pages/delivery/AssignedOrders'
import { RouteView } from '../pages/delivery/RouteView'
import { StatusUpdate } from '../pages/delivery/StatusUpdate'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public auth routes
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },

      // Customer routes (protected)
      {
        element: <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}><CustomerLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'menu', element: <MenuDashboard /> },
          { path: 'menu/:id', element: <PizzaDetails /> },
          { path: 'ai-combos', element: <AICombos /> },
          { path: 'suggestions', element: <Suggestions /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'payment-success', element: <PaymentSuccess /> },
          { path: 'orders', element: <OrderHistory /> },
          { path: 'tracking/:orderId', element: <LiveTracking /> },
          { path: 'profile', element: <UserProfile /> }
        ]
      },

      // Admin routes (protected)
      {
        path: 'admin',
        element: <ProtectedRoute roles={['ROLE_ADMIN']}><AdminLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'revenue', element: <RevenueAnalytics /> },
          { path: 'orders', element: <OrderManagement /> },
          { path: 'menu', element: <MenuManagement /> },
          { path: 'coupons', element: <CouponManagement /> },
          { path: 'customers', element: <CustomerAnalytics /> },
          { path: 'delivery', element: <DeliveryPerformance /> }
        ]
      },

      // Delivery routes (protected - requires ROLE_DELIVERY which doesn't exist yet, allow ROLE_ADMIN too)
      {
        path: 'delivery',
        element: <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_DELIVERY']}><DeliveryLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <DeliveryDashboardPage /> },
          { path: 'orders', element: <AssignedOrders /> },
          { path: 'route', element: <RouteView /> },
          { path: 'status', element: <StatusUpdate /> }
        ]
      }
    ]
  }
])
