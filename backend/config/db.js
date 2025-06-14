const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {});

const db = mongoose.connection;

db.on('connected', async () => {
    console.log('✅ Connected to MongoDB server');

});

db.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('⚠️ Disconnected from MongoDB server');
});

module.exports = db;
