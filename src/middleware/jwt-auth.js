const AuthService = require('../services/auth-service');

function requireAuth(req,res,next){
    const authToken = req.get('Authorization') || ''

    let bearerToken
    
    //check if the request is sent with 'bearer' token
    if (!authToken.toLowerCase().startsWith('bearer ')){
        res.statusMessage = 'Missing bearer token'
        return res.status(401).end();
    } 

    //get the actual bearer token
    bearerToken = authToken.split(' ')[1]

    try {
        //verify if the token sent match the jwt by comparing payload by using try-catch 
        const payload = AuthService.verifyJwt(bearerToken)
        const knexInstance = req.app.get('db')

        //if it passes the verification, pass it down to the requested endpoint
        AuthService.getUserWithUserName(knexInstance,payload.sub)
            .then(user => {
                if (!user){
                    res.statusMessage = 'Unauthorized request'
                    return res.status(401).end()
                }
                req.user = user
                next()
            })
            .catch(next)
    } catch(error) {
        res.statusMessage = 'Unauthorized request'
        res.status(401).end()
    }
}

module.exports = { requireAuth }