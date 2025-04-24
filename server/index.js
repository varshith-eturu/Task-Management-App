const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("./authMiddleware");

const app = express();
const PORT = 5001;
const SECRET = "mysecuresecret"; // Use .env in real projects

app.use(cors());
app.use(express.json());

// In-memory mock data
const users = [];
const tasks = {};

app.post(
  "/api/register",
  body("username").isString(),
  body("password").isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = bcrypt.hashSync(password, 8);
    users.push({ username, password: hashed });
    res.status(201).json({ message: "User registered successfully" });
  }
);

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/tasks", authMiddleware(SECRET), (req, res) => {
  res.json(tasks[req.user.username] || []);
});

app.post("/api/tasks", authMiddleware(SECRET), (req, res) => {
  const { title } = req.body;
  if (!tasks[req.user.username]) tasks[req.user.username] = [];
  const newTask = { id: Date.now(), title };
  tasks[req.user.username].push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", authMiddleware(SECRET), (req, res) => {
  const userTasks = tasks[req.user.username] || [];
  const task = userTasks.find((t) => t.id == req.params.id);
  if (!task) return res.sendStatus(404);
  task.title = req.body.title;
  res.json(task);
});

app.delete("/api/tasks/:id", authMiddleware(SECRET), (req, res) => {
  const userTasks = tasks[req.user.username] || [];
  tasks[req.user.username] = userTasks.filter((t) => t.id != req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
