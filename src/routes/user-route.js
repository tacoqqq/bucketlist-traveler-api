const express = require('express');
const DestinationService = require('../services/destination-service');
const userRouter = express.Router();
const UserService = require('../services/user-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const bodyParser = express.json();

userRouter
    .route('/')
    .get(requireAuth, (req,res,next) => {
        const { email } = req.user

        const knexInstance = req.app.get('db')
        UserService.hasUser(knexInstance,email)
            .then(response => {
                return res.status(200).json(response)
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post(bodyParser, (req,res,next) => {
        const { email, password } = req.body
        const newUserInfo = {
            email,
            password
        }

        //check if missing any of the necessary fields
        for (const [key,value] of Object.entries(newUserInfo))
            if (!value){
                res.statusMessage = `Missing ${key} in the request body!`
                return res.status(400).end()
            }

        //check the password see if it passes the validation. if not, return error.
        const passwordError = UserService.validatePassword(password)
        
        if (passwordError){
            res.statusMessage = passwordError
            res.status(400).end()
        }

        //check if the email has already been taken. if yes, return error.
        const knexInstance = req.app.get('db')

        UserService.hasUserWithEmail(knexInstance,email)
            .then(hasEmail => {
                if (hasEmail){
                    res.statusMessage = 'This email has already been registered.'
                    return res.status(400).end()
                }

                //if email is unique, continue to finish registration. 
                //hash the password. bcrypt returns a promise.
                return UserService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUserInfoWithHashedPassword = {
                            email,
                            password: hashedPassword
                        }
                        //insert new user info into the database with hashed password.
                        return UserService.insertNewUser(knexInstance, newUserInfoWithHashedPassword)
                            .then(insertedUser => {
                                res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${insertedUser.userId}`))
                                .json(UserService.sanitizeUserInfo(insertedUser))
                            })
                            .catch(next)
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = userRouter