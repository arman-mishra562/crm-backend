import { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.route';
import dashboardRoutes from './routes/dashboard.routes';


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

// ✅ Attach routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// ——— 404 Handler ———
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

// ——— Global Error Handler———
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});