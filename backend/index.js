// backend/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Port server backend

// Middleware
app.use(cors()); // Agar React (port 3000) bisa akses Backend (port 3001)
app.use(bodyParser.json());

// Konfigurasi Database (Sesuaikan dengan XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default user XAMPP
  password: '',      // Default password XAMPP (biasanya kosong)
  database: 'db_todos'
});

// Cek Koneksi Database
db.connect(err => {
  if (err) {
    console.error('Gagal konek ke database:', err);
  } else {
    console.log('✅ Berhasil terhubung ke Database MySQL');
  }
});

// --- API ROUTES (Jalur Data) ---

// 1. GET: Ambil semua data tugas
app.get('/todos', (req, res) => {
  const sql = 'SELECT * FROM todos ORDER BY id DESC';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// 2. POST: Tambah tugas baru
app.post('/todos', (req, res) => {
  const { title, description, due_date } = req.body;
  const sql = 'INSERT INTO todos (title, description, due_date, status) VALUES (?, ?, ?, "incomplete")';
  
  db.query(sql, [title, description, due_date], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Tugas berhasil ditambahkan', id: result.insertId });
  });
});

// 3. PUT: Update status (Selesai/Belum)
app.put('/todos/status/:id', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const sql = 'UPDATE todos SET status = ? WHERE id = ?';

  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Status berhasil diperbarui' });
  });
});

// 4. DELETE: Hapus tugas
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM todos WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: 'Tugas berhasil dihapus' });
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});