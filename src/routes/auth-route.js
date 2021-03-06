const express = require('express');
const authRouter = express.Router();
const bodyParser = express.json();
const AuthService = require('../services/auth-service');

authRouter
    .route('/')
    .post(bodyParser, (req,res,next) => {
        // proces the login info sent in the request
        const { email, password } = req.body
        const loginUser = {
            email,
            password
        }

        //if missing either email or password, return a 401 response
        for (const [key,value] of Object.entries(loginUser))
            if ( value == null){
                res.statusMessage = `Missing '${key}' in request body`
                return res.status(401).end()
            }

        //check if this email is enrolled into the database
        const knexInstance = req.app.get('db')
        AuthService.getUserWithUserName(knexInstance, email)
            .then(user => {
                if (!user){
                    res.statusMessage = 'Incorrect email or password.'
                    return res.status(401).end()
                }

                //if email is found, verify the password
                return AuthService.comparePasswords(password, user.password)
                        .then(passwordsMatch => {
                            if (!passwordsMatch){
                                res.statusMessage = 'Incorrect email or password.'
                                return res.status(401).end();
                            }

                            const sub = user.email
                            const payload = { email: user.email }
                            res.send({
                                authToken: AuthService.createJwt(sub,payload)
                            })
                        })
                        .catch(next)
            })
            .catch(next)
})

module.exports = authRouter;