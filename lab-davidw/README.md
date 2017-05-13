# lab 17 bearer auth
----
## Goal
Add a gallery model, with a POST, PUT, GET, and DELETE routes to interact with it, and some tests.


## Setup

 - **make sure you have Node.js and MongoDB installed.**
```$ apt-get node```
```$ npm install mongoose```

 - **install the app**
```$ npm install ```

 - **start the server**
```$ npm run start```

 - **start the database**
```$ mongod --dbpath ./db```
 - **start the mongo interface**
```$ mongo```
```$ use cfgram-dev```


## Usage
###### User management
You can sign up and sign in with the following end points:
note: this is based on using 'HTTPie'
- Sign up:
    - http POST
        - http POST :3000/api/signup username=<UniqueUsername> password=<password> email=<UniqueEmail>
- Sign in:
    - http GET
        - http :3000/api/signin -a<username>:<password>

###### Gallery management
You can sign up and sign in with the following end points:
note: this is based on using 'HTTPie'
- Create Gallery:
    - http POST
        - http POST :3000/api/gallery username=<UniqueUsername> password=<password> email=<UniqueEmail>
- Get Gallery array:
    - http GET
        - http GET :3000/api/galllery/<galleryId> 'Authorization:Bearer <your token string here>'
- Update Gallery:
    - http PUT :3000/api/gallery/<galleryId> 'Authorization:Bearer <your token string here>'

- Delete Gallery:
    -http DELETE :3000/api/gallery/<galleryId> 'Authorization:Bearer <your token string here>'

- Test!
   - npm run test
   (mocha)

## Expected

##### EXAMPLE RESPONSES:

###### User Management:
- POST:
```
      HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 207
  Content-Type: application/json; charset=utf-8
  Date: <date> GMT
  ETag: W/"<etag>"
  X-Powered-By: Express

  "<you will receive a unique token string here>"
```

- GET:
```
      HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 207
  Content-Type: application/json; charset=utf-8
  Date: <date> GMT
  ETag: W/"<etag>"
  X-Powered-By: Express

  "<you will receive a unique token string here>"
```

###### Gallery Management:
- POST:
```
      HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 207
  Content-Type: application/json; charset=utf-8
  Date: <date> GMT
  ETag: W/"<etag>"
  X-Powered-By: Express
      {
      "__v": <num>,
      "name": "<name string>",
      "desc": "<desc string>",
      "userId": "<userId>",
      "_id": "<galleryId",
      "created": "<timestamp>"
      }
```

- GET:
```
      HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 207
  Content-Type: application/json; charset=utf-8
  Date: <date> GMT
  ETag: W/"<etag>"
  X-Powered-By: Express

  [<you will receive an array of objects contained in the Gallery>]
```

- DELETE
```
HTTP/1.1 204 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 207
  Content-Type: application/json; charset=utf-8
  Date: <date> GMT
  ETag: W/"<etag>"
  X-Powered-By: Express
```

### Attributions
I worked closely with Abigail White, Ali Grampa, David Teddy and, Steven Johnson.
JR Iriarte really helped me get through making my POST route work.  
