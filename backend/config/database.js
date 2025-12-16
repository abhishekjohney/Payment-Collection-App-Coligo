const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Database file path
const dbPath = path.join(__dirname, '..', 'database', 'payment_collection.db');

// Create database connection
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Test connection
const testConnection = () => {
  try {
    const result = db.prepare('SELECT 1').get();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

module.exports = {
  db,
  testConnection
};
