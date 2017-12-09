const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

//Add Router
app.get('/articles/add', function(req, res){
    res.render('add-articles',{
        title: 'Add Articles'
    });
});
app.post('/articles/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
})

//fetch article post
app.get('/articles/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err);
        }else{
            res.render('article',{
                article:article
            })
        }
    })
})


app.listen('3000', function(){
    console.log('Server started....');
});