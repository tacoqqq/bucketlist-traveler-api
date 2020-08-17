const express = require('express');
const todoRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const TodoService = require('../services/todo-service');
const path = require('path');

todoRouter
    .route('/')
    .all(requireAuth)
    .get((req,res,next) => {
        const user_id = req.user.id
        const knexInstance = req.app.get('db')

        TodoService.getAllTodos(knexInstance,user_id)
            .then(response => {
                if (!response){
                    return res.status(400).json({
                        error: `Cannot find any matching records.`
                    })
                }
                return res.status(200).json(response)
            })
            .catch(next)
    })
    .post(bodyParser,(req,res,next) => {
        const user_id = req.user.id
        const knexInstance = req.app.get('db') 
        const { destination_id, content } = req.body
        
        const newTodo = {user_id, destination_id, content}
        for (const [key,value] of Object.entries(newTodo)){
            if (!value){
                return res.status(400).json({
                    error: `Missing ${key} in the request body!`
                })
            }
        }

        TodoService.insertTodo(knexInstance,newTodo)
            .then(insertedTodo => {
                return res
                        .status(201)
                        .location(path.posix.join(req.originalUrl,`/${insertedTodo.id}`))
                        .json(TodoService.sanitizeTodo(insertedTodo))

            })
            .catch(next)
    })


todoRouter
    .route('/:destinationId')    
    .all(requireAuth, (req,res,next) => {
        const user_id = req.user.id
        const destination_id = Number(req.params.destinationId)
        TodoService.getAllTodosFromOneDestination(
            req.app.get('db'),
            user_id,
            destination_id
            )
            .then(response => {
                if (!response) {
                    res.statusMessage = 'Bad request: cannot find todos of this destination!'
                    return res.status(404).end()
                }
                res.todos = response
                next();
            })
            .catch(next)
    })
    .get((req,res,next) => {
        res.json(res.todos)
    })


todoRouter
    .route('/:destinationId/:todoId') 
    .all(requireAuth, (req,res,next) => {
        const todo_id = Number(req.params.todoId)
        TodoService.getTodoByTodoId(
            req.app.get('db'),
            todo_id
            )
            .then(response => {
                if (!response) {
                    return res.status(404).json({error: 'Bad request: cannot find this video!'})
                }
                res.todo = response
                next();
            })
            .catch(next)
    })
    .get((req,res,next) => {
        res.json(res.todos)
    })
    .delete((req,res,next) => {
        const knexInstance = req.app.get('db')
        const todo_id = res.todo.id
        TodoService.deleteTodo(knexInstance, todo_id)
            .then(response => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req,res,next) => {
        const knexInstance = req.app.get('db')
        const todo_id = res.todo.id  
        const {content, user_id, destination_id, checked_active} = req.body

        const updatedTodo = {
            content,
            user_id,
            destination_id,
            todo_created_time: new Date(),
            checked_active
        }

        for (const [key,value] of Object.entries(updatedTodo)){
            if (value == undefined){
                return res.status(400).json({
                    error: `Missing ${key} in the request body!`
                })
            }
        }

        TodoService.updateTodo(knexInstance, todo_id, updatedTodo)
            .then(updatedTodo => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${updatedTodo.id}`))
                    .json(updatedTodo)
            })
            .catch(next)
    })



module.exports = todoRouter