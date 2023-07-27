
  import nodemailer from 'nodemailer';
  import { Router } from 'express';
  const router = Router();



  const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
    auth: {
      user: 'ttradingjournal@gmail.com',
      pass: 'tradingJournal852216',
    },
  });


  router.post('/sendEmail', (req, res) => {
    const { to, subject, text } = req.body.data;
  
    const mailOptions = {
      from: 'ttradingjournal@gmail.com',
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
        res.send('Email sent successfully');
      }
    });
  });
  

  
  export default router;