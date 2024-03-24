
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


import './App.css';
import Header from './components/layouts/Header/Header';
import Footer from './components/layouts/Footer/Footer';
import Home from './components/Home/Home';
import ProductDetails from './components/Product/ProductDetails';
import Products from './components/Product/Products';
import Search from './components/Product/Search';
import LoginSignUp from './components/User/LoginSignUp';
import UserOptions from './components/layouts/Header/UserOptions';
import Profile from './components/User/Profile';
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart';
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Cart/Payment';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import CreateProduct from './components/Admin/CreateProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';

import { useLoadUserQuery } from './redux/services/user';
import { setAuth } from './redux/features/auth';
import { loadApiKey } from './utils/loadApiKey';
import UserList from './components/Admin/UserList';





function App() {
  const { isSuccess } = useLoadUserQuery();

  const [stripeApiKey, setStripeApiKey] = useState("")



  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuth(true))
    }
  }, [isSuccess])

  const fetchApiKey = async () => {
    const res = await loadApiKey();
    setStripeApiKey(res);
  }


  useEffect(() => {
    WebFont.load({ google: { families: ["Roboto", "Droid Sans", "Chilanka"] } });
    fetchApiKey();
  }, [])



  return (
    <>

      <Router>


        <Header />
        {isAuthenticated && <UserOptions />}
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/product/:id' element={<ProductDetails />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path='/search' element={<Search />} ></Route>
          <Route exact path='/password/forgot' element={<ForgotPassword />}></Route>
          <Route exact path='password/reset/:token' element={<ResetPassword />}></Route>
          <Route exact path="/cart" element={<Cart />} ></Route>
          <Route exact path='/login' element={<LoginSignUp />}></Route>

          <Route exact path='/me/update' element={
            <ProtectedRoute >
              <UpdateProfile />
            </ProtectedRoute>} />
          <Route exact path='/account' element={
            <ProtectedRoute >
              <Profile />
            </ProtectedRoute>} />
          <Route exact path='/password/update' element={
            <ProtectedRoute >
              <UpdatePassword />
            </ProtectedRoute>}>
          </Route>

          <Route exact path='/shipping' element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>}>
          </Route>

          <Route exact path='/order/confirm' element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>}>
          </Route>

          <Route exact path='/order/:id' element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>}>
          </Route>

          {stripeApiKey && <Route exact path='/process/payment' element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            </Elements>}>

          </Route>}

          <Route exact path='/success' element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>}>
          </Route>

          <Route exact path='/orders' element={
            <ProtectedRoute isAdmin={true}>
              <MyOrders />
            </ProtectedRoute>}>
          </Route>

          {/* {path = "/admin/products"} */}

          <Route exact path="/admin/dashboard" element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }>

          </Route>

          <Route exact path="/admin/products" element={
            <ProtectedRoute isAdmin={true}>
              <ProductList />
            </ProtectedRoute>
          }>

          </Route>


          <Route exact path='/admin/product' element={
            <ProtectedRoute isAdmin={true} >
              <CreateProduct />
            </ProtectedRoute>
          }></Route>


          <Route exact path='/admin/product/:id' element={
            <ProtectedRoute isAdmin={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }>

          </Route>

          <Route exact path='/admin/orders' element={
            <ProtectedRoute isAdmin={true}>
              <OrderList />
            </ProtectedRoute>
          } >
          </Route>

          <Route exact path='/admin/order/:id' element={
            <ProtectedRoute isAdmin={true}>
              <ProcessOrder />
            </ProtectedRoute>
          }>

          </Route>

          <Route exact path='/admin/users' element={
            <ProtectedRoute isAdmin={true}>
              <UserList />
            </ProtectedRoute>}>

          </Route>

        </Routes>


        <Footer />
        <ToastContainer position='top-right' />
      </Router >

    </>
  )
}

export default App
