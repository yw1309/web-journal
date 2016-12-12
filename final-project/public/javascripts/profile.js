//profile.js

var db = require('../.././db');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

var postsArr = [];

document.addEventListener("DOMContentLoaded", function() {
	var bioDiv = document.getElementById("bio");
	var statsDiv = document.getElementById("stats");

	console.log("PROF JS")
	getPostsAsArr();
});


function getPostsAsArr () {
	console.log(req.user.posts);
}

// function 

