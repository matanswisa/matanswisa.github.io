
import nodemailer from 'nodemailer';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagePath = path.join(__dirname, 'logo.png');

// Check if the file exists before proceeding
fs.access(imagePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Image file not found:', err);
    return;
  }

  // Proceed with sending the email
  // ... Your email sending code here
});


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
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, 'logo.png'), // logo need to by the terms : "Terms.png"
        cid: 'tradeexalt_logo',
      },
      {
        filename: 'terms.png',
        path: path.join(__dirname, 'terms.png'), // path to the Terms image
        cid: 'terms_image',
      },
    ],
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