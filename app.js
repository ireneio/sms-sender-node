const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs  = require('express-handlebars');
const text = require('textbelt')

text.debug(true)

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index')
})

let info = {
  numbers: '',
  message: '',
  title: '',
  sender: '',
  email: ''
}

function sendSms() {
  const { message, title, sender, email } = info
  const config = {
    fromAddr: 'keiko100396@gmail.com',
    fromName: sender,
    region:   'us',
    subject:  title
  }
  try {
    if(info.numbers !== '') {
      info.numbers.forEach(number => {
        text.sendText(number, message, config, function(res) {
          console.log('SMS Result: ' + res)
        })
      })
    }
    
  } catch(e) {
    console.log('SMS Error: ' + e)
  }
}

app.post('/sms', function(req, res) {
  info.numbers = req.body.numbers
  info.message = req.body.message
  info.title = req.body.title
  info.sender = req.body.sender
  info.email = req.body.email
  console.log('SMS Info: ')
  console.log(info)
  sendSms()
  res.sendStatus(200)
})

module.exports = {
  app
};
