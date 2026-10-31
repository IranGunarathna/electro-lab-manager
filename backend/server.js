const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ElectroLab is running' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const itemRoutes = require('./routes/itemRoutes');
const labSessionRoutes = require('./routes/labSessionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/lab-sessions', labSessionRoutes);
app.use('/api/transactions', transactionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});