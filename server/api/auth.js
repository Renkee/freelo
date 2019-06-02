const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const User = require(path.join(__dirname, "/models/User.js"))
const router = express.Router()

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);


router.post('/login', async (req, res) => {
    let {email, password} = req.body;

    if(email && password) {
        let user = await User.find({email})

        if(user.length > 0 && user[0]._id) {
            bcrypt.compare(password, user[0].password).then((match) => {
                if(match) {
                    req.session.userID = user[0]._id
                    res.status(200).json({id: req.session.userID})
                } else {
                    res.status(401).json({message: 'Wrong email or password'})
                }
            }).catch((err) => {
                console.log(err)
            })
        } else {
            res.status(401).json({ message: 'Wrong email or password' })
        }
    } else {
        res.status(400).json({message: 'No email or password given'})
    }
})
/*
router.post('/register', async (req, res) => {
    let {email, password} = req.body;

    if(email && password) {
        let possibleUser = await User.find({email})

        if(possibleUser.length === 0) {
            let newUser = new User()

            newUser.email = email
            bcrypt.hash(password, saltRounds).then((hashedPassword) => {
                newUser.password = hashedPassword
                newUser.save()
                res.status(200).json({message: 'User successfully registered'})
            }).catch((err) => {
                console.log(err)
            })
        } else {
            res.status(401).json({message: 'Email is already in use'})
        }
    } else {
        res.status(400).json({message: 'No email or password given'})
    }
})
*/
router.post('/logout', (req, res) => {
    req.session.userID = null
    res.status(200).json({message: 'Successfully logged out'})
})

module.exports = router