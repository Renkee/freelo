const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
const User = require(path.join(__dirname, "/models/User.js"))
const {genLogMessage} = require(path.join(__dirname, "/helpers.js"))
const winston = require('winston')

const router = express.Router()

//const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const { RateLimiterMongo  } = require('rate-limiter-flexible');



const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 5;

const limiterSlowBruteByIP = new RateLimiterMongo ({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo ({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60,
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;



router.post('/login', async (req, res) => {
    let {email, password} = req.body;
    const ipAddr = req.ip;
    const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr);

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
        limiterSlowBruteByIP.get(ipAddr),
    ]);

    let retrySecs = 0;
    let remainingTriesForResponse = maxConsecutiveFailsByUsernameAndIP;

    // Check if IP or Username + IP is already blocked
    if (resSlowByIP !== null && resSlowByIP.remainingPoints <= 0) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resUsernameAndIP !== null && resUsernameAndIP.remainingPoints <= 0) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if(resUsernameAndIP !== null) {
        remainingTriesForResponse = resUsernameAndIP.remainingPoints
    }

    if (retrySecs > 0) {
        winston.warn(genLogMessage('/api/auth', req, {message: 'Too many requests', retrySecs}))
        return res.status(429).json({message: `Too many requests, try again after ${retrySecs} seconds`});
    }

    if(email && password) {
        try {
            const response = await User.find({email})
            const user = response[0];
            if(user && user._id) {
                if(await bcrypt.compare(password, user.password)) {
                    req.session.userID = user._id
                    req.session.userEmail = user.email

                    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
                        // Reset on successful authorisation
                        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
                    }

                    winston.info(genLogMessage('/api/auth', req, {message: 'User successfully logged in'}))
                    res.status(200).json({id: req.session.userID, email})
                } else {

                    await limiterSlowBruteByIP.consume(ipAddr)
                    await limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
                    winston.warn(genLogMessage('/api/auth', req, {message: 'Wrong password', remainingTriesForResponse}))
                    res.status(401).json({message: `Wrong email or password, remaining tries: ${remainingTriesForResponse}`}) // Wrong password
                }
            } else {

                await limiterSlowBruteByIP.consume(ipAddr)
                await limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
                winston.warn(genLogMessage('/api/auth', req, {message: 'Wrong email', remainingTriesForResponse}))
                res.status(401).json({ message: `Wrong email or password, remaining tries: ${remainingTriesForResponse}` }) // Wrong email
            }
        } catch(err) {
			winston.error(genLogMessage('/api/auth', req, {error: err}))
            res.status(500).json({message: 'Internal server error'})
        }
    } else {
        await limiterSlowBruteByIP.consume(ipAddr)
        await limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
        const message = 'No email or password given'
        winston.warn(genLogMessage('/api/auth', req, {message}))
        res.status(400).json({message})
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
router.post('/logout', async (req, res) => {
    await req.session.destroy()
    res.status(200).json({message: 'Successfully logged out'})
})

module.exports = router