const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//const flash = require('connect-flash');
const session = require('express-session');

//Connect to mongodb
mongoose.connect('mongodb://localhost/blog');
let db = mongoose.connection;

//checking connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//checking error
db.on('error', function(err){
    console.log(err);
});

//connecting to server
const app = express();

//retrieve from model
let Article = require('./models/article');

//BodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//static file
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Express session middleware
app.use(session({
    secret : 'uawye78awdalbidts786123&*)*()*',
    resave: true,
    saveUninitialized: true
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//Home router
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title: 'Articles',
                articles: articles
            });
        }
    });
});

//Route articles
let articles = require('./routes/articles');
app.use('/articles', articles); 

app.listen('420', function(){
    console.log('Server started....');
});