import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-detective';

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide password
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      message: 'Connection test', 
      timestamp: new Date() 
    });
    console.log('✅ Database write test successful!');
    
    // Clean up test document
    await testCollection.deleteOne({ message: 'Connection test' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
