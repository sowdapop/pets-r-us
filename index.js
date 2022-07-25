// Name: Kayla McDanel
// Date: 07/15/22
// Assignment: 8.2 Pets-R-Us Part 5
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
const fs = require('fs');

//Mongoose model imports
const User = require('./models/user');
const Appointment = require("./models/appointment");
const { db } = require('./models/user');


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

//Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
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
        moment: 'moment',
        users: 'users'
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
app.get('/login', (req, res) => {
  res.render('login', {csrfToken: req.csrfToken()})
  });


app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

app.post('/users', (req, res) => {
  console.log(`\n  CSRF protected value: ${req.body.userName}`);
  res.redirect('/login');
});

app.get('/', (req, res) => {
  res.render('index')
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function (req, res) {
});

//Logout Page
app.get("/logout", (req, res,) => {
  res.render('logout');
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

//Appointment Page
app.get("/appointment", (req, res) => {
  let servicesJsonFile = fs.readFileSync('./public/data/services.json');
  let services = JSON.parse(servicesJsonFile);
  res.render('appointment');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
  return next();
} else {
  res.redirect("index");
}
}


app.get('/data/services', async(req, res) => {
  let servicesJsonFile = fs.readFileSync('./public/data/services.json');
  let services = JSON.parse(servicesJsonFile);
  res.json(services);
})


//Profile Page
app.get("/profile", (req, res) => {
  res.render('profile');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
  return next();
} else {
  res.redirect("index");
}
}

app.post('/profile', (req, res) => {
  const newProfile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      appointment: req.body.appointment,
  };

  console.log(newProfile);

  res.redirect('/');
})

//Listen on Port 3000

app.listen(PORT, () => {
  console.log("Application started and listening on port" + PORT);
});