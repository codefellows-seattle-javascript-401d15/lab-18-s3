![cf](https://i.imgur.com/7v5ASc8.png) Lab 18 User Authorization
======

# About
This program allows users to store information regarding their `username`, `email`, and `password` using a Mongo Database. The program also allows users to create, update, retrieve, and delete gallery entries while validating their user information. The program utilizes REST principles to POST and GET to create and retrieve entries, given custom user input. This program runs in the user's terminal on `localhost:3000`.

# Directions for Modifying Database
1. First, `npm i` to download all resources onto the local machine.
2. In terminal, run files using `nodemon server`.
3. In a separate terminal tab, enter the following:

## Create User
4. To run POST or SIGNUP, type into command line:
`http POST :3000/api/signup username=<username> email=<email> password=<password>`
    * Example: `http POST :3000/api/signup username=abswhite email=abs@white.com password=1234`

5. To run GET or SIGNIN, type into command line: `http GET :3000/api/signin -a <username>:<password>`
    * Example: `http GET :3000/api/signin -a abswhite:1234`

* Improper requests will render a 'Bad Request' 400 status, or 404 status.

## Create Gallery
5. To run a POST, to create a new gallery image, type into command line: `http POST :3000/api/gallery  name=<picture name> desc=<description> 'Authorization:Bearer <authorization bearer code from User>'`
    * Example: `http POST :3000/api/gallery name=abswhite desc=selfie 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImJhNjdkMTBlOThhN2Y3MGIwNzc1MDAxYTE2MWVkZDdiNDJjNjg2OTZjZTFhZGQ2NjI4NWYyNmY0NWJiZDNlYWIiLCJpYXQiOjE0OTQ3MjA0NjR9.7UYJO4irxXjlxXEA0pNrWBWMUUafKu5H_6-xtO5XyBo'`

6. To run a GET, to retrieve a new gallery image, type into command line: `http GET :3000/api/gallery/<gallery image ID> 'Authorization:Bearer <authorization bearer code from User>'`
    * Example: `http GET :3000/api/gallery/59133f11e68bc0733cc86655 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijg4ODU5NDY1NGJlZjUyODNhNTFhOWIxZmQzNjE0MTBhNjFlNDI4MmE0NmEyNzZhMWMzZTk0ZWJiMDRhYjEzYTEiLCJpYXQiOjE0OTQ0MjkxMDV9.azi2L8XzRk1wfKwj2uvAUauY6DxkA8vfztmFGVoMqvs'`


7. To run a PUT, to update a new gallery image, type into command line:`http PUT :3000/api/gallery/<gallery image ID> name=<new picture name> desc=<new description> 'Authorization:Bearer <authorization bearer code from User>'`
    * Example: `http PUT :3000/api/gallery/59133f11e68bc0733cc86655 name=abigail desc=test 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijg4ODU5NDY1NGJlZjUyODNhNTFhOWIxZmQzNjE0MTBhNjFlNDI4MmE0NmEyNzZhMWMzZTk0ZWJiMDRhYjEzYTEiLCJpYXQiOjE0OTQ0MjkxMDV9.azi2L8XzRk1wfKwj2uvAUauY6DxkA8vfztmFGVoMqvs'`

8. To run a DELETE, to eliminate a new gallery image, type into command line: `http DELETE :3000/api/gallery/<gallery image ID> 'Authorization:Bearer <authorization bearer code from User>'`
    * Example: `http PUT :3000/api/gallery/59133f11e68bc0733cc86655 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijg4ODU5NDY1NGJlZjUyODNhNTFhOWIxZmQzNjE0MTBhNjFlNDI4MmE0NmEyNzZhMWMzZTk0ZWJiMDRhYjEzYTEiLCJpYXQiOjE0OTQ0MjkxMDV9.azi2L8XzRk1wfKwj2uvAUauY6DxkA8vfztmFGVoMqvs'`


# Directions for Accessing Database
1. Open Mongo Shell by entering `mongod --dbpath ./db` in the local machine terminal.
    * Verify shell by receiving localhost assignment in terminal window.
2. In a separate terminal tab, access Mongo environment by entering `mongo`.
2. After creating a db entry (see steps above), you can view the database by entering `show dbs`.
3. After verifying database creation in Step 2, you can enter the database environment by entering `use <database name>`.
4. To view database contents, enter `db.users.find()` in tab.
5. To delete database contents, enter `db.users.drop()`.

http -f POST :3000/api/gallery/<gallery id>/pic name=<image name> desc=<image description> image@~/<absolute path of image> 'Authorization:Bearer <user token>'
http -f POST :3000/api/gallery/59179ffa8aad7dde54f4d113/pic name=bruce desc=bruce+springsteen image@~/codefellows/401/labs/lab-18-s3/lab-abigail/pics/Bruce_Springsteen.jpg 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImJhNjdkMTBlOThhN2Y3MGIwNzc1MDAxYTE2MWVkZDdiNDJjNjg2OTZjZTFhZGQ2NjI4NWYyNmY0NWJiZDNlYWIiLCJpYXQiOjE0OTQ3MjA0NjR9.7UYJO4irxXjlxXEA0pNrWBWMUUafKu5H_6-xtO5XyBo'
