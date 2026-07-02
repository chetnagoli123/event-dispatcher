const express = require("express");

const eventRoutes = require("./routes/eventRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Event Dispatcher API Running"
    });
});

app.use("/api/v1", eventRoutes);

// Keep this LAST
app.use(errorHandler);

module.exports = app;