import "antd/dist/antd.css";
import "./App.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Routing from "./Routing/Routing";
// import { useDispatch } from "react-redux";
// import { publicRequest } from "./RequestApiCalls/Request";
// import { UPDATED_USER } from "./Redux/actions/Action";
// import { message } from "antd";
// import { useEffect } from "react";

function App() {
  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     const getUser = async () => {
  //       try {
  //         const res = await publicRequest.get("/users/user-detail");

  //         dispatch(UPDATED_USER(res.data));
  //       } catch (error) {
  //         message.error(error.response.data.message);
  //       }
  //     };
  //     getUser();
  //   }, [dispatch]);
  return <Routing />;
}

export default App;
