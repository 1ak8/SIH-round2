import { connectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

const run = async () => {
  await connectDB();
  await seedDatabase();
  console.log('Seed execution completed.');
  process.exit(0);
};

run();
