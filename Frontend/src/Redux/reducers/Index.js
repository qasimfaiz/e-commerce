import {combineReducers} from 'redux'
import { CartReducer } from './CartReducer'
import { OrderReducer } from './OrderReducer'
import { ProductReducer } from './ProductReducer'
import { UserReducer } from './UserReducer'


const AllReducers = combineReducers({
    CartReducer : CartReducer,
    Products : ProductReducer,
    UserReducer : UserReducer,
    OrderReducer :  OrderReducer
})
export default AllReducers;