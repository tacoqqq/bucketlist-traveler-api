const AuthService = require('../services/auth-service');

function requireAuth(req,res,next){
    const authToken = req.get('Authorization') || ''

    let bearerToken

    if (!authToken.toLowerCase().startsWith('bearer ')){
        res.statusMessage = 'Missing bearer token'
        return res.status(401).end();
    } 

    bearerToken = authToken.split(' ')[1]

    try {
        const payload = AuthService.verifyJwt(bearerToken)
        console.log(payload)
        const knexInstance = req.app.get('db')
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
        console.log('this is the error')
        res.statusMessage = 'Unauthorized request'
        res.status(401).end()
    }
}

module.exports = { requireAuth }