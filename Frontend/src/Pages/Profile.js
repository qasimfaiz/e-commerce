import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProfileCard from "../components/ProfileCard";
import { publicRequest } from "../RequestApiCalls/Request";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { LOGIN__SUCCESS, UPDATED_USER } from "../Redux/actions/Action";

const Profile = () => {
  const id = useParams().id;
  console.log("id", id);
  const [Loading, setLoading] = useState(true);

  let IsProcessing = useSelector((state) => state.UserReducer.isFetching);
  let User = useSelector((state) => state.UserReducer.CurrentUser);

  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await publicRequest.get(`/users/user-detail/${id}`);
        setLoading(false);
        dispatch(LOGIN__SUCCESS(res.data));
      } catch (error) {
        message.error(error.response.data.message);
        setLoading(false);
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <div>
      {Loading ? (
        <div
          className="site-card-border-less-wrapper"
          type="flex"
          justify="center"
          align="middle"
          style={{ minHeight: "100%" }}
        >
          <h5>Loading...</h5>
        </div>
      ) : (
        User && <ProfileCard />
      )}
    </div>
  );
};

export default Profile;
