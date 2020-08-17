const xss = require('xss')
const bcrypt = require('bcryptjs')

const UserService = {
    validatePassword(password){
        if (password.length < 8) {
            return 'Password must be longer than 8 characers.'
        }

        if (password.length > 72){
            return 'Password must be less than 72 characters.'
        }

        if (password.startsWith(' ') || password.endsWith(' ')){
            return 'Password must not start or end with empty spaces.'
        }
    },

    hasUserWithEmail(knex,email){
        return knex('bucketlist_users')
            .where('email', email)
            .first()
            .then(user => !!user) // convert the response to boolean balue
    },

    hasUser(knex,email){
        console.log('inside hasUser')
        return knex('bucketlist_users')
                .where('email', email)
                .first()
    },

    insertNewUser(knex,userInfo){
        return knex('bucketlist_users')
            .insert(userInfo)   
            .returning('*')  
            .then(rows => {
                return rows[0]
            })
    },

    sanitizeUserInfo(userInfo){
        return {
            id: userInfo.id,
            email: xss(userInfo.email),
            password: xss(userInfo.password),
            user_created_time: new Date(userInfo.user_created_time)
        }
    },

    hashPassword(password){
        return bcrypt.hash(password,12)
    }



}

module.exports = UserService