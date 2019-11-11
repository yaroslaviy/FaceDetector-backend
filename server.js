const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
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

const database = {
    users:[
        {
            id:'1',
            name:'John',
            email:'john@test.com',
            password:'cookies',
            entries:0,
            joined: new Date()
        },
        {
            id:'2',
            name:'Sally',
            email:'sally@test.com',
            password:'bananas',
            entries:0,
            joined: new Date()
        }
    ]
}
app.get('/', (req,res) => {
    res.send(database.users)
})

app.post('/signin', (req,res) => {
    db.select('email', 'hash').where('email', '=', req.body.email).from('login').then(data =>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            db.select('*').where('email', '=', req.body.email).from('users').then(user => {
                res.json(user[0]);
            }).catch(err => res.status(400).json('unable to get user'))
        }
        else {
            res.status(400).json('Wrong credentials');
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req,res) => {
    const {email, name , password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
        hash: hash,
        email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                res.json(user[0]);
            })
        }).then(trx.commit).catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'));
    
})

app.get('/profile/:id', (req,res)=>{
    const { id } = req.params;
    db.select('*').from('users').where({id: id}).then(user => {
        if(user.length)
        res.json(user[0])
        else res.status(400).json('Not Found')
    })
    .catch(err => res.status(400).json('Ooops, Something went wrong'));
})

app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users').where('id','=', id)
    .increment('entries', 1).returning('entries').then(entries => console.log(entries))
    .catch(err => res.status(400).json('unable to get entries'));
})

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