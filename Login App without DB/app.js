var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');

var session;

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/assets', express.static(__dirname + '/assets/css'));
app.use(sessions({
    secret: '()*)(*^&%askjdauihe^&#!(&^&&*',
    resave: false,
    saveUninitialized: true
}))

app.get('/login', function(req, res){
    session = req.session;
    if(session.uniqueID){
        res.redirect('/redirects');
    }
    res.sendFile('/files/index.html', {root: __dirname});
});

app.post('/login', function(req, res){
    //res.end(JSON.stringify(req.body));
    session = req.session;
    if(session.uniqueID){
        res.redirect('/redirects');
    }
    session.uniqueID = req.body.username;
    res.redirect('/redirects');
});

app.get('/logout', function (req, res){
    req.session.destroy(); //delete session
    res.redirect('/login');
});

app.get('/admin', function(req, res){
    session = req.session;
    if(session.uniqueID != 'admin'){
        res.send('Unauthorized access. Please logout <a href="/logout"> Logout </a>');
    }else{
        res.send('I am the admin. <a href="/logout"> Logout </a>')
    }
});

app.get('/redirects', function(req, res){
    session = req.session;
    if(session.uniqueID){
        res.redirect('/admin');
    }else{
        res.send('Who the fuck are you. <a href="/logout"> Logout </a>');
    }
});

app.listen(1337, function(){
    console.log('The magic will happen in port 1337');
});