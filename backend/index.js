const express = require("express");
const app = express();
const mysql = require("mysql2");

app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "js_crud_test",
    port: 3306,
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Create
app.post("/todo", (req, res) => {
    const content = req.body.content;

    if (!content) {
        return res.status(400).send({ error: "content is required" });
    }

    const query = "INSERT INTO todos (content) VALUES (?)";
    db.query(query, [content], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                error: "Error inserting data into database",
            });
        } else {
            res.status(201).send({ message: "Data inserted" });
        }
    });
});

// Read
app.get("/todo", (req, res) => {
    const query = "SELECT * FROM todos";
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: "Error retrieving data from database",
            });
        } else {
            res.status(200).json(result);
        }
    });
});

// Update
app.put("/todo/:id", (req, res) => {
    const id = req.params.id;
    const content = req.body.content;

    const query = "UPDATE todos SET content = ? WHERE id = ?";
    db.query(query, [content, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: "Error updating data in database" });
        } else {
            res.status(201).send({ message: "Data updated" });
        }
    });
});

// Delete
app.delete("/todo/:id", (req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM todos WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: "Error deleting data in database" });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send({
                    error: "No matching data found for deletion",
                });
            } else {
                res.status(200).send({ message: "Data deleted" });
            }
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
