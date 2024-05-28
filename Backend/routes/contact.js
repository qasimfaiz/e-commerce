const router = require("express").Router();
const nodemailer = require("nodemailer");

// Handle form submission

router.post("/form", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("req.body:", req.body);

  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL, // your Gmail address
        pass: process.env.PASSWORD, // your Gmail password or app password
      },
    });

    // send mail with defined transport object
    let mailOptions = {
      from: `"ShopSwift-fyp" <${process.env.EMAIL}>`, // sender address
      to: [process.env.EMAIL], // recipient addresses
      subject: subject,
      html: `
        <h2>Contact Details:</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send form submission notification
    transporter.sendMail(mailOptions);
    console.log("Form submission email sent");

    // Prepare automated response to the sender
    let automatedMailOptions = {
      from: `"ShopSwift-fyp" <${process.env.EMAIL}>`, // sender address
      to: email, // recipient address is the submitter's email
      subject: "Thank you for your form submission",
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>We have received your message and will get back to you soon.</p>
      `,
    };

    // Send automated response to the submitter
    await transporter.sendMail(automatedMailOptions);
    console.log("Automated response email sent");

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.log("Error Occurred:", error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
});

module.exports = router;
