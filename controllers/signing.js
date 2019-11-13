const handleSignin = (req,res, db, bcrypt) => {
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
}

module.exports =  {
    handleSignin: handleSignin
}