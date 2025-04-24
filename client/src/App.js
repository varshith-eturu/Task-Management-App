import React, { useState, useEffect } from "react";
import Login from "./Login";
import TaskList from "./TaskList";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <main role="main" className="App">
      <h1>Secure Task Manager</h1>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <TaskList token={token} setToken={setToken} />
      )}
    </main>
  );
}

export default App;
