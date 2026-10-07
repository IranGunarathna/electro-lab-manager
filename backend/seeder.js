// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing users to wipe corrupted hashes
    await User.deleteMany();

    const users = [
      {
        userId: 'ADM001',
        firstName: 'System',
        lastName: 'Admin',
        uniEmail: 'admin@eng.ruh.ac.lk',
        password: 'password123',
        dept: 'DEIE',
        role: 'Admin'
      },
      {
        userId: 'LAB001',
        firstName: 'Lab',
        lastName: 'Officer',
        uniEmail: 'officer@eng.ruh.ac.lk',
        password: 'password123',
        dept: 'DEIE',
        role: 'LabAssistant'
      },
      {
        userId: 'STU001',
        firstName: 'Akila',
        lastName: 'Jayan',
        uniEmail: 'akila@eng.ruh.ac.lk',
        password: 'password123',
        dept: 'DEIE',
        role: 'Student'
      }
    ];

    // User.create triggers the schema pre-save hook for each document
    await User.create(users);

    console.log('Seed successful: 3 accounts created with clean password hashes.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedUsers();