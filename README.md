# Journal WebApp
## Overview
This online Journal lets you keep record of anything you want, whether it's quick little notes, lists of things you have to do, personal secrets/thoughts, or anything else that you find interesting enough to enter in.

Users can register and login. Users can name their Journal and create entries in their journals. You can also create pin a location on a map and make an entry based on that. Maybe you have a nice lunch somewhere, or found a shiny penny, or saw a cute dog.
((Thinking about implementing this but not sure yet: You can chose if you'd like your Journal posts to be private or public. Private means they'll only be seen by you, and public means anyone on the site will be able to view them. If you don't have an account, you'll only be able to view other people's jounral entries.))

Features will include things like text posts, the ability to create lists, uploading images (?), and more (maybe)!

Tell your Diary all the things you're too embarassed to tell your friends.
## Data Model
We'll store users, homepage and posts. (Data model subject to change depending on how well this works out.)
* users will have 1 homepage
* each homepage will list the user's posts
  * changes depending on if it's public/private
  
May have to add more documents like lists, etc.

First draft schema:

```javascript
// users
// * users have a username and password
// * users have a homepage
// * users may have posts or not
var User = new mongoose.Schema({
  // username, password provided by plugin
  homepage:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Homepage' }]
});

// homepage that shows the user's posts
// * includes title of journal (if user named it)
// * includes list of posts user has made
var Homepage = new mongoose.Schema({
  name: {type: String},
  posts: [Post]
});

// a post
var Post = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  title: {type: String, required: true},
  date: (type: Date, required: true),
  content: {type: String, required: true}
});
```

## Wireframes
/journal/my-journal - page for showing user's journal

/journal/my-journal/create - creating new entry

/journal/my-journal/slug - page for showing a specific post

/journal/my-journal/slug/edit - page to edit a specific post

## Site map
ADD MAP

## User stories

1. as a user, I can create a journal
2. as a user, I can create an entry in my journal
2. as a user, I can pin a location on a map and make a note
3. as a user, I can edit an entry in my journal
4. as a user, I can view the entries in my journal and recount memorable memories
5. as a user, I can view other people's entries (maybe)

## Research Topics

* (6 points) Integrate user authentication
    * passport for user authentication
* (2 points) Google Maps API (or another nifty map library)
    * access user's location to include in jounral entry (if they want)
    * using it as a map interface so that users can pin locations and make entries
    * set it to 2 points because integration probably won't be too hard
* (4 points) Unit testing - Mocha
    * only doing this in case previous topics aren't worth 8 points already


