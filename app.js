// import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // for environment variables 

// initialize Express app
const app = express();

// middleware: serve static files
app.use(express.static('public')); // serve HTML, CSS, and image files from the 'public' folder

// middleware: parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// route for form submissions
app.post('/submit', (req, res) => {  // /submit route: receives form data from client-side
    const { name, email, message } = req.body; // get form data 

    // nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    // email 
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // email address receives form submission
        subject: `New Form Submission from ${name}`,
        text: `You have a new form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) { // if email was not successfully sent
            console.error('Error sending email:', error);
            return res.status(500).send('An error occurred. Try again.');
        }
        console.log('Email sent:', info.response); 
        res.status(200).send('Your message was sent!'); // if email sent successfully
    });
});

// starts the Express server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
