const { Router } = require ('express');
const controller = require('../controllers/user-controller');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const routes = Router();

//routes.get('/test', controller.getTest);
//routes.get('/books', controller.getBooks);

//TODO simplify json responses e.g. error and then error.text = the detail of the error

//routes.get("/messages", res.send("test")); //test message..

routes.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    //TODO add unique id to user starting with 0, count ascending (max(id)+1), useful if a connection with books assigned to an account is required

    let userInDb = await User.findOne({email: req.body.email})
    if (!userInDb){
        console.log("user not known add to DB");
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        const result = await user.save()
        const {password, ...data} = await result.toJSON()
        res.send(data)
    } else{
        console.log("user already known, send error...");
        res.send("user already known..."); //TODO like in row 11, generic error json with reason text...
    }


})

routes.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    const token = jwt.sign({_id: user._id}, "secret")
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
})

routes.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({_id: claims._id})

        const {password, ...data} = await user.toJSON()

        res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

routes.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
})

module.exports = routes;