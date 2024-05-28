import React from 'react';
import './Policy.css';
import PolicyImage from "../../assets/Policy.jpg"
const Policy = () => {
  return (
    <div className="policy-wrapper">
       <div className="about-background policy-background">
        <img src={PolicyImage} alt="Policy Background" className="about-image" />
      </div>
      <div className="policy-container">
        <h1 className='return-font'>Return Policy</h1>
        <section className="policy-section">
          <h2>General Return Policy</h2>
          <p>We accept returns within 30 days of purchase. Items must be in their original condition and packaging. To initiate a return, please contact our customer service team.</p>
        </section>
        <section className="policy-section">
          <h2>Non-Returnable Items</h2>
          <p>Some items are non-returnable, including:</p>
          <ul>
            <li>Gift cards</li>
            <li>Personalized items</li>
            <li>Perishable goods</li>
          </ul>
        </section>
        <section className="policy-section">
          <h2>Return Process</h2>
          <ol>
            <li>Contact customer service to initiate a return.</li>
            <li>Receive a return authorization and shipping label.</li>
            <li>Package the item securely and attach the return label.</li>
            <li>Drop off the package at the designated shipping location.</li>
          </ol>
        </section>
        <section className="policy-section">
          <h2>Refunds</h2>
          <p>Once we receive your return, we will inspect the item and notify you of the status of your refund. Approved refunds will be processed to the original method of payment within 7-10 business days.</p>
        </section>
        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>If you have any questions about our return policy, please contact us at <a href="mailto:support@example.com">support@example.com</a> or call us at (123) 456-7890.</p>
        </section>
      </div>
    </div>
  );
};

export default Policy;
