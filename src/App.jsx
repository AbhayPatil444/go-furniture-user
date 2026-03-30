
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import MainLayout from './components/layout/MainLayout';
import OrdersPage from './pages/OrdersPage';
import ThankYouPage from './pages/ThankYouPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import SearchResultsPage from './pages/SearchPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="checkout" element={<CheckoutPage/>}/>
          <Route path="search" element={<SearchResultsPage />} />
        </Route>

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ThankYouPage />} />

        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </>
  )
}

export default App
