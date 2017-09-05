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
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
//this connects to the mongo databse.
mongoose.connect('mongodb://localhost:27017/codeSnippet');

//this is all bloiler plate it lets us connect our doccuments with mustache and also lets us create a path for our public
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
app.use((req, res, next) => {
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
//this first post is for the users who already have a
//user name and password
app.post('/login', (req, res, next) => {
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


//this post creates a username and password for new users
app.post('/createLogin', (req, res, next) => {
  console.log('Name is username:' + req.body.username);
  let userCreate = req.body.username;
  console.log('Password is :' + req.body.password);
  let passCreate = req.body.password;

  if (loginCreator(userCreate, passCreate)) {
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
app.get('/', (req, res, next) => {
  res.render('home')
})
// this recieves the information from the form the post so that we can use it to save the snippet
app.post('/', (req, res, next) => {
  const snip = req.body.snippetInput;
  // console.log(snip);
  const note = req.body.notes;
  // console.log(note);
  const tags = req.body.tags.split(' ');
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

//this actually saves the snippet
  snippet.save()
    .then(() => {
      console.log('saved' + snippet);
      return CodeSchema.find();
    }).then((theSnippets) => {
      res.render('home', {
        theSnippets: theSnippets
      })
    })
});


//this shows all of the snippets so that it is easier to work with the data
app.get('/showall/', (req, res, next) => {
  req.session.login = true;
  CodeSchema.find()
  .then((viewSnippets) => {
    res.render('home', {
      viewSnippets: viewSnippets
    })
    // res.redirect('/')
  })
});

//this will take us to the update page with the update form
app.get('/update/:id', (req, res, next) => {
  let id = req.params.id;
  CodeSchema.findOne({
      _id: new ObjectId(id)
    })
    .then((update) => {
      res.render('update', {
        snipToUpdate: update
      })
    })
});

//this will use a post to update the code snippet
app.post('/update/:id', (req, res, next) => {
  let id = req.params.id
  let newSnip = req.body.upSnip
  let newTitle = req.body.upTitle
  let tags = req.body.upTags
  const newTags = tags.split(' ');
  let newLanguage = req.body.upLanguage
  let newNotes = req.body.upNotes
  // console.log('here in the post');
  CodeSchema.updateOne({
      _id: new ObjectId(id)
    }, {
      title: newTitle,
      snip: newSnip,
      tags: newTags,
      notes: newNotes,
      language: newLanguage
    })
    .then((theSnippets) => {
      res.render('home', {
        theSnippets: theSnippets
      })
    })
});

//this post will let us delete a snippet
app.post('/delete/:id', (req, res, next) => {
  let id = req.params.id;
  CodeSchema.deleteOne({
      _id: new ObjectId(id)
    })
    .then(() => {
     CodeSchema.find()
    })
    .then((theSnippets) => {
      res.render('home', {
        theSnippets: theSnippets
      })
    })
})

//this will let us search for snippets based on the tags
app.post('/searchtags', (req, res, next) => {
  let tagsToSearch = req.body.searchtags
  // console.log(CodeSchema.find());
  console.log(tagsToSearch);
  CodeSchema.find({
    tags: tagsToSearch
  }).then((searchSnippets) => {
    console.log(searchSnippets);
    res.render('search', {
      searchSnippets: searchSnippets
    })
    // res.redirect('/')
  })
})

//in this section we connect to port 3000 to connect with the server
app.listen(3000, () => {
  console.log('Successfully started express application!');
})

// this sectnion of the code will shut down mongoose
process.on('SIGINT', () => {
  console.log("\nshutting down");
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
