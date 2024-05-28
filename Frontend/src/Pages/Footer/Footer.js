import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import ShopLogo from "../../assets/ShopSmart_Wiki.png";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from "@ant-design/icons";
const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <div>
      <footer class="footer ">
        <div class="container footer-container pt-5">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-7">
              <div class="footer__about">
                <div class="footer__logo">
                  <Link to="/">
                    <img
                      src={ShopLogo}
                      height="50"
                      width="160"
                      alt=" ShopLogo"
                      loading="lazy"
                      
                    />
                  </Link>
                </div>
                <p>
                Discover a wide range of high-quality products curated just for you. Trusted by thousands of customers worldwide.
                </p>
                <div class="footer__payment">
                  <Link to="#">
                    <img
                      class="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                      alt="Visa"
                    />
                  </Link>
                  <Link to="#">
                    <img
                      class="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                      alt="Mastercard"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-5">
              <div class="footer__widget">
                <h6>Quick links</h6>
                <ul>
                  <li>
                    <Link to="#">About</Link>
                  </li>
                  <li>
                    <Link to="#">Blogs</Link>
                  </li>
                  <li>
                    <Link to="#">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-4">
              <div class="footer__widget">
                <h6>Account</h6>
                <ul>
                  <li>
                    <Link to="#">My Account</Link>
                  </li>
                  <li>
                    <Link to="#">Orders</Link>
                  </li>
                  <li>
                    <Link to="#">My Cart</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-8 col-sm-8">
              <div class="footer__newslatter">
                <h6>NEWSLETTER</h6>
                <form action="#">
                  <input type="text" placeholder="Email" className="mail_box"/>
                  <button type="submit" class="btn btn-dark btn-rounded sub-color" >
                    Subscribe
                  </button>
                </form>
                <div class="footer__social">
                  <a href="https://www.facebook.com/profile.php?id=100093043645474&mibextid=ZbWKwL" className="footer_social_links Fb" target="_blank">
                    <FacebookFilled />
                  </a>
                  <a href="https://x.com/QasimCh46075527?t=PfRNpPW-SimAPlgVZ8blmg&s=09" className="footer_social_links Twitter" target="_blank">
                    <TwitterSquareFilled />
                  </a>
                  <a 
  href="https://www.instagram.com/poison.stores?igsh=MWtocTNld2Z2NXA5dw==" 
  className="footer_social_links Instagram" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <InstagramFilled />
</a>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 ">
              <div class="footer__copyright__text">
                <p>Copyright &copy; {year} All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
