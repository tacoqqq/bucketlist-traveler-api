const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')

const AuthService = {
    getUserWithUserName(knex,email){
        console.log('inside the auth service getting user name')
        return knex('bucketlist_users')
                .where('email', email)
                .first()
    },

    comparePasswords(password,hash){
        console.log('inside the auth service comparing passwords')
        return bcrypt.compare(password,hash)
    },

    createJwt(subject,payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },

    verifyJwt(token) {
        return jwt.verify(token,config.JWT_SECRET,{
            algorithms: ['HS256']
        })
    }
}

module.exports = AuthService