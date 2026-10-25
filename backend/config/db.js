import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.warn('[AICTE Pravah DB] Warning: MONGO_URI is not defined in .env.');
    return false;
  }

  try {
    console.log('[AICTE Pravah DB] Attempting connection to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout to avoid hanging if network/creds fail
    });
    isConnected = true;
    console.log(`[AICTE Pravah DB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[AICTE Pravah DB] MongoDB connection error: ${error.message}`);
    console.log('[AICTE Pravah DB] Running in hybrid mode with local memory cache fallback.');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => isConnected;
