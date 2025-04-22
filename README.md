# Gilbert´s Hotel  
## This is a project made for the course "Backend-utveckling NodeJs" at Företagsuniversitetet.

Frontend link: https://gilberts-hotel.vercel.app  
Backend API link: https://gilberts-hotel-167477665950.europe-north2.run.app/

This project is made for the course "Backend-utveckling NodeJs" part of the Fullstack program at Företagsuniversitetet. The frontend is built with Vite + React + Typescript and is deployed on Vercel. The backend is made with Node.JS, Express.JS, Prisma Postgres and Redis. Socket.io is used for real time notifications and Winston is used for logging.

Type git clone https://github.com/Maje97/gilberts-hotel.git in your command prompter to download the repository. To run it locally you need to create an env-file in backend and provide:
- DATABASE_URL
- JWT_SECRET
- CLIENT_ORIGIN
- REDIS_URL  

You can either make accounts on prisma and redis or make docker containers as databases. If you want to use the frontend you need to change the URL´s for fetch requests.  

### Backend API
#### User routes  
Register new user:  
POST /user  
req.body: { "username": string, "password": string }  

Login user:  
POST /user/login  
req.body: { "username": string, "password": string }  

Delete user:   
DELETE /user/{id}  
req.headers: { "Authorization": JWT token }   

#### Room routes  
Create a room:  
POST /room  
req.headers: { "Authorization": JWT token }  
req.body: { "image": string, "name": string, "capacity": number, "type": "SINGLE" || "DOUBLE" || "FAMILY" }  

Get all rooms:  
GET /room  
req.headers: { "Authorization": JWT token }  

Get a specific room:  
GET /room/{id}  
req.headers: { "Authorization": JWT token }  

Get booked dates for a specific room:  
GET /room/availability/{id}  
req.headers: { "Authorization": JWT token }  

Update a room:  
PATCH /room/{id}  
req.headers: { "Authorization": JWT token }  
req.body: { "image": string, "name": string, "capacity": number, "type": "SINGLE" || "DOUBLE" || "FAMILY" }  

Delete a room:  
DELETE /room/{id}  
req.headers: { "Authorization": JWT token }  

#### Booking routes  
Create a booking:  
POST /booking  
req.headers: { "Authorization": JWT token }  
req.body: { "room": number, "user": number, "startTime": Date, "endTime": Date }  

Get all bookings (admin get all, users get all their bookings):  
GET /booking  
req.headers: { "Authorization": JWT token }  

Get a specific booking:  
GET /booking/{id}  
req.headers: { "Authorization": JWT token }  

Edit a booking:  
PATCH /booking/{id}  
req.headers: { "Authorization": JWT token }  
req.body: { "room": number, "user": number, "startTime": Date, "endTime": Date }  

Delete a booking:  
DELETE /booking/{id}  
req.headers: { "Authorization": JWT token }  

