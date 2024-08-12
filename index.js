const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bimmi@123',
  database: 'flashcards_db'
});

db.connect();

app.use(express.json());

app.get('/api/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer } = req.body;
  db.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, question, answer });
  });
});

app.put('/api/flashcards/:id', (req, res) => {
  const { question, answer } = req.body;
  db.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, req.params.id], (err) => {
    if (err) throw err;
    res.send('Flashcard updated');
  });
});

app.delete('/api/flashcards/:id', (req, res) => {
  db.query('DELETE FROM flashcards WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.send('Flashcard deleted');
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
