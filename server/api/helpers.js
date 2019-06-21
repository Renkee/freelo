const path = require('path')
const User = require(path.join(__dirname, "/models/User.js"))
module.exports = {
    async isAuthenticated(req, res, next) {
        if(req.session.userID){
            const user = await User.findById(req.session.userID)
            if(user && user._id == req.session.userID) {
                next()
            } else {
                res.status(400).json({message: 'Not authorized'})
            }
        } else {
            res.status(400).json({message: 'No user ID found'})
        }
    }
}