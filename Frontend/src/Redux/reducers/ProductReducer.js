import * as actions from "../actions/actionType"

const InitialState = {
    items : [],
}
export const ProductReducer = (state = InitialState, action)=>{
    switch (action.type) {
        case actions.FETCH_PRODUCT:
            return {
                items: action.payload,
            };
        
        default:
            return state;
    }
};