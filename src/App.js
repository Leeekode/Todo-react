import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    async function loadData() {
      const result = await axios({
        method: 'get',
        url: API_BASE + '/todos',
      });
      setTodos(result.data);
    }

    loadData();
  }, []);

  const completeTodo = async (id) => {
    const response = await axios({
      method: 'put',
      url: API_BASE + '/todo/complete/' + id,
    });
    const updatedTodos = response.data;

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === updatedTodos._id) {
          todo.complete = updatedTodos._id;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const response = await axios({
      method: 'delete',
      url: API_BASE + '/todo/delete/' + id,
    });
    const updatedTodos = response.data;
    setTodos((todos) => todos.filter((todo) => todo._id !== updatedTodos._id));
  };

  const addTodo = async () => {
    const response = await axios({
      method: 'Post',
      url: API_BASE + '/todo/new',
      data: {
        text: newTodo,
      },
    });
    const data = response.data;
    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo('');
  };
  return (
    <div className="App">
      <h1>ToDoList</h1>
      <h4>your task</h4>

      <div className="todos">
        {todos.map((item) => (
          <div
            className={'todo ' + (item.complete ? 'is-complete' : '')}
            key={item._id}
            onClick={() => completeTodo(item._id)}>
            <div className="checkbox"></div>

            <div className="text">{item.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(item._id)}>
              x
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={() => addTodo()}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
