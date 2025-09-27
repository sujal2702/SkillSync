import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT;

async function start() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
      console.log('Available at your primary URL:', process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
