module.exports = {
    isAuthenticated(req, res, next) {
        if(req.session.userID){
            next()
        } else {
            res.status(400).json({message: 'No user ID found'})
        }
    }
}