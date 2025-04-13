const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Set up middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // replace with your MySQL username
  password: '12345', // replace with your MySQL password
  database: 'algorithm_identifier'
});
// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// API Endpoint to get algorithms based on category
app.get('/api/algorithms', (req, res) => {
  const category = req.query.category;  // 'search', 'sort', etc.
  
  let sql = 'SELECT * FROM algorithms';
  if (category) {
    sql += ` WHERE category = ?`;
  }

  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// API Endpoint to add a new algorithm
app.post('/api/algorithms', (req, res) => {
  const { name, description, time_complexity, space_complexity, example_code, category } = req.body;

  if (!name || !description || !time_complexity || !space_complexity || !example_code || !category) {
    console.error('Invalid input data:', req.body); // Log input data
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = `INSERT INTO algorithms (name, description, time_complexity, space_complexity, example_code, category) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  console.log('SQL Query:', sql); // Log SQL query
  console.log('Values:', [name, description, time_complexity, space_complexity, example_code, category]); // Log values

  db.query(sql, [name, description, time_complexity, space_complexity, example_code, category], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err); // Log any SQL errors
      return res.status(500).json({ error: 'Database insert error' });
    }
    console.log('Insert result:', result); // Log result
    res.json({ message: 'Algorithm added successfully', id: result.insertId });
  });
});
// Serve the index.html (Frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
