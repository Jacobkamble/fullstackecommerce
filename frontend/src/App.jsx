
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader';


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

import { useLoadUserQuery } from './redux/services/user';
import { setAuth } from './redux/features/auth';





function App() {
  const { isSuccess } = useLoadUserQuery();

  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuth(true))
    }
  }, [isSuccess])


  useEffect(() => {
    WebFont.load({ google: { families: ["Roboto", "Droid Sans", "Chilanka"] } })
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

        </Routes>


        <Footer />
        <ToastContainer position='top-right' />
      </Router >

    </>
  )
}

export default App
