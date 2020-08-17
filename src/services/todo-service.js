const xss = require('xss')

const TodoService = {
    getAllTodos(knex,userId){
        return knex('bucketlist_todos')
            .select('*')
            .where('user_id', userId)
            .orderBy('id', 'desc')
    },

    getAllTodosFromOneDestination(knex,userId,destinationId){
        return knex('bucketlist_todos')
            .select('*')
            .orderBy('id', 'desc')
            .where('user_id', userId)
            .where('destination_id', destinationId)
    },

    getTodoByTodoId(knex,todoId){
        return knex('bucketlist_todos')
            .select('*')
            .where('id',todoId)
            .first()    
    },

    insertTodo(knex,newTodo){
        return knex('bucketlist_todos')
            .insert(newTodo)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteTodo(knex,todoId){
        return knex('bucketlist_todos')
            .where('id',todoId)
            .delete()
    },

    updateTodo(knex,todoId,updatedTodo){
        return knex('bucketlist_todos')
            .where('id', todoId)
            .update(updatedTodo)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    sanitizeTodo(todo){
        return {
            id: todo.id,
            user_id: todo.user_id,
            destination_id: todo.destination_id,
            content: xss(todo.content),
            checked_active: todo.checked_active,
            todo_created_time: todo.todo_created_time
        }
    }

}

module.exports = TodoService