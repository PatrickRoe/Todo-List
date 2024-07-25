import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/todos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setTodos(data))
            .catch(error => console.error('Error fetching todos:', error));
    }, []);

    const addTodo = () => {
        fetch('http://localhost:5000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(newTodo => setTodos([...todos, newTodo]))
            .catch(error => console.error('Error adding todo:', error));
        setTitle('');
    };

    const updateTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedTodo => {
                setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
                setEditingId(null);
            })
            .catch(error => console.error('Error updating todo:', error));
        setTitle('');
    };

    const deleteTodo = (id) => {
        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => setTodos(todos.filter(todo => todo._id !== id)))
            .catch(error => console.error('Error deleting todo:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateTodo(editingId);
        } else {
            addTodo();
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task"
                />
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        <span onClick={() => {
                            setTitle(todo.title);
                            setEditingId(todo._id);
                        }}>{todo.title}</span>
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
