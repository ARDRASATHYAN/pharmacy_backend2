require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');



const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const storeRouter = require('./routes/storeRoutes');
const hsnRouter = require('./routes/hsnRoutes');
const drugScheduleRouter = require('./routes/drugScheduleRoutes');
const itemsRouter = require('./routes/itemRoutes');
const supplierRouter = require('./routes/suppliersRoutes');
const customerRouter = require('./routes/customerRoutes');
const purchaseRouter = require('./routes/purchaseRoutes');
const puchaseReturnRouter = require('./routes/purchaseReturnRoutes');
const roleRouter = require('./routes/roleRoutes');
const stockRouter = require('./routes/stockRoutes');
const startCleanupJob = require('./utils/cleanupTokens');
const salesRouter = require('./routes/salesRoutes');
const salesReturnRouter = require('./routes/salesReturnRoutes');
const damagedStockRouter = require('./routes/damagedStockRoutes');
const excessStockRouter = require('./routes/excessStockRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pharmacy-pied-xi.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));


//  SAFE DB INIT + EXIT ON FAILURE
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");

    if (process.env.NODE_ENV === "production") {
      console.warn(" sequelize.sync() DISABLED in production.");
    } else {
      await sequelize.sync({ alter: false, force: false });
      console.log("Development: Models synchronized safely.");
    }

    startCleanupJob();

  } catch (err) {
    console.error(" Database initialization failed:", err);
    process.exit(1);  //  Stop server
  }
}

initializeDatabase();


// Routes

app.use('/api/user', userRouter);
app.use('/api/auth',authRouter)
app.use('/api/store', storeRouter);
app.use('/api/hsn', hsnRouter);
app.use('/api/drug_Schedule', drugScheduleRouter);
app.use('/api/items', itemsRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/customer', customerRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/purchasereturn', puchaseReturnRouter);
app.use('/api/role',roleRouter)
app.use('/api/stock',stockRouter)
app.use("/api/sales", salesRouter); 
app.use("/api/sales-returns", salesReturnRouter); 
app.use("/api/damaged-stock", damagedStockRouter);
app.use("/api/excess-stock", excessStockRouter);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
