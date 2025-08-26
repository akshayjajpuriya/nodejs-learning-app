// 1. Import the Express library
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth'); // <-- IMPORT THE ROUTER
const dashboardRoutes = require('./routes/dashboard'); // <-- IMPORT NEW ROUTER

// 2. Create an instance of an Express application
const app = express();

app.use(express.static('public'));  
app.use(express.json()); // <-- MIDDLEWARE TO READ JSON FROM REQUESTS
app.use('/api', authRoutes); // <-- USE THE ROUTER FOR ANY URL STARTING WITH /api
app.use('/api/dashboard', dashboardRoutes); // <-- USE NEW ROUTER


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// 3. Define a port number for our server to listen on
const PORT = 3000;

// 4. Start the server and make it listen for connections
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});