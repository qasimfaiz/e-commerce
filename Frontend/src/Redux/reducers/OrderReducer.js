import * as actions from "../actions/actionType"

const InitialState = {
    orders : [],
}
export const OrderReducer = (state = InitialState, action)=>{
    switch (action.type) {
        case actions.USER_ORDERS:
            return {
                orders: action.payload,
            };
        
        case actions.USER_ORDERS_NULL:
            return {
                orders: null,
            };
        
        default:
            return state;
    }
};