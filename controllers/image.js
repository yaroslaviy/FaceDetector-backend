const Clarifai = require('clarifai');
const MY_KEY = require('../apikey');

const app = new Clarifai.App({apiKey: MY_KEY});

const handleAPI = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input);

}


const handleImage = (req,res,db) => {
    const { id } = req.body;
    db('users').where('id','=', id)
    .increment('entries', 1).returning('entries').then(entries => console.log(entries))
    .catch(err => res.status(400).json('unable to get entries'));
}
module.exports =  {
    handleImage,
    handleAPI
}
