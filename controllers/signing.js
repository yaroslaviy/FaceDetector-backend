const handleSignin = (req,res, db, bcrypt) => {
    const {email, password} = req.body
    if(!email || !password)
        return res.status(400).json('incorrect frm submission')
    db.select('email', 'hash').where('email', '=', email).from('login').then(data =>{
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            db.select('*').where('email', '=', email).from('users').then(user => {
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