import mongoose from 'mongoose';
import { generateFakeUsers, generateFriendRequests } from './fakerData.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') }); // Load environment variables

mongoose.connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log('Connected to MongoDB.');
    await generateFakeUsers(10); // Generate 10 fake users
    await generateFriendRequests(); // Generate friend requests
    mongoose.disconnect();
    console.log('Database seeding completed.');
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
