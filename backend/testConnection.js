const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rahulbhumika99:yQCLmOttm6M85c13@cluster0.tgkdsbs.mongodb.net/Teasells?retryWrites=true&w=majority';

console.log('Starting MongoDB connection test...');
console.log('MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 