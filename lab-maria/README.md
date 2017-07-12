#About
Small Node.js App for Codefellows Coding Bootcamp.

Sign up to account that almost does something using MongoDB.

##Installation:
1. clone this repository and ``cd`` into it
2. run ``npm i``

## To Use:
1. Start the server using ``npm start`` in one terminal
2. In another, you'll need to spin up the mongo database server
  ⋅⋅⋅ * Ensure there is a directory named 'db' in your cloned repository
  ⋅⋅⋅ * In your terminal, enter ``mongod --dbpath ./db``
  ⋅⋅⋅ ⋅⋅⋅ Should you come into the 'address in use' error, ``sudo killall mongod`` should do it.
3. 2. In yet another terminal, use [HTTPie][https://httpie.org/] to perform the following CRUD operations:

##User Routes:
POST: /api/user
GET: /api/user
A token is included in the response of both of these routes
#Gallery Creation:
*Note that a user must exist before a gallery can be created*
POST: /api/gallery
GET: /api/gallery/:id
PUT: /api/gallery/:id
DELETE: /api/gallery/:id
#Pic Creation
POST: /api/gallery/:galleryID/pic
GET: /api/pic/:picID
DELETE: /api/pic/:picID
