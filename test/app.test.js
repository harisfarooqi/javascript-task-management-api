const request = require("supertest");
const app = require("../app");
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

describe("Task Management API Tests", () => {

    it("GET / should return welcome message", async () => {
        const response = await request(app).get("/");
        assert.equal(response.status, 200);
        assert.equal(response.text, "Welcome to Task Management API");
    });

    it("GET /health should return healthy status", async () => {
        const response = await request(app).get("/health");
        assert.equal(response.status, 200);
        assert.equal(response.body.status, "healthy");
    });

    it("POST /tasks should create a task", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "Learn Docker" });

        assert.equal(response.status, 201);
        assert.equal(response.body.title, "Learn Docker");
        assert.equal(response.body.completed, false);
    });

    it("GET /tasks should return tasks", async () => {
        const response = await request(app).get("/tasks");

        assert.equal(response.status, 200);
        assert.ok(Array.isArray(response.body));
        assert.ok(response.body.length > 0);
    });

    it("GET /tasks/1 should return a single task", async () => {
        const response = await request(app).get("/tasks/1");

        assert.equal(response.status, 200);
        assert.equal(response.body.id, 1);
    });

    it("PUT /tasks/1 should update a task", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({
                title: "Learn GitHub Actions",
                completed: true
            });

        assert.equal(response.status, 200);
        assert.equal(response.body.title, "Learn GitHub Actions");
        assert.equal(response.body.completed, true);
    });

    it("DELETE /tasks/1 should delete a task", async () => {
        const response = await request(app).delete("/tasks/1");

        assert.equal(response.status, 200);
        assert.equal(response.body.message, "Task deleted successfully");
    });

});