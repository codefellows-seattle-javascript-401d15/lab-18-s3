# Goal:
* Create Multiple users
  * Create galleries that are joined to a user with a matching id
  * Generate a unique token for each user
  * Use the proper username and password combination to sign in a user
* Verify each gallery interaction with a token to make sure that only a user with the proper token can access a gallery
  * Use a user's unique token to approve each action taken by a user
* Post pictures to AWS S3 buckets through the app.

## Installation:
1. Fork the repository
2. Run ```npm i``` to install dependencies

## Mongo Setup:
1. Create a directory for the database `db`
2. Run `mongod --dbpath ./db` in the terminal


## Routes:

### User Creation:
* POST: ```/api/signup```
* GET: ```/api/signin```


### Gallery Creation:
* POST: ```/api/gallery```
* GET ```/api/gallery/galleryid```
* PUT ```/api/gallery/galleryid```
* DELETE ```/api/gallery/galleryid```

### Picture Creation:
* POST: ```/api/picture/galleryid```
* DELETE ```/api/picture/pictureid```
