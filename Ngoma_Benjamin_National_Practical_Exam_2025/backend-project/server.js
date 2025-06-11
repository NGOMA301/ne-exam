import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import carRoutes from './routes/car.routes.js';
import packageRoutes from './routes/package.routes.js';
import servicePackageRoutes from './routes/servicePackage.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Routes (will create next)
app.use('/api/car', carRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service-package', servicePackageRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
