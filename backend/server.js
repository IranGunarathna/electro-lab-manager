
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// getting  environment variables using the env
dotenv.config();

// Connecting t mongoDB Atlas
connectDB();

const app = express();

// intermediate process handles that run on every HTTP


app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ElectroLab is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const componentRoutes = require('./routes/componentRoutes');

// Add with the other routes:
app.use('/api/components', componentRoutes);


const transactionRoutes = require('./routes/transactionRoutes');

// Mount alongside other routes:
app.use('/api/transactions', transactionRoutes);

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/api/equipment', equipmentRoutes);