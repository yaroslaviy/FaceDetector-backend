const Joi = require('joi');

const handleRegister = (req,res,db,bcrypt) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).required()
    })

    const {email, name , password} = req.body;

    const {error, value} = registerSchema.validate(req.body);
    
    if(error)
        return res.status(400).json(error.details[0].message)
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
    
};

module.exports =  {
    handleRegister: handleRegister
}