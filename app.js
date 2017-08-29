const express = require('express');
const mustache = require('mustache');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginMustache = require('./loginCreds/login.js');
const app = express();
var path = require('path');
const credintials = require('./loginCreds/login.js');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const loginProofer = credintials.loginProofer;

app.use(bodyParser.urlencoded({
  extended: false
}));


app.use('/views',express.static(path.join(__dirname, '/views')));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
      console.log('in the interceptor');
      // this is where the login screen sends a cookie to authenticate the login page
      // if the
      // console.log(req.session.login);
      // console.log(req.session);
      // console.log(req);
      console.log(req.url);
      if (req.url == '/login') {
        next()
      } else if (!req.session.login) {
          res.render('login')
        } else {
        next()
      }
      })

      app.post('/login', function(req, res) {
        console.log('Name is username:' + req.body.username);
        let username = req.body.username;
        console.log('Password is :' + req.body.password);
        let password = req.body.password;

        if (loginProofer(username, password)) {
          req.session.login = true;
          req.session.username = username;
          res.redirect('/');
        } else {

          res.render('login', {
            error: 'Bad login'
          });
        }
      });

    app.get('/', function(req, res) {
      res.render('home')
    })


    app.listen(3000, function() {
      console.log('Successfully started express application!');
    })
