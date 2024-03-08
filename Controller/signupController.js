const userModel = require("../Model/userinfoModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs = require("fs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.techtutorpro.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@techtutorpro.com",
    pass: "RAIHANj10205060?",
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation
  },
});

const signupController = async (req, res, next) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const profile = req.file.path;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      profile,
    });

    const savedUser = await newUser.save();
    const htmlEmail = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333;
          }
          p {
            margin-bottom: 10px;
            line-height: 1.6;
          }
          ul {
            margin-bottom: 10px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to Our Website!</h2>
          <p>Dear ${lastName},</p>
          <p>Thank you for registering on our website. We are excited to have you as a member of our community.</p>
          <p>Here are some of the features you can enjoy:</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
          <p>Feel free to explore our website and let us know if you have any questions or feedback.</p>
          <p>Best regards,<br/>Your Website Team</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: "contact@techtutorpro.com",
      to: username,
      subject: "Thanks for signing up",
      html: htmlEmail,
    };

    await transporter.sendMail(mailOptions);

    // Sending response after email is sent successfully
    res.status(201).json({ message: savedUser });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = signupController;
