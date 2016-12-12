// db.js

var mongoose = require('mongoose'), 
URLSlugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  // username: {type: String},
  // password: {type: String}
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  bio : { type: String, default: "Welcome to my profile!" },
});

var Post = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  // author: [User],
  title: {type: String, required: true},
  date: {type: Date, default: Date.now},
  content: {type: String, required: true},
  public: {type: Boolean, default: false},
  // comments: [Comment],
  edited: {type: String, default: ""},
});



User.plugin(passportLocalMongoose);
// User.plugin(URLSlugs('username'));
Post.plugin(URLSlugs('title'));

mongoose.model('Post', Post);
mongoose.model('User', User);
// mongoose.model('Bio', Bio);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/final';
}

mongoose.connect(dbconf);

// mongoose.connect('mongodb://localhost/final');
