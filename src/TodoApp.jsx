// TodoApp.jsx
import { useState } from "react";
import "./TodoApp.css";

export default function TodoApp({ todos, fetchTodos, addTodoHandler, deleteTodoHandler }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ id: "", title: "", description: "" });
    console.log("TODOS:", todos);
    const addTodo = async () => {
        if (!form.id || !form.title) return;
        setLoading(true);
        await addTodoHandler(form);
        await fetchTodos();
        setForm({ id: "", title: "", description: "" });
        setLoading(false);
    };

    const deleteTodo = async (id) => {
        setLoading(true);
        await deleteTodoHandler(id);
        await fetchTodos();
        setLoading(false);
    };

    const fetchTodo = async () => {
        setLoading(true);
        await fetchTodos();
        setLoading(false);
    }

    return loading ? <div className="app"><h6>Loading...</h6></div> : (
        <div className="app">
            <div className="container">
                <h1>Todo Manager</h1>

                <div className="card">
                    <input
                        type="text"
                        placeholder="Todo ID"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <button onClick={() => addTodo(form)}>Add Todo</button>
                </div>
                <div>
                    <button title="Fetch Todos" onClick={() => fetchTodo()} >Fetch Todos</button>
                </div>
                <div className="todo-list">
                    {todos.map((todo) => (
                        <div className="todo-card" key={todo.id}>
                            <div>
                                <span className="todo-id">ID: {todo.id}</span>
                                <h2>{todo.title}</h2>
                                <p>{todo.description}</p>
                            </div>
                            <button className="delete" onClick={() => deleteTodo(todo.id)}>
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
