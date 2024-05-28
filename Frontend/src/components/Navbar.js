import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShopLogo from "../assets/ShopSmart_Wiki.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { UPDATED_USER, USER__LOGOUT } from "../Redux/actions/Action";
import { LogoutApiCalls } from "../RequestApiCalls/UserApiCalls";
import { message } from "antd";
import { publicRequest } from "../RequestApiCalls/Request";
import Search from "antd/lib/input/Search";

function Navbar() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  let dispatch = useDispatch();
  let cartData = useSelector((state) => state.CartReducer.cart);
  let user = useSelector((state) => state.UserReducer.CurrentUser);

  function LogoutHandle() {
    LogoutApiCalls(navigate, message);
    dispatch(USER__LOGOUT());
  }
;

 

  return (
    <div className="mb-8">
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light ">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse navbar-styling" id="navbarSupportedContent">
            <Link className="navbar-brand mt-2 mt-lg-0" to="/">
              <img
                src={ShopLogo}
                data-mdb-toggle="collapse"
                height="46"
                width="140"
                alt="ShopLogo"
                loading="lazy"
              />
            </Link>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="Faq">
                  FAQ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="Policy">
                  Policy
                </Link>
              </li>
            </ul>
          </div>

        
         
          <div className="d-flex align-items-center">

            <Link className="text-reset me-3" to="/cart">
              <ShoppingCartIcon />
              {cartData.length >= 1 ? (
                <span className="badge rounded-pill badge-notification bg-danger">
                  {cartData.length}
                </span>
              ) : (
                <span className="badge rounded-pill badge-notification bg-danger"></span>
              )}
            </Link>

            {user && (
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenu2"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.username}
                </button>

                <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                  <li>
                    <Link to={`/Profile/${user._id}`}>
                      <button className="dropdown-item" type="button">
                        My Profile
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/changePassword/${user._id}`}>
                      <button className="dropdown-item" type="button">
                        Change Password
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/orderList/${user._id}`}>
                      <button className="dropdown-item" type="button">
                        My Orders
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <button
                        onClick={LogoutHandle}
                        className="dropdown-item"
                        type="button"
                      >
                        Sign out
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {!user && (
              <div>
                <Link to="/Register">
                  <button type="button" className="btn btn-primary ms-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
