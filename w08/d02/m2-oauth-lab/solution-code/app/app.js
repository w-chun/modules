var express        = require('express');
var path           = require('path');
var logger         = require('morgan');
var bodyParser     = require('body-parser');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');
var expressSession = require('express-session');
var cookieParser   = require("cookie-parser");

// Mongoose Setup
mongoose.connect('mongodb://localhost:27017/facebook-authentication-app');

// Middleware
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Setting up the Passport Strategies
require("./config/passport")(passport)


// Home page
app.get('/', function(req, res){
  console.log(req)
  res.render('layout', {user: req.user});
});

// -> Facebook
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: "email" })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' })
);
// <- GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: "user" })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/', failureRedirect: '/' })
);

// Logout
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/")
});

app.listen(3000);
