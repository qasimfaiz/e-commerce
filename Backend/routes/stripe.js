const express = require("express");
const app = express();


const Stripe = require('stripe'); 
const stripe = Stripe(process.env.SECRET_KEY)

// const stripe = require("stripe")(process.env.SECRET_KEY);
const { verifyToken } = require("./verifyToken");


app.post("/payment", verifyToken, async (req, res) => {

    await stripe.charges.create({
      source: req.body.tokenId, // obtained with Stripe.js
        amount: req.body.amount, 
        currency: 'usd',
        
      }, (stripeErr, stripeRes)=> {
        if(stripeErr){
            res.status(500).json(stripeErr)
        }
        else{
            res.status(200).json(stripeRes)
        }
      }); 
      
  });
  

module.exports = app;