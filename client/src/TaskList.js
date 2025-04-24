import React, { useEffect, useState } from "react";

function TaskList({ token, setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    const res = await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <input
        aria-label="New Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>
      <ul aria-label="Task List">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}{" "}
            <button onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>
              ❌
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        localStorage.removeItem("token");
        setToken("");
      }}>
        Logout
      </button>
    </div>
  );
}

export default TaskList;
