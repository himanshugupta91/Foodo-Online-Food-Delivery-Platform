import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from '../customers/pages/Home/HomePage'
import CustomerDashboard from '../customers/pages/Home/CustomerDashboard'
import OwnerHomePage from '../customers/pages/Home/OwnerHomePage'
import AdminHomePage from '../customers/pages/Home/AdminHomePage'
import Navbar from '../customers/components/Navbar/Navbar'
import Cart from '../customers/pages/Cart/Cart'
import Profile from '../customers/pages/Profile/Profile'
import PaymentSuccess from '../customers/pages/PaymentSuccess/PaymentSuccess'
import Search from '../customers/components/Search/Search'
import CreateRestaurantForm from '../admin/AddRestaurants/CreateRestaurantForm'
import Restaurant from '../customers/pages/Restaurant/Restaurant'
import Restaurants from '../customers/pages/Restaurant/Restaurants'
import PasswordChangeSuccess from '../customers/pages/Auth/PasswordChangeSuccess'
import NotFound from '../customers/pages/NotFound/NotFound'
import LoginPage from '../customers/pages/Auth/LoginPage'
import RegisterPage from '../customers/pages/Auth/RegisterPage'
import Events from '../customers/pages/Events/Events'


const CustomerRoutes = () => {
  const { auth } = useSelector(store => store)

  const getHomePage = () => {
    if (!auth.user) return <HomePage />;
    switch (auth.user.role) {
      case "ROLE_CUSTOMER": return <CustomerDashboard />;
      case "ROLE_RESTAURANT_OWNER": return <OwnerHomePage />;
      case "ROLE_SUPER_ADMIN": return <AdminHomePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className='relative'>
      {/* Keep navigation persistent while page content swaps through route changes. */}
      <nav className="sticky top-0 z-50">
        <Navbar />
      </nav>
      <Routes>
        <Route exact path='/' element={getHomePage()} />
        <Route exact path='/account/login' element={<LoginPage />} />
        <Route exact path='/account/register' element={<RegisterPage />} />
        <Route exact path='/restaurants' element={<Restaurants />} />
        <Route exact path='/restaurant/:city/:title/:id' element={<Restaurant />} />
        {/* Prevent non-customer roles from opening cart flow by rerouting to their dashboards. */}
        <Route path='/cart' element={auth.user?.role === "ROLE_CUSTOMER" ? <Cart /> : auth.user?.role === "ROLE_RESTAURANT_OWNER" ? <Navigate to="/admin/restaurant" /> : auth.user?.role === "ROLE_SUPER_ADMIN" ? <Navigate to="/super-admin" /> : <Cart />} />
        <Route path='/payment/success/:id' element={<PaymentSuccess />} />
        <Route path='/my-profile/*' element={auth.user?.role === "ROLE_SUPER_ADMIN" ? <Navigate to="/super-admin" /> : <Profile />} />
        <Route path='/search' element={<Search />} />
        <Route path='/events' element={<Events />} />
        <Route path='/admin/add-restaurant' element={auth.user?.role === "ROLE_SUPER_ADMIN" ? <Navigate to="/super-admin" /> : <CreateRestaurantForm />} />
        <Route exact path='/password_change_success' element={<PasswordChangeSuccess />} />
        <Route exact path='/*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default CustomerRoutes
