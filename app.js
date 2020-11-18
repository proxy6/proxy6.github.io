const express = require('express');
const ejs = require('ejs')
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
require('dotenv').config()
const app = express();

//set up view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//set up static folder
app.use(express.static(path.join(__dirname, 'public')))

//set up body parser
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/contact', (req, res) => {
    const output = `
<p>You have a new contact from your Portfolio</p>
<h3>Contact Details</h3>
<ul>
<li>First Name: ${req.body.fname}</li>
<li>Last Name: ${req.body.lname}</li>
<li>Email: ${req.body.email}</li>
<li>Phone Number: ${req.body.pnumber}</li>
<li>Date: ${new Date()}</li>
</ul>
<h3>Message:</h3>
<p>${req.body.message}</p>
`
    const userEmail = req.body.email;
    async function main() {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.HOST_USER,
                pass: process.env.HOST_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Progress Portfolio" <${process.env.EMAIL_SENDER}>`, // sender address
            to: "progresseze@gmail.com", // list of receivers
            subject: "Contact Info from your Portfolio", // Subject line
            // plain text body
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    main().catch(console.error);
    res.render('index')
})

const port = process.env.PORT || 3500
app.listen(port, () => {
    console.log('server started')
})
