import 'dotenv/config'; // Load environment variables from .env file
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_backend';

/**
 * Connect to MongoDB and Startup Server
 */
const startServer = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    
    await mongoose.connect(MONGO_URI);
    
    console.log('🍃 [Database]: MongoDB connection established successfully!');

    // Start Express Application Server
    app.listen(PORT, () => {
      console.log(`[Server]: Server is running high on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ [Database Connection Error]:', error.message);
    process.exit(1); // Exit process with failure code
  }
};

// Initiate Lifecycle
startServer();