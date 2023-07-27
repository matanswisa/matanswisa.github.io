
import nodemailer from 'nodemailer';
import { Router } from 'express';
const router = Router();



const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
  secure: false,
  auth: {
    user: 'tradeExalt@outlook.co.il',
    pass: 'trade1125462$#567',
  },
});


router.post('/sendEmail', (req, res) => {
  console.log(req.body);
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'tradeExalt@outlook.co.il',
    to,
    subject,
    text,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});



export default router;