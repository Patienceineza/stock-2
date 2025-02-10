const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const reportRouter = require("./routes/reports");
const { swaggerUi, specs } = require("./swagger");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const sales = require("./routes/sales");
const stockMovementRoutes = require("./routes/stockMovement");
const salesOrderRoutes = require("./routes/salesOrder");
const barcodeRoutes = require("./routes/barcode");
const exchangeRateRoutes = require("./routes/exchangeRate");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"), {
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/reports", reportRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salesOrders", salesOrderRoutes);
app.use("/api/sales", sales);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/exchange-rate', exchangeRateRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
