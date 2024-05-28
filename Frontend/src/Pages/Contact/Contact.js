import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import Header from "../../components/Header";
import ContactImage from "../../assets/Contact.jpg"; // Import the image
import "./Contact.css";
import { publicRequest } from "../../RequestApiCalls/Request";

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Form values:", values);
    setLoading(true);
    try {
      const res = await publicRequest.post("contact/form", values);
      console.log(res);
      message.success("Message sent successfully");
    } catch (error) {
      console.log(error.response.data);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <div>
      <div className="about-background contact-background">
        <img src={ContactImage} alt="About Us Background" className="about-image" />
      </div>
      <Header title="Contact us" />
      <div className="contact-form-container">
        <Form
          form={form}
          name="contact-form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter subject" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {loading ? "Sending Message" : "Send Message"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Contact;
