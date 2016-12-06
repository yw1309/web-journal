var db = require('.././db');
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
// var Homepage = mongoose.model('Homepage');

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("res.locals.user",res.locals.user);
	res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your username or password is incorrect.'});
    }
  })(req, res, next);
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid. Try picking a different username.'});
    } else {
    	console.log("reg user:",User.username,User.password)
    	console.log("reg user:",user.username,user.password)
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});



router.get('/new-post', function(req, res, next) {
	res.render('create');
});

router.post('/add-post', function(req, res, next) {
	console.log('req.user', req.user);
	var pub = false;
	if (req.body.check != undefined){
		var pub = true;
	}

	var newPost = new Post({
		title: req.body.title,
		location: req.body.location,
		content: req.body.content,
		public: pub,
		author: req.user,
	})

	newPost.save(function(err, post){
		console.log("newPost",newPost);
		if (err){
			console.log(err);
		}
		// res.redirect('/view-posts');
	});

	var currentUser = req.user;
	currentUser.posts.push(newPost);

	currentUser.save(function(err, post){
	// console.log(req.user);
		if (err){
			console.log(err);
		}
		res.redirect('/view-posts'); 
	}); 
}); 

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/view-posts', function(req, res, next) {	
	Post.find(function(err, posts, count) {
		res.render( 'view', {'slug': posts.slug, 'posts': posts});
	});
});

router.get('/view-posts/:slug', function(req, res, next) {
	Post.find({'slug' : req.params.slug}, function(err, post, count) {
		res.render('viewone', {slug: post.slug,'post': post});
	});
});


router.get('/edit/:slug', function(req, res, next) {
	Post.find({'slug' : req.params.slug}, function(err, post, count) {
		res.render('edit', {slug: post.slug,'post': post});
	});
});

router.post('/update/:slug', function(req, res, next) {
	var pub = false;
	if (req.body.check != undefined){
		var pub = true;
	}
	Post.findOneAndUpdate({'slug' : req.params.slug}, 
		{$set: {
			title: req.body.title, 
			location: req.body.location, 
			content: req.body.content,
			public: pub,
			edited: "edited",
		}},function(err, posts, count) {
			var strURL = '/view-posts/'+req.params.slug;
			res.redirect(strURL);
		});

});


module.exports = router;
