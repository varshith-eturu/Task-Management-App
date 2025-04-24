import React, { useState } from "react";

function Login({ setToken }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "register" : "login";
    const res = await fetch(`http://localhost:5001/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login Form">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <input
        aria-label="Username"
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        aria-label="Password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      <p>
        {isRegistering ? "Already have an account?" : "New user?"}{" "}
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </form>
  );
}

export default Login;
