# Authentication demo

Small web authentication demo project, showcasing:
- `express`
- `ejs` for HTML templating
- MongoDB for storing user data
- `mongoose` for creating a schema for the User model (and interfacing with a Mongo DB)
- `express-session` for saving user session in cookies
- `bcrypt` for password hashing

## Setup

(Mongo service needs to be running first)

```
npm install
node index.js
```

This will run the app at `http://localhost:3000/`.

## Endpoints

- `/register` create a user account
- `/login` log in if not already logged in
- `/secret` you can only access this page if logged in (you can also log out from here)

