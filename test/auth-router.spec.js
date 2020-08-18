const knex = require('knex')
const app = require('../src/app')
const { STORE } = require('./store')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

describe('Auth endpoints', function(){
    let db
    const testUser = STORE.Users[0]
    console.log(testUser)
    before('make knex instance', () => {
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

      describe(`POST /api/login`, () => {
          beforeEach('insert users', () => {
              return db('bucketlist_users')
                .insert(STORE.Users)
          })
          
          console.log('hello')
          const requiredFields = ['email', 'password']

          requiredFields.forEach(field => {
              const loginAttemptBody = {
                email: testUser.email,
                password: testUser.password                  
              }

              it (`responds with 401 required error when ${field} is missing`, () => {
                  delete loginAttemptBody[field]

                  return supertest(app)
                            .post('/api/login')
                            .send(loginAttemptBody)
                            .expect(401)
              })
          })

          it (`responds with 401 required error when bad username or password`, () => {
            const invalidUser = {
                email: 'invalid@gmail.com',
                password: 'invalidpassword'
            }
            return supertest(app)
                      .post('/api/login')
                      .send(invalidUser)
                      .expect(401)
        })

        it (`responds with 401 required error when valid username but invalid password`, () => {
            const invalidPassword = {
                email: testUser.email,
                password: 'invalidpassword'
            }
            return supertest(app)
                      .post('/api/login')
                      .send(invalidPassword)
                      .expect(401)
        })

        it (`responds 200 and JWT auth token using secret when valid credentials`, () => {
            const userValidCredentials = {
                email: testUser.email,
                password: 'hellohello'
            }
            console.log(userValidCredentials)

            const expectedToken = jwt.sign(
                { email: testUser.email }, //payload
                process.env.JWT_SECRET,  //secret
                {
                    subject: testUser.email,
                    algorithm: 'HS256'
                } // option
            )
            console.log(expectedToken)
            console.log(process.env.JWT_SECRET)
            return supertest(app)
                    .post('/api/login')
                    .send(userValidCredentials)
                    .expect(200, {
                        authToken: expectedToken
                })
        })


    })

})