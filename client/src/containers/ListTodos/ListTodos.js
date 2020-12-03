import React, {Component} from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import EditTodo from '../../components/EditTodo/EditTodo';

class ListTodos extends Component {
    state = {
        todos: [],
        loading: true,
        description: '',
        error: ''
    }

    componentDidMount() {
        this.getTodos();
    }

    //get list of todo items
    getTodos = async() => {
        await fetch("/todos")
            .then(async (response) => {
                const jsonData = await response.json();
                await this.setState({
                    todos: [...jsonData],
                    loading: false
                });
            }).catch(err => console.error(err.message));
    }

    //delete todo function
    onDeleteTodo = async (id) => {
        await fetch(`/todos/${id}`, {
            method: "DELETE"
        }).then(async () => {
            //update state todos to all todos that don't have the deleted todo id
            await this.setState({todos: this.state.todos.filter(todo => todo.todo_id !== id)});
        }).catch (err => console.error(err.message));
    }

    //add todo function
    onSubmitEntry = async (e) => {
        e.preventDefault(); //don't want e to refresh
        //validate input
        if (this.state.description === '') return this.setState({error: 'Error: Input cannot be empty'});
        const body = {description: this.state.description};
        await fetch("/todos", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(() => {
                //refresh page
                window.location = "/";
            }).catch (err => console.error(err.message));
    }

    //edit description function
    onUpdateDescription = async(e, id) => {
        e.preventDefault();
        const body = {description: this.state.description};
        await fetch(`/todos/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(async () => {
            //refresh
            window.location = '/';
        }).catch (err => console.error(err.message));
    }

    //user starts typing
    onUpdateInput = (e) => {
        this.setState({
            description: e.target.value,
            error: ''
        });
    }

    render() {
    let error = (this.state.error !== '') ? <p style={{color: 'red'}}>{this.state.error}</p> : null;
        let todos = <Spinner/>;
        //if not loading, set todos to loaded list
        if(!this.state.loading) {
            todos = <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th className="text-center">Edit</th>
                        <th className="text-center">Delete</th>
                    </tr>
                </thead>
                <tbody> 
                    {this.state.todos.map(todo => (
                        <tr key={todo.todo_id}>
                            <td>{todo.description}</td>
                            <td className="text-center">
                                <EditTodo todo={todo}/>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-danger" onClick={() => this.onDeleteTodo(todo.todo_id)}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                </svg> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        };
        return(
            <div className="container">
                <h1 className="text-center mt-5">To Do List</h1>
                <form className="d-flex mt-3" onSubmit={this.onSubmitEntry}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter new to do item"
                        value={this.state.description}
                        onChange={this.onUpdateInput}
                    />
                    <button className="btn btn-primary ml-1">Add</button>
                </form>
                {error}
                {todos}   
            </div>
        );
    }
}

export default ListTodos;