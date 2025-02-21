require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const mysql = require('mysql2');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

//Demo API call for transactions from .json
function getDemoTransactions() {
  const transactions = fs.readFileSync('./data/demoTransactions.json');
  return JSON.parse(transactions);
};

app.get('/api/demoTransactions', (req, res) => {
  try {
    const transactions = getDemoTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({message: 'Failed to load demo transaction data'});
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//MySQL database connection and API call
/*
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.get('/api/transactions', (req, res) => {
    db.query('SELECT id, date, type, description, category, subCategory, accountName, balance, ABS(value) AS value FROM transactions', (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  });
  */