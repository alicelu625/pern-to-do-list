import React, {Fragment, useState} from 'react';

const EditTodo = ({todo}) => {
    const [description, setDescription] = useState(todo.description);

    //edit description function
    const updateDescription = async(e) => {
        e.preventDefault();
        const body = {description};
        await fetch(`/todos/${todo.todo_id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(() => {
            //refresh
            window.location = '/';
        }).catch (err => console.error(err.message));
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#id${todo.todo_id}`}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg> Edit
            </button>
            <div className="modal" id={`id${todo.todo_id}`} onClick={() => setDescription(todo.description)}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Todo</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => setDescription(todo.description)}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <input type='text' className="form-control" value={description} onChange={e => setDescription(e.target.value)}/>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={e => updateDescription(e)}>Confirm</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setDescription(todo.description)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditTodo;