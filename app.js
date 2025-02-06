const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
// app.use('/api/inventory', require('./routes/inventoryRoutes'));
// app.use('/api/sales', require('./routes/salesRoutes'));

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
