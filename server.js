const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');

// Initialize app
const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);

// run check endpoint
app.get('/', (req, res) => {
    res.send('Career Guidance Chatbot API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});