const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const MONGODB_URI = 'mongodb+srv://rahulbhumika99:yQCLmOttm6M85c13@cluster0.tgkdsbs.mongodb.net/Teasells?retryWrites=true&w=majority';

const createAdminUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connected to MongoDB, checking for admin user...');
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists. Email: admin@example.com');
      return;
    }
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: AdminPass123');
    console.log('User ID:', admin._id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
createAdminUser(); 