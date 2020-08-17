require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const destinationRouter = require('./routes/destination-route');
const userRouter = require('./routes/user-route');
const todoRouter = require('./routes/todo-route');
const authRouter = require('./routes/auth-route')


const app = express();

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting))
app.use(helmet());
app.use(cors());

app.get('/api/', (req,res) => {
    res.json({
        ok: true
    })
})

app.use('/api/destinations', destinationRouter)
app.use('/api/users', userRouter)
app.use('/api/todos', todoRouter)
app.use('/api/login', authRouter)

app.use((error,req,res,send)=> {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error!'}}
    } else {
        response = {error}
    }
    res.status(500).json(error)
})


module.exports = app;