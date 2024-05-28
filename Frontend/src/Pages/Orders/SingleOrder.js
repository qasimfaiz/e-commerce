import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
  MDBBadge,
} from "mdb-react-ui-kit";
import "./SingleOrder.css";
import { useParams } from "react-router-dom";
import { userRequest } from "../../RequestApiCalls/Request";
import { Button, message } from "antd";
import { useSelector } from "react-redux";

export default function SingleOrder() {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState(null);

  let { OrderId, id } = useParams();

  useEffect(() => {
    const getAllOrders = async (id) => {
      try {
        const res = await userRequest.get(`orders/detail/${OrderId}/${id}`);

        if (res.status === 200) {
          const allOrders = res.data[0];
          setOrder(allOrders);
          const SingleOrderProduct = allOrders?.products;
          setProducts(SingleOrderProduct);
        }
      } catch (error) {
        message.error(error.response.data);
      }
    };
    getAllOrders(id);
  }, [id]);

  return (
    <>
      <section
        className="h-100 gradient-custom"
        style={{ backgroundColor: "#eee" }}
      >
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" xl="8">
              <MDBCard style={{ borderRadius: "10px" }}>
                <MDBCardHeader className="px-4 py-5">
                  <MDBTypography tag="h5" className="text-muted mb-0">
                    Thanks for your Order
                    <span style={{ color: "#a8729a" }}> # {order?._id}</span>
                    <span className=" ms-5">
                      {order?.status === "Pending" && (
                        <MDBBadge pill light color="secondary">
                          Pending
                        </MDBBadge>
                      )}
                      {order?.status === "Processing" && (
                        <MDBBadge pill light color="success">
                          Active
                        </MDBBadge>
                      )}
                      {order?.status === "Cancelled" && (
                        <MDBBadge pill light color="warning">
                          Cancelled
                        </MDBBadge>
                      )}
                      {order?.status === "Delivered" && (
                        <MDBBadge pill light color="primary">
                          Delivered
                        </MDBBadge>
                      )}
                    </span>
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p
                      className="lead fw-normal mb-0"
                      style={{ color: "#a8729a" }}
                    >
                      Receipt
                    </p>
                    <p className="small text-muted mb-0">
                      Receipt Voucher : 1KAU9-84UIL
                    </p>
                  </div>

                  {products?.map((product) => (
                    <MDBCard className="shadow-0 border mb-4">
                      <MDBCardBody>
                        <MDBRow>
                          <MDBCol md="2">
                            <MDBCardImage
                              src={product.image.url}
                              fluid
                              alt={product.title}
                            />
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0">{product.title}</p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            {/* <p className="text-muted mb-0 small">White</p> */}
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            {/* <p className="text-muted mb-0 small">
                            Capacity: 64GB
                          </p> */}
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">
                              Qty: {product.qty}
                            </p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">
                              ${product.qty * product.price}
                            </p>
                          </MDBCol>
                        </MDBRow>
                        <hr
                          className="mb-4"
                          style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                        />
                        <MDBProgress
                          style={{ height: "6px", borderRadius: "16px" }}
                        >
                          <MDBProgressBar
                            style={{
                              borderRadius: "16px",
                              backgroundColor: "#a8729a",
                            }}
                            width={100}
                            valuemin={0}
                            valuemax={100}
                          />
                        </MDBProgress>
                        {/* <MDBRow className="align-items-center">
                        <MDBCol md="2">
                          <p className="text-muted mb-0 small">Track Order</p>
                        </MDBCol>
                        <MDBCol md="10">
                          <MDBProgress
                            style={{ height: "6px", borderRadius: "16px" }}
                          >
                            <MDBProgressBar
                              style={{
                                borderRadius: "16px",
                                backgroundColor: "#a8729a",
                              }}
                              width={65}
                              valuemin={0}
                              valuemax={100}
                            />
                          </MDBProgress>
                          <div className="d-flex justify-content-around mb-1">
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Out for delivary
                            </p>
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">
                              Delivered
                            </p>
                          </div>
                        </MDBCol>
                      </MDBRow> */}
                      </MDBCardBody>
                    </MDBCard>
                  ))}
                  <div className="d-flex justify-content-between pt-2">
                    <p className="fw-bold mb-0">Order Details</p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Total</span> $
                      {order?.amount}
                    </p>
                  </div>

                  {/* <div className="d-flex justify-content-between pt-2">
                      <p className="text-muted mb-0">Invoice Number : 788152</p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Discount</span> $19.00
                      </p>
                    </div> */}

                  <div className="d-flex justify-content-between">
                    <p className="text-muted mb-0">
                      Invoice Date :{" "}
                      {order?.createdAt &&
                        new Date(order?.createdAt).toISOString().slice(0, 10)}
                    </p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Delivery Charges</span>{" "}
                      Free
                    </p>
                  </div>
                </MDBCardBody>
                <MDBCardFooter
                  className="border-0 px-4 py-5"
                  style={{
                    backgroundColor: "#a8729a",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  <MDBTypography
                    tag="h5"
                    className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                  >
                    {order?.status === "Cancelled" ? (
                      <p className="mt-3">Refunded Amount</p>
                    ) : (
                      <p className="mt-3">Total paid</p>
                    )}
                    <span className="h2 mb-0 ms-2">${order?.amount}</span>
                  </MDBTypography>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}
