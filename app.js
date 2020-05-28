const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express')
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

/* Stripe Public and Secret Keys*/

let Public_Key = process.env.PUBLICKEY;
let Secret_Key = process.env.SECRETKEY;

const stripe = require('stripe')(Secret_Key);
  
/* App set and App use */

app.use(express.static(path.join(__dirname, 'views')));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use('/fonts', express.static('fonts'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

/* Nodemailer configuration */

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD
  }
});


/* Routes*/

app.get('/', (req, res) => {
  res.render('shop');
});

/* Create customer in Stripe */

app.post('/payment', (req,res) =>{
   
    stripe.customers.create({         
            email: req.body.stripeEmail,
            name:req.body.stripeBillingName,
            card: req.body.stripeToken,    
          })
          .then((customer) =>{
            return stripe.charges.create({
              amount:6777,
              description: "Special Date Kit",
              currency: "cad",
              customer: customer.id
            });
          })
          .then((charge) => {
            res.render('payment');
            console.log(charge);

            let mailOptions = {
              from:'alexandrevelandia@gmail.com',
              to:'alejos13@hotmail.com',
              subject:'Congratulations! :)',
              html:'<h2>Email is working</h2><br>'
              +'Email: '+req.body.stripeEmail +'<br>'
              +'Name: '+req.body.stripeBillingName +'<br>'
          };
            transporter.sendMail(mailOptions, function(err,data){
                console.log('-> Email sent!');
            });
          })
          .catch((err) => {
              res.send(err)
              console.log("Stripe Error:", err);

              let mailOptions = {
                from:'alexandrevelandia@gmail.com',
                to:'alejos13@hotmail.com',
                subject:'Bad News :(',
                html:'<h2>Something is wrong with your card.</h2>'
            };

              transporter.sendMail(mailOptions, function(err,data){
                    console.log('Mail Error Sent');
                });
          });
    
});

/* Start listening on specified port */
app.listen(port, () => {
    console.info('Stripe APP listening on port', port)
});