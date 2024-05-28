import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import AllReducers from "./Redux/reducers/Index";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, AllReducers);

let store = createStore(persistedReducer, composeWithDevTools());

export default store;
