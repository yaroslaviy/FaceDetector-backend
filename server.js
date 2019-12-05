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
        host : '127.0.0.1',
        user : 'postgres',
        password : 'admin',
        database: 'facedetector'
    }
});


app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {res.send(database.users)})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)} )

app.post('/register', (req,res) => {register.handleRequest(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=>{profile.handleProfile(req,res,db)})

app.put('/image', (req,res) => {image.handleImage(req,res,db)})

app.post('/imageurl', (req,res) => { image.handleAPI(req,res)})

app.listen(3000, ()=>{
    console.log('listening on port 3000')
})



/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/