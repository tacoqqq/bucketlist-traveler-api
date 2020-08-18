const knex = require('knex')
const app = require('../src/app');
const { STORE } = require('./store');
const supertest = require('supertest');
const jwt = require('jsonwebtoken')


describe.only(`destination router`, () => {
    let db

    const testUser = STORE.Users[0]

    before('make knex instance', () => {
        console.log(process.env.TEST_DATABASE_URL)
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })


    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(
        `TRUNCATE
          bucketlist_users,
          bucketlist_destinations,
          bucketlist_todos
          RESTART IDENTITY CASCADE`
      ))

      afterEach('cleanup', () => db.raw(
        `TRUNCATE
          bucketlist_users,
          bucketlist_destinations,
          bucketlist_todos
          RESTART IDENTITY CASCADE`
      ))


    function makeAuthHeader(user){
        console.log(user)
        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            {
                subject: user.email,
                algorithm: 'HS256'
            }
        )
        console.log(token)
        return `bearer ${token}`
    }    

    describe(`GET /api/destinations`, () => {

        beforeEach('insert destinations', () => {
            return db('bucketlist_users')
              .insert(STORE.Users)
              .then( res => {
                  return db('bucketlist_destinations')
                    .insert(STORE.Destinations)
              })
        })

        it (`GET /api/destinations responds 200 and all destinations`, () => {
            return supertest(app)
                    .get('/api/destinations')
                    .set('Authorization', makeAuthHeader(testUser))
                    .expect(200, STORE.Destinations)
        })
    })
})
