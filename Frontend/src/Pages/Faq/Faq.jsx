import React, { useState } from 'react';
import './Faq.css';
import FaqImage from "../../assets/Faq.jpg"
const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
          question: 'What is your return policy?',
          answer: 'You can return any item within 30 days of purchase.',
        },
        {
          question: 'How long does shipping take?',
          answer: 'Shipping usually takes 5-7 business days.',
        },
        {
          question: 'Where are you located?',
          answer: 'We are located in San Francisco, CA.',
        },
        {
          question: 'Do you offer international shipping?',
          answer: 'Yes, we offer international shipping to many countries. Shipping fees may apply.',
        },
        {
          question: 'How can I contact customer service?',
          answer: 'You can contact our customer service via email at shopsmartwiki@gmail.com or call us at (123) 456-7890.',
        },
      ];
    
      const toggleFAQ = (index) => {
        if (activeIndex === index) {
          setActiveIndex(null);
        } else {
          setActiveIndex(index);
        }
      };
    
      return (
        <div className="faq-container">
             <div className="about-background">
        <img src={FaqImage} alt="Faq Background" className="about-image" />
      </div>
          <h1>Frequently Asked Questions</h1>
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleFAQ(index)}>
              <div className="faq-question">
                {faq.question}
                <span className={`arrow ${activeIndex === index ? 'down' : 'right'}`}></span>
              </div>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      );
    };
export default FAQ;
