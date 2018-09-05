
// Basic authentication middleware
exports.isAuthenticated = function (req, res, next) {

   

    if (req.method === 'OPTIONS') {
        next();
    } else {
        if (req.session.authenticated === false) {

            res.status(403)
            res.send('Not authorized')
            res.end();

        } else {
            next()
        }
    }
    

   
}