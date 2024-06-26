import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { PersistGate } from 'redux-persist/integration/react';
import store from "./Store";
import {Provider} from 'react-redux'
import {persistStore} from "redux-persist";



let persistor = persistStore(store);


ReactDOM.render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>


, document.getElementById("root"));

