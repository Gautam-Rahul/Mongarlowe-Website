const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongodbUri = process.env.MONGODB_URI || 'mongodb+srv://rahulbhumika99:yQCLmOttm6M85c13@cluster0.tgkdsbs.mongodb.net/Teasells?retryWrites=true&w=majority';
    console.log('MongoDB URI (masked):', mongodbUri.substring(0, 20) + '...');
    
    const conn = await mongoose.connect(mongodbUri, {
      // These options are no longer needed in Mongoose 6+, but keeping for clarity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test a simple query to check connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

module.exports = connectDB; 