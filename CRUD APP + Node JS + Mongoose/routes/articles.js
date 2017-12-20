const express = require('express');
const router = express.Router();


//Article models
let Article = require('../models/article');

//User models
let User = require('../models/user');

//Add Router
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add-articles',{
        title: 'Add Articles'
    });
});
router.post('/add', function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    //req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //checking the error
    let errors = req.validationErrors();
    if(errors){
        res.render('add-articles',{
            title: 'Add Article',
            errors: errors
        });
    }else{
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
    
        article.save(function(err){
            if(err){
                console.log(err);
            }else{
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        });
    }
});

//fetch article post
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            if(err){
                console.log(err);
            }else{
                res.render('article',{
                    article:article,
                    author: user.name,
                });
            }
        }); 
    });
});

//Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }
        res.render('edit-articles',{
            title: "Edit Article",
            article: article
        });
    });
});

//Submit edit form
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

//Delete route
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Article.findById(req.params._id, function(err, article){
        if(article.author != req.user._id){
            res.status(500).send();
        }else{
            Article.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

//access control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger', 'Please login');
        res.redirect('/user/login');
    }
}

module.exports = router;