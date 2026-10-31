const express = require("express");

const app = express();

app.use(express.json());

const tasks = [];

let nextTaskId = 1;

// HOME
app.get("/", (req, res) => {
    res.send("Welcome to Task Management API");
});

// HEALTH
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        message: "Task Management API is running"
    });
});

// CREATE TASK
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Valid task title is required"
        });
    }

    const newTask = {
        id: nextTaskId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// GET ALL TASKS
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// GET SINGLE TASK
app.get("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!Number.isInteger(taskId) || taskId <= 0 || !task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json(task);
});

// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!Number.isInteger(taskId) || taskId <= 0 || !task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            message: "Valid title and completed boolean are required"
        });
    }

    task.title = title.trim();
    task.completed = completed;

    res.status(200).json(task);
});

// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (!Number.isInteger(taskId) || taskId <= 0 || taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask
    });
});

module.exports = app;