const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
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



app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
