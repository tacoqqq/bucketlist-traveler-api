const app = require('../src/app');
const { STORE } = require('./store');
const supertest = require('supertest');

describe.skip(`todo router`, () => {
    it (`GET /api/todos responds 200 and all todos`, () => {
        return supertest(app)
                .get('/api/todos')
                .expect(200, STORE.Todos)
    })
})
