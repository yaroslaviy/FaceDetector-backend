const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const register = require('./controllers/register');
const signin = require('./controllers/signing');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
    client:'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});


app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {res.send('app is running')})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)} )

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=>{profile.handleProfile(req,res,db)})

app.put('/image', (req,res) => {image.handleImage(req,res,db)})

app.post('/imageurl', (req,res) => { image.handleAPI(req,res)})

app.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`)
})



/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/