import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import Avatar from "react-avatar";
import {
  UpdateProfileApiCalls,
  UpdateProfilePic,
} from "../RequestApiCalls/UserApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = () => {
  // let loading = useSelector((state) => state.loading);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  let User = useSelector((state) => state.UserReducer.CurrentUser);
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const flexContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Create a temporary URL for the selected image
    if (file) {
      const ImageUrl = URL.createObjectURL(file);
      setImageUrl(ImageUrl);
    }
  };
  const removeImage = () => {
    setImageUrl(null);
    setSelectedFile(null);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { username, email, password } = values;
    const lowercaseEmail = email.toLowerCase();

    const formData = new FormData();
    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    formData.append("username", username);
    formData.append("email", lowercaseEmail);
    formData.append("password", password);
    console.log(formData);
    UpdateProfileApiCalls(formData, id, dispatch, navigate, message);
    setLoading(false);
  };

  return (
    <div className="profile-card">
      <Card title="User Profile" bordered={false}>
        <Form
          {...layout}
          name="profile-form"
          onFinish={onFinish}
          style={{ flexContainerStyle }}
        >
          {/* Avatar */}
          <div className="d-flex justify-content-center mb-4 position-relative">
            <Avatar
              src={imageUrl || User.image.profilePic}
              alt="profilePic"
              round={true}
              size={150}
              name={User.username}
              style={{ marginBottom: 24 }}
            />
            {imageUrl && (
              <div
                style={{ position: "absolute", top: "15px", right: "105px" }}
              >
                <button
                  className="position-absolute top-0 start-100 rounded-circle translate-middle p-2 bg-danger border border-light rounded-circle"
                  onClick={removeImage}
                >
                  <span className="visually-hidden ">Remove image</span>X
                </button>
              </div>
            )}
            {!imageUrl && (
              <div
                style={{ position: "absolute", top: "15px", right: "105px" }}
              >
                <label
                  className="position-absolute top-0 start-100 rounded-circle  translate-middle p-2 bg-primary text-white border border-light rounded-circle"
                  htmlFor="customFile2"
                >
                  <span className="visually-hidden">Upload image</span>
                  +
                  <input
                    type="file"
                    className="form-control d-none"
                    id="customFile2"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
            )}
          </div>
          {/* <img
            alt="example"
            style={{ width: "35%" }} // Combine the inline style and fieldStyle object using spread operator
            src={User.image.profilePic}
            className="rounded-circle"
            name="profilePic"
          /> */}

          <Form.Item label="Username" name="username">
            <Input placeholder={User.username} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
            ]}
          >
            <Input placeholder={User.email} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {loading ? "Updating Profile" : " Update Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProfile;
