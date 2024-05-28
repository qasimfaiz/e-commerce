import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { message } from "antd";
import { userRequest } from "../../RequestApiCalls/Request";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

function OrderList() {
  let User = useSelector((state) => state.UserReducer.CurrentUser);
  const userId = User._id;

  let { id } = useParams();
  const [orders, setOrders] = useState(null);
  // console.log(id)
  console.log(id);
  useEffect(() => {
    const getAllOrders = async (id) => {
      try {
        const res = await userRequest.get(`/orders/all/${id}`);
        console.log(res);
        if (res.status === 200) {
          const sortedOrders = res.data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
          });
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.log(error);
        // message.error(error.response.data);
      }
    };
    getAllOrders(id);
  }, [id]);

  return (
    <div>
      {orders?.length === 0 ? (
        <p className="no-orders-message">
          Oops! You don't have any previous orders.
        </p>
      ) : (
        <MDBTable align="middle" className="container">
          <MDBTableHead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Order ID</th>
              <th scope="col">Status</th>
              <th scope="col">Items qty</th>
              <th scope="col">Amount</th>
              <th scope="col">Actions</th>
            </tr>
          </MDBTableHead>
          {orders?.map((order, index) => (
            <MDBTableBody>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="ms-1">
                      <p className="fw-bold mb-1">{index + 1}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="ms-2">
                      <p className="fw-bold mb-1">{order._id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {order.status === "pending" && (
                    <MDBBadge pill light color="secondary">
                      Pending
                    </MDBBadge>
                  )}
                  {order.status === "processing" && (
                    <MDBBadge pill light color="success">
                      Active
                    </MDBBadge>
                  )}
                  {order.status === "cancelled" && (
                    <MDBBadge pill light color="warning">
                      Cancelled
                    </MDBBadge>
                  )}
                  {order.status === "delivered" && (
                    <MDBBadge pill light color="primary">
                      Delivered
                    </MDBBadge>
                  )}
                </td>
                <td>
                  <p className="fw-normal mb-1">
                    {order.products.reduce(
                      (totalQty, current) => totalQty + current.qty,
                      0
                    )}
                  </p>
                </td>
                <td>$ {order.amount}</td>
                <td>
                  <Link to={`/orderDetail/${order._id}/${userId}`}>
                    <MDBBtn color="link" rounded size="sm">
                      View
                    </MDBBtn>
                  </Link>
                </td>
              </tr>
            </MDBTableBody>
          ))}
        </MDBTable>
      )}
    </div>
  );
}

export default OrderList;
