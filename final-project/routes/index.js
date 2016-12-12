var db = require('.././db');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var Post = mongoose.model('Post');
var User = mongoose.model('User');

var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
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
	if (req.user == null) {
		res.redirect('/');
	}
	else {
		res.render('create');
	}
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
		if (err){
			console.log(err);
		}
		res.redirect('/personal'); 
	}); 
}); 

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

router.get('/feed', function(req, res, next) {	

	Post.find({'public':true}, function(err, posts, count) {
		res.render( 'view', {'slug': posts.slug, 'posts': posts});
	});
});

router.get('/personal', function(req, res, next) {	
	if (req.user == null) {
		res.redirect('/');
	}
	else {
		var userID = req.user._id;
		console.log(userID,"userID");
		Post.find({'author' : ObjectId(userID)}, function(err, posts, count) {
			res.render( 'view', {'slug': posts.slug, 'posts': posts});
		});
	}
	
});

router.get('/view-posts/:slug', function(req, res, next) {
	Post.find({'slug' : req.params.slug}, function(err, post, count) {
		var canEdit = false;

		if (req.user !== undefined) {
			console.log("inside1");
			console.log("post[0].author",post[0].author);
			console.log("req.user._id",req.user._id);

			if (String (post[0].author) == String(req.user._id)) {
				console.log("inside");

				canEdit = true;
			}
		}
		var authorID = post[0].author;
		
		User.find({'_id':ObjectId(post[0].author)}, function(err, user, count) {
			res.render('viewone', {slug: post.slug,'user':user,'post': post, 'canEdit': canEdit});

		});
	});
});


router.get('/edit/:slug', function(req, res, next) {
	if (req.user == null) {
		res.redirect('/');
	}
	else {
		Post.find({'slug' : req.params.slug}, function(err, post, count) {
			if (req.user !== undefined) {
				console.log("inside1 edit");
				console.log("post[0].author",post[0].author);
				console.log("req.user._id",req.user._id);

				if (String (post[0].author) == String(req.user._id)) {
					console.log("inside edit");
					res.render('edit', {slug: post.slug,'post': post});
				}
				else {
					res.redirect('/feed');

				}
			}
		});
	}
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


router.get('/profile/', function(req, res, next) {
	if (req.user == null) {
		res.redirect('/');
	}
	else {
		var url = '/profile/' + req.user.username;
		res.redirect(url);
	}
});

router.get('/profile/:username', function(req, res, next) {
	if (req.user == null) {
		res.redirect('/');
	}
	else {
		
		var userID = req.user._id;
		var postsArr = [];
		Post.find({'author' : ObjectId(userID)}, function(err, posts, count) {

			var contentArr = posts.map(function(post) {
				return post.content;
			});

			if (contentArr.length !== 0) {

				var wordsInEach = contentArr.map(function(str) {
					return str.split(' ').length;
				});

				var totalWords = wordsInEach.reduce(function(a, b){ 
					return parseInt(a) + parseInt(b);
				});

				var charsInEach = contentArr.map(function(str) {
					return str.length;
				});

				var totalChars = charsInEach.reduce(function(a, b){ 
					return parseInt(a) + parseInt(b);
				});

				var moreThanTenWords = wordsInEach.filter(hasMoreThanTenWords);

				var numPostsTenWords = moreThanTenWords.length;

				function hasMoreThanTenWords(words) {
					return words >= 10;
				}

			}
			else {
				var totalWords = 0;
				var totalChars = 0;
				var numPostsTenWords = 0;
			}
			
			res.render('profile', {'user': req.user, 'totalWords':totalWords,
				'totalChars':totalChars,'numPostsTenWords':numPostsTenWords} );

		});

	} // else
});

router.get('/edit-profile', function(req, res, next) {
	if (req.user == null) {
		res.redirect('/');
	}
	else{
		res.render('edit-bio', {'user': req.user});
	}
});

router.post('/update-bio', function(req, res, next) {
	User.findOneAndUpdate({'_id':ObjectId(req.user._id)}, {
		$set: {
			bio: req.body.about, 
		}},function(err, posts, count) {
			var strURL = '/profile';
			res.redirect(strURL);
		});

});


module.exports = router;
