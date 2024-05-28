import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import About from "../Pages/About";
import CartPage from "../Pages/Cart/Cart";
import Contact from "../Pages/Contact/Contact";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";
import ProductDetail from "../Pages/ProductDetail/ProductDetail";
import Footer from "../Pages/Footer/Footer";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Profile from "../Pages/Profile";
import OrderList from "../Pages/Orders/OrderList";
import SingleOrder from "../Pages/Orders/SingleOrder";
import Protected from "./Protected";
import { useSelector } from "react-redux";
import Reset from "../Pages/Authentication/Reset";
import ChangePassword from "../Pages/Authentication/ChangePassword";
import UpdateProfile from "../Pages/UpdateProfile";
import Faq from "../Pages/Faq/Faq"
import Policy from "../Pages/Policy/Policy"
function Routing() {
  let user = useSelector((state) => state.UserReducer.CurrentUser);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Faq" element={<Faq />}/>
          <Route path="/Policy" element={<Policy />}/>
          <Route path={`/ProductDetail/:id`} element={<ProductDetail />} />

          {/* Protected Routes */}
          <Route
            path={`/orderList/:id`}
            element={
              <Protected user={user}>
                <OrderList />
              </Protected>
            }
          />
          <Route
            path={`/orderDetail/:OrderId/:id`}
            element={
              <Protected user={user}>
                <SingleOrder />
              </Protected>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          {/* Navigate to home page when user is logged in */}
          <Route
            path="/Register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/Login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/reset"
            element={!user ? <Reset /> : <Navigate to="/" />}
          />

          <Route
            path="/Profile/:id"
            element={
              <Protected user={user}>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/changePassword/:id"
            element={
              <Protected user={user}>
                <ChangePassword />
              </Protected>
            }
          />
          <Route
            path="/update-profile/:id"
            element={
              <Protected user={user}>
                <UpdateProfile />
              </Protected>
            }
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default Routing;
