const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '232921_Sa',
    database: 'task_db',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API เพิ่ม Task ใหม่
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title });
    });
});

// API ลบ Task ตาม ID
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Task deleted' });
    });
});

// API ค้นหา Task ตาม ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error fetching task:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                res.json(results[0]); // ส่งข้อมูล Task กลับไป
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        }
    });
});


// เปิดเซิร์ฟเวอร์ที่ port 5000
app.listen(5000, () => console.log('Server running on port 5000'));

