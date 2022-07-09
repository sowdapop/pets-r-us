// Name: Kayla McDanel
// Date: 07/02/22
// Assignment: 6.2 Pets-R-Us Part 3
// Description: Website using Node, Express, EJS, MongoDB, and Mongoose.

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const moment = require('moment');
const csurf = require('csurf');
const helmet = require('helmet');

//Mongoose model imports
const User = require('./models/user');
const { register } = require('./models/user');


const app = express();
const csurfProtection = csurf({ cookie: true });
const PORT = process.env.PORT || 3000;

//Connection to Mongo
var CONN = 'mongodb+srv://admin:water@buwebdev-cluster-1.fhrta.mongodb.net/web340DB?retryWrites=true&w=majority';

mongoose.connect(CONN).then(() => {
  console.log('Connection to MongoDB database was successful');
}).catch(err => {
  console.log('MongoDB Error: ' + err.message);
});

//Static Files
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/styles/site.css", express.static(__dirname + "public/styles/site.css"));



//HTML Routes

app.engine('.html', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set("views", "./views");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet.xssFilter());
app.use(cookieParser());
app.use(csurfProtection);

app.use(session({
  secret: 's3cret',
  resave: true,
  saveUninitialized: true
}));

//Mongo Connection
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("", (req, res) => {
  let errorMessage = '';

  let users = User.find({}, function (err, users) {
    if (err) {
      console.log(err);
      errorMessage = 'MongoDB Exception: ' + err;
    } else {
      errorMessage = null;
    }
  });
});

//Landing page
app.get("", (req, res) => {
  res.render('index');
});

//Home page
app.get("/index", (req, res) => {
  res.render('index');
});

//Grooming page
app.get("/grooming", (req, res) => {
  res.render('grooming');
});

//Boarding Page
app.get("/boarding", (req, res) => {
  res.render('boarding');
});

//Training Page
app.get("/training", (req, res) => {
  res.render('training');
});

//Registration page
app.get("/registration", (req, res) => {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('registration', {
        users: users
    })}
  });
 });

 app.post('/registration', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  User.register(new User({username: username, email: email}), password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect('/registration');
    }
    passport.authenticate("local")(
      req, res, function () {
        res.redirect('/registration')
      });
  });
 })

app.post('users', (req, res) => {
  const userName = req.body.userName;

  console.log(req.body);
  let user = new User ({
    name: userName
  })

  User.create(user, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    };
  });
})

//Login Page
app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

app.post('/users', (req, res) => {
  console.log(`\n  CSRF protected value: ${req.body.password}`);
  res.redirect('/login');
})

app.get('/login', (req, res) => {
  res.render('login')
  });

app.post("/login", passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/login"
}), function (req, res) {
});

//Logout Page
app.get("/logout", (req, res) => {
  res.render('logout');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/index');
});

//Listen on Port 3000

app.listen(PORT, () => {
  console.log("Application started and listening on port" + PORT);
});