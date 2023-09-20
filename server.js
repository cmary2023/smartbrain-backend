const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');// Using npm package bcrypt to encrypt password
const cors = require('cors');
const knex = require('knex');// Using npm package knex to connect server with database

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({// db is an alias for database
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host: "dpg-ck4aba6ct0pc738lvplg-a.oregon-postgres.render.com",
    port:5432,
    user: "smartdb_pez7_user",
    password: "9S3prdrEDCGgC38SxueRZ6MqQKQ02NUy",
    database: "smartdb_pez7"
  }
})


const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!



app.post('/signin',(req,res) => {signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)}) 
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})
/*********** Overview ***********
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*********************************/

/********* Table Queries *********

> Users Table
CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);

> Login Table
CREATE TABLE login (
	id serial PRIMARY KEY,
	hash VARCHAR(100) NOT NULL,
	email text UNIQUE NOT NULL
);

*********************************/



app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
