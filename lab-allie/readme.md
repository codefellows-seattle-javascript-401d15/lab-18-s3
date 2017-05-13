## Bearer Auth Lab

This lab uses a Mongo database to allow a user to sign up with a password and email address, then sign back in using the same credentials. This lab also used Mongo to create a Gallery that can be referenced through the user's token. The gallery can be added, fetched, updated, or deleted. This lab also uses Mongo to create an image within a gallery that can be referenced by the gallery ID. A token was generated and can be used to retrieve the User's information. All of the shell commands utilize HTTPie.

### Users
In the command line, the following command can be used to create a new user through the POST method:

`http POST :3000/api/signup username=<username> email=<email> password=<password>`

The GET method can be used to retrieve the user's entry in Mongo using the following command: 

`http GET :3000/api/signin -a <username>:<password>`

### Galleries
In the command line, the following command can be used to create a new gallery through the POST method:

`http POST :3000/api/gallery  name=<picture name> desc=<description> 'Authorization:Bearer <token retrieved from user with GET method, above>'`

The GET method can be used to retrieve the gallery's entry in Mongo using the following command:

`http GET :3000/api/gallery/<galleryID> 'Authorization:Bearer <token retrieved from user with GET method, above>'`

The PUT method can be used to update the gallery's entry in Mongo using the following command:

`http PUT :3000/api/gallery/<galleryID> name=<new picture name> desc=<new description> 'Authorization:Bearer <token retrieved from user with GET method, above>'`

The DELETE method can be used to remove the gallery's entry in Mongo using the following command:

`http DELETE :3000/api/gallery/<galleryID> 'Authorization:Bearer <token retrieved from user with GET method, above>'`


### Images
The POST and DELETE methods were tested using Postman. The token retrieved from the user with the GET method can be used to add an image to the gallery. These images were also stored in Amazon Web Service's S3 Buckets.


### Dependencies
This lab uses the following dependencies:
* Dependencies: bcrypt, bluebird, body-parser, cors, crypto, debug, del, dotenv, express, http-errors, jsonwebtoken, mongoose, and morgan
* Install with the command line prompt of `npm install -S ` then the names of these dependencies separated by a space
* Developer Dependencies: chai, chai-http, coveralls, istanbul, mocha, mocha-lcov-reporter
* Install with the command line prompt of `npm install -D ` then the names of these developer dependencies separated by a space

This lab utilized the following scripts:
```  "scripts": {
    "test": "mocha",
    "start": "node server.js",
    "debug": "DEBUG=cfgram* nodemon server.js",
    "debug-test": "DEBUG=cfgram* mocha",
    "cover": "istanbul cover _mocha",
    "coveralls": "npm run cover -- --report lcovonly && cat ./coverage/lcov.info | coveralls"```