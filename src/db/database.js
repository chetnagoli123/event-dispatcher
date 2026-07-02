const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const databasePath = path.join(__dirname, "../../database.sqlite");

const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite database connected.");
    }
});

const schemaPath = path.join(__dirname, "schema.sql");

const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
    if (err) {
        console.error("Failed to initialize database:", err.message);
    } else {
        console.log("Database schema initialized.");
    }
});

module.exports = db;