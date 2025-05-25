// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('taskmanager');
  }
  return db;
}

module.exports = connectDB;
