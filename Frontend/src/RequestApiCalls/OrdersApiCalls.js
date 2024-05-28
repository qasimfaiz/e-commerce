import { userRequest } from "./Request";

export const Order = async (
  message,
  customer,
  products,
  amount,
  address,
  dispatch,
  CLEAR__CART
) => {
  try {
    const res = await userRequest.post("/orders", {
      customer,
      products,
      amount,
      address,
    });
    console.log(res);
    await dispatch(CLEAR__CART());
  } catch (error) {
    console.log("Something went wrong");
  }
};

// export const getAllOrders = async (UserId, message, dispatch) => {
//   try {
//     const res = await userRequest.get(`/orders/all/${UserId}`);
//     if (res.status === 200) {
//       dispatch(USER__ORDERS(res.data));
//     }
//   } catch (error) {
//     message.error(error.response.data);
//   }
// };
