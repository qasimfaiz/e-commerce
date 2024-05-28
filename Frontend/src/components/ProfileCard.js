import React, { useState } from "react";
import { Card, message } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { publicRequest } from "../RequestApiCalls/Request";
import Avatar from "react-avatar";
const ProfileCard = () => {
  let user = useSelector((state) => state.UserReducer.CurrentUser);

  const cardStyle = {
    width: 400,
    margin: "0 auto",
    marginTop: 100,
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const fieldStyle = {
    marginBottom: 12,
  };
  const flexContainerStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  };
  const flexContainerStyleRow = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  const removeImage = async (id) => {
    try {
      const response = await publicRequest.post("/users/user/remove-profile", {
        id: id,
      });
      message.success("Image removed successfully");
      console.log(response);
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={cardStyle} title="User Profile">
        <div style={{ ...fieldStyle, ...flexContainerStyleRow }}>
          <Link to={`/update-profile/${user._id}`}>Update Profile</Link>
          {user?.image?.profilePic && (
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => removeImage(user._id)}
            >
              Remove image
            </span>
          )}
        </div>
        <div style={flexContainerStyle}>
          <div className="d-flex position-relative" style={flexContainerStyle}>
            <Avatar
              alt="profilePic"
              src={user.image.profilePic}
              round={true}
              name={user.username}
              size={120}
              style={{ marginBottom: 24 }}
            />
          </div>
          <div style={fieldStyle}>
            <label>Name:</label>
            <span>{user.username}</span>
          </div>
          <div style={fieldStyle}>
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div style={fieldStyle}>
            <label>Password:</label>
            <Link to={`/changePassword/${user._id}`}>
              Click here to change password
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
