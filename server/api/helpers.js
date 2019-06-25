const path = require('path')
const winston = require('winston')
const User = require(path.join(__dirname, "/models/User.js"))

const genLogMessage = (path, req, additionalInfo) => {
    return `${req.ip} - ${req.method} ${path} ${JSON.stringify({...additionalInfo, user: req.session.userEmail})}`
}

module.exports = {
    async isAuthenticated(req, res, next) {
        if(req.session.userID){
            const user = await User.findById(req.session.userID)
            if(user && user._id == req.session.userID) {
                next()
            } else {
                const message = 'Not authorized'
                winston.warn(genLogMessage('/api/auth', req, {message}))
                res.status(400).json({message})
            }
        } else {
            const message = 'Not logged in'
            winston.warn(genLogMessage('/api/auth', req, {message}))
            res.status(400).json({message})
        }
    },
    genLogMessage
}