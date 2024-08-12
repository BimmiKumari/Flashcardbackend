const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.get('/api/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards_db', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer } = req.body;
  db.query('INSERT INTO flashcards_db (question, answer) VALUES (?, ?)', [question, answer], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, question, answer });
  });
});

app.put('/api/flashcards/:id', (req, res) => {
  const { question, answer } = req.body;
  db.query('UPDATE flashcards_db SET question = ?, answer = ? WHERE id = ?', [question, answer, req.params.id], (err) => {
    if (err) throw err;
    res.send('Flashcard updated');
  });
});

app.delete('/api/flashcards/:id', (req, res) => {
  db.query('DELETE FROM flashcards_db WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.send('Flashcard deleted');
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

