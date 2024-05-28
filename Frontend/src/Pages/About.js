import React from "react";
import Header from "../components/Header";
import "./About.css";
import AboutImage from "../assets/aboutus_background.jpg";

function About() {
  return (
    <div className="about-container">
      <div className="about-background">
        <img src={AboutImage} alt="About Us Background" className="about-image" />
      </div>
      <div className="about-content">
        <Header title="About Us" />
        <h2 className="about-heading">Welcome to Our e-Commerce Store!</h2>
        <p className="about-paragraph">
          At ShopSmart Wiki , we are committed to offering you an unparalleled online shopping experience. Our mission is to curate a selection of premium products, ensuring that you find exactly what you need at competitive prices.
        </p>
        <p className="about-paragraph">
          With our intuitive interface and secure payment options, you can shop with confidence from the comfort of your home. We prioritize customer satisfaction and strive to exceed your expectations with every purchase. 😎
        </p>
        <p className="about-paragraph">
          Whether you're in search of the latest fashion trends, cutting-edge electronics, stylish home goods, or more, our extensive product catalog caters to every need and preference. Start exploring our store today and elevate your shopping experience!
        </p>
        <p className="about-paragraph">Thank you for choosing ShopSmart Wiki as your preferred destination for online shopping. We look forward to serving you and wish you a delightful shopping journey!</p>
      </div>
    </div>
  );
}

export default About;
