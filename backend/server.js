const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Ganti dengan password MySQL Anda
  database: 'perpustakaan'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// CRUD Routes for Member
app.get('/members', (req, res) => {
  const sql = 'SELECT * FROM member';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Database query error' });
    }
    console.log("Results from database:", results); // Tambahkan log
    res.json(results);
  });
});


app.post('/create', (req, res) => {
  const { username, email, password, role } = req.body;
  const sql = 'INSERT INTO member (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/update/:id', (req, res) => {
  const { username, email, password, role } = req.body;
  const sql = 'UPDATE member SET username = ?, email = ?, password = ?, role = ? WHERE id = ?';
  db.query(sql, [username, email, password, role, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Member updated' });
  });
});

app.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM member WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Member deleted' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, role FROM member WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
