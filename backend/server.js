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
    database: 'task_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

// API GET Tasks
app.get('/tasks', (req, res) => {
    // ดึงข้อมูลจากตาราง tasks รวมทั้ง due_date
    db.query('SELECT id, title, description, status, due_date FROM tasks', (err, results) => {
        if (err) {
            console.error('❌ Error fetching tasks:', err);
            return res.status(500).json({ error: 'Error fetching tasks' });
        }
        // ส่งข้อมูลทาสก์ทั้งหมดรวมทั้ง due_date ไปยัง frontend
        res.json(results);
    });
});


app.post('/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body;  // ตรวจสอบว่าได้ดึงค่าถูกต้องหรือไม่

    // ตรวจสอบค่าที่รับมา
    console.log('Received Data:', { title, description, status, due_date });

    // เชื่อมต่อกับฐานข้อมูลและบันทึกข้อมูลใหม่
    db.query('INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)', 
        [title, description, status, due_date], 
        (err, result) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).send('Error inserting task');
            }
            res.json({ id: result.insertId, title, description, status, due_date });
        }
    );
});

// API สำหรับอัปเดตเฉพาะสถานะของ Task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // อัปเดตแค่ status เท่านั้น

    // ตรวจสอบว่าได้รับ status หรือไม่
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    // SQL Query สำหรับอัปเดตแค่สถานะ
    const query = `
        UPDATE tasks 
        SET status = ? 
        WHERE id = ?;
    `;
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('❌ Error updating task status:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // ถ้าไม่มีการอัปเดต (เช่นไม่พบ ID)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // ถ้าทุกอย่างถูกต้อง ส่งกลับข้อมูล Task ที่อัปเดตสถานะ
        res.json({
            id,
            status
        });
    });
});


// API DELETE Task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Task deleted' });
    });
});

// API สำหรับอัปเดต Title ของ Task
app.put('/tasks/title/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;  // รับค่า title จาก body

    // ตรวจสอบว่าได้รับ title หรือไม่
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // SQL Query สำหรับอัปเดต title
    const query = `
        UPDATE tasks 
        SET title = ? 
        WHERE id = ?;
    `;
    db.query(query, [title, id], (err, result) => {
        if (err) {
            console.error('❌ Error updating task title:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // ถ้าไม่มีการอัปเดต (เช่นไม่พบ ID)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // ถ้าทุกอย่างถูกต้อง ส่งกลับข้อมูล Task ที่อัปเดต title
        res.json({
            id,
            title
        });
    });
});

app.post('/tasks', (req, res) => {
    const { title, description, status, due_date } = req.body;

    // ตรวจสอบค่าที่รับมา
    console.log('Received Data:', { title, description, status, due_date });

    // เชื่อมต่อกับฐานข้อมูลและบันทึกข้อมูลใหม่
    db.query('INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)', 
        [title, description, status, due_date], 
        (err, result) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).send('Error inserting task');
            }
            res.json({ id: result.insertId, title, description, status, due_date });
        }
    );
});

app.get('/tasks', (req, res) => {
    const searchQuery = req.query.search || '';  // ใช้พารามิเตอร์ search ถ้ามี

    const query = `
        SELECT id, title, description, status, due_date
        FROM tasks
        WHERE title LIKE ? OR description LIKE ?
    `;

    db.query(query, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('❌ Error fetching tasks:', err);
            return res.status(500).json({ error: 'Error fetching tasks' });
        }
        res.json(results);
    });
});


app.listen(4000, () => console.log('✅ Server running on port 4000'));
