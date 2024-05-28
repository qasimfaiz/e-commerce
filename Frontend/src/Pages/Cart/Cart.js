import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  REMOVE,
  INCREAMENT,
  DECREAMENT,
  CLEAR__CART,
} from "../../Redux/actions/Action";
import "./cart.css";
import ShopLogo from "../.././assets/ShopSmart_Wiki.png";
import StripeCheckout from "react-stripe-checkout";
import { useEffect } from "react";
import swal from "sweetalert";
import { userRequest } from "../../RequestApiCalls/Request";
import { Order } from "../../RequestApiCalls/OrdersApiCalls";
import { message } from "antd";

function CartPage() {
  let User = useSelector((state) => state.UserReducer.CurrentUser);
  // console.log(User._id)

  let cartData = useSelector((state) => state.CartReducer.cart);
  // const navigate = useNavigate();

  let TotalBill = cartData
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const [StripeToken, setStripeToken] = useState(null);
  const dispatch = useDispatch();
  // const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY;
  const PUBLISHABLE_KEY = "pk_test_51PIAIB09fQfWr7pfQEQ6YhQp6am3iqAHvhlTxscnAqht14CQa5fFgtX45DsG6GqnrtCxv27b6foXzJPEguEALlsx0095Gv5rJq";

  // Getting Token form stripe
  const onToken = (token) => {
    setStripeToken(token);
    console.log(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      const amountInCents = parseInt((TotalBill * 100).toFixed(0));

      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: StripeToken.id,
          amount: amountInCents,
        });

        swal("Thank You!", "Order placed successfully!", "success");
        const { _id, username, email, role, profilePic, verified } = User;

        const customer = {
          _id,
          username,
          email,
          role,
          profilePic,
          verified,
        };
        const OrderPayment = TotalBill;
        const address = res.data.billing_details.address;
        Order(
          message,
          customer,
          cartData,
          OrderPayment,
          address,
          dispatch,
          CLEAR__CART
        );
      } catch (error) {
        // swal("Sorry!", `${error.response.data}`, "error");
        console.log(error);
      }
    };
    StripeToken && makeRequest();
  }, [StripeToken, TotalBill]);

  return (
    <section class="h-100 gradient-custom">
      {cartData.length >= 1 ? (
        <div class="container py-5">
          <div class="row d-flex justify-content-center my-4">
            <div class="col-md-8">
              <div class="card mb-4">
                <div class="card-header py-3">
                  <h5 class="mb-0">Shopping Cart</h5>
                </div>
                <div class="card-body Scroll">
                  {cartData.map((prod) => {
                    {
                      /* console.log(prod.qty) */
                    }
                    return (
                      <div class="row">
                        <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                          <div
                            class="bg-image  hover-overlay hover-zoom ripple rounded"
                            data-mdb-ripple-color="light"
                          >
                            <img
                              src={prod.image.url}
                              class="w-50 center-cart-image "
                              alt="Blue Jeans Jacket"
                            />
                            <Link to="#">
                              <div
                                class="mask"
                                style={{
                                  backgroundColor: "rgba(251, 251, 251, 0.2)",
                                }}
                              ></div>
                            </Link>
                          </div>
                        </div>

                        <div class="col-lg-5 col-md-6 mb-4 mb-lg-0 ">
                          <p>
                            <strong>{prod.title}</strong>
                          </p>
                          <p>Color: blue</p>
                          <p>Size: M</p>
                          <button
                            onClick={() => dispatch(REMOVE(prod._id))}
                            type="button"
                            class="btn btn-primary btn-sm me-1 mb-2"
                            data-mdb-toggle="tooltip"
                            title="Remove item"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                          <button
                            type="button"
                            class="btn btn-danger btn-sm mb-2"
                            data-mdb-toggle="tooltip"
                            title="Move to the wish list"
                          >
                            <i class="fas fa-heart"></i>
                          </button>
                        </div>

                        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                          <div
                            class="d-flex mb-4"
                            style={{ maxWidth: "300px" }}
                          >
                            <button
                              class="btn btn-primary px-3 me-2"
                              onClick={() => dispatch(DECREAMENT(prod))}
                            >
                              <i class="fas fa-minus"></i>
                            </button>

                            <div class="form-outline">
                              <input
                                id="form1"
                                min="1"
                                name="quantity"
                                value={prod.qty}
                                class="form-control"
                              />
                              {/* <label class="form-label" for="form1">Quantity</label> */}
                            </div>

                            <button
                              class="btn btn-primary px-3 ms-2"
                              onClick={() => dispatch(INCREAMENT(prod))}
                            >
                              <i class="fas fa-plus"></i>
                            </button>
                          </div>

                          <p class="text-start text-md-center">
                            <span>
                              {prod.qty} X ${prod.price.toFixed(2)} ={" "}
                            </span>
                            <strong>
                              ${(prod.qty * prod.price).toFixed(2)}
                            </strong>
                          </p>
                        </div>
                        <hr class="my-4" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div class="col-md-4 ">
              <div class="card mb-4  ">
                <div class="card-header py-3 summary">
                  <h5 class="mb-0">Summary</h5>
                </div>
                <div class="card-body summary">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products
                      <span>{cartData.length}</span>
                    </li>

                    {/* <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping
                    <span>Gratis</span>
                  </li> */}
                    <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                        <strong>
                          <p class="mb-0">(including VAT)</p>
                        </strong>
                      </div>

                      <span>
                        <strong>${TotalBill}</strong>
                      </span>
                    </li>
                  </ul>
                  {User ? (
                    <StripeCheckout
                      name="Shoping Center"
                      image={ShopLogo}
                      billingAddress
                      shippingAddress
                      description={`Your total bill is ${TotalBill}`}
                      amount={TotalBill * 100}
                      token={onToken}
                      stripeKey={PUBLISHABLE_KEY}
                    >
                      <button
                        type="button"
                        class="btn btn-primary btn-lg btn-block"
                      >
                        Go to checkout
                      </button>
                    </StripeCheckout>
                  ) : (
                    <Link to="/Login">
                      <button
                        type="button"
                        class="btn btn-primary btn-lg btn-block"
                      >
                        Login
                      </button>
                    </Link>
                  )}
                </div>
              </div>
              <div class="card mb-4">
                <div class="card-body">
                  <p>
                    <strong>Expected shipping delivery</strong>
                  </p>
                  <p class="mb-0">12.10.2020 - 14.10.2020</p>
                </div>
              </div>
              <div class="card mb-4 mb-lg-0">
                <div class="card-body">
                  <p>
                    <strong>We accept</strong>
                  </p>
                  <img
                    class="me-2"
                    width="45px"
                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                    alt="Visa"
                  />

                  <img
                    class="me-2"
                    width="45px"
                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                    alt="Mastercard"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="container-fluid  mt-5" style={{ background: "#dee1e4" }}>
          <div class="row">
            <div class="col-md-12">
              <div class="card-body cart">
                <div class="col-sm-12 empty-cart-cls text-center">
                  <img
                    src="https://i.imgur.com/dCdflKN.png"
                    width="130"
                    height="130"
                    class="img-fluid mb-4 mr-3"
                  />
                  <h3>
                    <strong>Your Cart is Empty</strong>
                  </h3>
                  <h4>Add something to make me happy :)</h4>
                  <Link
                    to="/"
                    class="btn btn-primary cart-btn-transform m-3"
                    data-abc="true"
                  >
                    continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPage;
