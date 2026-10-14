const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://mern-frontend-xo7a.onrender.com',
  'https://mern-frontend-234876.onrender.com',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }

    callback(null, true);
  },
  credentials: true,
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from MERN Backend' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Chuỗi kết nối MongoDB Atlas (Nếu có chuỗi Atlas thật thì thay vào đây)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentdb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error (Chưa kết nối Atlas, vẫn chạy Express):', err.message));

// Câu 36: GET /api/students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Câu 37: POST /api/students
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Câu 38: PUT /api/students/:id
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Câu 39: DELETE /api/students/:id
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sinh viên' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));