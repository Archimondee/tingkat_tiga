const express = require('express');
const router = express.Router();


//Article models
let Article = require('../models/article');

//Add Router
router.get('/add', function(req, res){
    res.render('add-articles',{
        title: 'Add Articles'
    });
});
router.post('/add', function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
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
        article.author = req.body.author;
        article.body = req.body.body;
    
        article.save(function(err){
            if(err){
                console.log(err);
            }else{
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        })
    }
});

//fetch article post
router.get('/:id', function(req, res){
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

//Load edit form
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit-articles',{
            title: "Edit Article",
            article: article
        })
    })
})

//Submit edit form
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    })

})

//Delete route
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

module.exports = router;