const Joi = require('joi');

const handleSignin = (req,res, db, bcrypt) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).required(),
        password: Joi.string().alphanum().required()
    })

    const {email, password} = req.body
    const {error} = registerSchema.validate(req.body);
    
    if(error)
        return res.status(400).json(error.details[0].message)
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
    .catch(err => res.status(400).json('Login failed, try again'))
}

module.exports =  {
    handleSignin: handleSignin
}