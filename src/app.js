const express = require("express");

const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Event Dispatcher API Running"
    });
});

// Assignment API
app.use("/api/v1", eventRoutes);

module.exports = app;