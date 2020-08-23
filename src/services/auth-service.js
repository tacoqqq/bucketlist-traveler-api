const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')

const AuthService = {
    getUserWithUserName(knex,email){
        return knex('bucketlist_users')
                .where('email', email)
                .first()
    },

    comparePasswords(password,hash){
        return bcrypt.compare(password,hash)
    },

    //used when user requests to log in
    createJwt(subject,payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },

    //used when user request to access endpoints
    verifyJwt(token) {
        return jwt.verify(token,config.JWT_SECRET,{
            algorithms: ['HS256']
        })
    }
}

module.exports = AuthService