var db = require('.././db');
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Homepage = mongoose.model('Homepage');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


router.get('/new-post', function(req, res, next) {
	res.render('create');
});

router.post('/add-post', function(req, res, next) {
	new Post({
		title: req.body.title,
		location: req.body.location,
		content: req.body.content
	}).save(function(err, post){
		res.redirect('/view-posts');
	});

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
	Post.findOneAndUpdate({'slug' : req.params.slug}, 
		{$set: {title: req.body.title, location: req.body.location, 
			content: req.body.content}},
		function(err, posts, count) {

			var strURL = '/view-posts/'+req.params.slug;
			res.redirect(strURL);
		});

});


module.exports = router;
