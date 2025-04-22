# Gilbert´s Hotel  
### This is a project made for the course "Backend-utveckling NodeJs" at Företagsuniversitetet.

Frontend link: https://gilberts-hotel.vercel.app  
Backend API link: https://gilberts-hotel-673663b70f08.herokuapp.com/  

This project is made for the course "Backend-utveckling NodeJs" part of the Fullstack program at Företagsuniversitetet. The frontend is built with Vite + React + Typescript and is deployed on Vercel. The backend is made with Node.JS, Express.JS, Prisma Postgres and Redis. Socket.io is used for real time notifications and Winston is used for logging.

Type git clone https://github.com/Maje97/gilberts-hotel.git in your command prompter to download the repository. To run it locally you need to create an env-file in backend and provide:
- DATABASE_URL
- JWT_SECRET
- CLIENT_ORIGIN
- REDIS_URL  

You can either make accounts on prisma and redis or make docker containers as databases. If you want to use the frontend you need to change the URL´s for fetch requests.  

### Backend API
User routes  
Room routes  
Booking routes  