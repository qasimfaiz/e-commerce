import React from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UpdatePasswordApiCalls } from "../../RequestApiCalls/UserApiCalls";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  const onFinish = (values) => {
    const { password, newPassword } = values;
    UpdatePasswordApiCalls(password, newPassword, id, navigate, message);
  };

  return (
    <div className="profile-card">
      <Card title="Change Password" bordered={false}>
        <Form
          {...layout}
          name="profile-form"
          initialValues={user}
          onFinish={onFinish}
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "New password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
