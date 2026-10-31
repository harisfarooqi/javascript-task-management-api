// Import Express application from app.js
const app = require("./app");

// Server port
const PORT = 4000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});