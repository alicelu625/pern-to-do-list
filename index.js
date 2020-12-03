const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path'); //alows working with directory paths

const app = express();

/*MIDDLEWARE*/
app.use(cors()); //allow different domains on server to interact with each other
app.use(express.json()); //enable get json data from request body

if(process.env.NODE_ENV === 'production') {
    //serve static content from a specified directory (join root with client/build)
    app.use(express.static(path.join(__dirname, 'client/build')));
}

/*LISTENER*/
//env variable for port if set, otherwise, use 5000
const PORT = process.env.PORT || 5000;
//listen on port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});

/*ROUTES*/

//create a todo
app.post('/todos', async(req, res) => {
    try {
        const {description} = req.body;
        //query to insert todo
        const newTodo = await pool.query(
            //RETURNING * - returns data
            "INSERT INTO todo (description) VALUES($1) RETURNING * ",
            [description] //into $1
        );
        //return inserted todo
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all todos
app.get('/todos', async (req, res) => {
    try {
        //query to get all todos
        const allTodos = await pool.query("SELECT * FROM todo");
        //return all todos from query result
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        //query to get todo by with specified id
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        //return todo from query result
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        //query to update to do
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description, id]
        );
        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
            [id]  
        );
        res.json("To do was deleted");
    } catch (err) {
        console.log(err.message);
    }
});

//for any routes routes not defined
app.get("*", (req,res) => {
    //point to index.html page
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});