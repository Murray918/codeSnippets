// here is where we require all of the things we need for this project and set constents on functions to reduce typing
const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginMustache = require('./loginCreds/login.js');
const app = express();
const path = require('path');
const credentials = require('./loginCreds/login.js');
const mongoose = require('mongoose');
const loginProofer = credentials.loginProofer;
const loginCreator = credentials.loginCreator;
const CodeSchema = require('./models/model.js');
mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
// Replace "test" with your database name.
mongoose.connect('mongodb://localhost:27017/codeSnippet');

//this is alll
//bloiler plate
app.use('/public', express.static(path.join(__dirname, '/public')));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({
  extended: false
}));
//this is our sessions
//which keeps track of our users
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
//This is the login page section
//this is the interceptor
app.use(function(req, res, next) {
  console.log('in the interceptor');
  // this is where the login screen sends a cookie to authenticate the login page
  // if the url == login then render the login p
  console.log(req.url);
  if (req.url == '/login') {
    next()
  } else if (!req.session.login) {
    res.render('login')
  } else {
    next()
  }
})
//post for login page
app.post('/login', function(req, res) {
  console.log('Name is username:' + req.body.username);
  let username = req.body.username;
  console.log('Password is :' + req.body.password);
  let password = req.body.password;

  if (loginProofer(username, password)) {
    //this is part of the session object that if true takes you to the home page
    req.session.login = true;
    req.session.username = username;
    res.redirect('/');
  } else {
    //this will show an error if the username
    //and password are not sored in the array
    res.render('login', {
      error: 'Bad login'
    });
  }
});

//This is the Home page
//this will render the home page
app.get('/', function(req, res) {
  res.render('home')
})
// this recieves the information from the form
app.post('/', (req, res, next) => {
  const snip = req.body.snippetInput;
  // console.log(snip);
  const note = req.body.notes;
  // console.log(note);
  const tags = req.body.tags;
  // console.log(tags);
  const language = req.body.language;
  // console.log(language);
  const title = req.body.title;
  // console.log(title);
  const snippet = new CodeSchema({
    title: title,
    snippet: snip,
    tags: tags,
    notes: note,
    language: language
  })
  snippet.save()
    .then(function() {
      // console.log('saved' + snippet);
      return CodeSchema.find();
    }).then( (theSnippets) => {
      res.render('home', {
        theSnippets: theSnippets
      })
    })
})
//in this section our
app.listen(3000, function() {
  console.log('Successfully started express application!');
})

process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
