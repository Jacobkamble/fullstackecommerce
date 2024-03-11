
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './components/layouts/Header/Header';
import WebFont from "webfontloader"
import { useEffect } from 'react';
import Footer from './components/layouts/Footer/Footer';
import Home from './components/Home/Home';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
// import ProductDetails from './components/product/ProductDetails';
import ProductDetails from "./components/Product/ProductDetails"
import Products from './components/Product/Products';
import Search from './components/Product/Search';
import LoginSignUp from './components/User/LoginSignUp';
import UserOptions from './components/layouts/Header/UserOptions';
import { useLoadUserQuery } from './redux/services/user';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from './redux/features/auth';
import Profile from './components/User/Profile';
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';







function App() {
  const { data, refetch, isLoading } = useLoadUserQuery();
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  // const selector = useSelector(state => state)

  // console.log(selector, "selector")

  useEffect(() => {
    if (data && data.success) {
      dispatch(setAuth(true))
    }
  }, [data])


  useEffect(() => {
    WebFont.load({ google: { families: ["Roboto", "Droid Sans", "Chilanka"] } })
  }, [])


  return (
    <>
      <Router>
        {/* <UpdateProfile /> */}
        <UpdatePassword />
        <Header />
        {isAuthenticated && <   UserOptions user={data?.user} refetch={refetch} />}
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/product/:id' element={<ProductDetails />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path='/search' element={<Search />} ></Route>
          <Route exact path='/me/update' element={<ProtectedRoute loading={isLoading} user={data?.user}>
            <UpdateProfile user={data?.user} refetch={refetch} />
          </ProtectedRoute>} />
          <Route exact path='/account' element={<ProtectedRoute loading={isLoading} user={data?.user}>
            <Profile user={data?.user} loading={isLoading} />
          </ProtectedRoute>} />
          <Route exact path='/login' element={<LoginSignUp refetch={refetch} />}></Route>
        </Routes>


        <Footer />
        <ToastContainer position='top-right' />
      </Router>

    </>
  )
}

export default App
