# Lab 18 - cfgram API w/ S3
This is a lab assignment in CF401 where we create an API that is used for uploading pictures to s3. It has routes for creating users, galleries, and pics. It also uses basic authentication and authorization, requiring a client to have a user in order create galleries or pics.

### Setup
- Clone this repo
- Run ```npm install``` in your terminal (make sure you're at the lab-steven filepath in the repo)
- Setup environment variables in a .env file for your PORT, MONGOD_URI, APP_SECRET, AWS_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY

### Methods and Routes
##### User
- ```POST /api/signup```        : requires *username*, *email*, and *password*. Returns Token.
- ```GET /api/signin```         : requires {<username>:<password>}. Returns Token.
##### Gallery
- ```POST /api/gallery```       : requires *name* and *desc*, and 'Authorization:Bearer <token>'. Returns the Gallery.
- ```GET /api/gallery/:id```    : requires *gallery id* in the url as a parameter and 'Authorization:Bearer <token>'. Returns the Gallery.
- ```PUT /api/gallery/:id```    : requires any updates to *name* or *desc* and 'Authorization:Bearer <token>'. Returns updated Gallery.
- ```DELETE /api/gallery/:id``` : requires *gallery id* in the url as a parameter and 'Authorization:Bearer <token>'. Returns 204 status response.
##### Pic
- ```POST /api/gallery/:id/pic```   : requires *gallery id* in the url as a parameter, *name*, *desc*, and image file. Also requires 'Authorization:Bearer <token>'. Returns created Pic.
- ```GET /api/pic/:id```            : requires *pic id* in the url as a parameter, and 'Authorization:Bearer <token>'. Returns Pic.
- ```DELETE /api/pic/:id```         : requires *pic id* in the url as a parameter, and 'Authorization:Bearer <token>'. Returns 204 status response.

### Scripts
- ```npm run lint```            : lints the code
- ```npm test```                : runs tests
- ```npm run debug```           : runs nodemon server with debug active
- ```npm start```               : runs server.
